import { LESSONS, REGIONS, lessonMetaForConcept, type LessonMeta } from '../../content/curriculum';
import { currentPosition, type Progress } from '../../progression/progress';

/** Where the learner is headed next: a lesson, a project mission, or nothing left on the chart. */
export type NextStep =
  | { kind: 'lesson'; lesson: LessonMeta }
  | { kind: 'mission'; missionId: string; title: string; regionName: string }
  | { kind: 'done' };

export function nextStep(p: Progress): NextStep {
  const here = currentPosition(p);
  if (!here) return { kind: 'done' };
  const r = REGIONS[here.region], c = r.concepts[here.concept];
  if (c.lessonId) return { kind: 'lesson', lesson: lessonMetaForConcept(c.id)! };
  return { kind: 'mission', missionId: c.missionId!, title: c.name.replace(/^Project: /, ''), regionName: r.name };
}

/** The lesson to open when the Academy is opened without a route. */
export function defaultLesson(p: Progress): LessonMeta {
  const s = nextStep(p);
  if (s.kind === 'lesson') return s.lesson;
  return LESSONS.find((l) => !p.completed[l.conceptId]) ?? LESSONS[LESSONS.length - 1];
}
