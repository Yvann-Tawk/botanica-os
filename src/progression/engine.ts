// Progression engine: XP, levels, streaks, mastery and achievements, all derived from a log of learning events.
// Pure functions. XP comes from *unique* awards, so repeating work never farms XP.

import { ACHIEVEMENTS, type Achievement } from '../content/achievements';
import { ALL_CONCEPTS, REGIONS } from '../content/curriculum';
import { isDone, type Progress } from './progress';

/* ---- the log ---- */

export interface LearnEvent {
  /** run · check-fail · fixed · exercise · quiz · lesson · mission · milestone · achievement */
  type: string;
  /** What it was about, e.g. "g01-l03:challenge" or a mission id. */
  ref?: string;
  at: string;
  /** XP granted by this event (0 when the award key was already used). */
  xp: number;
  /** Unique award key; an award key only ever pays out once. */
  award?: string;
  /** Hints used (exercises) and whether a quiz passed on the first submission. */
  meta?: { hints?: number; firstTry?: boolean };
}

export interface Progression {
  v: 1;
  events: LearnEvent[];
  pilotName: string;
}

export const EMPTY_PROGRESSION: Progression = { v: 1, events: [], pilotName: '' };
const MAX_EVENTS = 5000;

export function normalizeProgression(raw: unknown): Progression {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Progression>;
  const events = Array.isArray(r.events)
    ? r.events.filter((e): e is LearnEvent => !!e && typeof e.type === 'string' && typeof e.at === 'string' && typeof e.xp === 'number').slice(-MAX_EVENTS)
    : [];
  return { v: 1, events, pilotName: typeof r.pilotName === 'string' ? r.pilotName.slice(0, 40) : '' };
}

/** XP table. Keys are award prefixes; the full key adds the specific item so each pays once. */
export const XP = { practice: 40, challenge: 60, quiz: 30, firstRun: 10, regionBonus: 200 } as const;

/** Appends an event. If `award` was already paid, the event is still logged (for streaks and mastery) with 0 XP. */
export function record(p: Progression, e: Omit<LearnEvent, 'at' | 'xp'> & { xp?: number }, at = new Date().toISOString()): { p: Progression; gained: number } {
  const paid = e.award ? p.events.some((x) => x.award === e.award && x.xp > 0) : true;
  const gained = e.award && !paid ? Math.max(0, e.xp ?? 0) : 0;
  const ev: LearnEvent = { type: e.type, ref: e.ref, award: e.award, meta: e.meta, at, xp: gained };
  return { p: { ...p, events: [...p.events, ev].slice(-MAX_EVENTS) }, gained };
}

export const totalXP = (p: Progression) => p.events.reduce((a, e) => a + e.xp, 0);

/* ---- levels (the prototype's table) ---- */

export const LV_T = [0, 150, 450, 900, 1600, 2600, 4000, 6000, 9000, 13000, 99999];
export const LV_N = ['Spore Cadet', 'Seedling', 'Germinator', 'Sapling Navigator', 'Fern Pilot', 'Canopy Pilot', 'Grove Captain', 'Old-Growth Admiral', 'Starwood Admiral', 'Cosmic Arborist'];
export function levelOf(xp: number) {
  let i = 0;
  while (i < LV_T.length - 2 && xp >= LV_T[i + 1]) i++;
  return { n: i + 1, name: LV_N[i], lo: LV_T[i], hi: LV_T[i + 1], nextName: LV_N[i + 1] ?? LV_N[i] };
}

/* ---- streaks: consecutive local days with any learning event ---- */

const dayKey = (iso: string) => { const d = new Date(iso); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
export function activeDays(p: Progression): Set<string> { return new Set(p.events.map((e) => dayKey(e.at))); }

/** Current streak: counts back from today (or yesterday, so the streak survives until the day ends). */
export function streak(p: Progression, now = new Date()): number {
  const days = activeDays(p);
  const d = new Date(now);
  if (!days.has(dayKey(d.toISOString()))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(dayKey(d.toISOString()))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
/** Longest run ever, for achievements. */
export function longestStreak(p: Progression): number {
  const keys = Array.from(activeDays(p)).map((k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).getTime(); }).sort((a, b) => a - b);
  let best = 0, run = 0, prev = NaN;
  for (const t of keys) { run = Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = t; }
  return best;
}
/** Seven flags Mon..Sun for the current week. */
export function weekFlags(p: Progression, now = new Date()): boolean[] {
  const days = activeDays(p), monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return days.has(dayKey(d.toISOString())); });
}

/* ---- mastery: separate from XP and from completion ----
   A concept's mastery (0–1) comes from what the learner demonstrated:
   practice passed .25 · challenge passed .35 · quiz passed .25 · independence .15 (challenge with ≤1 hint, quiz right first time)
   plus .1 for each mission that reinforces the concept, capped at 1. */

export interface ConceptEvidence { practice: boolean; challenge: boolean; quiz: boolean; independent: boolean; reinforced: number }
export const masteryScore = (e: ConceptEvidence) =>
  Math.min(1, (e.practice ? 0.25 : 0) + (e.challenge ? 0.35 : 0) + (e.quiz ? 0.25 : 0) + (e.independent ? 0.15 : 0) + 0.1 * e.reinforced);
/** Evidence for one concept, read from the event log. `reinforcedBy` lists missions that practise the concept. */
export function conceptEvidence(p: Progression, lessonId: string, reinforcedBy: string[]): ConceptEvidence {
  const has = (type: string, ref: string) => p.events.find((e) => e.type === type && e.ref === ref);
  const ch = has('exercise', `${lessonId}:challenge`), qz = has('quiz', lessonId);
  return {
    practice: !!has('exercise', `${lessonId}:practice`),
    challenge: !!ch,
    quiz: !!qz,
    independent: !!ch && (ch.meta?.hints ?? 3) <= 1 && !!qz?.meta?.firstTry,
    // board missions that practise the concept, plus this lesson's own optional missions
    reinforced: reinforcedBy.filter((m) => has('mission', m)).length
      + new Set(p.events.filter((e) => e.type === 'lmission' && e.ref?.startsWith(`${lessonId}-m`)).map((e) => e.ref)).size,
  };
}
export type MasteryLevel = 'new' | 'seen' | 'practised' | 'mastered';
export const masteryLevel = (s: number): MasteryLevel => (s >= 0.85 ? 'mastered' : s >= 0.5 ? 'practised' : s > 0 ? 'seen' : 'new');

/* ---- achievements ---- */

export interface AchievementContext { progress: Progression; learning: Progress; missionsDone: { id: string; type: string }[] }

export function earned(a: Achievement, c: AchievementContext): boolean {
  const r = a.rule;
  switch (r.kind) {
    case 'event': return c.progress.events.some((e) => e.type === r.event);
    case 'concept': return isDone(c.learning, r.id);
    case 'concepts': return ALL_CONCEPTS.filter((x) => isDone(c.learning, x.id)).length >= r.count;
    case 'region': { const reg = REGIONS.find((x) => x.id === r.id); return !!reg && reg.concepts.every((x) => isDone(c.learning, x.id)); }
    case 'mission': return c.missionsDone.some((m) => m.id === r.id);
    case 'missions': return c.missionsDone.filter((m) => m.type === r.type).length >= r.count;
    case 'streak': return longestStreak(c.progress) >= r.days;
    case 'events': return new Set(c.progress.events.filter((e) => e.type === r.event).map((e) => e.ref)).size >= r.count;
    case 'eventRef': return c.progress.events.some((e) => e.type === r.event && !!e.ref?.endsWith(r.suffix));
  }
}

/** Achievements earned now but not yet logged. */
export function newAchievements(c: AchievementContext): Achievement[] {
  const logged = new Set(c.progress.events.filter((e) => e.type === 'achievement').map((e) => e.ref));
  return ACHIEVEMENTS.filter((a) => !logged.has(a.id) && earned(a, c));
}
export const unlockedAt = (p: Progression, id: string) => p.events.find((e) => e.type === 'achievement' && e.ref === id)?.at ?? null;
