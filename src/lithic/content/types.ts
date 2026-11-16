// Lithic lesson content schema. Mirrors Botanica's five-stage arc (Discover → Experiment → Practice →
// Challenge → Master) and its recap + three-mission shape, so the Lithic Academy can reuse those patterns
// (LESSON_UI_SPEC). The difference is the workspace: an HTML editor + sandboxed live preview, validated by the
// DOM-based HtmlCheck engine instead of the Python runtime. Quiz/recap value types are shared with Botanica.

import type { QuizQuestion, SyntaxExample, CommonMistake } from '../../content/lessons/types';
import type { HtmlCheck } from '../runtime/htmlChecks';

export type { QuizQuestion, SyntaxExample, CommonMistake };

/** A validated exercise: starter markup, DOM checks, and progressive hints. */
export interface HtmlExercise {
  heading: string;
  lede: string;
  /** Shown in the task card; omit for an unguided challenge. */
  steps?: string[];
  note?: string;
  starter: string;
  checks: HtmlCheck[];
  hints: string[];
}

/** Exactly three optional missions per lesson (Seed / Sprout / Bloom = 15 / 30 / 50 XP). */
export type MissionTier = 'seed' | 'sprout' | 'bloom';
export interface HtmlMission {
  id: string;
  lessonId: string;
  tier: MissionTier;
  title: string;
  objective: string;
  expected: string;
  starter: string;
  hints: string[];
  xpReward: number;
  checks: HtmlCheck[];
}

export interface HtmlRecap {
  takeaways: string[];
  syntaxExamples: SyntaxExample[];
  commonMistakes: CommonMistake[];
  knowledgeChecks: QuizQuestion[];
}

/** A complete HTML lesson. `conceptId` is the Lithic curriculum key (`lithic.html.<mini>.l<n>`). */
export interface HtmlLesson {
  id: string;
  conceptId: string;
  planetId: 'foundation';
  conceptKey: string;      // the owning mini-planet id, e.g. 'lithic.html.stone'
  number: number;
  title: string;
  minutes: number;
  xp: number;
  objectives: string[];
  discover: { heading: string; lede: string; example: string; exampleNote?: string; tip?: string };
  experiment: { heading: string; lede: string; steps: string[]; tip?: string; starter: string };
  practice: HtmlExercise;
  challenge: HtmlExercise;
  quiz: QuizQuestion[];
  recap: HtmlRecap;
  missions: [HtmlMission, HtmlMission, HtmlMission];
}

/** Mission tier metadata, matching Botanica's. */
export const HTML_TIERS: { tier: MissionTier; name: string; label: string; xp: number }[] = [
  { tier: 'seed', name: 'The Seed', label: 'Easy', xp: 15 },
  { tier: 'sprout', name: 'The Sprout', label: 'Medium', xp: 30 },
  { tier: 'bloom', name: 'The Bloom', label: 'Challenging', xp: 50 },
];
