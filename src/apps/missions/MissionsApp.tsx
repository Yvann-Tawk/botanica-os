// Missions: the prototype's expedition board (tickets, brief, archive checks, editor) on real missions.
import { useCallback, useEffect, useState } from 'react';
import { CodeEditor } from '../../editor/CodeEditor';
import { Console, useConsole } from '../../editor/Console';
import { GROUPS, MISSIONS, missionById, type Mission } from '../../content/missions';
import { conceptById } from '../../content/curriculum';
import type { Check } from '../../content/lessons/types';
import { isDone, type Progress } from '../../progression/progress';
import type { Learning } from '../../progression/useLearning';
import { usePythonSession } from '../../runtime/usePython';
import type { KV } from '../../storage/db';
import { Rich } from '../academy/rich';

interface MissionState { v: 1; code: string | null; milestone: number; checks: boolean[] | null; hints: number }
const fresh = (): MissionState => ({ v: 1, code: null, milestone: 0, checks: null, hints: 0 });
function normalize(raw: unknown): MissionState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<MissionState>;
  return { v: 1, code: typeof r.code === 'string' ? r.code : null, milestone: typeof r.milestone === 'number' ? Math.max(0, Math.floor(r.milestone)) : 0,
    checks: Array.isArray(r.checks) ? r.checks.map((x) => x === true) : null, hints: typeof r.hints === 'number' ? Math.max(0, Math.min(5, r.hints)) : 0 };
}

export type MissionStatus = 'done' | 'open' | 'locked' | 'sealed';
export function missionStatus(m: Mission, p: Progress, doneIds: string[]): MissionStatus {
  if (doneIds.includes(m.id)) return 'done';
  if (m.sealed) return 'sealed';
  return m.requires.every((c) => isDone(p, c)) ? 'open' : 'locked';
}

interface Props {
  kv: KV;
  progress: Progress;
  learning: Pick<Learning, 'missionsDone' | 'milestone' | 'missionDone' | 'progression'>;
  route: string | null;
  editorMode: 'auto' | 'simple';
  onSay: (text: string, mood?: 'happy' | 'confused' | 'celebrating') => void;
  onOpenLesson: (lessonId: string) => void;
}

const STATUS_TEXT: Record<MissionStatus, string> = { done: 'Completed', open: 'Ready to launch', locked: 'Opens soon', sealed: 'Sealed' };
const SAVE_MS = 400;

export default function MissionsApp({ kv, progress, learning, route, editorMode, onSay, onOpenLesson }: Props) {
  const doneIds = learning.missionsDone.map((m) => m.id);
  const firstOpen = MISSIONS.find((m) => missionStatus(m, progress, doneIds) === 'open') ?? MISSIONS[0];
  const [sel, setSel] = useState(route && missionById(route) ? route : firstOpen.id);
  const [states, setStates] = useState<Record<string, MissionState>>({});
  const con = useConsole();
  const py = usePythonSession(con);
  useEffect(() => { if (route && missionById(route)) setSel(route); }, [route]);
  useEffect(() => { py.warm(); }, []);

  const m = missionById(sel)!;
  const status = missionStatus(m, progress, doneIds);
  const playable = status === 'open' || status === 'done';
  const st = states[sel];

  useEffect(() => {
    if (states[sel]) return;
    let alive = true;
    kv.get(`mission:${sel}`).catch(() => undefined).then((raw) => { if (alive) setStates((s) => ({ ...s, [sel]: normalize(raw) })); });
    return () => { alive = false; };
  }, [sel, kv, states]);
  useEffect(() => {
    if (!st) return;
    const t = setTimeout(() => { kv.set(`mission:${sel}`, st).catch(() => {}); }, SAVE_MS);
    return () => clearTimeout(t);
  }, [st, sel, kv]);
  const update = useCallback((f: (s: MissionState) => MissionState) => setStates((all) => ({ ...all, [sel]: f(all[sel] ?? fresh()) })), [sel]);

  const milestones = m.milestones;
  const msIndex = milestones ? Math.min(st?.milestone ?? 0, milestones.length - 1) : 0;
  const checks: Check[] = milestones ? milestones[msIndex].checks : m.checks ?? [];
  const hints = milestones ? milestones[msIndex].hints : m.hints ?? [];
  const code = st?.code ?? m.starter ?? '';
  const busy = py.status === 'running' || py.status === 'waiting-input';
  const allMilestonesDone = !!milestones && (st?.milestone ?? 0) >= milestones.length;

  const runChecks = async () => {
    if (!st || busy) return;
    const r = await py.check(code, m.filename!, { checks, inputs: m.inputs ?? [] });
    if (!r?.report) return;
    const ok = r.report.results.every(Boolean), n = r.report.results.filter(Boolean).length;
    if (milestones) {
      learning.milestone(m, msIndex, ok);
      if (ok) {
        const last = msIndex === milestones.length - 1;
        update((s) => ({ ...s, checks: last ? r.report!.results : null, milestone: Math.max(s.milestone, msIndex + 1), hints: 0 }));
        if (last) learning.missionDone(m);
        else onSay(`Milestone ${msIndex + 1} holds. On to "${milestones[msIndex + 1].title}".`, 'celebrating');
        return;
      }
    } else if (ok) learning.missionDone(m);
    update((s) => ({ ...s, checks: r.report!.results }));
    if (!ok) onSay(`${n} of ${checks.length} archive checks pass. Look at the ones with an x.`, n ? 'happy' : 'confused');
    else onSay('Stamped! The archive accepts it.', 'celebrating');
  };

  const shown = st?.checks && st.checks.length === checks.length ? st.checks : null;
  const firstFail = shown ? checks.findIndex((_, i) => !shown[i]) : -1;
  const missing = m.requires.filter((c) => !isDone(progress, c)).map((c) => conceptById(c)!);
  const firstMissingLesson = missing.find((c) => c.lessonId);

  return (
    <div className="wbody">
      <div className="ms">
        <div className="ms-list scroll" role="region" aria-label="Expedition board">
          <p className="disp" style={{ margin: '0 4px 2px', fontSize: '22px' }}>Expedition board</p>
          <p style={{ margin: '0 4px 4px', fontSize: '12.5px', color: '#63685c' }}>{doneIds.length} of {MISSIONS.filter((x) => !x.sealed).length} launchable missions completed</p>
          {MISSIONS.map((x, i) => {
            const s = missionStatus(x, progress, doneIds), on = x.id === sel, first = i === 0 || MISSIONS[i - 1].type !== x.type;
            const sealed = s === 'sealed' || s === 'locked', inv = on || x.type === 'Boss';
            return (
              <div key={x.id}>
                {first && <p className="mgroup">{GROUPS[x.type]}</p>}
                <button className={'mticket ' + (on ? 'is-sel ' : '') + (x.type === 'Boss' && !on ? 'is-boss ' : '') + (sealed && !on ? 'is-sealed' : '')} onClick={() => setSel(x.id)} aria-pressed={on} style={{ marginBottom: '8px' }}>
                  <span className="mmeta"><span>{x.type}</span><span>·</span><span>{x.xp} XP</span><span>·</span><span>{x.mins}</span></span>
                  <span style={{ fontWeight: 700, fontSize: '14.5px', lineHeight: 1.25 }}>{x.title}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                    <span style={{ display: 'flex', gap: '2px' }} aria-label={`Difficulty ${x.diff} of 4`} role="img">
                      {[1, 2, 3, 4].map((k) => <svg key={k} width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M5 11 C 0 8, 0 3, 5 1 C 10 3, 10 8, 5 11 Z" fill={k <= x.diff ? (inv ? '#f3c766' : '#3e6510') : 'none'} stroke={inv ? '#f3c766' : '#3e6510'} strokeWidth="1"></path></svg>)}
                    </span>
                    <span>{STATUS_TEXT[s]}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="ms-brief scroll" tabIndex={0} role="region" aria-label="Mission brief">
          <p className="mono" style={{ margin: '0 0 6px', fontSize: '12px', color: '#8a6000' }}>{m.type === 'Boss' ? 'Guided project' : `${m.type} mission`} · {m.region}</p>
          <h2 className="h2" style={{ fontSize: '28px' }}>{m.title}</h2>
          <p className="lede" style={{ fontSize: '15px' }}><Rich text={m.brief} /></p>
          {playable && <>
            {milestones && (
              <ol className="ms-steps" aria-label="Project milestones">
                {milestones.map((ms, i) => {
                  const done = (st?.milestone ?? 0) > i, cur = i === msIndex && !allMilestonesDone;
                  return <li key={i} className={(done ? 'is-done ' : '') + (cur ? 'is-cur' : '')} aria-current={cur ? 'step' : undefined}>
                    <span className="ms-n">{done ? '✓' : i + 1}</span><span>{ms.title}</span>
                  </li>;
                })}
              </ol>
            )}
            {milestones && !allMilestonesDone && <p style={{ margin: '0 0 12px', fontSize: '14.5px' }}><b>Milestone {msIndex + 1}.</b> <Rich text={milestones[msIndex].brief} /></p>}
            <div className="task">
              <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>Archive checks{milestones ? ` · milestone ${msIndex + 1}` : ''}</p>
              <ul className="checks">
                {checks.map((c, i) => {
                  const ok = shown ? shown[i] : status === 'done' && !milestones ? true : null;
                  return <li key={i}><span className={'ck ' + (ok === true ? 'ok' : ok === false ? 'no' : '')}><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    {ok === true && <path d="M2.5 6.2 L 5 8.5 L 9.5 3.5" fill="none" stroke="#f6f2e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>}
                    {ok === false && <path d="M3 3 L 9 9 M9 3 L 3 9" stroke="#a8423c" strokeWidth="1.8" strokeLinecap="round"></path>}
                  </svg></span><span>{c.label}<span className="vh">{ok === true ? ' (passing)' : ok === false ? ' (not yet)' : ''}</span></span></li>;
                })}
              </ul>
              {firstFail >= 0 && checks[firstFail].fail && <p style={{ margin: '10px 0 0', fontSize: '13.5px', color: '#a8423c' }}><Rich text={checks[firstFail].fail!} /></p>}
            </div>
            {(st?.hints ?? 0) < hints.length && <button className="hintbtn" style={{ marginTop: '10px' }} onClick={() => update((s) => ({ ...s, hints: s.hints + 1 }))}>{(st?.hints ?? 0) === 0 ? 'Show a hint' : `Show hint ${(st?.hints ?? 0) + 1} of ${hints.length}`}</button>}
            {hints.slice(0, st?.hints ?? 0).map((h, i) => <div className="hint" key={i}><b>Hint {i + 1}.</b> <Rich text={h} /></div>)}
            {m.reward && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px', padding: '14px', border: '1.5px dashed #b47e00', borderRadius: '12px', background: 'rgba(180,126,0,.08)' }}>
                <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" style={{ flex: 'none' }}><g transform="rotate(-8 22 22)"><path d="M10 6 H 38 V 38 H 10 L 4 22 Z" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></path><circle cx="11" cy="22" r="2.6" fill="none" stroke="#242820" strokeWidth="1.4"></circle><path d="M17 15 H 32 M17 22 H 32 M17 29 H 27" stroke="#3e6510" strokeWidth="2" strokeLinecap="round"></path></g></svg>
                <div style={{ flex: 1, minWidth: '160px', fontSize: '13.5px' }}><b>{status === 'done' ? 'Earned' : 'Reward'}</b><br />{m.reward.artifact} ({m.reward.desc.toLowerCase()}) and {m.xp} XP{m.completesConcept ? `, and the last Origins concept` : ''}</div>
              </div>
            )}
          </>}
          {!playable && (
            <div className="task" style={{ background: '#eae4d5' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '14px' }}>{status === 'sealed' ? 'Sealed' : 'Not yet'}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#3c4036' }}>{m.req}</p>
              {status === 'locked' && missing.length > 0 && <p style={{ margin: '8px 0 0', fontSize: '13.5px', color: '#3c4036' }}>Still to do: {missing.map((c) => c.name).join(', ')}.</p>}
              {status === 'locked' && firstMissingLesson && <button className="btn moss" style={{ marginTop: '12px' }} onClick={() => onOpenLesson(firstMissingLesson.lessonId!)}>Open {firstMissingLesson.name}</button>}
            </div>
          )}
        </div>

        <div className="ms-work">
          {playable && st ? (
            <div className="ed">
              <div className="ed-bar">
                <div className="ed-tab mono"><span className="tdot" style={{ background: '#e2a93b', borderColor: '#0b0f08' }}></span>{m.filename}</div>
                <div className="ed-actions">
                  <button className="btn-g" onClick={() => update((s) => ({ ...s, code: null }))} disabled={st.code == null}>Reset</button>
                  {busy
                    ? <button className="btn-run" onClick={py.stop}><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" rx="1" fill="#12180e"></rect></svg>Stop</button>
                    : <button className="btn-run" onClick={() => py.run(code, m.filename!)}><svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1 L 9 6 L 1 11 Z" fill="#12180e"></path></svg>Run<span className="kbd">⌘↵</span></button>}
                </div>
              </div>
              <CodeEditor key={sel} value={code} onChange={(c) => update((s) => ({ ...s, code: c }))} onRun={() => { if (!busy) py.run(code, m.filename!); }} ariaLabel={`Python code editor for the mission, ${m.filename}`} mode={editorMode} />
              <Console lines={con.lines} tip={py.tip} title={`Console · Python ${py.rt.pythonVersion || '3.12'}`} onClear={() => { con.clear(); py.setTip(''); }}
                empty="Run the code, then run the archive checks." style={{ height: '32%' }} inputPrompt={py.prompt} onInput={py.answer} />
              <div className="ms-runbar">
                <span style={{ flex: 1 }} role="status">{status === 'done' ? 'Completed. Run the checks again any time; it will not pay out twice.' : shown ? `${shown.filter(Boolean).length} of ${checks.length} checks pass.` : m.inputs ? `Checks answer input() with: ${m.inputs.join(', ')}.` : 'Run it, then run the archive checks.'}</span>
                <button className="btn-run" style={{ height: '40px', padding: '0 16px' }} onClick={runChecks} disabled={busy}>Run archive checks</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '30px', textAlign: 'center', color: '#a3a893' }}>
              <div style={{ maxWidth: '300px' }}>
                <svg width="120" height="120" viewBox="-60 -60 120 120" aria-hidden="true" style={{ display: 'block', margin: '0 auto 14px' }}><circle r="44" fill="none" stroke="#3a4730" strokeWidth="2" strokeDasharray="4 6"></circle><circle r="28" fill="#1b2315" stroke="#5b6650" strokeWidth="2"></circle><circle cy="-6" r="7" fill="#6f7a63"></circle><path d="M-4 -2 L 4 -2 L 6 14 L -6 14 Z" fill="#6f7a63"></path></svg>
                <p className="disp" style={{ margin: '0 0 6px', fontSize: '20px', color: '#ece6d6' }}>{status === 'sealed' ? 'This mission is sealed' : 'Almost charted'}</p>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5 }}>{m.req}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
