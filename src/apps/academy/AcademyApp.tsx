// Academy: the prototype's five-stage lesson window, driven by lesson data and real Python validation.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CodeEditor } from '../../editor/CodeEditor';
import { Console, useConsole } from '../../editor/Console';
import { hlBlock } from '../../editor/highlight';
import { conceptById, LESSONS, REGIONS, regionOf } from '../../content/curriculum';
import { ALL_LESSONS, lessonById } from '../../content/lessons';
import { STAGES, type Exercise } from '../../content/lessons/types';
import { isAvailable, isDone, regionStatus, type Progress } from '../../progression/progress';
import { prerequisites } from '../../content/curriculum';
import { usePythonSession } from '../../runtime/usePython';
import type { KV } from '../../storage/db';
import type { Learning } from '../../progression/useLearning';
import { JarsFigure } from './JarsFigure';
import { codeFor, freshState, isLessonComplete, normalizeLessonState, slotForStage, stagesDone, type LessonState } from './lessonState';
import { Rich } from './rich';
import { defaultLesson } from './nextLesson';

interface Props {
  kv: KV;
  progress: Progress;
  /** Lesson requested by the chart or desktop; null = continue where the learner is. */
  route: string | null;
  editorMode: 'auto' | 'simple';
  learning: Pick<Learning, 'exercise' | 'quiz' | 'lessonDone'>;
  onOpenMission: (id: string) => void;
  onSay: (text: string, mood?: 'happy' | 'confused' | 'celebrating') => void;
  onOpenChart: () => void;
  onSub: (sub: string) => void;
}

const SAVE_MS = 400;
const pad = (n: number) => String(n).padStart(2, '0');


export default function AcademyApp({ kv, progress, route, editorMode, learning, onOpenMission, onSay, onOpenChart, onSub }: Props) {
  const [lessonId, setLessonId] = useState(() => (route && lessonById(route) ? route : defaultLesson(progress).id));
  const [states, setStates] = useState<Record<string, LessonState>>({});
  const lesson = lessonById(lessonId) ?? ALL_LESSONS[0];
  const region = regionOf(lesson.conceptId)!;
  const st = states[lessonId];
  const con = useConsole();
  const py = usePythonSession(con);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { if (route && lessonById(route)) setLessonId(route); }, [route]);
  useEffect(() => { onSub(`${region.name} · Lesson ${pad(lesson.number)}`); }, [region.name, lesson.number, onSub]);
  useEffect(() => { py.warm(); }, []);

  // load this lesson's saved work
  useEffect(() => {
    if (states[lessonId]) return;
    let alive = true;
    kv.get(`lesson:${lessonId}`).catch(() => undefined).then((raw) => { if (alive) setStates((s) => ({ ...s, [lessonId]: normalizeLessonState(raw) })); });
    return () => { alive = false; };
  }, [lessonId, kv, states]);
  useEffect(() => {
    if (!st) return;
    const t = setTimeout(() => { kv.set(`lesson:${lessonId}`, st).catch(() => {}); }, SAVE_MS);
    return () => clearTimeout(t);
  }, [st, lessonId, kv]);

  const update = useCallback((f: (s: LessonState) => LessonState) => setStates((all) => ({ ...all, [lessonId]: f(all[lessonId] ?? freshState()) })), [lessonId]);
  const completed = isDone(progress, lesson.conceptId);

  // a lesson completes once all three gates have passed; report it exactly once
  const reported = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!st || !isLessonComplete(st) || completed || reported.current.has(lessonId)) return;
    reported.current.add(lessonId);
    learning.lessonDone(lesson);
  }, [st, completed, lessonId, lesson, learning]);

  useEffect(() => { scroller.current?.scrollTo?.({ top: 0 }); }, [st?.stage, lessonId]);

  const stage = STAGES[st?.stage ?? 0];
  const slot = slotForStage(stage.id);
  const code = st ? codeFor(lesson, st, slot) : '';
  const busy = py.status === 'running' || py.status === 'waiting-input';
  const done = st ? stagesDone(st, completed) : [];
  const exampleLines = useMemo(() => hlBlock(lesson.discover.example.replace(/\n+$/, '')), [lesson]);

  if (!st) return <div className="wbody" />;

  const go = (i: number) => update((s) => ({ ...s, stage: Math.max(0, Math.min(4, i)) }));
  const run = async () => {
    if (busy) return;
    const r = await py.run(code, 'lesson.py');
    if (r && slot === 'experiment') update((s) => ({ ...s, experimentRan: true }));
    if (r?.error) onSay('Ooh, a traceback. Those are clues. I left a note in the console.', 'confused');
  };

  const checkExercise = async (which: 'practice' | 'challenge') => {
    const ex: Exercise = lesson[which];
    const r = await py.check(codeFor(lesson, st, which), 'lesson.py', { checks: ex.checks, inputs: ex.inputs ?? [] });
    if (!r?.report) return;
    const ok = r.report.results.every(Boolean);
    update((s) => ({ ...s, checks: { ...s.checks, [which]: r.report!.results }, attempts: { ...s.attempts, [which]: s.attempts[which] + 1 }, passed: { ...s.passed, [which]: s.passed[which] || ok } }));
    learning.exercise(lesson, which, ok, st.hints[which]);
    const n = r.report.results.filter(Boolean).length;
    if (ok) onSay(which === 'practice' ? 'Every check is green. The navigator is pleased.' : 'You read the problem and fixed it. That is the whole job, honestly.', 'celebrating');
    else onSay(`${n} of ${ex.checks.length} checks pass. Look at the ones with an x.`, n ? 'happy' : 'confused');
  };

  const submitQuiz = () => {
    const right = lesson.quiz.every((q, i) => st.quiz[i] === q.a);
    learning.quiz(lesson, right, st.attempts.master === 0);
    update((s) => ({ ...s, quizChecked: true, attempts: { ...s.attempts, master: s.attempts.master + 1 }, passed: { ...s.passed, master: s.passed.master || right } }));
    if (!right) onSay('Close. Read the notes under the questions you missed, then try again.', 'confused');
  };

  const next = ALL_LESSONS[ALL_LESSONS.indexOf(lesson) + 1];
  const projectAfter = !next || regionOf(next.conceptId) !== region ? region.concepts.find((c) => c.missionId) : undefined;
  const atEnd = st.stage === 4;
  const nextLabel = !atEnd ? `Next: ${STAGES[st.stage + 1].name}` : completed ? (projectAfter ? `Next: ${projectAfter.name.replace(/^Project: /, '')}` : next ? `Next lesson: ${next.title}` : 'See it on the chart') : 'Finish the checks to complete';
  const onNext = () => {
    if (!atEnd) return go(st.stage + 1);
    if (!completed) return;
    if (projectAfter) onOpenMission(projectAfter.missionId!); else if (next) setLessonId(next.id); else onOpenChart();
  };
  // Not gated: a lesson can always be read. Say plainly what it builds on, or that its system is still sealed.
  const regionOpen = regionStatus(progress)[REGIONS.indexOf(region)].open;
  const prereqs = conceptById(lesson.conceptId) && !completed && !isAvailable(progress, lesson.conceptId)
    ? prerequisites(lesson.conceptId).filter((c) => !isDone(progress, c)).map((c) => conceptById(c)!.name) : [];

  return (
    <div className="wbody">
      <div className="ac">
        <header className="ac-head">
          <div style={{ minWidth: 0 }}>
            <p className="mono ac-crumb" style={{ margin: '0 0 4px', fontSize: '12px', color: '#63685c' }}>
              <button className="ac-crumb-btn" onClick={onOpenChart}>{region.name}</button> ›{' '}
              <label className="vh" htmlFor="ac-lesson">Choose a lesson</label>
              <select id="ac-lesson" className="ac-select" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
                {REGIONS.map((r) => {
                  const ls = LESSONS.filter((l) => l.regionId === r.id && lessonById(l.id));
                  return ls.length ? <optgroup key={r.id} label={`${r.n} · ${r.name}`}>{ls.map((l) => <option key={l.id} value={l.id}>{`Lesson ${pad(l.number)} · ${l.title}${isDone(progress, l.conceptId) ? ' ✓' : ''}`}</option>)}</optgroup> : null;
                })}
              </select> › {stage.name}
            </p>
            <h1 className="disp" style={{ margin: 0, fontSize: '28px', lineHeight: 1.1 }}>{lesson.title}</h1>
          </div>
          <ol className="steps" aria-label="Lesson stages">
            {STAGES.map((s, i) => {
              const cur = i === st.stage, dn = done[i];
              const c = { bg: dn ? '#345a04' : cur ? '#c95851' : '#f6f2e8', ring: dn ? '#345a04' : cur ? '#242820' : '#9a9f92', fg: dn ? '#f6f2e8' : cur ? '#1a1410' : '#777c70' };
              return (
                <li key={s.id}>
                  <button className={'step' + (cur ? ' is-cur' : '') + (dn ? ' is-done' : '')} onClick={() => go(i)} aria-current={cur ? 'step' : undefined}
                    aria-label={`Stage ${i + 1}: ${s.name}${dn ? ', done' : ''}${cur ? ', current' : ''}`}>
                    <StageIcon i={i} {...c} />
                    <span>{s.name}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </header>
        <div className="ac-split">
          <div className="ac-lesson">
            <div className="scroll" style={{ flex: 1, minHeight: 0 }} ref={scroller} tabIndex={0} role="region" aria-label="Lesson text">
              <div className="ac-inner">
                <p className="kicker">Stage {st.stage + 1} of 5 · {stage.name}</p>
                {stage.id === 'discover' && <>
                  <h2 className="h2">{lesson.discover.heading}</h2>
                  <p className="lede"><Rich text={lesson.discover.lede} /></p>
                  {!regionOpen && !completed && <div className="hint" role="note">{region.name} is still sealed on your chart: complete {REGIONS[REGIONS.indexOf(region) - 1]?.name} first to open it. You can read and practise here anyway; the chart will catch up.</div>}
                  {regionOpen && prereqs.length > 0 && <div className="hint" role="note">This lesson builds on {prereqs.join(', ')}. You can read on, or start there first.</div>}
                  <div className="ac-goals">
                    <b>By the end of this lesson you can</b>
                    {lesson.objectives.map((o) => <span key={o}>· <Rich text={o} /></span>)}
                  </div>
                  {lesson.discover.figure === 'jars' && <JarsFigure />}
                  <div className="codeblock mono">{exampleLines.map((ln) => <div className="ed-ln" key={ln.n}>{ln.toks.map((tk, i) => <span key={i} style={{ color: tk.c }}>{tk.t}</span>)}</div>)}</div>
                  {lesson.discover.tags && <>
                    <h3 className="h3">{lesson.discover.tagsHeading}</h3>
                    <div className="tags">{lesson.discover.tags.map((t) => (
                      <div className="ttag" key={t.name}><p className="mono" style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: t.color }}>{t.name}</p><p style={{ margin: '2px 0 4px', fontSize: '13.5px' }}>{t.desc}</p><p className="mono" style={{ margin: 0, fontSize: '12.5px', color: '#63685c' }}>{t.examples}</p></div>
                    ))}</div>
                  </>}
                  {lesson.discover.tip && <div className="ftip"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" style={{ flex: 'none' }}><circle cx="9" cy="9" r="6.5" fill="none" stroke="#345a04" strokeWidth="2"></circle><path d="M14 14 L 19.5 19.5" stroke="#345a04" strokeWidth="2.4" strokeLinecap="round"></path></svg><span><Rich text={lesson.discover.tip} /></span></div>}
                </>}
                {stage.id === 'experiment' && <>
                  <h2 className="h2">{lesson.experiment.heading}</h2>
                  <p className="lede"><Rich text={lesson.experiment.lede} /></p>
                  <ol className="ac-steps">{lesson.experiment.steps.map((s) => <li key={s}><Rich text={s} /></li>)}</ol>
                  {lesson.experiment.tip && <div className="ftip"><svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" style={{ flex: 'none' }}><path d="M11 20 V 10" stroke="#345a04" strokeWidth="2" strokeLinecap="round"></path><path d="M11 12 C 6 12, 3 8, 4 4 C 8 4, 11 7, 11 12 Z M11 10 C 15 10, 18 7, 18 3 C 14 3, 11 6, 11 10 Z" fill="#3e6510"></path></svg><span><Rich text={lesson.experiment.tip} /></span></div>}
                </>}
                {(stage.id === 'practice' || stage.id === 'challenge') && (
                  <ExerciseView ex={lesson[stage.id]} which={stage.id} st={st} busy={busy}
                    onCheck={() => checkExercise(stage.id as 'practice' | 'challenge')}
                    onHint={() => update((s) => ({ ...s, hints: { ...s.hints, [stage.id]: Math.min(3, s.hints[stage.id as 'practice'] + 1) } }))} />
                )}
                {stage.id === 'master' && <>
                  <h2 className="h2">Prove it to the archive.</h2>
                  <p className="lede">{lesson.quiz.length} questions. Answer them all correctly{st.passed.practice && st.passed.challenge ? ' and ' + region.name + ' grows a new sprout on your chart.' : '. Pass Practice and Challenge as well to complete the lesson.'}</p>
                  {lesson.quiz.map((q, i) => {
                    const sel = st.quiz[i], chk = st.quizChecked && sel != null, right = sel === q.a;
                    return (
                      <div className="qcard" key={i}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '15px' }} id={`q-${lessonId}-${i}`}>{i + 1}. {q.q}</p>
                        <div className="qopts" role="radiogroup" aria-labelledby={`q-${lessonId}-${i}`}>
                          {q.opts.map((o, j) => {
                            const isSel = sel === j;
                            const cls = chk && isSel ? (right ? 'is-right' : 'is-wrong') : isSel ? 'is-sel' : '';
                            return <button key={j} className={'qopt ' + cls} role="radio" aria-checked={isSel}
                              onClick={() => update((s) => ({ ...s, quiz: { ...s.quiz, [i]: j }, quizChecked: false }))}><span className="qdot"></span>{o}</button>;
                          })}
                        </div>
                        {chk && <p style={{ margin: '10px 0 0', fontSize: '13.5px', color: right ? '#345a04' : '#a8423c' }}><b>{right ? 'Correct.' : 'Not quite.'}</b> {q.why}</p>}
                      </div>
                    );
                  })}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="btn pri" onClick={submitQuiz} disabled={Object.keys(st.quiz).length < lesson.quiz.length}>Submit to the archive</button>
                    <span style={{ fontSize: '13px', color: '#63685c' }} role="status">
                      {st.passed.master ? (completed ? 'Lesson complete.' : 'Quiz passed.') : `${Object.keys(st.quiz).length} of ${lesson.quiz.length} answered`}
                    </span>
                  </div>
                </>}
              </div>
            </div>
            <div className="ac-nav">
              <button className="btn" onClick={() => go(st.stage - 1)} disabled={st.stage === 0}>Back</button>
              <button className="btn moss" onClick={onNext} disabled={atEnd && !completed}>{nextLabel}</button>
            </div>
          </div>

          <div className="ac-code">
            <div className="ed">
              <div className="ed-bar">
                <div className="ed-tab mono"><span className="tdot" style={{ background: '#e2a93b', borderColor: '#0b0f08' }}></span>lesson.py</div>
                <div className="ed-actions">
                  <button className="btn-g" onClick={() => update((s) => ({ ...s, code: { ...s.code, [slot]: null } }))} disabled={st.code[slot] == null}>Reset</button>
                  {busy
                    ? <button className="btn-run" onClick={py.stop}><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" rx="1" fill="#12180e"></rect></svg>Stop</button>
                    : <button className="btn-run" onClick={run}><svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1 L 9 6 L 1 11 Z" fill="#12180e"></path></svg>Run<span className="kbd">⌘↵</span></button>}
                </div>
              </div>
              <CodeEditor key={`${lessonId}:${slot}`} value={code} onChange={(c) => update((s) => ({ ...s, code: { ...s.code, [slot]: c } }))} onRun={run}
                ariaLabel={`Python code editor for the lesson, ${stage.name}`} mode={editorMode} />
              <Console lines={con.lines} tip={py.tip} title={`Console · Python ${py.rt.pythonVersion || '3.12'}`} onClear={() => { con.clear(); py.setTip(''); }}
                empty="Press Run to send lesson.py through the vessel's interpreter." inputPrompt={py.prompt} onInput={py.answer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseView({ ex, which, st, busy, onCheck, onHint }: { ex: Exercise; which: 'practice' | 'challenge'; st: LessonState; busy: boolean; onCheck: () => void; onHint: () => void }) {
  const results = st.checks[which];
  const hints = st.hints[which];
  const firstFail = results ? ex.checks.findIndex((_, i) => !results[i]) : -1;
  return <>
    <h2 className="h2">{ex.heading}</h2>
    <p className="lede"><Rich text={ex.lede} /></p>
    <div className="task">
      {ex.steps && <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14.5px' }}>{ex.steps.map((s) => <li key={s}><Rich text={s} /></li>)}</ol>}
      {ex.note && <p style={{ margin: ex.steps ? '10px 0 0' : 0, fontSize: '14px', color: '#63685c' }}><Rich text={ex.note} /></p>}
      <ul className="checks" aria-label="Field checks">
        {ex.checks.map((c, i) => {
          const ok = results ? results[i] : null;
          return (
            <li key={i}>
              <span className={'ck ' + (ok === true ? 'ok' : ok === false ? 'no' : '')}>
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  {ok === true && <path d="M2.5 6.2 L 5 8.5 L 9.5 3.5" fill="none" stroke="#f6f2e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>}
                  {ok === false && <path d="M3 3 L 9 9 M9 3 L 3 9" stroke="#a8423c" strokeWidth="1.8" strokeLinecap="round"></path>}
                </svg>
              </span>
              <span>{c.label}<span className="vh">{ok === true ? ' (passing)' : ok === false ? ' (not yet)' : ''}</span></span>
            </li>
          );
        })}
      </ul>
      {firstFail >= 0 && ex.checks[firstFail].fail && <p style={{ margin: '10px 0 0', fontSize: '13.5px', color: '#a8423c' }}><Rich text={ex.checks[firstFail].fail!} /></p>}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
      <button className="btn pri" onClick={onCheck} disabled={busy}>{which === 'practice' ? 'Check my work' : 'Check my fix'}</button>
      {hints < ex.hints.length && <button className="hintbtn" onClick={onHint}>{hints === 0 ? 'Show a hint' : `Show hint ${hints + 1} of ${ex.hints.length}`}</button>}
      {st.passed[which] && <span className="chip" style={{ color: '#345a04' }}>{which === 'practice' ? 'Logged' : 'Repaired'}</span>}
    </div>
    {ex.hints.slice(0, hints).map((h, i) => <div className="hint" key={i}><b>Hint {i + 1}.</b> <Rich text={h} /></div>)}
    <p className="ac-honest">Checks run on this device. They look at what your program does, so different correct solutions pass. They're here to guide you, not to grade you.</p>
  </>;
}

function StageIcon({ i, bg, ring, fg }: { i: number; bg: string; ring: string; fg: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={bg} stroke={ring} strokeWidth="1.5"></circle>
      {i === 0 && <ellipse cx="12" cy="14" rx="4" ry="5.2" transform="rotate(-20 12 14)" fill={fg}></ellipse>}
      {i === 1 && <><path d="M12 18 V 11" stroke={fg} strokeWidth="1.8" strokeLinecap="round"></path><path d="M12 12 C 8 12, 6.5 9, 7 7 C 10 7, 12 9, 12 12 Z" fill={fg}></path></>}
      {i === 2 && <><path d="M12 18.5 V 8" stroke={fg} strokeWidth="1.8" strokeLinecap="round"></path><path d="M12 13 C 8 13, 6 10, 6.5 8 C 9.5 8, 12 10, 12 13 Z M12 11 C 15.5 11, 17.5 8, 17 6 C 14 6, 12 8, 12 11 Z" fill={fg}></path></>}
      {i === 3 && <><path d="M12 19 V 12" stroke={fg} strokeWidth="1.8" strokeLinecap="round"></path><path d="M12 13 C 9 12, 8.5 8, 12 5 C 15.5 8, 15 12, 12 13 Z" fill={fg}></path></>}
      {i === 4 && <><circle cx="12" cy="7.2" r="2.6" fill={fg}></circle><circle cx="16.6" cy="10.6" r="2.6" fill={fg}></circle><circle cx="14.8" cy="16" r="2.6" fill={fg}></circle><circle cx="9.2" cy="16" r="2.6" fill={fg}></circle><circle cx="7.4" cy="10.6" r="2.6" fill={fg}></circle><circle cx="12" cy="12" r="2" fill={bg}></circle></>}
    </svg>
  );
}
