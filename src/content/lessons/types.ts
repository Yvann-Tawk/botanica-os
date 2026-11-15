// Lesson schema. Text fields accept light inline markup: `code`, **bold**.
//
// Stages follow the prototype's five: Discover (what + why, with a worked example) → Experiment (guided play
// in the live editor) → Practice (a guided exercise, validated) → Challenge (an unguided one, validated) →
// Master (knowledge check). A lesson completes only when Practice, Challenge and Master all pass.

/** JSON values for expectations. Lists also match tuples, and match sets ignoring order. */
export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Checks run in Python against the learner's program. Several valid solutions pass as long as behaviour matches. */
export type Check =
  /** The program runs without an exception, in every case. */
  | { kind: 'runs'; label: string; fail?: string }
  /** Output of the first run. `lines` compares whole lines (trailing spaces ignored); `contains`/`regex` search. */
  | { kind: 'output'; label: string; lines?: string[]; contains?: string; regex?: string; fail?: string }
  /** A variable after the first run. `type` uses the exact class name, so bool is not int. */
  | { kind: 'var'; label: string; name: string; type?: 'int' | 'float' | 'str' | 'bool' | 'list' | 'tuple' | 'dict' | 'set' | 'NoneType'; equals?: Json; nonEmpty?: boolean; fail?: string }
  /** The source text. Use sparingly: prefer behaviour. */
  | { kind: 'source'; label: string; matches?: string; notMatches?: string; fail?: string }
  /** Re-run with different stdin lines; check the output of each. */
  | { kind: 'cases'; label: string; cases: { inputs: string[]; regex?: string; expect?: Record<string, Json> }[]; fail?: string }
  /** Re-run with different starting values (replaces the first `name = ...` line); check variables after.
   *  Use `{ __set__: [...] }`, `{ __tuple__: [...] }` or `{ __date__: 'YYYY-MM-DD' }` for those starting values. */
  | { kind: 'variants'; label: string; variants: { set: Record<string, Json>; expect: Record<string, Json> }[]; fail?: string }
  /** Call a function the learner defined. */
  /** Evaluate expressions against the program's names (lesson-authored), e.g. `Plant("fern", 30).height`. */
  | { kind: 'expr'; label: string; cases: { expr: string; equals?: Json; prints?: string[] }[]; fail?: string }
  | { kind: 'call'; label: string; fn: string; calls: { args?: Json[]; kwargs?: Record<string, Json>; returns?: Json; prints?: string[] }[]; fail?: string };

export interface Exercise {
  heading: string;
  lede: string;
  /** Steps shown in the task card; omit for an unguided challenge. */
  steps?: string[];
  note?: string;
  starter: string;
  /** Lines fed to input() when checking (and the first case's output is what the learner sees). */
  inputs?: string[];
  checks: Check[];
  hints: string[];
}

export interface QuizQuestion { q: string; opts: string[]; a: number; why: string }

export interface Tag { name: string; color: string; desc: string; examples: string }

/** The mandatory part of a lesson (five stages). Recap and optional missions are added in `extras/`. */
export interface LessonCore {
  id: string;
  conceptId: string;
  number: number;
  title: string;
  description: string;
  objectives: string[];
  difficulty: 1 | 2 | 3;
  minutes: number;
  /** Awarded by the progression engine (Milestone 5). */
  xp: number;
  discover: { heading: string; lede: string; figure?: 'jars'; example: string; tagsHeading?: string; tags?: Tag[]; tip?: string };
  experiment: { heading: string; lede: string; steps: string[]; tip?: string; code: string };
  practice: Exercise;
  challenge: Exercise;
  quiz: QuizQuestion[];
}

export type StageId = 'discover' | 'experiment' | 'practice' | 'challenge' | 'master';
export const STAGES: { id: StageId; name: string }[] = [
  { id: 'discover', name: 'Discover' }, { id: 'experiment', name: 'Experiment' }, { id: 'practice', name: 'Practice' },
  { id: 'challenge', name: 'Challenge' }, { id: 'master', name: 'Master' },
];

/* ---- lesson recap: shown once the lesson is complete, revisitable any time ---- */
export interface SyntaxExample { label: string; code: string }
export interface CommonMistake { mistake: string; why: string; fix: string }
export interface LessonRecap {
  /** 3–5 short takeaways. */
  takeaways: string[];
  /** Short, runnable snippets of the syntax this lesson introduced. */
  syntaxExamples: SyntaxExample[];
  /** 2–3 beginner mistakes: what happens, why, and how to avoid it. */
  commonMistakes: CommonMistake[];
  /** 2–3 self-assessment questions. Never block progress. */
  knowledgeChecks: QuizQuestion[];
}

/* ---- optional lesson missions: exactly three per lesson, never required ---- */
export type MissionTier = 'seed' | 'sprout' | 'bloom';
export const TIERS: { tier: MissionTier; name: string; difficulty: 'easy' | 'medium' | 'challenging'; label: string; xp: number }[] = [
  { tier: 'seed', name: 'The Seed', difficulty: 'easy', label: 'Easy', xp: 15 },
  { tier: 'sprout', name: 'The Sprout', difficulty: 'medium', label: 'Medium', xp: 30 },
  { tier: 'bloom', name: 'The Bloom', difficulty: 'challenging', label: 'Challenging', xp: 50 },
];
export interface LessonMission {
  id: string;
  lessonId: string;
  tier: MissionTier;
  difficulty: 'easy' | 'medium' | 'challenging';
  title: string;
  description: string;
  /** The learning objective, in one line. */
  objective: string;
  /** Expected behaviour, in plain words. */
  expected: string;
  starterCode: string;
  hints: string[];
  xpReward: number;
  /** Lines fed to input() when validating. */
  inputs?: string[];
  /** Validation rules: the same behaviour-based checks lessons use. */
  checks: Check[];
}
export interface LessonExtras { recap: LessonRecap; missions: [LessonMission, LessonMission, LessonMission] }
export type Lesson = LessonCore & LessonExtras;
