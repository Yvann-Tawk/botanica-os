// The Lithic learning store. Lithic owns its own progress + event log in separate kv keys
// (`lithic-progress`, `lithic-progression`) so Botanica's data is never read or written here — no clobbering,
// no duplicated awards. The global XP shown in the shell is the sum of Botanica's and Lithic's (both logs feed
// the same engine). Concept completion persists so the Survey's lock/current/done states are real.

import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeProgression, record, totalXP, XP, EMPTY_PROGRESSION, type Progression } from '../progression/engine';
import { complete, isDone, normalizeProgress, EMPTY_PROGRESS, type Progress } from '../progression/progress';
import type { KV } from '../storage/db';
import type { HtmlLesson, HtmlMission } from './content/types';
import type { AcademyAwards } from './academy/LithicAcademy';

export interface LithicLearning {
  progress: Progress;
  progression: Progression;
  xp: number;
  ready: boolean;
  awards: AcademyAwards;
}

export function useLithicLearning(kv: KV): LithicLearning {
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [progression, setProgression] = useState<Progression>(EMPTY_PROGRESSION);
  const [ready, setReady] = useState(false);
  const pRef = useRef(progress), gRef = useRef(progression);
  pRef.current = progress; gRef.current = progression;

  useEffect(() => {
    let alive = true;
    Promise.all([kv.get('lithic-progress').catch(() => undefined), kv.get('lithic-progression').catch(() => undefined)])
      .then(([rp, rg]) => { if (!alive) return; setProgress(normalizeProgress(rp)); setProgression(normalizeProgression(rg)); setReady(true); });
    return () => { alive = false; };
  }, [kv]);

  const saveG = useCallback((g: Progression) => { kv.set('lithic-progression', g).catch(() => {}); }, [kv]);
  const saveP = useCallback((p: Progress) => { kv.set('lithic-progress', p).catch(() => {}); }, [kv]);

  /** Apply events to the log, paying each award key at most once. */
  const apply = useCallback((events: Parameters<typeof record>[1][]) => {
    let g = gRef.current;
    for (const e of events) g = record(g, e).p;
    gRef.current = g; setProgression(g); saveG(g);
  }, [saveG]);

  const completeConcept = useCallback((conceptId: string) => {
    const next = complete(pRef.current, conceptId);
    if (next !== pRef.current) { pRef.current = next; setProgress(next); saveP(next); }
  }, [saveP]);

  const awards: AcademyAwards = {
    run: () => {
      // log one activity event per day, for streaks, without flooding
      const today = new Date().toDateString();
      if (!gRef.current.events.some((e) => e.type === 'run' && new Date(e.at).toDateString() === today)) apply([{ type: 'run', award: 'li-first-run', xp: XP.firstRun }]);
    },
    exercise: (l, which, ok, hints) => {
      const ref = `li:${l.id}:${which}`;
      if (!ok) { apply([{ type: 'check-fail', ref }]); return; }
      apply([{ type: 'exercise', ref, award: `li-ex:${l.id}:${which}`, xp: XP[which], meta: { hints } }]);
    },
    quiz: (l, ok) => { if (ok) apply([{ type: 'quiz', ref: l.id, award: `li-quiz:${l.id}`, xp: XP.quiz }]); },
    lessonDone: (l) => {
      completeConcept(l.conceptId);
      apply([{ type: 'lesson', ref: l.id, award: `li-lesson:${l.id}`, xp: l.xp }]);
    },
    mission: (m: HtmlMission, ok, hints) => {
      const ref = `li-lm:${m.id}`;
      if (!ok) { apply([{ type: 'check-fail', ref }]); return false; }
      const first = !gRef.current.events.some((e) => e.type === 'lmission' && e.ref === m.id);
      if (first) apply([{ type: 'lmission', ref: m.id, award: `li-lm:${m.id}`, xp: m.xpReward, meta: { hints } }]);
      return first;
    },
  };

  return { progress, progression, xp: totalXP(progression), ready, awards };
}

export const lithicLessonDone = (p: Progress, lesson: HtmlLesson) => isDone(p, lesson.conceptId);
