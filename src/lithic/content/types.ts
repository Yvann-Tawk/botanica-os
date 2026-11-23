// Lithic lesson content schema. Mirrors Botanica's five-stage arc (Discover → Experiment → Practice →
// Challenge → Master) and its recap + three-mission shape, so the Lithic Academy reuses those patterns
// (LESSON_UI_SPEC). The schema is generic over the *check* type `C`, so each discipline plugs in its own
// validator — HtmlCheck (DOM) for HTML, DaxCheck for DAX, MCheck for Power Query M — while the stage/recap/
// mission shell stays shared. Quiz/recap value types are shared with Botanica.

import type { QuizQuestion, SyntaxExample, CommonMistake } from '../../content/lessons/types';
import type { HtmlCheck } from '../runtime/htmlChecks';

export type { QuizQuestion, SyntaxExample, CommonMistake };

/** A validated exercise: starter code, discipline checks, and progressive hints. */
export interface Exercise<C> {
  heading: string;
  lede: string;
  /** Shown in the task card; omit for an unguided challenge. */
  steps?: string[];
  note?: string;
  starter: string;
  checks: C[];
  hints: string[];
}

/** Exactly three optional missions per lesson (Seed / Sprout / Bloom = 15 / 30 / 50 XP). */
export type MissionTier = 'seed' | 'sprout' | 'bloom';
export interface Mission<C> {
  id: string;
  lessonId: string;
  tier: MissionTier;
  title: string;
  objective: string;
  expected: string;
  starter: string;
  hints: string[];
  xpReward: number;
  checks: C[];
}

export interface Recap {
  takeaways: string[];
  syntaxExamples: SyntaxExample[];
  commonMistakes: CommonMistake[];
  knowledgeChecks: QuizQuestion[];
}

/** A complete Lithic lesson, generic over its check type. `conceptId` is the curriculum key. */
export interface Lesson<C> {
  id: string;
  conceptId: string;
  planetId: string;
  conceptKey: string;      // the owning mini-planet id, e.g. 'lithic.html.stone'
  number: number;
  title: string;
  minutes: number;
  xp: number;
  objectives: string[];
  discover: { heading: string; lede: string; example: string; exampleNote?: string; tip?: string };
  experiment: { heading: string; lede: string; steps: string[]; tip?: string; starter: string };
  practice: Exercise<C>;
  challenge: Exercise<C>;
  quiz: QuizQuestion[];
  recap: Recap;
  missions: [Mission<C>, Mission<C>, Mission<C>];
}

/* ---- HTML (The Foundation) uses the DOM-based HtmlCheck ---- */
export type HtmlExercise = Exercise<HtmlCheck>;
export type HtmlMission = Mission<HtmlCheck>;
export type HtmlRecap = Recap;
export interface HtmlLesson extends Lesson<HtmlCheck> { planetId: 'foundation' }

/** Mission tier metadata, matching Botanica's. */
export const HTML_TIERS: { tier: MissionTier; name: string; label: string; xp: number }[] = [
  { tier: 'seed', name: 'The Seed', label: 'Easy', xp: 15 },
  { tier: 'sprout', name: 'The Sprout', label: 'Medium', xp: 30 },
  { tier: 'bloom', name: 'The Bloom', label: 'Challenging', xp: 50 },
];
export const TIERS = HTML_TIERS;
