import { ACHIEVEMENTS } from '../src/content/achievements';
import { conceptEvidence, EMPTY_PROGRESSION, earned, levelOf, longestStreak, masteryLevel, masteryScore, newAchievements, normalizeProgression, record, streak, totalXP, weekFlags, type Progression } from '../src/progression/engine';
import { EMPTY_PROGRESS } from '../src/progression/progress';

const at = (d: string) => `${d}T12:00:00`;
const ev = (p: Progression, type: string, date: string, extra: object = {}) => record(p, { type, ...extra }, new Date(at(date)).toISOString()).p;

describe('XP', () => {
  it('pays each award key once, however often the work is repeated', () => {
    let p = EMPTY_PROGRESSION, gained = 0;
    for (let i = 0; i < 5; i++) { const r = record(p, { type: 'exercise', ref: 'g01-l01:practice', award: 'ex:g01-l01:practice', xp: 40 }); p = r.p; gained += r.gained; }
    expect(gained).toBe(40);
    expect(totalXP(p)).toBe(40);
    expect(p.events).toHaveLength(5); // still logged, for streaks and mastery
  });
  it('events without an award key pay nothing', () => {
    expect(record(EMPTY_PROGRESSION, { type: 'run', xp: 999 }).gained).toBe(0);
  });
  it('levels follow the prototype table', () => {
    expect(levelOf(0)).toMatchObject({ n: 1, name: 'Spore Cadet' });
    expect(levelOf(150)).toMatchObject({ n: 2, name: 'Seedling' });
    expect(levelOf(13000)).toMatchObject({ n: 10, name: 'Cosmic Arborist' });
  });
  it('normalizes stored data', () => {
    expect(normalizeProgression({ events: [{ type: 'run', at: 'x', xp: 1 }, { bad: 1 }], pilotName: 7 })).toEqual({ v: 1, events: [{ type: 'run', at: 'x', xp: 1 }], pilotName: '' });
  });
});

describe('streaks', () => {
  it('counts consecutive days ending today or yesterday', () => {
    let p = EMPTY_PROGRESSION;
    for (const d of ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12']) p = ev(p, 'run', d);
    expect(streak(p, new Date(at('2026-11-12')))).toBe(4);
    expect(streak(p, new Date(at('2026-11-13')))).toBe(4); // today not started yet
    expect(streak(p, new Date(at('2026-11-15')))).toBe(0);
    expect(longestStreak(ev(p, 'run', '2026-11-20'))).toBe(4);
  });
  it('marks the days of this week', () => {
    const p = ev(EMPTY_PROGRESSION, 'run', '2026-11-10'); // a Tuesday
    expect(weekFlags(p, new Date(at('2026-11-13')))).toEqual([false, true, false, false, false, false, false]);
  });
});

describe('mastery (separate from XP and completion)', () => {
  it('builds from evidence and rewards independence', () => {
    let p = EMPTY_PROGRESSION;
    p = record(p, { type: 'exercise', ref: 'g01-l02:practice' }).p;
    expect(masteryLevel(masteryScore(conceptEvidence(p, 'g01-l02', [])))).toBe('seen');
    p = record(p, { type: 'exercise', ref: 'g01-l02:challenge', meta: { hints: 3 } }).p;
    p = record(p, { type: 'quiz', ref: 'g01-l02', meta: { firstTry: false } }).p;
    expect(masteryScore(conceptEvidence(p, 'g01-l02', []))).toBeCloseTo(0.85);
    const helped = record(EMPTY_PROGRESSION, { type: 'exercise', ref: 'g01-l02:practice' }).p;
    const indep = [
      { type: 'exercise', ref: 'g01-l02:challenge', meta: { hints: 0 } },
      { type: 'quiz', ref: 'g01-l02', meta: { firstTry: true } },
    ].reduce((q, e) => record(q, e).p, helped);
    expect(masteryScore(conceptEvidence(indep, 'g01-l02', []))).toBe(1);
  });
  it('missions that practise a concept reinforce it', () => {
    const p = record(record(EMPTY_PROGRESSION, { type: 'exercise', ref: 'g01-l03:practice' }).p, { type: 'mission', ref: 'label' }).p;
    expect(conceptEvidence(p, 'g01-l03', ['label']).reinforced).toBe(1);
  });
});

describe('achievements', () => {
  const ctx = (progress: Progression, completed: Record<string, string> = {}, missions: { id: string; type: string }[] = []) => ({ progress, learning: { ...EMPTY_PROGRESS, completed }, missionsDone: missions });
  const byId = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)!;
  it('are data, evaluated by rule', () => {
    expect(earned(byId('first-light'), ctx(ev(EMPTY_PROGRESSION, 'run', '2026-11-13')))).toBe(true);
    expect(earned(byId('name-giver'), ctx(EMPTY_PROGRESSION, { 'origins.variables': 'x' }))).toBe(true);
    expect(earned(byId('specimen-clerk'), ctx(EMPTY_PROGRESSION, {}, [{ id: 'hello', type: 'Micro' }]))).toBe(true);
    expect(earned(byId('loop-gardener'), ctx(EMPTY_PROGRESSION))).toBe(false);
  });
  it('new ones are reported once', () => {
    const p = ev(EMPTY_PROGRESSION, 'run', '2026-11-13');
    expect(newAchievements(ctx(p)).map((a) => a.id)).toEqual(['first-light']);
    const logged = record(p, { type: 'achievement', ref: 'first-light' }).p;
    expect(newAchievements(ctx(logged))).toEqual([]);
  });
});
