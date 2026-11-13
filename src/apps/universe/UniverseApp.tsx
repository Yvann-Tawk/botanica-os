import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react';
import type { Progress } from '../../progression/progress';
import { buildUniverse, fitCamera, focusCamera, INITIAL_CAMERA, zoomAt, type ViewState } from './model';
import { UniverseView } from './UniverseView';

interface Props {
  progress: Progress;
  /** Bumped by "Enter the Universe" to re-fit the chart. */
  fitSignal: number;
  scale: () => number;
  onOpenLesson: (lessonId: string) => void;
  onOpenMission: (missionId: string) => void;
  onOpenMissions: () => void;
  onSay: (text: string) => void;
}

type Pan = { sx: number; sy: number; ox: number; oy: number; k: number; moved: boolean };
const KEY_STEP = 60;
let consumedFit = 0;

export default function UniverseApp({ progress, fitSignal, scale, onOpenLesson, onOpenMission, onOpenMissions, onSay }: Props) {
  const [v, setV] = useState<ViewState>({ ...INITIAL_CAMERA, hov: null, sel: null, panning: false, glide: false });
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
    setV((s) => ({ ...s, ...fitCamera(w, h), glide: true, sel: null }));
  };
  // Each signal value fits once, even across remounts and StrictMode's doubled effects.
  useEffect(() => { if (fitSignal === consumedFit) return; consumedFit = fitSignal; fit(); }, [fitSignal]);

  const local = (e: { clientX: number; clientY: number }) => {
    const r = ref.current!.getBoundingClientRect(), k = scale();
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };

  const select = (id: string) => {
    setV((s) => ({ ...s, ...focusCamera(s, id, size.w, size.h), sel: id, hov: null, glide: true }));
    if (id === 'origins') onSay('Six moons, six lessons. The pink one is where you are headed next.');
  };

  const vals = useMemo(() => buildUniverse(progress, v, size, {
    select,
    hover: (id) => { if (!pan.current) setV((s) => (s.hov === id ? s : { ...s, hov: id })); },
    openLesson: onOpenLesson,
    openMission: onOpenMission,
  }), [progress, v, size, onOpenLesson, onOpenMission]);

  /* ---- pointer: drag to drift, two fingers to pinch ---- */
  const uvDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as Element).closest?.('button, .uv-panel, .uv-zoom, .uv-legend')) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
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
    setV((s) => ({ ...s, panning: false, sel: p && !p.moved && s.sel ? null : s.sel }));
  };
  const uvWheel = (e: WheelEvent<HTMLDivElement>) => {
    const pt = local(e);
    setV((s) => ({ ...s, ...zoomAt(s, e.deltaY < 0 ? 1.1 : 1 / 1.1, pt.x, pt.y), glide: false }));
  };
  const zoomBy = (f: number) => setV((s) => ({ ...s, ...zoomAt(s, f, size.w / 2, size.h / 2), glide: true }));

  /* ---- keyboard: the chart itself drifts and zooms; planets are ordinary buttons ---- */
  const uvKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && v.sel) { e.stopPropagation(); setV((s) => ({ ...s, sel: null })); ref.current?.focus(); return; }
    if (e.target !== e.currentTarget) return;
    const moves: Record<string, [number, number]> = { ArrowLeft: [KEY_STEP, 0], ArrowRight: [-KEY_STEP, 0], ArrowUp: [0, KEY_STEP], ArrowDown: [0, -KEY_STEP] };
    if (moves[e.key]) { e.preventDefault(); const [dx, dy] = moves[e.key]; setV((s) => ({ ...s, ux: s.ux + dx, uy: s.uy + dy, glide: true })); }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomBy(1.25); }
    else if (e.key === '-') { e.preventDefault(); zoomBy(0.8); }
    else if (e.key === '0') { e.preventDefault(); fit(); }
  };

  return (
    <div className="wbody">
      <UniverseView {...vals} uvRef={ref} uvDown={uvDown} uvMove={uvMove} uvUp={uvUp} uvWheel={uvWheel} uvKey={uvKey}
        zoomIn={() => zoomBy(1.25)} zoomOut={() => zoomBy(0.8)} zoomReset={fit}
        closePanel={() => setV((s) => ({ ...s, sel: null }))} openMissions={onOpenMissions} />
    </div>
  );
}
