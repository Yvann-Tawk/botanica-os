// Learning progress and the unlock rules derived from it. Pure functions; the store lives in App.
// Only the Academy (Milestone 4) writes completions. Nothing here awards progress by itself.

import { CONCEPTS_PER_REGION, REGIONS, prerequisites, regionOf } from '../content/curriculum';

export interface Progress {
  v: 1;
  /** conceptId → ISO timestamp of first completion. */
  completed: Record<string, string>;
}

export const EMPTY_PROGRESS: Progress = { v: 1, completed: {} };

export function normalizeProgress(raw: unknown): Progress {
  const r = raw as Partial<Progress> | null;
  const completed: Record<string, string> = {};
  if (r && typeof r === 'object' && r.completed && typeof r.completed === 'object') {
    for (const [k, v] of Object.entries(r.completed)) if (regionOf(k) && typeof v === 'string') completed[k] = v;
  }
  return { v: 1, completed };
}

export const isDone = (p: Progress, conceptId: string) => conceptId in p.completed;

/** Completing is idempotent: the first timestamp is kept. */
export function complete(p: Progress, conceptId: string, at = new Date().toISOString()): Progress {
  if (isDone(p, conceptId) || !regionOf(conceptId)) return p;
  return { ...p, completed: { ...p.completed, [conceptId]: at } };
}

export interface RegionStatus {
  /** Concepts completed. */
  done: number;
  open: boolean;      // reachable: the previous region is complete
  mastered: boolean;  // all six complete
  charted: boolean;   // not open yet, but the route is drawn (prototype rule)
  sealed: boolean;
}

/** The prototype's gating, driven by real completions instead of preset numbers. */
export function regionStatus(p: Progress): RegionStatus[] {
  const m = REGIONS.map((r) => r.concepts.filter((c) => isDone(p, c.id)).length);
  return REGIONS.map((_, i) => {
    const open = i === 0 || m[i - 1] >= CONCEPTS_PER_REGION;
    const mastered = m[i] >= CONCEPTS_PER_REGION;
    const charted = !open && m[i - 1] >= 2 && (i === 1 || m[i - 2] >= CONCEPTS_PER_REGION);
    return { done: m[i], open, mastered, charted, sealed: !open && !charted };
  });
}

/** A concept can be started when its region is open and its prerequisites are complete. */
export function isAvailable(p: Progress, conceptId: string): boolean {
  const r = regionOf(conceptId); if (!r) return false;
  const st = regionStatus(p)[REGIONS.indexOf(r)];
  return st.open && prerequisites(conceptId).every((id) => isDone(p, id));
}

/** "You are here": the first open, unfinished region, and its first available unfinished concept. */
export function currentPosition(p: Progress): { region: number; concept: number } | null {
  const st = regionStatus(p);
  const ri = st.findIndex((s) => s.open && !s.mastered);
  if (ri < 0) return null;
  const ci = REGIONS[ri].concepts.findIndex((c) => !isDone(p, c.id) && isAvailable(p, c.id));
  return ci < 0 ? null : { region: ri, concept: ci };
}

/** Dev-only presets that reproduce the prototype's three journeys (`?demo=new|current|seasoned`).
 *  Never persisted. */
export function demoProgress(kind: string): Progress | null {
  const counts: Record<string, number[]> = {
    new: [0, 0, 0, 0, 0, 0, 0, 0],
    current: [2, 0, 0, 0, 0, 0, 0, 0],
    seasoned: [6, 6, 6, 6, 4, 0, 0, 0],
  };
  const m = counts[kind]; if (!m) return null;
  let p = EMPTY_PROGRESS;
  REGIONS.forEach((r, i) => r.concepts.slice(0, m[i]).forEach((c) => { p = complete(p, c.id, '2026-01-01T00:00:00.000Z'); }));
  return p;
}
