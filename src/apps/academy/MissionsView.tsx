// Optional lesson missions: three cards (Seed, Sprout, Bloom) and a briefing for the selected one.
import { TIERS, type Lesson, type LessonMission } from '../../content/lessons/types';
import { Rich } from './rich';
import { StageIcon } from './StageIcon';

/** Working state of one optional mission, saved under `lmission:<id>`, apart from lesson progress. */
export interface MissionState { v: 1; code: string | null; checks: boolean[] | null; hints: number; attempts: number }
export const freshMission = (): MissionState => ({ v: 1, code: null, checks: null, hints: 0, attempts: 0 });
export function normalizeMissionState(raw: unknown): MissionState {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<MissionState>;
  const n = (v: unknown, max: number) => (typeof v === 'number' && v >= 0 ? Math.min(max, Math.floor(v)) : 0);
  return { v: 1, code: typeof r.code === 'string' ? r.code : null, checks: Array.isArray(r.checks) ? r.checks.map((x) => x === true) : null, hints: n(r.hints, 5), attempts: n(r.attempts, 1e6) };
}
export type MissionStatus = 'Not started' | 'In progress' | 'Completed';
export const missionStatus = (s: MissionState | undefined, completed: boolean): MissionStatus =>
  completed ? 'Completed' : s && (s.code != null || s.attempts > 0 || s.hints > 0) ? 'In progress' : 'Not started';

const TIER_ICON = [0, 2, 4]; // seed, sprout, bloom from the stage icons
const tierOf = (m: LessonMission) => TIERS.findIndex((t) => t.tier === m.tier);

interface Props {
  lesson: Lesson;
  states: Record<string, MissionState>;
  completed: Set<string>;
  selected: LessonMission | null;
  busy: boolean;
  onSelect: (id: string | null) => void;
  onSubmit: (m: LessonMission) => void;
  onHint: (m: LessonMission) => void;
}

export function MissionsView({ lesson, states, completed, selected, busy, onSelect, onSubmit, onHint }: Props) {
  if (!selected) {
    return <>
      <h2 className="h2">Optional missions.</h2>
      <p className="lede">Three extra challenges that use only what <b>{lesson.title}</b> (and the lessons before it) taught. They are <b>optional</b>: skip them, do them in any order, or come back later. Your progress along the chart never depends on them.</p>
      <div className="lm-cards">
        {lesson.missions.map((m) => {
          const ti = tierOf(m), t = TIERS[ti], done = completed.has(m.id), status = missionStatus(states[m.id], done);
          return (
            <div className={'task lm-card' + (done ? ' is-done' : '')} key={m.id}>
              <div className="lm-head">
                <StageIcon i={TIER_ICON[ti]} size={34} bg={done ? '#345a04' : '#eae4d5'} ring={done ? '#345a04' : '#242820'} fg={done ? '#f6f2e8' : '#3e6510'} />
                <div style={{ minWidth: 0 }}>
                  <p className="mono lm-meta">{t.name} · {t.label} · +{m.xpReward} XP</p>
                  <p className="lm-title">{m.title}</p>
                </div>
              </div>
              <p className="lm-obj"><Rich text={m.objective} /></p>
              <div className="lm-foot">
                <span className="chip" style={{ color: done ? '#345a04' : status === 'In progress' ? '#8a6000' : '#63685c' }}>{status}</span>
                <button className={'btn' + (done ? '' : ' moss')} onClick={() => onSelect(m.id)} aria-label={`${status === 'Not started' ? 'Start' : done ? 'Practise' : 'Continue'} ${t.name}: ${m.title}`}>
                  {status === 'Not started' ? 'Start mission' : done ? 'Practise again' : 'Continue'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="ac-honest">Bonus XP is paid once per mission. Retry as often as you like; there is no penalty for failed attempts or for skipping.</p>
    </>;
  }

  const m = selected, t = TIERS[tierOf(m)], st = states[m.id], done = completed.has(m.id);
  const results = st?.checks && st.checks.length === m.checks.length ? st.checks : null;
  const firstFail = results ? m.checks.findIndex((_, i) => !results[i]) : -1;
  const hints = st?.hints ?? 0;
  return <>
    <button className="hintbtn" onClick={() => onSelect(null)}>← All missions for this lesson</button>
    <p className="kicker" style={{ marginTop: '10px' }}>Optional mission · {t.name} · {t.label} · +{m.xpReward} XP</p>
    <h2 className="h2">{m.title}</h2>
    <p className="lede"><Rich text={m.description} /></p>
    <div className="ac-goals">
      <b>Learning objective</b>
      <span><Rich text={m.objective} /></span>
    </div>
    <div className="task">
      <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '14px' }}>Expected behaviour</p>
      <p style={{ margin: 0, fontSize: '14.5px' }}><Rich text={m.expected} /></p>
      <ul className="checks" aria-label="Mission checks">
        {m.checks.map((c, i) => {
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
      {firstFail >= 0 && <p role="status" style={{ margin: '10px 0 0', fontSize: '13.5px', color: '#a8423c' }}><Rich text={m.checks[firstFail].fail ?? 'Not there yet. Run it, compare what it does with the expected behaviour, and look at the checks marked with an x.'} /></p>}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
      <button className="btn pri" onClick={() => onSubmit(m)} disabled={busy}>Submit mission</button>
      {hints < m.hints.length && <button className="hintbtn" onClick={() => onHint(m)}>{hints === 0 ? 'Show a hint' : `Show hint ${hints + 1} of ${m.hints.length}`}</button>}
      {done && <span className="chip" style={{ color: '#345a04' }}>Completed · +{m.xpReward} XP earned</span>}
    </div>
    {m.hints.slice(0, hints).map((h, i) => <div className="hint" key={i}><b>Hint {i + 1}.</b> <Rich text={h} /></div>)}
    <p className="ac-honest">Write your solution in mission.py on the right. Run it as often as you like, then submit. Different correct solutions pass.{m.inputs?.length ? ` Checks answer input() with: ${m.inputs.join(', ')}.` : ''}</p>
  </>;
}
