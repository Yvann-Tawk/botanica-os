// Universe view-model: a port of the prototype's renderVals() universe section, driven by real progress.

import { rng } from '../../art/decoration';
import { CONCEPTS_PER_REGION, REGIONS } from '../../content/curriculum';
import { clamp } from '../../shell/windowReducer';
import { currentPosition, isAvailable, isDone, regionStatus, type Progress } from '../../progression/progress';

/* ---- static decoration, computed once with the prototype's seeds ---- */
const R1 = rng(7), R2 = rng(42);
export const FAR_STARS = Array.from({ length: 150 }, () => ({ x: Math.round(R1() * 3200), y: Math.round(R1() * 2200), r: (0.6 + R1() * 1.3).toFixed(2), o: (0.25 + R1() * 0.5).toFixed(2), c: R1() > 0.85 ? '#f0c06a' : '#ece6d6', cls: R1() > 0.8 ? 'twk' : '' }));
export const NEAR_STARS = Array.from({ length: 120 }, () => ({ x: Math.round(R2() * 2600), y: Math.round(R2() * 1700), r: (1 + R2() * 2.2).toFixed(2), o: (0.3 + R2() * 0.6).toFixed(2), c: R2() > 0.8 ? '#f0c06a' : (R2() > 0.7 ? '#cfe0d0' : '#ece6d6'), cls: R2() > 0.75 ? 'twk2' : '' }));
const SEED_PTS = [[150, 820], [215, 752], [300, 738], [262, 862], [182, 932], [118, 880]];
const SPROUT_ANG = [-90, -122, -58, -150, -30, -172];
const DORM = '#363d30';

function hexRgb(h: string) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
export function mix(a: string, b: string, t: number) {
  const A = hexRgb(a), B = hexRgb(b);
  return '#' + [0, 1, 2].map((i) => Math.round(A[i] + (B[i] - A[i]) * t).toString(16).padStart(2, '0')).join('');
}
const D = (b: boolean) => (b ? 'inline' : 'none');

/* ---- camera ---- */
export interface Camera { ux: number; uy: number; us: number }
export const MIN_ZOOM = 0.3, MAX_ZOOM = 1.5;
export const INITIAL_CAMERA: Camera = { ux: -100, uy: -180, us: 0.5 };
/** Panel width (340) + margins; the chart centres in the space left beside it. */
export const PANEL_ROOM = 360;

/** Zoom by factor f around a point (px, py) in view coordinates, keeping that point fixed. */
export function zoomAt(c: Camera, f: number, px: number, py: number): Camera {
  const ns = clamp(c.us * f, MIN_ZOOM, MAX_ZOOM);
  return { us: ns, ux: px - (px - c.ux) * (ns / c.us), uy: py - (py - c.uy) * (ns / c.us) };
}
/** Fit the whole chart. */
export function fitCamera(w: number, h: number): Camera {
  const s = clamp(Math.min(w / 2120, h / 1180), MIN_ZOOM, 0.9);
  return { us: s, ux: w / 2 - 1310 * s, uy: h / 2 - 880 * s };
}
/** Centre a region, leaving room for the specimen sheet on wide views. */
export function focusCamera(c: Camera, regionId: string, w: number, h: number): Camera {
  const r = REGIONS.find((x) => x.id === regionId)!, s = Math.max(c.us, 0.72);
  const cx = (w - (w > 760 ? PANEL_ROOM : 0)) / 2;
  return { us: s, ux: cx - r.x * s, uy: h / 2 - r.y * s };
}

/* ---- view values ---- */
export interface ConceptRow {
  name: string; cls: string; dDone: string; dCur: string; dTodo: string; dLock: string; state: string; tc: string; sc: string;
  aria: string; onOpen?: () => void;
}
export interface PlanetVals {
  id: string; n: string; name: string; sub: string; left: number; top: number; size: number; lx: number; ly: number;
  gid: string; cid: string; body: string; light: string; dark: string; accent: string; glow: string; glowOp: number; featOp: number; orbitC: string;
  dSeed: string; dFlow: string; dArch: string; dEng: string; dMach: string; dNet: string; dFront: string; dExp: string;
  sprouts: { tf: string }[]; canopy: { x: string; y: string; r: number; f: string }[]; dBloom: string;
  moons: { x: string; y: string; r: number; f: string; s: string }[]; moonCls: string; dHere: string; dSeal: string;
  subC: string; nameC: string; stC: string; statusText: string; aria: string;
  onClick: () => void; onEnter: () => void; onLeave: () => void;
}
export interface UniverseVals {
  uvCls: string; planeCls: string; ux: string; uy: string; us: string; farX: string; farY: string;
  farStars: typeof FAR_STARS; nearStars: typeof NEAR_STARS;
  seedStars: { tf: string; c: string; o: number }[]; seedLines: { x1: number; y1: number; x2: number; y2: number; c: string; w: number; dash: string }[];
  seedLabel: string; seedLabelC: string;
  routes: { d: string; c: string; w: number; dash: string; o: number; cls: string }[];
  planets: PlanetVals[];
  hasHere: boolean; hereX: number; hereY: number; hereConcept: string;
  uvSummary: string;
  showPrev: boolean; prev: { x: number; y: number; n: string; sub: string; name: string; blurb: string; dots: { c: string }[]; next: string; subC: string };
  hasPanel: boolean;
  pan: { n: string; name: string; sub: string; blurb: string; body: string; light: string; statusText: string; locked: boolean; canLearn: boolean; cta: string; lockNote: string; concepts: ConceptRow[]; onLearn: () => void };
  zoomRight: number; zoomPct: string;
}

export interface ViewState extends Camera { hov: string | null; sel: string | null; panning: boolean; glide: boolean }
export interface Callbacks {
  select: (id: string) => void;
  hover: (id: string | null) => void;
  openLesson: (lessonId: string) => void;
  openMission: (missionId: string) => void;
}

export function buildUniverse(p: Progress, v: ViewState, size: { w: number; h: number }, cb: Callbacks): UniverseVals {
  const status = regionStatus(p);
  const here = currentPosition(p);
  const curRegion = here ? here.region : -1, curConcept = here ? here.concept : -1;
  const { us, ux, uy } = v;

  const planets: PlanetVals[] = REGIONS.map((r, i) => {
    const S = status[i], alive = S.done > 0 || S.mastered, t = S.mastered ? 0 : alive ? 0.12 : (S.sealed ? 0.66 : 0.5);
    const body = mix(r.c[0], DORM, t), light = mix(r.c[1], DORM, t), dark = mix(r.c[2], '#12180e', t * 0.6), accent = mix(r.c[3], DORM, t);
    const sprouts: { tf: string }[] = [];
    // sprouts mark completed concepts, in completion order around the rim
    const doneIdx = r.concepts.map((c, j) => (isDone(p, c.id) ? j : -1)).filter((j) => j >= 0);
    if (!S.mastered) doneIdx.forEach((_, k) => {
      const a = (SPROUT_ANG[k] * Math.PI) / 180;
      sprouts.push({ tf: 'translate(' + (Math.cos(a) * 57).toFixed(1) + ' ' + (Math.sin(a) * 57).toFixed(1) + ') rotate(' + (SPROUT_ANG[k] + 90) + ') scale(' + (1.25 - k * 0.04).toFixed(2) + ')' });
    });
    const canopy = [];
    if (S.mastered) for (let c = 0; c <= 9; c++) { const ca = ((-178 + c * 19.5) * Math.PI) / 180, cr = 9 + (c % 3) * 2.5; canopy.push({ x: (Math.cos(ca) * 58).toFixed(1), y: (Math.sin(ca) * 58).toFixed(1), r: cr, f: c % 2 ? '#8fb356' : '#b4cfb6' }); }
    const moons = r.concepts.map((cn, j) => {
      const a = ((-60 + j * 60) * Math.PI) / 180, done = isDone(p, cn.id), cur = i === curRegion && j === curConcept;
      return { x: (Math.cos(a) * 86).toFixed(1), y: (Math.sin(a) * 86).toFixed(1), r: cur ? 8 : 6.5,
        f: done ? '#e2a93b' : cur ? '#e58a80' : '#12180e', s: done || cur ? '#0b0f08' : (S.sealed ? '#3d4636' : '#6f7a63') };
    });
    const st = S.mastered ? `Fully grown · ${CONCEPTS_PER_REGION} of ${CONCEPTS_PER_REGION}` : S.open ? `${S.done} of ${CONCEPTS_PER_REGION} concepts` : S.charted ? 'Route charted' : 'Sealed';
    return {
      id: r.id, n: r.n, name: r.name, sub: r.sub, left: r.x - r.R, top: r.y - r.R, size: r.R * 2, lx: r.x - 160, ly: r.y + r.R * 0.93,
      gid: 'pg-' + r.id, cid: 'pc-' + r.id, body, light, dark, accent,
      glow: S.mastered || alive ? r.c[1] : '#000000', glowOp: S.mastered ? 0.2 : alive ? 0.12 : 0,
      featOp: S.sealed ? 0.45 : 0.9, orbitC: S.sealed ? '#2c3624' : (alive ? '#5b6650' : '#3a4532'),
      dSeed: D(r.kind === 'Seed'), dFlow: D(r.kind === 'Flow'), dArch: D(r.kind === 'Arch'), dEng: D(r.kind === 'Eng'), dMach: D(r.kind === 'Mach'), dNet: D(r.kind === 'Net'), dFront: D(r.kind === 'Front'), dExp: D(r.kind === 'Exp'),
      sprouts, canopy, dBloom: D(S.mastered), moons, moonCls: S.sealed ? 'pl-moons still' : 'pl-moons',
      dHere: D(i === curRegion), dSeal: D(S.sealed),
      subC: S.sealed ? '#6f7a63' : '#e2a93b', nameC: S.sealed ? '#8e9584' : '#ece6d6', stC: S.mastered ? '#e2a93b' : S.open ? '#e58a80' : S.charted ? '#b4cfb6' : '#6f7a63',
      statusText: st, aria: `${r.name}, ${r.sub}. ${st}. Open specimen sheet.`,
      onClick: () => cb.select(r.id),
      onEnter: () => cb.hover(r.id),
      onLeave: () => cb.hover(null),
    };
  });

  const routes = [];
  for (let q = 0; q < REGIONS.length - 1; q++) {
    const A = REGIONS[q], B = REGIONS[q + 1], mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y, L = Math.sqrt(dx * dx + dy * dy), off = (q % 2 ? 1 : -1) * 90;
    const S2 = status[q + 1];
    routes.push({ d: 'M' + A.x + ' ' + A.y + ' Q ' + (mx - (dy / L) * off).toFixed(0) + ' ' + (my + (dx / L) * off).toFixed(0) + ' ' + B.x + ' ' + B.y,
      c: S2.open ? '#e2a93b' : S2.charted ? '#b4cfb6' : '#3a4532', w: S2.open ? 4 : 3, dash: S2.open ? '2 12' : S2.charted ? '10 10' : '4 12', o: S2.open ? 0.95 : S2.charted ? 0.6 : 0.8, cls: S2.open ? 'route-lit' : '' });
  }

  const lit0 = status[0].done;
  const seedStars = SEED_PTS.map((pt, i) => { const on = i < lit0; return { tf: 'translate(' + pt[0] + ' ' + pt[1] + ') scale(' + (on ? 1 : 0.6) + ')', c: on ? '#f0c06a' : '#4a5442', o: on ? 1 : 0.8 }; });
  const seedLines = SEED_PTS.map((a1, sl) => { const a2 = SEED_PTS[(sl + 1) % SEED_PTS.length], on = sl + 1 < lit0; return { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], c: on ? '#e2a93b' : '#3a4532', w: on ? 2.5 : 1.5, dash: on ? '0' : '3 8' }; });

  /* hover preview card */
  const hoverR = v.hov && v.hov !== v.sel && !v.panning ? REGIONS.find((r) => r.id === v.hov) ?? null : null;
  let prev: UniverseVals['prev'] | null = null;
  if (hoverR) {
    const hi = REGIONS.indexOf(hoverR), HS = status[hi];
    let px = (hoverR.x + hoverR.R * 0.75) * us + ux + 14;
    const py = (hoverR.y - hoverR.R * 0.6) * us + uy;
    if (px > size.w - 300) px = (hoverR.x - hoverR.R * 0.75) * us + ux - 294;
    const nextC = hoverR.concepts.find((c) => !isDone(p, c.id));
    prev = { x: Math.round(clamp(px, 8, size.w - 290)), y: Math.round(clamp(py, 8, size.h - 200)), n: hoverR.n, sub: hoverR.sub, name: hoverR.name, blurb: hoverR.blurb,
      subC: HS.sealed ? '#a3a893' : '#e2a93b',
      dots: hoverR.concepts.map((c, j) => ({ c: isDone(p, c.id) ? '#e2a93b' : (hi === curRegion && j === curConcept) ? '#e58a80' : '#33402a' })),
      next: HS.mastered ? 'Fully grown. Revisit any concept.' : HS.open ? 'Next: ' + (nextC?.name ?? '') : HS.charted ? `Route charted · opens after ${REGIONS[hi - 1].name}` : 'Sealed · ' + (hi > 0 ? 'complete ' + REGIONS[hi - 1].name + ' first' : '') };
  }

  /* specimen sheet */
  const selR = v.sel ? REGIONS.find((r) => r.id === v.sel) ?? null : null;
  let pan: UniverseVals['pan'] | null = null;
  if (selR) {
    const si = REGIONS.indexOf(selR), SS = status[si];
    const cur = si === curRegion ? selR.concepts[curConcept] : undefined;
    pan = { n: selR.n, name: selR.name, sub: selR.sub, blurb: selR.blurb, body: planets[si].body, light: planets[si].light,
      statusText: planets[si].statusText, locked: !SS.open, canLearn: !!(cur?.lessonId || cur?.missionId),
      cta: (SS.done ? 'Continue: ' : 'Begin: ') + (cur?.name ?? ''),
      onLearn: () => { if (cur?.lessonId) cb.openLesson(cur.lessonId); else if (cur?.missionId) cb.openMission(cur.missionId); },
      lockNote: SS.charted ? `The route is charted but the gate is closed. Complete all six ${REGIONS[si - 1].name} concepts to fly here. You can preview every concept now.` : 'Sealed. ' + (si > 0 ? `Complete ${REGIONS[si - 1].name} to chart a route here.` : ''),
      concepts: selR.concepts.map((c, j) => {
        const dn = isDone(p, c.id), cu = si === curRegion && j === curConcept, lk = !SS.open && !dn;
        const state = dn ? 'complete' : cu ? 'up next' : lk ? 'sealed' : isAvailable(p, c.id) ? 'ready' : 'upcoming';
        // Exploration over gating: any concept with content can be opened from the sheet unless its system is sealed.
        const canOpen = !!(c.lessonId || c.missionId) && !SS.sealed;
        return { name: c.name, cls: cu ? 'is-cur' : '', dDone: D(dn), dCur: D(cu), dTodo: D(!dn && !cu && !lk), dLock: D(lk),
          state, tc: lk ? '#a3a893' : '#ece6d6', sc: dn ? '#e2a93b' : cu ? '#e58a80' : '#8e9584',
          aria: `${c.name}, ${state}.` + (canOpen ? (c.lessonId ? ' Open in the Academy.' : ' Open in Missions.') : ' No lesson yet.'),
          onOpen: canOpen ? () => (c.lessonId ? cb.openLesson(c.lessonId) : cb.openMission(c.missionId!)) : undefined };
      }) };
  }

  const hereR = curRegion >= 0 ? REGIONS[curRegion] : null;
  const totalDone = status.reduce((a, s) => a + s.done, 0);
  return {
    uvCls: v.panning ? 'is-panning' : '', planeCls: v.glide ? 'glide' : '', ux: ux.toFixed(1), uy: uy.toFixed(1), us: us.toFixed(3),
    farX: (ux * 0.22).toFixed(1), farY: (uy * 0.22).toFixed(1), farStars: FAR_STARS, nearStars: NEAR_STARS,
    seedStars, seedLines, seedLabel: `${REGIONS[0].constellation.toUpperCase()} · ${lit0}/6`, seedLabelC: lit0 ? '#e2a93b' : '#5f6a55',
    routes, planets,
    hasHere: !!hereR, hereX: hereR ? hereR.x - 150 : 0, hereY: hereR ? hereR.y - hereR.R * 0.93 - 74 : 0, hereConcept: hereR ? hereR.concepts[curConcept].name : '',
    uvSummary: `${totalDone} of ${REGIONS.length * CONCEPTS_PER_REGION} concepts complete · ${status.filter((s) => s.open).length} of ${REGIONS.length} systems reachable`,
    showPrev: !!prev, prev: prev ?? { x: 0, y: 0, n: '', sub: '', name: '', blurb: '', dots: [], next: '', subC: '#e2a93b' },
    hasPanel: !!pan, pan: pan ?? { n: '', name: '', sub: '', blurb: '', body: '', light: '', statusText: '', locked: false, canLearn: false, cta: '', lockNote: '', concepts: [], onLearn: () => {} },
    zoomRight: pan && size.w > 760 ? 368 : 16, zoomPct: Math.round(us * 200) + '%',
  };
}
