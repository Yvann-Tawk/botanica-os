// The app's learning store: concept completion + the event log, the rules that award XP and achievements,
// and the moments worth telling the learner about. Apps report what happened; this decides what it's worth.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ACHIEVEMENTS, type Achievement } from '../content/achievements';
import { LESSONS, REGIONS } from '../content/curriculum';
type Lesson = { id: string; conceptId: string; xp: number };
import { MISSIONS, type Mission } from '../content/missions';
import { normalizeLessonState } from '../apps/academy/lessonState';
import type { KV } from '../storage/db';
import { levelOf, newAchievements, record, totalXP, XP, type LearnEvent, type Progression } from './engine';
import { complete, regionStatus, type Progress } from './progress';

export interface Notify {
  xp(n: number): void;
  toast(text: string, sub?: string): void;
  say(text: string, mood?: 'happy' | 'celebrating' | 'confused'): void;
  levelUp(level: number, name: string): void;
  conceptCompleted(conceptId: string, progress: Progress): void;
}

const today = () => new Date().toDateString();

export function useLearning(o: { kv: KV; demo: boolean; initialProgress: Progress; initialProgression: Progression; notify: Notify }) {
  const [progress, setProgress] = useState(o.initialProgress);
  const [progression, setProgression] = useState(o.initialProgression);
  // refs hold the latest values so several reports in one tick compose correctly
  const pRef = useRef(progress), gRef = useRef(progression), notify = useRef(o.notify);
  pRef.current = progress; gRef.current = progression; notify.current = o.notify;

  const save = useCallback((key: string, value: unknown) => {
    if (!o.demo) o.kv.set(key, value).catch(() => notify.current.toast('Progress could not be saved on this device'));
  }, [o.kv, o.demo]);

  const missionsDone = useCallback((g: Progression) => {
    const ids = new Set(g.events.filter((e) => e.type === 'mission').map((e) => e.ref));
    return MISSIONS.filter((m) => ids.has(m.id)).map((m) => ({ id: m.id, type: m.type }));
  }, []);

  /** Apply a batch of events, then settle achievements, region bonuses and level-ups. */
  const apply = useCallback((events: (Omit<LearnEvent, 'at' | 'xp'> & { xp?: number })[], learning = pRef.current) => {
    const before = levelOf(totalXP(gRef.current)).n;
    let g = gRef.current, gained = 0;
    for (const e of events) { const r = record(g, e); g = r.p; gained += r.gained; }
    // region bonus once each region is fully grown
    regionStatus(learning).forEach((s, i) => {
      if (s.mastered) { const r = record(g, { type: 'region', ref: REGIONS[i].id, award: `region:${REGIONS[i].id}`, xp: XP.regionBonus }); if (r.gained) { g = r.p; gained += r.gained; } }
    });
    const fresh: Achievement[] = newAchievements({ progress: g, learning, missionsDone: missionsDone(g) });
    for (const a of fresh) g = record(g, { type: 'achievement', ref: a.id }).p;
    gRef.current = g;
    setProgression(g);
    save('progression', g);
    if (gained) notify.current.xp(gained);
    for (const a of fresh) notify.current.toast(`Patch earned: ${a.name}`, a.desc);
    const after = levelOf(totalXP(g));
    if (after.n > before) notify.current.levelUp(after.n, after.name);
  }, [missionsDone, save]);

  const completeConcept = useCallback((conceptId: string) => {
    const next = complete(pRef.current, conceptId);
    if (next === pRef.current) return null;
    pRef.current = next;
    setProgress(next);
    save('progress', next);
    notify.current.conceptCompleted(conceptId, next);
    return next;
  }, [save]);

  /* ---- reports from the apps ---- */

  /** Any program run. Logged once per day: enough for First Light and streaks without flooding the log. */
  const ran = useCallback(() => {
    if (gRef.current.events.some((e) => e.type === 'run' && new Date(e.at).toDateString() === today())) return;
    apply([{ type: 'run', award: 'first-run', xp: XP.firstRun }]);
  }, [apply]);

  /** A Practice/Challenge or mission check finished. */
  const checked = useCallback((ref: string, ok: boolean, award: { key: string; xp: number } | null, hints = 0) => {
    const failedBefore = gRef.current.events.some((e) => e.type === 'check-fail' && e.ref === ref);
    if (!ok) { apply([{ type: 'check-fail', ref }]); return; }
    const evs: (Omit<LearnEvent, 'at' | 'xp'> & { xp?: number })[] = [];
    if (failedBefore && !gRef.current.events.some((e) => e.type === 'fixed' && e.ref === ref)) evs.push({ type: 'fixed', ref });
    if (award) evs.push({ type: ref.includes(':') && !ref.startsWith('mission:') ? 'exercise' : 'milestone', ref, award: award.key, xp: award.xp, meta: { hints } });
    if (evs.length) apply(evs);
  }, [apply]);

  const exercise = useCallback((lesson: Lesson, which: 'practice' | 'challenge', ok: boolean, hints: number) =>
    checked(`${lesson.id}:${which}`, ok, { key: `ex:${lesson.id}:${which}`, xp: XP[which] }, hints), [checked]);

  const quiz = useCallback((lesson: Lesson, ok: boolean, firstTry: boolean) => {
    if (ok) apply([{ type: 'quiz', ref: lesson.id, award: `quiz:${lesson.id}`, xp: XP.quiz, meta: { firstTry } }]);
  }, [apply]);

  const lessonDone = useCallback((lesson: Lesson) => {
    const next = completeConcept(lesson.conceptId) ?? pRef.current;
    apply([{ type: 'lesson', ref: lesson.id, award: `lesson:${lesson.id}`, xp: lesson.xp }], next);
  }, [apply, completeConcept]);

  const milestone = useCallback((m: Mission, index: number, ok: boolean) =>
    checked(`mission:${m.id}:${index}`, ok, ok ? { key: `ms:${m.id}:${index}`, xp: 50 } : null), [checked]);

  const missionDone = useCallback((m: Mission) => {
    if (gRef.current.events.some((e) => e.type === 'mission' && e.ref === m.id)) return;
    const next = m.completesConcept ? completeConcept(m.completesConcept) ?? pRef.current : pRef.current;
    apply([{ type: 'mission', ref: m.id, award: `mission:${m.id}`, xp: m.xp }], next);
  }, [apply, completeConcept]);

  const setPilotName = useCallback((name: string) => {
    const g = { ...gRef.current, pilotName: name.trim().slice(0, 40) };
    gRef.current = g; setProgression(g); save('progression', g);
  }, [save]);

  /** Replace everything (backup restore). */
  const replace = useCallback((p: Progress, g: Progression) => { pRef.current = p; gRef.current = g; setProgress(p); setProgression(g); }, []);

  // On load: lessons completed before the event log existed (Milestone 4 data) get their evidence and XP from
  // the saved lesson records, once. Then settle any achievements that are due (e.g. after a restored backup).
  useEffect(() => {
    let alive = true;
    (async () => {
      const missing = o.demo ? [] : LESSONS.filter((l) => pRef.current.completed[l.conceptId] && !gRef.current.events.some((e) => e.type === 'lesson' && e.ref === l.id));
      const evs: (Omit<LearnEvent, 'at' | 'xp'> & { xp?: number })[] = [];
      for (const l of missing) {
        const st = normalizeLessonState(await o.kv.get(`lesson:${l.id}`).catch(() => undefined));
        evs.push({ type: 'exercise', ref: `${l.id}:practice`, award: `ex:${l.id}:practice`, xp: XP.practice, meta: { hints: st.hints.practice } });
        evs.push({ type: 'exercise', ref: `${l.id}:challenge`, award: `ex:${l.id}:challenge`, xp: XP.challenge, meta: { hints: st.hints.challenge } });
        evs.push({ type: 'quiz', ref: l.id, award: `quiz:${l.id}`, xp: XP.quiz, meta: { firstTry: st.attempts.master <= 1 } });
        evs.push({ type: 'lesson', ref: l.id, award: `lesson:${l.id}`, xp: l.xp });
      }
      if (!alive) return;
      if (evs.length || newAchievements({ progress: gRef.current, learning: pRef.current, missionsDone: missionsDone(gRef.current) }).length) apply(evs);
    })();
    return () => { alive = false; };
  }, []); // run once

  const xp = useMemo(() => totalXP(progression), [progression]);
  const done = useMemo(() => missionsDone(progression), [progression, missionsDone]);
  return { progress, progression, xp, level: levelOf(xp), missionsDone: done, achievements: ACHIEVEMENTS,
    ran, exercise, quiz, lessonDone, milestone, missionDone, setPilotName, replace };
}

export type Learning = ReturnType<typeof useLearning>;
