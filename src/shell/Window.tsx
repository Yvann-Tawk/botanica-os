import { useRef, type PointerEvent, type ReactNode } from 'react';
import type { AppDef } from '../content/apps';
import type { Geom, ShellAction, WinState } from './windowReducer';

interface Props {
  app: AppDef;
  win: WinState;
  g: Geom;
  focused: boolean;
  dispatch: (a: ShellAction) => void;
  onActivity: () => void;
  /** Ratio of rendered to layout size, for when the stage is CSS-scaled. */
  scale: () => number;
  /** Replaces the registry subtitle, e.g. the Terminal's open file. */
  sub?: string;
  children: ReactNode;
}

type Drag = { mode: 'move' | 'size'; sx: number; sy: number; ox: number; oy: number; ow: number; oh: number; k: number };

export function Window({ app, win, g, focused, dispatch, onActivity, scale, sub, children }: Props) {
  const drag = useRef<Drag | null>(null);
  const visible = win.open && !win.min;
  const cls = ['win', visible ? 'is-open' : 'is-hidden', g.max ? 'is-max' : '', focused ? '' : 'is-blur'].join(' ');
  const label = app.longName;

  const start = (mode: Drag['mode']) => (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    if (mode === 'move' && (e.target as HTMLElement).closest?.('button')) return;
    if (g.max && mode === 'move') return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
    drag.current = { mode, sx: e.clientX, sy: e.clientY, ox: g.x, oy: g.y, ow: g.w, oh: g.h, k: scale() };
    dispatch({ type: 'focus', id: app.id });
    e.preventDefault();
  };
  const move = (e: PointerEvent) => {
    const d = drag.current; if (!d) return;
    const dx = (e.clientX - d.sx) / d.k, dy = (e.clientY - d.sy) / d.k;
    if (d.mode === 'move') dispatch({ type: 'move', id: app.id, x: d.ox + dx, y: d.oy + dy });
    else { dispatch({ type: 'move', id: app.id, x: d.ox, y: d.oy }); dispatch({ type: 'resize', id: app.id, w: d.ow + dx, h: d.oh + dy }); }
  };
  const end = () => { drag.current = null; };

  return (
    <section
      className={cls}
      style={{ left: `${g.x}px`, top: `${g.y}px`, width: `${g.w}px`, height: `${g.h}px`, zIndex: win.z }}
      onPointerDown={() => { onActivity(); dispatch({ type: 'focus', id: app.id }); }}
      aria-label={`${label} window`}
      aria-hidden={!visible}
      {...({ inert: visible ? undefined : '' } as object)}
      data-app={app.id}
      tabIndex={-1}
    >
      <div className="tbar" onPointerDown={start('move')} onPointerMove={move} onPointerUp={end}
        onDoubleClick={(e) => { if ((e.target as HTMLElement).closest?.('button')) return; dispatch({ type: 'toggleMax', id: app.id }); }}>
        <button className="wbtn close" aria-label={`Close ${label}`} onClick={() => dispatch({ type: 'close', id: app.id })}><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2.2 2.2 L7.8 7.8 M7.8 2.2 L2.2 7.8" stroke="#242820" strokeWidth="1.8" strokeLinecap="round"></path></svg></button>
        <div className="tstripes"></div>
        <div className="ttitle"><span className="tdot" style={{ background: app.dot }}></span><span>{app.name}</span><span className="tsub">{sub ?? app.sub}</span></div>
        <div className="tstripes"></div>
        <button className="wbtn" aria-label={`Minimize ${label}`} onClick={() => dispatch({ type: 'minimize', id: app.id })}><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 7 H 8" stroke="#242820" strokeWidth="1.8" strokeLinecap="round"></path></svg></button>
        <button className="wbtn" aria-label={(g.max ? 'Restore ' : 'Maximize ') + label} onClick={() => dispatch({ type: 'toggleMax', id: app.id })}><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><rect x="1.5" y="1.5" width="7" height="7" rx="1" fill="none" stroke="#242820" strokeWidth="1.5"></rect><rect x="1.5" y="1.5" width="3.6" height="3.6" fill="#242820"></rect></svg></button>
      </div>
      {children}
      <div className="rsz" onPointerDown={start('size')} onPointerMove={move} onPointerUp={end} aria-hidden="true"></div>
    </section>
  );
}
