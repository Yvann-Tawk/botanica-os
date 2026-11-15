// Per-lesson working state, saved under `lesson:<id>`: where you are, your code, what has passed.
// Completion itself lives in the progress store; this is the scratch work behind it.

import type { Lesson, StageId } from '../../content/lessons/types';

export type CodeSlot = 'experiment' | 'practice' | 'challenge';

export interface LessonState {
  v: 1;
  stage: number;
  code: Record<CodeSlot, string | null>; // null = untouched starter
  experimentRan: boolean;
  passed: { practice: boolean; challenge: boolean; master: boolean };
  /** Last check results per exercise, so the ticks survive a reload. */
  checks: { practice: boolean[] | null; challenge: boolean[] | null };
  hints: { practice: number; challenge: number };
  quiz: Record<number, number>;
  /** Show verdicts under the quiz (cleared when an answer changes). */
  quizChecked: boolean;
  attempts: { practice: number; challenge: number; master: number };
}

export const freshState = (): LessonState => ({
  v: 1, stage: 0, code: { experiment: null, practice: null, challenge: null }, experimentRan: false,
  passed: { practice: false, challenge: false, master: false }, checks: { practice: null, challenge: null },
  hints: { practice: 0, challenge: 0 }, quiz: {}, quizChecked: false, attempts: { practice: 0, challenge: 0, master: 0 },
});

export function normalizeLessonState(raw: unknown): LessonState {
  const f = freshState();
  if (!raw || typeof raw !== 'object') return f;
  const r = raw as Partial<LessonState>;
  const bool = (v: unknown) => v === true;
  const num = (v: unknown, max = 99) => (typeof v === 'number' && v >= 0 ? Math.min(max, Math.floor(v)) : 0);
  const str = (v: unknown) => (typeof v === 'string' ? v : null);
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(bool) : null);
  return {
    v: 1,
    stage: num(r.stage, 6), // 0–4 the five stages, 5 recap, 6 optional missions
    code: { experiment: str(r.code?.experiment), practice: str(r.code?.practice), challenge: str(r.code?.challenge) },
    experimentRan: bool(r.experimentRan),
    passed: { practice: bool(r.passed?.practice), challenge: bool(r.passed?.challenge), master: bool(r.passed?.master) },
    checks: { practice: arr(r.checks?.practice), challenge: arr(r.checks?.challenge) },
    hints: { practice: num(r.hints?.practice, 3), challenge: num(r.hints?.challenge, 3) },
    quizChecked: bool(r.quizChecked),
    quiz: r.quiz && typeof r.quiz === 'object' ? Object.fromEntries(Object.entries(r.quiz).filter(([, v]) => typeof v === 'number')) as Record<number, number> : {},
    attempts: { practice: num(r.attempts?.practice, 1e6), challenge: num(r.attempts?.challenge, 1e6), master: num(r.attempts?.master, 1e6) },
  };
}

export const codeFor = (l: Lesson, s: LessonState, slot: CodeSlot) =>
  s.code[slot] ?? (slot === 'experiment' ? l.experiment.code : l[slot].starter);

/** The editor on the right follows the stage: Discover/Experiment/Master share the playground. */
export const slotForStage = (stage: StageId): CodeSlot => (stage === 'practice' ? 'practice' : stage === 'challenge' ? 'challenge' : 'experiment');

export const isLessonComplete = (s: LessonState) => s.passed.practice && s.passed.challenge && s.passed.master;

/** Which stages show a done mark. */
export function stagesDone(s: LessonState, completed: boolean): boolean[] {
  return [s.stage > 0 || completed, s.experimentRan || completed, s.passed.practice, s.passed.challenge, s.passed.master];
}
