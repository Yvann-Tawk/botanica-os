import { describe, it, expect } from 'vitest';
import { HTML_LESSONS } from '../src/lithic/content';
import { ALL_LITHIC_LESSONS, lithicConceptById } from '../src/lithic/curriculum';
import { HTML_TIERS } from '../src/lithic/content/types';
import { runHtmlChecks } from '../src/lithic/runtime/htmlChecks';

describe('Lithic HTML content integrity', () => {
  it('every authored lesson matches a curriculum lesson node', () => {
    const byId = new Map(ALL_LITHIC_LESSONS.map((l) => [l.id, l]));
    for (const lesson of HTML_LESSONS) {
      const node = byId.get(lesson.id);
      expect(node, `lesson ${lesson.id} must exist in curriculum`).toBeTruthy();
      expect(lesson.conceptId).toBe(node!.conceptId);
      expect(lithicConceptById(lesson.conceptKey), `concept ${lesson.conceptKey}`).toBeTruthy();
    }
  });

  it('lesson ids are unique', () => {
    const ids = HTML_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each lesson has exactly three missions: Seed / Sprout / Bloom at 15 / 30 / 50 XP', () => {
    for (const lesson of HTML_LESSONS) {
      expect(lesson.missions).toHaveLength(3);
      lesson.missions.forEach((m, i) => {
        expect(m.tier).toBe(HTML_TIERS[i].tier);
        expect(m.xpReward).toBe(HTML_TIERS[i].xp);
        expect(m.lessonId).toBe(lesson.id);
        expect(m.checks.length, `${m.id} needs checks`).toBeGreaterThan(0);
        expect(m.hints.length).toBeGreaterThan(0);
      });
    }
  });

  it('mission ids are globally unique', () => {
    const ids = HTML_LESSONS.flatMap((l) => l.missions.map((m) => m.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('exercises and quizzes are well-formed', () => {
    for (const lesson of HTML_LESSONS) {
      for (const ex of [lesson.practice, lesson.challenge]) {
        expect(ex.checks.length, `${lesson.id} exercise needs checks`).toBeGreaterThan(0);
        expect(ex.hints.length).toBeGreaterThan(0);
        expect(typeof ex.starter).toBe('string');
      }
      expect(lesson.quiz.length).toBeGreaterThanOrEqual(2);
      for (const q of lesson.quiz) {
        expect(q.opts.length).toBeGreaterThanOrEqual(2);
        expect(q.a).toBeGreaterThanOrEqual(0);
        expect(q.a).toBeLessThan(q.opts.length);
      }
      expect(lesson.recap.takeaways.length).toBeGreaterThan(0);
      expect(lesson.objectives.length).toBeGreaterThan(0);
    }
  });

  it('every authored check uses a valid selector (none fail to run)', () => {
    const sample = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title></head><body><h1>x</h1></body></html>';
    for (const lesson of HTML_LESSONS) {
      const checkSets = [lesson.practice.checks, lesson.challenge.checks, ...lesson.missions.map((m) => m.checks)];
      for (const checks of checkSets) {
        for (const r of runHtmlChecks(sample, checks)) {
          expect(r.detail ?? '', `invalid selector in ${lesson.id}: ${r.label}`).not.toContain('Check could not run');
        }
      }
    }
  });
});
