// The Survey window content: the Lithic world-navigator. Same window + pan/zoom pattern as Botanica's Universe,
// re-skinned geological, with the three expansion tiers (planet → mini-planet nodes → lesson nodes).
import { Fragment, type PointerEvent, type Ref, type WheelEvent } from 'react';
import type { NodeVals, PlanetVals, SurveyVals } from './model';

interface Handlers {
  uvRef: Ref<HTMLDivElement>;
  uvDown: (e: PointerEvent<HTMLDivElement>) => void;
  uvMove: (e: PointerEvent<HTMLDivElement>) => void;
  uvUp: (e: PointerEvent<HTMLDivElement>) => void;
  uvWheel: (e: WheelEvent<HTMLDivElement>) => void;
  zoomIn: () => void; zoomOut: () => void; zoomReset: () => void;
  closePanel: () => void; returnToOrbis: () => void;
}

function PlanetBody({ p }: { p: PlanetVals }) {
  const gid = `li-g-${p.id}`, cid = `li-c-${p.id}`;
  return (
    <svg viewBox="-100 -100 200 200" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={gid} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor={p.grad[0]}></stop>
          <stop offset="0.55" stopColor={p.grad[1]}></stop>
          <stop offset="1" stopColor={p.grad[2]}></stop>
        </radialGradient>
        <clipPath id={cid}><circle r="60"></circle></clipPath>
      </defs>
      <circle r="96" fill={p.accent} opacity={p.dim ? 0.05 : 0.14}></circle>
      <circle r="86" fill="none" stroke={p.accent} strokeWidth="1.4" strokeDasharray="3 6" opacity={p.dim ? 0.3 : 0.7}></circle>
      {/* cut-geode ring (the specimen motif) */}
      <path d="M -94 0 A 94 22 0 0 1 94 0" transform="rotate(-14)" fill="none" stroke={p.grad[2]} strokeWidth="7" opacity="0.8"></path>
      <circle r="60" fill={`url(#${gid})`} stroke="#0b0f08" strokeWidth="2.5"></circle>
      <g clipPath={`url(#${cid})`}>
        {/* crystalline facets */}
        <g stroke="#0b0f08" strokeWidth="1.6" strokeLinejoin="round" opacity="0.55">
          <path d="M0 0 L-30 -46 L6 -58 L26 -20 Z" fill={p.grad[0]}></path>
          <path d="M0 0 L26 -20 L58 2 L24 30 Z" fill={p.grad[2]}></path>
          <path d="M0 0 L24 30 L-6 58 L-34 24 Z" fill={p.grad[1]}></path>
          <path d="M0 0 L-34 24 L-54 -16 L-30 -46 Z" fill={p.grad[2]}></path>
        </g>
        <path d="M-70 36 C -40 26, 40 26, 70 36 L70 70 L-70 70 Z" fill={p.grad[2]} opacity="0.45"></path>
        <circle cx="26" cy="22" r="66" fill="#0b0f08" opacity="0.28"></circle>
      </g>
      <path d="M -44 -38 A 58 58 0 0 1 26 -54" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round"></path>
      <path d="M -94 0 A 94 22 0 0 0 94 0" transform="rotate(-14)" fill="none" stroke={p.grad[2]} strokeWidth="7" opacity="0.92"></path>
      {p.here && (<circle r="72" fill="none" stroke="#e58a80" strokeWidth="2.5" className="pl-pulse"></circle>)}
      {p.sealed && (
        <g transform="translate(46 46)">
          <rect x="-9" y="-3" width="18" height="14" rx="2" fill="#17130d" stroke="#6f6450" strokeWidth="1.6"></rect>
          <path d="M-5 -3 V -7 A 5 5 0 0 1 5 -7 V -3" fill="none" stroke="#6f6450" strokeWidth="1.6"></path>
        </g>
      )}
    </svg>
  );
}

function Node({ n }: { n: NodeVals }) {
  const r = n.size / 2;
  return (
    <>
      <button className="nodep" style={{ left: `${n.cx - r}px`, top: `${n.cy - r}px`, width: `${n.size}px`, height: `${n.size}px` }}
        disabled={n.locked} onClick={n.onClick} aria-label={`${n.name}, ${n.state}`}>
        <svg viewBox="-50 -50 100 100" width="100%" height="100%" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
          <circle r="40" fill={n.color} stroke="#0b0f08" strokeWidth="2.5" opacity={n.locked ? 0.5 : 1}></circle>
          <circle r="40" fill="none" stroke="#0b0f08" strokeWidth="1" strokeDasharray={n.locked ? '3 4' : 'none'}></circle>
          <path d="M-22 -14 A 30 30 0 0 1 14 -26" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round"></path>
          {n.state === 'done' && (<path d="M-16 2 L -4 14 L 18 -14" fill="none" stroke="#17130d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>)}
          {n.state === 'current' && (<circle r="12" fill="#17130d"></circle>)}
          {n.locked && (<g transform="translate(0 2)"><rect x="-9" y="-2" width="18" height="13" rx="2" fill="#17130d" stroke="#2b2616" strokeWidth="1.4"></rect><path d="M-5 -2 V -6 A 5 5 0 0 1 5 -6 V -2" fill="none" stroke="#17130d" strokeWidth="1.6"></path></g>)}
        </svg>
      </button>
      <div className="node-label" style={{ left: `${n.lx}px`, top: `${n.ly}px` }}>
        <span className="mono" style={{ fontSize: '12px', color: n.locked ? '#8a8069' : '#ece6d6' }}>{n.name}</span>
      </div>
    </>
  );
}

export function SurveyView(v: SurveyVals & Handlers) {
  const { uvCls, planeCls, ux, uy, us, planets, nodes, hasHere, hereX, hereY, hereLabel, zoomPct, zoomRight, summary, hover, panel } = v;
  return (
    <div className={`uv lith ${uvCls}`} ref={v.uvRef} onPointerDown={v.uvDown} onPointerMove={v.uvMove} onPointerUp={v.uvUp} onPointerCancel={v.uvUp} onWheel={v.uvWheel}
      tabIndex={0} aria-roledescription="survey chart" aria-label="The Lithic Survey. Drag to drift, scroll to zoom, click a discipline to expand it.">
      <div className={`uv-plane ${planeCls}`} style={{ transform: `translate(${ux}px, ${uy}px) scale(${us})` }}>
        {/* planets */}
        {planets.map((p) => (
          <Fragment key={p.id}>
            <div style={{ display: 'contents' }}>
              <button className="planet" style={{ left: `${p.left}px`, top: `${p.top}px`, width: `${p.size}px`, height: `${p.size}px`, opacity: p.dim ? 0.28 : 1 }}
                aria-label={p.aria} onClick={p.onClick} onMouseEnter={p.onEnter} onMouseLeave={p.onLeave} onFocus={p.onEnter} onBlur={p.onLeave}>
                <PlanetBody p={p} />
              </button>
              <div className="pl-label" style={{ left: `${p.lx}px`, top: `${p.ly}px`, opacity: p.dim ? 0.4 : 1 }}>
                <span className="mono pl-n" style={{ color: '#a3977a' }}>{p.n} · {p.discipline}</span>
                <span className="disp pl-name" style={{ color: '#ece6d6' }}>{p.name}</span>
                <span className="mono pl-st" style={{ color: p.sealed ? '#8a8069' : p.here ? '#e58a80' : '#e2a93b' }}>{p.statusText}</span>
              </div>
            </div>
          </Fragment>
        ))}
        {/* expansion nodes */}
        {nodes.map((n) => (<Node key={n.key} n={n} />))}
        {hasHere && (
          <div className="here" style={{ left: `${hereX}px`, top: `${hereY}px` }}>
            <span className="tag">You are here · {hereLabel}</span>
            <span className="stem"></span>
          </div>
        )}
      </div>

      {/* HUD */}
      <div className="uv-ui uv-title">
        <p className="mono" style={{ margin: '0 0 4px', fontSize: '11.5px', color: '#e2a93b', letterSpacing: '.06em' }}>PLATE II · SYSTEM 02 · THE LITHIC SHELF</p>
        <p className="disp" style={{ margin: 0, fontSize: '28px', lineHeight: 1.1, color: '#ece6d6' }}>The Lithic Survey</p>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#a3a893' }}>{summary}</p>
      </div>

      <div className="uv-ui uv-legend" aria-label="Legend">
        <span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="#e2a93b"></circle></svg>Complete</span>
        <span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="#e58a80"></circle></svg>Current</span>
        <span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="#cfd2c2"></circle></svg>Open</span>
        <span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="none" stroke="#6f6450" strokeWidth="1.5" strokeDasharray="2 2"></circle></svg>Sealed</span>
      </div>

      <div className="uv-ui uv-zoom" style={{ right: `${zoomRight}px` }}>
        <button aria-label="Zoom out" onClick={v.zoomOut}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8 H 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg></button>
        <span className="pct mono">{zoomPct}</span>
        <button aria-label="Zoom in" onClick={v.zoomIn}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8 H 13 M8 3 V 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg></button>
        <button aria-label="Re-centre the Survey" onClick={v.zoomReset}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.8"></circle><circle cx="8" cy="8" r="1.6" fill="currentColor"></circle><path d="M8 0.5 V 3 M8 13 V 15.5 M0.5 8 H 3 M13 8 H 15.5" stroke="currentColor" strokeWidth="1.8"></path></svg></button>
      </div>

      <div className="uv-ui uv-hint mono">drag to drift · scroll to zoom · click a discipline</div>

      {hover && (
        <div className="uv-ui uv-prev" style={{ left: '22px', top: '120px' }}>
          <p className="mono" style={{ margin: '0 0 2px', fontSize: '11.5px', color: '#a3977a' }}>{hover.n} · {hover.discipline}</p>
          <p className="disp" style={{ margin: '0 0 6px', fontSize: '21px', color: '#ece6d6' }}>{hover.name}</p>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#cfd2c2', lineHeight: 1.45 }}>{hover.blurb}</p>
          <p style={{ margin: 0, fontSize: '12.5px', color: hover.sealed ? '#8a8069' : '#e2a93b' }}>{hover.sealed ? 'Sealed discipline' : 'Open — click to survey'}</p>
        </div>
      )}

      {panel && (
        <aside className="uv-ui uv-panel" aria-label="Specimen sheet">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '18px 18px 14px', borderBottom: '1px solid #33402a' }}>
            <svg width="54" height="54" viewBox="-30 -30 60 60" aria-hidden="true" style={{ flex: 'none' }}><circle r="26" fill={panel.tier === 'lessons' ? '#e2a93b' : '#c6b48c'} stroke="#0b0f08" strokeWidth="2"></circle><circle cx="8" cy="8" r="27" fill="#0b0f08" opacity="0.3"></circle></svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="mono" style={{ margin: 0, fontSize: '11.5px', color: '#e2a93b' }}>SPECIMEN SHEET · {panel.discipline}</p>
              <p className="disp" style={{ margin: '2px 0 2px', fontSize: '25px', lineHeight: 1.1 }}>{panel.name}</p>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#a3a893' }}>{panel.sub} · {panel.statusText}</p>
            </div>
            <button className="xbtn" aria-label="Close specimen sheet" onClick={v.closePanel}><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></path></svg></button>
          </div>
          <div className="scroll-d" style={{ flex: 1, padding: '14px 14px 10px' }}>
            {panel.onBack && (<button className="btn-d ghost" style={{ marginBottom: '12px' }} onClick={panel.onBack}>{panel.backLabel}</button>)}
            <p style={{ margin: '0 4px 14px', fontSize: '13.5px', color: '#cfd2c2', lineHeight: 1.5 }}>{panel.blurb}</p>
            {panel.rows.map((row) => (
              <button type="button" key={row.key} className={`crow ${row.state === 'current' ? 'is-cur' : ''}`} disabled={!row.onOpen} onClick={row.onOpen} aria-label={row.aria}
                style={{ width: '100%', border: 0, background: row.state === 'current' ? undefined : 'none', cursor: row.onOpen ? 'pointer' : 'default', textAlign: 'left' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={{ flex: 'none' }}>
                  {row.state === 'done' && (<g><circle cx="10" cy="10" r="8" fill="#e2a93b"></circle><path d="M6 10.5 L 9 13 L 14 7.5" fill="none" stroke="#12180e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g>)}
                  {row.state === 'current' && (<g><circle cx="10" cy="10" r="8" fill="none" stroke="#e58a80" strokeWidth="2"></circle><circle cx="10" cy="10" r="4" fill="#e58a80"></circle></g>)}
                  {row.state === 'open' && (<circle cx="10" cy="10" r="7.5" fill="none" stroke="#6f7a63" strokeWidth="1.6"></circle>)}
                  {row.state === 'locked' && (<g><rect x="5" y="9" width="10" height="7.5" rx="1.5" fill="#46553a"></rect><path d="M7 9 V 7 A 3 3 0 0 1 13 7 V 9" fill="none" stroke="#6f7a63" strokeWidth="1.6"></path></g>)}
                </svg>
                <span className="ct" style={{ color: row.state === 'locked' ? '#8a8069' : '#ece6d6' }}>{row.name}</span>
                <span className="mono" style={{ fontSize: '11.5px', color: '#a3a893' }}>{row.sub}</span>
              </button>
            ))}
            {panel.locked && panel.lockNote && (<p style={{ margin: '14px 4px 0', padding: '12px 14px', border: '1px dashed #5b6650', borderRadius: '10px', fontSize: '13px', color: '#cfd2c2', lineHeight: 1.5 }}>{panel.lockNote}</p>)}
          </div>
          <div style={{ display: 'flex', gap: '8px', padding: '12px 14px 14px', borderTop: '1px solid #33402a' }}>
            {panel.cta && (<button className="btn-d" style={{ flex: 1 }} onClick={panel.onCta}>{panel.cta}</button>)}
            <button className="btn-d ghost" onClick={v.returnToOrbis}>Orbis</button>
          </div>
        </aside>
      )}
    </div>
  );
}
