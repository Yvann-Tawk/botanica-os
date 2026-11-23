// The Lithic Academy: the five-stage lesson shell (Discover → Experiment → Practice → Challenge → Master) plus
// recap and three missions. It is generic over the discipline: a `runChecks` function validates the learner's
// code and a `Workspace` component renders the editor + discipline-specific output pane (HTML preview, DAX
// results, …). The shell — stages, task cards, hints, quiz, recap, missions, awards — is shared across worlds.

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TIERS } from '../content/types';
import type { Lesson, Mission } from '../content/types';

type StageId = 'discover' | 'experiment' | 'practice' | 'challenge' | 'master';
const STAGES: { id: StageId; name: string }[] = [
  { id: 'discover', name: 'Discover' }, { id: 'experiment', name: 'Experiment' }, { id: 'practice', name: 'Practice' },
  { id: 'challenge', name: 'Challenge' }, { id: 'master', name: 'Master' },
];
type View = StageId | 'recap' | 'missions';

export interface CheckResult { label: string; ok: boolean; detail?: string }
const allPass = (rs: CheckResult[]) => rs.every((r) => r.ok);

/** The editor + discipline output pane. Each world supplies one (HTML preview, DAX results, …). */
export interface WorkspaceProps { code: string; editable: boolean; onChange: (v: string) => void; onRun: () => void; canCheck: boolean; fileName: string; ariaLabel: string }
export type WorkspaceComponent = (props: WorkspaceProps) => ReactNode;

/** Awards decoupled from the check type: they read only ids and XP. */
export interface AcademyAwards {
  exercise: (lesson: { id: string; conceptId: string; xp: number }, which: 'practice' | 'challenge', ok: boolean, hints: number) => void;
  quiz: (lesson: { id: string }, ok: boolean) => void;
  lessonDone: (lesson: { id: string; conceptId: string; xp: number }) => void;
  mission: (m: { id: string; xpReward: number }, ok: boolean, hints: number) => boolean;
  run: () => void;
}

interface Saved { code: Record<string, string>; passed: Record<string, boolean>; hints: Record<string, number>; done: Record<string, boolean>; }
const freshSaved = (): Saved => ({ code: {}, passed: {}, hints: {}, done: {} });

interface Props {
  lesson: Lesson<unknown>;
  completed: boolean;
  initial?: Partial<Saved>;
  awards: AcademyAwards;
  onSave: (s: Saved) => void;
  onExit: () => void;
  /** Header kicker, e.g. "The Foundation · HTML". */
  kicker: string;
  /** Editor file name, e.g. "page.html" or "measure.dax". */
  fileName: string;
  runChecks: (code: string, checks: unknown[]) => CheckResult[];
  Workspace: WorkspaceComponent;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function LithicAcademy({ lesson, completed, initial, awards, onSave, onExit, kicker, fileName, runChecks, Workspace }: Props) {
  const Pane = Workspace;
  const [view, setView] = useState<View>('discover');
  const [s, setS] = useState<Saved>(() => ({ ...freshSaved(), ...initial, code: { ...initial?.code }, passed: { ...initial?.passed }, hints: { ...initial?.hints }, done: { ...initial?.done } }));
  const [results, setResults] = useState<Record<string, CheckResult[]>>({});
  const [hintOpen, setHintOpen] = useState<Record<string, number>>({});
  const [quizPicks, setQuizPicks] = useState<(number | null)[]>(() => lesson.quiz.map(() => null));

  useEffect(() => { const t = setTimeout(() => onSave(s), 400); return () => clearTimeout(t); }, [s, onSave]);
  useEffect(() => { awards.run(); }, []); // a visit counts as activity

  const codeFor = (key: string, starter: string) => s.code[key] ?? starter;
  const setCode = useCallback((key: string, v: string) => setS((p) => ({ ...p, code: { ...p.code, [key]: v } })), []);

  const lessonComplete = !!s.passed['practice'] && !!s.passed['challenge'] && !!s.done['master'];
  useEffect(() => {
    if (lessonComplete && !s.done['lesson']) { awards.lessonDone(lesson); setS((p) => ({ ...p, done: { ...p.done, lesson: true } })); }
  }, [lessonComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkExercise = (which: 'practice' | 'challenge') => {
    const ex = which === 'practice' ? lesson.practice : lesson.challenge;
    const res = runChecks(codeFor(which, ex.starter), ex.checks);
    setResults((r) => ({ ...r, [which]: res }));
    const ok = allPass(res);
    awards.exercise(lesson, which, ok, hintOpen[which] ?? 0);
    if (ok) setS((p) => ({ ...p, passed: { ...p.passed, [which]: true } }));
  };

  const submitQuiz = () => {
    const ok = quizPicks.every((p, i) => p === lesson.quiz[i].a);
    awards.quiz(lesson, ok);
    if (ok) setS((p) => ({ ...p, done: { ...p.done, master: true } }));
  };

  const stageIndex = STAGES.findIndex((x) => x.id === view);
  const masterDone = !!s.done['master'];
  const stageDone = (id: StageId) => id === 'discover' || id === 'experiment' ? true : id === 'master' ? masterDone : !!s.passed[id];

  return (
    <div className="ac">
      <div className="ac-head">
        <div>
          <p className="kicker">{kicker} · Lesson {pad(lesson.number)}</p>
          <h2 className="h2" style={{ margin: 0 }}>{lesson.title}</h2>
        </div>
        <ol className="steps" aria-label="Lesson stages">
          {STAGES.map((st) => (
            <li key={st.id}>
              <button className={`step${view === st.id ? ' is-cur' : ''}${stageDone(st.id) && view !== st.id ? ' is-done' : ''}`} onClick={() => setView(st.id)}>{st.name}</button>
            </li>
          ))}
          {(lessonComplete || completed) && <li><button className={`step${view === 'recap' ? ' is-cur' : ''}`} onClick={() => setView('recap')}>Recap</button></li>}
          {(lessonComplete || completed) && <li><button className={`step${view === 'missions' ? ' is-cur' : ''}`} onClick={() => setView('missions')}>Missions</button></li>}
        </ol>
      </div>

      <div className="ac-split">
        <div className="ac-lesson scroll">
          <div className="ac-inner">
            {view === 'discover' && (<>
              <p className="kicker">{lesson.discover.heading}</p>
              <Markup className="lede" text={lesson.discover.lede} />
              <h3 className="h3">Objectives</h3>
              <ul>{lesson.objectives.map((o, i) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}</ul>
              <h3 className="h3">Example</h3>
              <pre className="codeblock mono">{lesson.discover.example}</pre>
              {lesson.discover.exampleNote && <Markup className="lede" text={lesson.discover.exampleNote} />}
              {lesson.discover.tip && <div className="ftip"><span aria-hidden="true">◆</span><Markup text={lesson.discover.tip} /></div>}
            </>)}

            {view === 'experiment' && (<>
              <p className="kicker">{lesson.experiment.heading}</p>
              <Markup className="lede" text={lesson.experiment.lede} />
              <ol>{lesson.experiment.steps.map((st, i) => <li key={i} style={{ marginBottom: 6 }}><Markup text={st} /></li>)}</ol>
              {lesson.experiment.tip && <div className="ftip"><span aria-hidden="true">◆</span><Markup text={lesson.experiment.tip} /></div>}
            </>)}

            {(view === 'practice' || view === 'challenge') && (() => {
              const ex = view === 'practice' ? lesson.practice : lesson.challenge;
              const res = results[view];
              return (<>
                <p className="kicker">{view === 'practice' ? 'Practice' : 'Challenge'}</p>
                <h3 className="h2" style={{ fontSize: 22 }}>{ex.heading}</h3>
                <Markup className="lede" text={ex.lede} />
                <div className="task">
                  {ex.steps && <ol style={{ margin: '0 0 10px', paddingLeft: 18 }}>{ex.steps.map((st, i) => <li key={i} style={{ marginBottom: 4 }}><Markup text={st} /></li>)}</ol>}
                  {ex.note && <Markup className="lede" text={ex.note} />}
                  <ul className="checks">
                    {ex.checks.map((c, i) => {
                      const r = res?.[i];
                      return (<li key={i}>
                        <span className={`ck${r ? (r.ok ? ' ok' : ' no') : ''}`} aria-hidden="true">{r ? (r.ok ? '✓' : '×') : ''}</span>
                        <span>{(c as { label: string }).label}{r && !r.ok && r.detail ? <span style={{ color: '#a8423c' }}> — {r.detail}</span> : null}</span>
                      </li>);
                    })}
                  </ul>
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="hintbtn" onClick={() => setHintOpen((h) => ({ ...h, [view]: Math.min((h[view] ?? 0) + 1, ex.hints.length) }))}>Need a hint?</button>
                  {Array.from({ length: hintOpen[view] ?? 0 }).map((_, i) => <div className="hint" key={i}><Markup text={ex.hints[i]} /></div>)}
                </div>
                {s.passed[view] && <p style={{ marginTop: 12, color: '#345a04', fontWeight: 600 }}>Passed ✓</p>}
              </>);
            })()}

            {view === 'master' && (<>
              <p className="kicker">Master · knowledge check</p>
              {lesson.quiz.map((q, qi) => (
                <div className="qcard" key={qi}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{q.q}</p>
                  <div className="qopts">
                    {q.opts.map((opt, oi) => {
                      const picked = quizPicks[qi] === oi;
                      const cls = masterDone ? (oi === q.a ? ' is-right' : picked ? ' is-wrong' : '') : (picked ? ' is-sel' : '');
                      return <button key={oi} className={`qopt${cls}`} onClick={() => setQuizPicks((p) => p.map((x, i) => i === qi ? oi : x))}><span className="qdot" aria-hidden="true"></span>{opt}</button>;
                    })}
                  </div>
                  {masterDone && <p className="lede" style={{ margin: '10px 0 0', fontSize: 13.5 }}>{q.why}</p>}
                </div>
              ))}
              {!masterDone && <button className="btn moss" disabled={quizPicks.some((p) => p === null)} onClick={submitQuiz}>Submit answers</button>}
              {masterDone && <p style={{ color: '#345a04', fontWeight: 600 }}>All correct ✓</p>}
            </>)}

            {view === 'recap' && <RecapView lesson={lesson} />}
            {view === 'missions' && <Missions lesson={lesson} awards={awards} runChecks={runChecks} fileName={fileName} Pane={Pane} done={s.done} markDone={(id) => setS((p) => ({ ...p, done: { ...p.done, [id]: true } }))} />}
          </div>
          <div className="ac-nav">
            <button className="btn" onClick={() => { const i = Math.max(0, stageIndex - 1); setView(STAGES[i].id); }} disabled={stageIndex <= 0}>← Back</button>
            {stageIndex >= 0 && stageIndex < STAGES.length - 1
              ? <button className="btn moss" onClick={() => setView(STAGES[stageIndex + 1].id)}>Next stage →</button>
              : <button className="btn" onClick={onExit}>Return to the Survey</button>}
          </div>
        </div>

        <div className="ac-code">
          <Pane
            code={view === 'practice' ? codeFor('practice', lesson.practice.starter) : view === 'challenge' ? codeFor('challenge', lesson.challenge.starter) : view === 'experiment' ? codeFor('experiment', lesson.experiment.starter) : lesson.discover.example}
            editable={view === 'practice' || view === 'challenge' || view === 'experiment'}
            onChange={(v) => setCode(view, v)}
            onRun={() => { if (view === 'practice') checkExercise('practice'); else if (view === 'challenge') checkExercise('challenge'); }}
            canCheck={view === 'practice' || view === 'challenge'}
            fileName={fileName}
            ariaLabel={`Editor, ${view} stage`}
          />
        </div>
      </div>
    </div>
  );
}

/* ---- recap ---- */
function RecapView({ lesson }: { lesson: Lesson<unknown> }) {
  const r = lesson.recap;
  return (<>
    <p className="kicker">Recap · {lesson.title}</p>
    <h3 className="h3">Key takeaways</h3>
    <ul>{r.takeaways.map((t, i) => <li key={i} style={{ marginBottom: 4 }}><Markup text={t} /></li>)}</ul>
    <h3 className="h3">Syntax</h3>
    {r.syntaxExamples.map((ex, i) => <div key={i} style={{ marginBottom: 8 }}><p className="mono" style={{ margin: '0 0 2px', fontSize: 12, color: '#8a6000' }}>{ex.label}</p><pre className="codeblock mono" style={{ margin: 0 }}>{ex.code}</pre></div>)}
    <h3 className="h3">Common mistakes</h3>
    {r.commonMistakes.map((m, i) => <div className="task" key={i} style={{ marginBottom: 10 }}><p style={{ margin: '0 0 4px', fontWeight: 600 }}><Markup text={m.mistake} /></p><p className="lede" style={{ margin: '0 0 4px', fontSize: 13.5 }}><Markup text={m.why} /></p><p className="lede" style={{ margin: 0, fontSize: 13.5, color: '#345a04' }}><Markup text={m.fix} /></p></div>)}
  </>);
}

/* ---- missions ---- */
function Missions({ lesson, awards, runChecks, fileName, Pane, done, markDone }: { lesson: Lesson<unknown>; awards: AcademyAwards; runChecks: (code: string, checks: unknown[]) => CheckResult[]; fileName: string; Pane: WorkspaceComponent; done: Record<string, boolean>; markDone: (id: string) => void }) {
  const [sel, setSel] = useState(0);
  const [code, setCode] = useState<Record<string, string>>({});
  const [res, setRes] = useState<Record<string, CheckResult[]>>({});
  const [hints, setHints] = useState<Record<string, number>>({});
  const m: Mission<unknown> = lesson.missions[sel];
  const tier = TIERS[sel];
  const c = code[m.id] ?? m.starter;
  const check = () => {
    const r = runChecks(c, m.checks); setRes((x) => ({ ...x, [m.id]: r }));
    const ok = allPass(r); const first = awards.mission(m, ok, hints[m.id] ?? 0); if (ok && first) markDone(m.id);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className="kicker">Optional missions · {lesson.title}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        {lesson.missions.map((mm, i) => (
          <button key={mm.id} className="chip" onClick={() => setSel(i)} style={{ borderColor: sel === i ? '#242820' : undefined, background: done[mm.id] ? '#dfe9d6' : sel === i ? '#eae4d5' : '#f6f2e8' }}>
            {TIERS[i].name}{done[mm.id] ? ' ✓' : ''} · +{TIERS[i].xp}
          </button>
        ))}
      </div>
      <div className="task">
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>{m.title} <span className="mono" style={{ fontSize: 11.5, color: '#8a6000' }}>{tier.label} · +{tier.xp} XP</span></p>
        <p className="lede" style={{ margin: '0 0 4px', fontSize: 13.5 }}><Markup text={m.objective} /></p>
        <p className="lede" style={{ margin: 0, fontSize: 13.5, color: '#63685c' }}>Expected: <Markup text={m.expected} /></p>
        <ul className="checks">
          {m.checks.map((ch, i) => { const r = res[m.id]?.[i]; return <li key={i}><span className={`ck${r ? (r.ok ? ' ok' : ' no') : ''}`} aria-hidden="true">{r ? (r.ok ? '✓' : '×') : ''}</span><span>{(ch as { label: string }).label}{r && !r.ok && r.detail ? <span style={{ color: '#a8423c' }}> — {r.detail}</span> : null}</span></li>; })}
        </ul>
        <div style={{ marginTop: 8 }}>
          <button className="hintbtn" onClick={() => setHints((h) => ({ ...h, [m.id]: Math.min((h[m.id] ?? 0) + 1, m.hints.length) }))}>Need a hint?</button>
          {Array.from({ length: hints[m.id] ?? 0 }).map((_, i) => <div className="hint" key={i}><Markup text={m.hints[i]} /></div>)}
        </div>
        {done[m.id] && <p style={{ marginTop: 8, color: '#345a04', fontWeight: 600 }}>Complete ✓ (+{tier.xp} XP)</p>}
      </div>
      <div style={{ minHeight: 320, border: '1.5px solid #242820', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Pane code={c} editable onChange={(v) => setCode((x) => ({ ...x, [m.id]: v }))} onRun={check} canCheck fileName={fileName} ariaLabel={`Mission editor, ${m.title}`} />
      </div>
    </div>
  );
}

/* ---- tiny inline markup: `code`, **bold** ---- */
function Markup({ text, className }: { text: string; className?: string }) {
  const parts = useMemo(() => tokenize(text), [text]);
  return <p className={className} style={className ? undefined : { margin: 0 }}>{parts}</p>;
}
function tokenize(text: string) {
  const out: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0, m: RegExpExecArray | null, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] != null) out.push(<code className="inl" key={k++}>{m[1]}</code>);
    else out.push(<strong key={k++}>{m[2]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
