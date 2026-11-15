// The Orbis Journal's view model, built from the same progress records Botanica writes. Nothing here is
// stored: Orbis reads the learner's single profile and summarises it, so the two can never disagree.

import { ACHIEVEMENTS } from '../content/achievements';
import { LESSONS } from '../content/curriculum';
import { nextStep } from '../apps/academy/nextLesson';
import { relativeTime } from '../apps/terminal/workspace';
import { levelOf, streak, totalXP, type Progression } from '../progression/engine';
import type { Progress } from '../progression/progress';
import { openWorlds, WORLDS } from './worlds';

export interface JournalVals {
  pilotName: string;
  xp: number;
  level: { n: number; name: string; frac: number; toNext: number };
  lessonsDone: number;
  lessonsTotal: number;
  missionsDone: number;
  streak: number;
  worldsOpen: number;
  worldsTotal: number;
  /** Where "Resume in Botanica" goes; lessonId is null once every lesson is done. */
  next: { title: string; where: string; lessonId: string | null; done: number; of: number; note: string };
  marks: { name: string; when: string }[];
}

export function buildJournal(p: Progress, g: Progression, now = Date.now()): JournalVals {
  const xp = totalXP(g), lv = levelOf(xp);
  const frac = Math.max(0, Math.min(1, (xp - lv.lo) / (lv.hi - lv.lo)));
  const lessonsDone = LESSONS.filter((l) => p.completed[l.conceptId]).length;
  // project missions on the Missions board, plus the optional Seed / Sprout / Bloom lesson missions
  const missionsDone = new Set(g.events.filter((e) => e.type === 'mission' || e.type === 'lmission').map((e) => `${e.type}:${e.ref}`)).size;

  const step = nextStep(p);
  let next: JournalVals['next'];
  if (step.kind === 'lesson') {
    const l = step.lesson, inRegion = LESSONS.filter((x) => x.regionId === l.regionId);
    const done = inRegion.filter((x) => p.completed[x.conceptId]).length;
    next = { title: l.title, where: `Botanica · ${l.regionName} · Lesson ${String(l.number).padStart(2, '0')}`, lessonId: l.id, done, of: inRegion.length,
      note: `${done} of ${inRegion.length} ${l.regionName} lessons complete` };
  } else if (step.kind === 'mission') {
    next = { title: step.title, where: `Botanica · ${step.regionName} · Project mission`, lessonId: null, done: lessonsDone, of: LESSONS.length,
      note: 'Every lesson before it is complete' };
  } else {
    next = { title: 'Every lesson grown', where: 'Botanica · all galaxies charted', lessonId: null, done: lessonsDone, of: LESSONS.length,
      note: `${lessonsDone} of ${LESSONS.length} lessons complete` };
  }

  const marks = g.events.filter((e) => e.type === 'achievement')
    .sort((a, b) => b.at.localeCompare(a.at)).slice(0, 3)
    .map((e) => ({ name: ACHIEVEMENTS.find((a) => a.id === e.ref)?.name ?? e.ref ?? 'Achievement', when: `Botanica · ${relativeTime(e.at, now)}` }));

  return {
    pilotName: g.pilotName, xp,
    level: { n: lv.n, name: lv.name, frac, toNext: lv.hi - xp },
    lessonsDone, lessonsTotal: LESSONS.length, missionsDone, streak: streak(g, new Date(now)),
    worldsOpen: openWorlds().length, worldsTotal: WORLDS.length, next, marks,
  };
}
