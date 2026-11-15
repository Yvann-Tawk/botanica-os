// Compact authoring helpers for lesson extras (recap + three optional missions).
import { TIERS, type Check, type LessonExtras, type LessonMission, type LessonRecap } from '../types';

export type MissionDraft = Pick<LessonMission, 'title' | 'description' | 'objective' | 'expected' | 'starterCode' | 'hints' | 'checks' | 'inputs'>;

/** recap(takeaways, [label, code][], [mistake, why, fix][], [question, options, answerIndex, why][]) */
export function recap(takeaways: string[], syntax: [string, string][], mistakes: [string, string, string][], checks: [string, string[], number, string][]): LessonRecap {
  return {
    takeaways,
    syntaxExamples: syntax.map(([label, code]) => ({ label, code })),
    commonMistakes: mistakes.map(([mistake, why, fix]) => ({ mistake, why, fix })),
    knowledgeChecks: checks.map(([q, opts, a, why]) => ({ q, opts, a, why })),
  };
}

/** mission(title, description, objective, expected, starterCode, checks, hints, inputs?) */
export function mission(title: string, description: string, objective: string, expected: string, starterCode: string, checks: Check[], hints: string[], inputs?: string[]): MissionDraft {
  return { title, description, objective, expected, starterCode, checks, hints, inputs };
}

/** Builds one lesson's extras: missions get their id (`<lesson>-m1..3`), tier, difficulty and XP from their position. */
export function extras(lessonId: string, r: LessonRecap, drafts: [MissionDraft, MissionDraft, MissionDraft]): Record<string, LessonExtras> {
  const missions = drafts.map((d, i): LessonMission => ({ ...d, id: `${lessonId}-m${i + 1}`, lessonId, tier: TIERS[i].tier, difficulty: TIERS[i].difficulty, xpReward: TIERS[i].xp }));
  return { [lessonId]: { recap: r, missions: missions as LessonExtras['missions'] } };
}
