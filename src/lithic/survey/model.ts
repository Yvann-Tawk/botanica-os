// The Lithic Survey view-model: pure functions that turn the curriculum + progress + camera/tier state into
// render values for SurveyView. The pan/zoom camera is the same engine as Botanica's Universe (zoomAt/clamp,
// reused), re-fitted to Lithic's three dig-sites. The three expansion tiers (planet → mini-planet nodes →
// lesson nodes) are Lithic's own, driven by `sel` (planet id) and `conc` (concept index).

import { clamp } from '../../shell/windowReducer';
import { type Camera, MIN_ZOOM, MAX_ZOOM, zoomAt } from '../../apps/universe/model';
import type { Progress } from '../../progression/progress';
import { isDone } from '../../progression/progress';
import { PLANETS, type LithicConcept, type LithicPlanet } from '../curriculum';

export { zoomAt, MIN_ZOOM, MAX_ZOOM };
export type { Camera };

/** Expansion geometry (DESIGN_TOKENS §B): concept ring, lesson ring, and node sizes. */
export const CONCEPT_RING = (R: number) => R * 0.62 + 104;
export const LESSON_RING = 162;
export const NODE = { concept: 96, hub: 110, lesson: 62 } as const;
const PANEL_ROOM = 360;

/** Centroid of the three planets, used to frame the whole Survey. */
const CX = Math.round(PLANETS.reduce((a, p) => a + p.x, 0) / PLANETS.length);
const CY = Math.round(PLANETS.reduce((a, p) => a + p.y, 0) / PLANETS.length);

export const INITIAL_CAMERA: Camera = { ux: -120, uy: -140, us: 0.46 };

/** Fit all three dig-sites. */
export function fitSurvey(w: number, h: number): Camera {
  const s = clamp(Math.min(w / 1500, h / 1100), MIN_ZOOM, 0.82);
  return { us: s, ux: w / 2 - CX * s, uy: h / 2 - CY * s };
}
/** Centre a planet, leaving room for the specimen sheet on wide views. */
export function focusPlanet(c: Camera, planet: LithicPlanet, w: number, h: number): Camera {
  const s = Math.max(c.us, 0.68);
  const cx = (w - (w > 760 ? PANEL_ROOM : 0)) / 2;
  return { us: s, ux: cx - planet.x * s, uy: h / 2 - planet.y * s };
}
/** Zoom in a little further on a selected mini-planet so its lessons have room. */
export function focusConcept(c: Camera, x: number, y: number, w: number, h: number): Camera {
  const s = Math.max(c.us, 0.92);
  const cx = (w - (w > 760 ? PANEL_ROOM : 0)) / 2;
  return { us: s, ux: cx - x * s, uy: h / 2 - y * s };
}

export interface ViewState extends Camera {
  hov: string | null;
  /** Selected planet id (tier 1+). */
  sel: string | null;
  /** Selected concept index within the planet (tier 2), or null. */
  conc: number | null;
  panning: boolean;
  glide: boolean;
}

/* ---- gating derived from real progress ---- */

/** A planet is reachable when it is open (sealed ones never unlock here). */
const planetOpen = (p: LithicPlanet) => p.status === 'open';

/** A concept's lessons are all complete. */
function conceptDone(p: Progress, c: LithicConcept): boolean {
  return c.lessons.every((l) => isDone(p, l.conceptId));
}
/** A concept is unlocked when it's the first in its planet, or the previous concept is complete. */
function conceptOpen(prog: Progress, planet: LithicPlanet, i: number): boolean {
  if (!planetOpen(planet)) return false;
  return i === 0 || conceptDone(prog, planet.concepts[i - 1]);
}
/** A lesson is available when every earlier lesson in its concept is complete. */
function lessonAvailable(prog: Progress, c: LithicConcept, i: number): boolean {
  return c.lessons.slice(0, i).every((l) => isDone(prog, l.conceptId));
}

export type LessonState = 'done' | 'current' | 'open' | 'locked';
function lessonState(prog: Progress, planet: LithicPlanet, ci: number, c: LithicConcept, li: number): LessonState {
  if (!conceptOpen(prog, planet, ci)) return 'locked';
  if (isDone(prog, c.lessons[li].conceptId)) return 'done';
  if (!lessonAvailable(prog, c, li)) return 'locked';
  // the first available, not-done lesson is the current one
  const firstOpen = c.lessons.findIndex((l, k) => lessonAvailable(prog, c, k) && !isDone(prog, l.conceptId));
  return li === firstOpen ? 'current' : 'open';
}

/** "You are here": the first open planet, its first open+unfinished concept and current lesson. */
export function currentSpot(prog: Progress): { planet: LithicPlanet; ci: number; li: number } | null {
  for (const planet of PLANETS) {
    if (!planetOpen(planet)) continue;
    for (let ci = 0; ci < planet.concepts.length; ci++) {
      if (!conceptOpen(prog, planet, ci)) continue;
      const c = planet.concepts[ci];
      const li = c.lessons.findIndex((l, k) => lessonAvailable(prog, c, k) && !isDone(prog, l.conceptId));
      if (li >= 0) return { planet, ci, li };
    }
  }
  return null;
}

/* ---- render values ---- */

export interface NodeVals {
  key: string; cx: number; cy: number; size: number;
  name: string; state: LessonState | 'open' | 'locked' | 'done';
  color: string; locked: boolean; onClick?: () => void;
  lx: number; ly: number;
}
export interface PlanetVals {
  id: string; left: number; top: number; size: number;
  n: string; name: string; discipline: string; blurb: string;
  grad: [string, string, string]; accent: string;
  dim: boolean; expanded: boolean; sealed: boolean; here: boolean;
  lx: number; ly: number; statusText: string;
  onClick: () => void; onEnter: () => void; onLeave: () => void; aria: string;
}
export interface SpecimenRow { key: string; name: string; sub: string; state: LessonState | 'open' | 'locked' | 'done'; onOpen?: () => void; aria: string }
export interface SpecimenVals {
  n: string; name: string; discipline: string; sub: string; blurb: string; statusText: string;
  tier: 'concepts' | 'lessons'; backLabel?: string; onBack?: () => void;
  rows: SpecimenRow[]; locked: boolean; lockNote?: string;
  cta?: string; onCta?: () => void;
}
export interface SurveyVals {
  uvCls: string; planeCls: string; ux: number; uy: number; us: number;
  planets: PlanetVals[]; nodes: NodeVals[]; hubless: boolean;
  hasHere: boolean; hereX: number; hereY: number; hereLabel: string;
  zoomPct: string; zoomRight: number; summary: string;
  hover: PlanetVals | null;
  panel: SpecimenVals | null;
}

export interface Callbacks {
  selectPlanet: (id: string) => void;
  deselect: () => void;
  selectConcept: (i: number) => void;
  backToConcepts: () => void;
  hover: (id: string | null) => void;
  openLesson: (lessonId: string) => void;
  returnToOrbis: () => void;
}

const STATE_COLOR: Record<string, string> = { done: '#e2a93b', current: '#e58a80', open: '#cfd2c2', locked: '#6f6450' };

export function buildSurvey(prog: Progress, v: ViewState, size: { w: number; h: number }, cb: Callbacks): SurveyVals {
  const here = currentSpot(prog);
  const selPlanet = v.sel ? PLANETS.find((p) => p.id === v.sel) ?? null : null;

  const planets: PlanetVals[] = PLANETS.map((p) => {
    const expanded = v.sel === p.id;
    const dim = !!v.sel && v.sel !== p.id;
    const isHere = here?.planet.id === p.id && !v.sel;
    return {
      id: p.id, left: p.x - p.R, top: p.y - p.R, size: p.R * 2,
      n: p.n, name: p.name, discipline: p.discipline, blurb: p.blurb,
      grad: p.grad, accent: p.accent, dim, expanded, sealed: p.status === 'sealed', here: isHere,
      lx: p.x - 160, ly: p.y + p.R + 10,
      statusText: p.status === 'open' ? (isHere ? 'You are here' : 'Open') : 'Sealed',
      onClick: () => (p.status === 'open' ? cb.selectPlanet(p.id) : cb.selectPlanet(p.id)),
      onEnter: () => cb.hover(p.id), onLeave: () => cb.hover(null),
      aria: `${p.name}, ${p.discipline}${p.status === 'sealed' ? ', sealed' : ''}`,
    };
  });

  // expansion nodes
  const nodes: NodeVals[] = [];
  if (selPlanet) {
    const open = planetOpen(selPlanet);
    if (v.conc == null) {
      const N = selPlanet.concepts.length, R = CONCEPT_RING(selPlanet.R);
      selPlanet.concepts.forEach((c, i) => {
        const ang = (-90 + (360 / N) * i) * (Math.PI / 180);
        const cx = selPlanet.x + R * Math.cos(ang), cy = selPlanet.y + R * Math.sin(ang);
        const unlocked = conceptOpen(prog, selPlanet, i);
        const done = conceptDone(prog, c);
        const state = !open || !unlocked ? 'locked' : done ? 'done' : 'open';
        nodes.push({ key: c.id, cx, cy, size: NODE.concept, name: c.name, state,
          color: STATE_COLOR[state] ?? selPlanet.accent, locked: state === 'locked',
          onClick: state === 'locked' ? undefined : () => cb.selectConcept(i),
          lx: cx, ly: cy + NODE.concept / 2 + 8 });
      });
    } else {
      const c = selPlanet.concepts[v.conc], N = selPlanet.concepts.length, R = CONCEPT_RING(selPlanet.R);
      const ang = (-90 + (360 / N) * v.conc) * (Math.PI / 180);
      const hx = selPlanet.x + R * Math.cos(ang), hy = selPlanet.y + R * Math.sin(ang);
      // hub (the promoted mini-planet)
      nodes.push({ key: `${c.id}:hub`, cx: hx, cy: hy, size: NODE.hub, name: c.name, state: 'open',
        color: selPlanet.accent, locked: false, lx: hx, ly: hy - NODE.hub / 2 - 16 });
      const M = c.lessons.length;
      c.lessons.forEach((l, li) => {
        const la = (-90 + (360 / M) * li) * (Math.PI / 180);
        const lx = hx + LESSON_RING * Math.cos(la), ly = hy + LESSON_RING * Math.sin(la);
        const st = lessonState(prog, selPlanet, v.conc!, c, li);
        nodes.push({ key: l.id, cx: lx, cy: ly, size: NODE.lesson, name: `L${String(l.number).padStart(2, '0')}`,
          state: st, color: STATE_COLOR[st], locked: st === 'locked',
          onClick: st === 'locked' ? undefined : () => cb.openLesson(l.id),
          lx, ly: ly + NODE.lesson / 2 + 7 });
      });
    }
  }

  const hover = v.hov && !v.sel ? planets.find((p) => p.id === v.hov) ?? null : null;

  const openCount = PLANETS.filter(planetOpen).length;
  const summary = `${openCount} discipline open · ${PLANETS.length - openCount} sealed`;

  return {
    uvCls: v.panning ? 'is-panning' : '', planeCls: v.glide ? 'glide' : '',
    ux: v.ux, uy: v.uy, us: v.us,
    planets, nodes, hubless: v.conc == null,
    hasHere: !!here && !v.sel, hereX: here ? here.planet.x - 150 : 0, hereY: here ? here.planet.y - here.planet.R - 92 : 0,
    hereLabel: here ? here.planet.concepts[here.ci].name : '',
    zoomPct: `${Math.round(v.us * 100)}%`, zoomRight: v.sel && size.w > 760 ? PANEL_ROOM + 16 : 16,
    summary, hover,
    panel: selPlanet ? buildPanel(prog, selPlanet, v, cb) : null,
  };
}

function buildPanel(prog: Progress, p: LithicPlanet, v: ViewState, cb: Callbacks): SpecimenVals {
  const sealed = p.status === 'sealed';
  if (v.conc != null) {
    const c = p.concepts[v.conc];
    return {
      n: p.n, name: c.name, discipline: p.discipline, sub: c.sub, blurb: c.blurb,
      statusText: `${c.lessons.filter((l) => isDone(prog, l.conceptId)).length} / ${c.lessons.length} lessons`,
      tier: 'lessons', backLabel: `← ${p.name}`, onBack: cb.backToConcepts,
      rows: c.lessons.map((l, li) => {
        const st = lessonState(prog, p, v.conc!, c, li);
        return { key: l.id, name: l.title, sub: `Lesson ${String(l.number).padStart(2, '0')} · ${l.minutes} min`, state: st,
          onOpen: st === 'locked' ? undefined : () => cb.openLesson(l.id),
          aria: `${l.title}, ${st}` } as SpecimenRow;
      }),
      locked: false,
      cta: lessonCta(prog, p, c), onCta: () => openFirstPlayable(prog, c, cb),
    };
  }
  return {
    n: p.n, name: p.name, discipline: p.discipline, sub: `System 02 · ${p.discipline}`, blurb: p.blurb,
    statusText: sealed ? 'Sealed discipline' : 'Open',
    tier: 'concepts',
    rows: p.concepts.map((c, i) => {
      const unlocked = conceptOpen(prog, p, i), done = conceptDone(prog, c);
      const st = sealed || !unlocked ? 'locked' : done ? 'done' : 'open';
      const d = c.lessons.filter((l) => isDone(prog, l.conceptId)).length;
      return { key: c.id, name: c.name, sub: `${c.sub} · ${d}/${c.lessons.length}`, state: st as SpecimenRow['state'],
        onOpen: st === 'locked' ? undefined : () => cb.selectConcept(i), aria: `${c.name}, ${st}` };
    }),
    locked: sealed,
    lockNote: sealed ? `${p.discipline} is sealed. Its modules unseal once the discipline's lessons and language workspace are ready — the HTML world (The Foundation) is open now.` : undefined,
  };
}

function lessonCta(prog: Progress, p: LithicPlanet, c: LithicConcept): string | undefined {
  if (p.status !== 'open') return undefined;
  const anyDone = c.lessons.some((l) => isDone(prog, l.conceptId));
  return anyDone ? 'Continue this module' : 'Lay the first stone';
}
function openFirstPlayable(prog: Progress, c: LithicConcept, cb: Callbacks) {
  const next = c.lessons.find((l, k) => lessonAvailable(prog, c, k) && !isDone(prog, l.conceptId)) ?? c.lessons[0];
  cb.openLesson(next.id);
}
