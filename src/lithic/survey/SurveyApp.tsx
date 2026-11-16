// The Survey window: pan/zoom camera (same engine as Botanica's Universe) plus the three expansion tiers.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import type { Progress } from '../../progression/progress';
import { PLANETS } from '../curriculum';
import { buildSurvey, fitSurvey, focusPlanet, focusConcept, INITIAL_CAMERA, CONCEPT_RING, zoomAt, type ViewState } from './model';
import { SurveyView } from './SurveyView';

interface Props {
  progress: Progress;
  /** Bumped by "Enter the Survey" / resume to re-fit the chart (and optionally frame a planet). */
  fitSignal: number;
  framePlanet?: string | null;
  scale: () => number;
  onOpenLesson: (lessonId: string) => void;
  onReturnToOrbis: () => void;
}

type Pan = { sx: number; sy: number; ox: number; oy: number; k: number; moved: boolean };
let consumedFit = 0;

export default function SurveyApp({ progress, fitSignal, framePlanet, scale, onOpenLesson, onReturnToOrbis }: Props) {
  const [v, setV] = useState<ViewState>({ ...INITIAL_CAMERA, hov: null, sel: null, conc: null, panning: false, glide: false });
  const [size, setSize] = useState({ w: 1060, h: 604 });
  const ref = useRef<HTMLDivElement>(null);
  const pan = useRef<Pan | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => { if (el.offsetWidth) setSize((s) => (s.w === el.offsetWidth && s.h === el.offsetHeight ? s : { w: el.offsetWidth, h: el.offsetHeight })); };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);

  const fit = () => {
    const el = ref.current, w = el?.offsetWidth || size.w, h = el?.offsetHeight || size.h;
    setV((s) => ({ ...s, ...fitSurvey(w, h), glide: true, sel: null, conc: null }));
  };
  // Each signal value runs once, even across remounts/StrictMode. Optionally frames a planet (resume/Continue).
  useEffect(() => {
    if (fitSignal === consumedFit) return; consumedFit = fitSignal;
    const el = ref.current, w = el?.offsetWidth || size.w, h = el?.offsetHeight || size.h;
    const p = framePlanet ? PLANETS.find((x) => x.id === framePlanet) : null;
    if (p) setV((s) => ({ ...s, ...focusPlanet(s, p, w, h), sel: p.id, conc: null, glide: true, hov: null }));
    else setV((s) => ({ ...s, ...fitSurvey(w, h), glide: true, sel: null, conc: null }));
  }, [fitSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  const local = (e: { clientX: number; clientY: number }) => {
    const r = ref.current!.getBoundingClientRect(), k = scale();
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };

  const selectPlanet = (id: string) => {
    const p = PLANETS.find((x) => x.id === id)!;
    setV((s) => ({ ...s, ...focusPlanet(s, p, size.w, size.h), sel: id, conc: null, hov: null, glide: true }));
  };
  const selectConcept = (i: number) => {
    const p = PLANETS.find((x) => x.id === v.sel)!;
    const N = p.concepts.length, R = CONCEPT_RING(p.R);
    const ang = (-90 + (360 / N) * i) * (Math.PI / 180);
    const cx = p.x + R * Math.cos(ang), cy = p.y + R * Math.sin(ang);
    setV((s) => ({ ...s, ...focusConcept(s, cx, cy, size.w, size.h), conc: i, hov: null, glide: true }));
  };
  const backToConcepts = () => { const p = PLANETS.find((x) => x.id === v.sel)!; setV((s) => ({ ...s, ...focusPlanet(s, p, size.w, size.h), conc: null, glide: true })); };
  const deselect = () => fit();

  const vals = useMemo(() => buildSurvey(progress, v, size, {
    selectPlanet, deselect, selectConcept, backToConcepts,
    hover: (id) => { if (!pan.current) setV((s) => (s.hov === id ? s : { ...s, hov: id })); },
    openLesson: onOpenLesson, returnToOrbis: onReturnToOrbis,
  }), [progress, v, size, onOpenLesson, onReturnToOrbis]);

  /* ---- pointer: drag to drift, two fingers to pinch ---- */
  const uvDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as Element).closest?.('button, .uv-panel, .uv-zoom, .uv-legend')) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 2) { pan.current = null; pinch.current = null; return; }
    pan.current = { sx: e.clientX, sy: e.clientY, ox: v.ux, oy: v.uy, k: scale(), moved: false };
    setV((s) => ({ ...s, panning: true, glide: false, hov: null }));
  };
  const uvMove = (e: PointerEvent<HTMLDivElement>) => {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current) { const f = dist / pinch.current; setV((s) => ({ ...s, ...zoomAt(s, f, (a.x + b.x) / 2, (a.y + b.y) / 2), glide: false })); }
      pinch.current = dist;
      return;
    }
    const p = pan.current; if (!p) return;
    const dx = (e.clientX - p.sx) / p.k, dy = (e.clientY - p.sy) / p.k;
    if (Math.abs(dx) + Math.abs(dy) > 3) p.moved = true;
    setV((s) => ({ ...s, ux: p.ox + dx, uy: p.oy + dy }));
  };
  const uvUp = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    const p = pan.current; pan.current = null;
    // a click on empty space (no drag) steps up one tier: lessons → concepts → three-planet view
    if (p && !p.moved && v.sel) setV((s) => (s.conc != null ? { ...s, conc: null } : { ...s, sel: null, panning: false }));
    else setV((s) => ({ ...s, panning: false }));
  };
  const uvWheel = (e: WheelEvent<HTMLDivElement>) => {
    const pt = local(e);
    setV((s) => ({ ...s, ...zoomAt(s, e.deltaY < 0 ? 1.1 : 1 / 1.1, pt.x, pt.y), glide: false }));
  };
  const zoomBy = (f: number) => setV((s) => ({ ...s, ...zoomAt(s, f, size.w / 2, size.h / 2), glide: true }));

  return (
    <div className="wbody">
      <SurveyView {...vals} uvRef={ref} uvDown={uvDown} uvMove={uvMove} uvUp={uvUp} uvWheel={uvWheel}
        zoomIn={() => zoomBy(1.25)} zoomOut={() => zoomBy(0.8)} zoomReset={fit}
        closePanel={() => setV((s) => ({ ...s, sel: null, conc: null }))} returnToOrbis={onReturnToOrbis} />
    </div>
  );
}
