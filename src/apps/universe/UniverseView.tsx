// Universe window view: markup ported verbatim from the prototype (Main.dc.html, Universe section).
// All values are computed in UniverseApp; this file only renders them.
import { Fragment, type KeyboardEvent, type PointerEvent, type Ref, type WheelEvent } from 'react';
import type { UniverseVals } from './model';

interface Handlers {
  uvRef: Ref<HTMLDivElement>;
  uvDown: (e: PointerEvent<HTMLDivElement>) => void;
  uvMove: (e: PointerEvent<HTMLDivElement>) => void;
  uvUp: (e: PointerEvent<HTMLDivElement>) => void;
  uvWheel: (e: WheelEvent<HTMLDivElement>) => void;
  uvKey: (e: KeyboardEvent<HTMLDivElement>) => void;
  zoomIn: () => void; zoomOut: () => void; zoomReset: () => void;
  closePanel: () => void; openMissions: () => void;
}

export function UniverseView(v: UniverseVals & Handlers) {
  const { uvCls, farX, farY, farStars, planeCls, ux, uy, us, nearStars, seedLines, seedStars, seedLabelC, seedLabel, routes, planets,
    hasHere, hereX, hereY, hereConcept, uvSummary, zoomRight, zoomPct, showPrev, prev, hasPanel, pan,
    zoomIn, zoomOut, zoomReset, closePanel, openMissions } = v;
  return (
    <div className={`uv ${uvCls}`} ref={v.uvRef} onPointerDown={v.uvDown} onPointerMove={v.uvMove} onPointerUp={v.uvUp} onPointerCancel={v.uvUp} onWheel={v.uvWheel}
      onKeyDown={v.uvKey} tabIndex={0} aria-roledescription="star chart" aria-label="Chart of Known Python. Arrow keys drift, plus and minus zoom, 0 re-centres, Tab moves between worlds.">
        <svg viewBox="0 0 3200 2200" width="3200" height="2200" aria-hidden="true" style={{position: `absolute`, left: `-700px`, top: `-600px`, transform: `translate(${farX}px, ${farY}px)`, pointerEvents: `none`}}>
          {farStars.map((s, s_i) => (<Fragment key={s_i}>
            <circle cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} className={s.cls}></circle>
          </Fragment>))}
        </svg>

        <div className={`uv-plane ${planeCls}`} style={{transform: `translate(${ux}px, ${uy}px) scale(${us})`}}>
          <svg viewBox="0 0 2600 1700" width="2600" height="1700" aria-hidden="true" style={{position: `absolute`, left: `0`, top: `0`, overflow: `visible`, pointerEvents: `none`}}>
            <defs>
              <filter id="uvNeb" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="70"></feGaussianBlur></filter>
            </defs>
            <ellipse cx="620" cy="920" rx="440" ry="280" fill="#3e6510" opacity="0.26" filter="url(#uvNeb)"></ellipse>
            <ellipse cx="1560" cy="760" rx="480" ry="250" fill="#7a2f2a" opacity="0.18" filter="url(#uvNeb)"></ellipse>
            <ellipse cx="2080" cy="1100" rx="380" ry="220" fill="#b47e00" opacity="0.12" filter="url(#uvNeb)"></ellipse>
            <g fill="none" stroke="#2c3824" strokeWidth="2">
              <circle cx="1300" cy="880" r="380" strokeDasharray="4 10"></circle>
              <circle cx="1300" cy="880" r="700"></circle>
              <circle cx="1300" cy="880" r="1040" strokeDasharray="14 12"></circle>
              <path d="M1300 -200 V 1900 M200 880 H 2400" strokeDasharray="2 14"></path>
            </g>
            <g fontFamily="JetBrains Mono, monospace" fontSize="20" fill="#5f6a55" letterSpacing="2">
              <text x="1320" y="196">DECL. +40°</text>
              <text x="2120" y="868">R.A. 06h</text>
              <text x="230" y="866">R.A. 18h</text>
              <text x="1320" y="1610">FIG. I — THE KNOWN PYTHON · SURVEYED BY THE HORTENSIA</text>
            </g>
            {nearStars.map((s, s_i) => (<Fragment key={s_i}>
              <circle cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} className={s.cls}></circle>
            </Fragment>))}
            {/* First Seed constellation */}
            {seedLines.map((l, l_i) => (<Fragment key={l_i}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.c} strokeWidth={l.w} strokeDasharray={l.dash} strokeLinecap="round"></line>
            </Fragment>))}
            {seedStars.map((s, s_i) => (<Fragment key={s_i}>
              <g transform={s.tf}><path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z" fill={s.c} opacity={s.o}></path></g>
            </Fragment>))}
            <text x="150" y="700" fontFamily="JetBrains Mono, monospace" fontSize="20" fill={seedLabelC} letterSpacing="2">{seedLabel}</text>
            {/* routes */}
            {routes.map((r, r_i) => (<Fragment key={r_i}>
              <path d={r.d} fill="none" stroke={r.c} strokeWidth={r.w} strokeDasharray={r.dash} strokeLinecap="round" opacity={r.o} className={r.cls}></path>
            </Fragment>))}
          </svg>

          {planets.map((p, p_i) => (<Fragment key={p_i}>
            <div style={{display: `contents`}}>
              <button className="planet" style={{left: `${p.left}px`, top: `${p.top}px`, width: `${p.size}px`, height: `${p.size}px`}} aria-label={p.aria} onClick={p.onClick} onMouseEnter={p.onEnter} onMouseLeave={p.onLeave} onFocus={p.onEnter} onBlur={p.onLeave}>
                <svg viewBox="-100 -100 200 200" width="100%" height="100%" aria-hidden="true" style={{display: `block`, overflow: `visible`}}>
                  <defs>
                    <radialGradient id={p.gid} cx="0.36" cy="0.3" r="0.8">
                      <stop offset="0" stopColor={p.light}></stop>
                      <stop offset="0.55" stopColor={p.body}></stop>
                      <stop offset="1" stopColor={p.dark}></stop>
                    </radialGradient>
                    <clipPath id={p.cid}><circle r="60"></circle></clipPath>
                  </defs>
                  <circle r="98" fill={p.glow} opacity={p.glowOp}></circle>
                  <g display={p.dExp}>
                    <path d="M-48 -26 C -110 -64, -170 -58, -240 -104 C -176 -40, -116 -10, -54 2 Z" fill={p.accent} opacity="0.32"></path>
                    <path d="M-50 -14 C -120 -40, -170 -30, -220 -60" fill="none" stroke={p.accent} strokeWidth="2" opacity="0.5"></path>
                  </g>
                  <circle r="86" fill="none" stroke={p.orbitC} strokeWidth="1.4" strokeDasharray="3 6"></circle>
                  <g display={p.dArch}><path d="M -94 0 A 94 22 0 0 1 94 0" transform="rotate(-16)" fill="none" stroke={p.accent} strokeWidth="7" opacity="0.85"></path></g>
                  <circle r="60" fill={`url(#${p.gid})`} stroke="#0b0f08" strokeWidth="2.5"></circle>
                  <g clipPath={`url(#${p.cid})`}>
                    <g opacity={p.featOp}>
                      <g display={p.dSeed}>
                        <path d="M-70 8 C -44 -6, -22 14, 4 4 C 28 -6, 46 10, 70 2 L 70 70 L -70 70 Z" fill={p.accent} opacity="0.5"></path>
                        <path d="M-62 34 C -36 24, -10 40, 18 30 C 40 22, 56 34, 70 28" fill="none" stroke={p.dark} strokeWidth="3" opacity="0.5"></path>
                        <ellipse cx="-14" cy="-18" rx="20" ry="11" transform="rotate(-28 -14 -18)" fill={p.dark} opacity="0.4"></ellipse>
                      </g>
                      <g display={p.dFlow} fill="none" stroke={p.accent} strokeLinecap="round">
                        <path d="M-72 -24 C -46 -38, -20 -10, 6 -24 S 50 -14, 72 -30" strokeWidth="7" opacity="0.7"></path>
                        <path d="M-72 4 C -40 -8, -18 18, 14 4 S 52 12, 72 0" strokeWidth="5" opacity="0.55"></path>
                        <path d="M-72 32 C -44 22, -16 44, 16 30 S 54 40, 72 26" strokeWidth="4" opacity="0.45"></path>
                      </g>
                      <g display={p.dArch} fill={p.accent}>
                        <rect x="-70" y="-46" width="140" height="10" opacity="0.45"></rect>
                        <rect x="-70" y="-24" width="140" height="7" opacity="0.3"></rect>
                        <rect x="-70" y="-4" width="140" height="11" opacity="0.45"></rect>
                        <rect x="-70" y="20" width="140" height="6" opacity="0.3"></rect>
                        <rect x="-70" y="38" width="140" height="10" opacity="0.4"></rect>
                      </g>
                      <g display={p.dEng}>
                        <circle r="34" fill="none" stroke={p.accent} strokeWidth="10" strokeDasharray="7 6" opacity="0.65"></circle>
                        <circle r="17" fill={p.dark} opacity="0.45"></circle>
                        <circle r="6" fill={p.accent} opacity="0.8"></circle>
                      </g>
                      <g display={p.dMach} stroke={p.dark} strokeWidth="1.5">
                        <path d="M-62 -6 L -24 -42 L 8 -8 L -28 22 Z" fill={p.light} opacity="0.45"></path>
                        <path d="M8 -8 L 46 -40 L 70 6 L 30 30 Z" fill={p.accent} opacity="0.35"></path>
                        <path d="M-28 22 L 8 -8 L 30 30 L -8 62 Z" fill={p.dark} opacity="0.35"></path>
                      </g>
                      <g display={p.dNet} fill="none" stroke={p.accent} strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
                        <path d="M-60 -20 C -30 -10, -20 10, 0 0 C 20 -10, 30 -30, 56 -36 M0 0 C 6 20, 24 30, 48 40 M0 0 C -12 22, -30 34, -50 46 M-30 -12 C -34 -30, -20 -46, -6 -58 M24 -18 C 34 -6, 50 -4, 66 2"></path>
                        <circle cx="56" cy="-36" r="3" fill={p.accent}></circle><circle cx="48" cy="40" r="3" fill={p.accent}></circle><circle cx="-50" cy="46" r="3" fill={p.accent}></circle><circle cx="-6" cy="-58" r="3" fill={p.accent}></circle><circle cx="0" cy="0" r="4" fill={p.accent}></circle>
                      </g>
                      <g display={p.dFront}>
                        <path d="M0 0 C 10 -4, 14 8, 4 14 C -10 22, -24 4, -16 -12 C -6 -32, 26 -30, 34 -6 C 44 22, 14 46, -14 42 C -48 36, -58 -2, -40 -30" fill="none" stroke={p.accent} strokeWidth="6" opacity="0.6" strokeLinecap="round"></path>
                      </g>
                      <g display={p.dExp}>
                        <path d="M-70 -20 Q 0 -34 70 -20 M-70 10 Q 0 -4 70 10 M-70 38 Q 0 26 70 38" fill="none" stroke={p.dark} strokeWidth="1.6" opacity="0.55"></path>
                        <path d="M-40 30 C -20 10, 0 26, 18 6 S 40 -10, 52 -30" fill="none" stroke={p.accent} strokeWidth="3" strokeDasharray="4 5"></path>
                      </g>
                    </g>
                    <circle cx="26" cy="22" r="66" fill="#0b0f08" opacity="0.3"></circle>
                  </g>
                  <path d="M -44 -38 A 58 58 0 0 1 26 -54" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round"></path>
                  <g display={p.dArch}><path d="M -94 0 A 94 22 0 0 0 94 0" transform="rotate(-16)" fill="none" stroke={p.accent} strokeWidth="7" opacity="0.95"></path></g>
                  <g display={p.dExp}><path d="M20 -58 V -86" stroke="#ece6d6" strokeWidth="2.4"></path><path d="M20 -86 L 40 -79 L 20 -72 Z" fill="#c95851" stroke="#0b0f08" strokeWidth="1.2"></path></g>
                  {p.canopy.map((cn, cn_i) => (<Fragment key={cn_i}>
                    <circle cx={cn.x} cy={cn.y} r={cn.r} fill={cn.f} stroke="#0b0f08" strokeWidth="1.5"></circle>
                  </Fragment>))}
                  {p.sprouts.map((sp, sp_i) => (<Fragment key={sp_i}>
                    <g transform={sp.tf}>
                      <g className="pl-sprout">
                        <path d="M0 0 C 1 -6, -1 -11, 0 -16" fill="none" stroke="#0b0f08" strokeWidth="2.4" strokeLinecap="round"></path>
                        <path d="M0 -10 C -7 -15, -12 -11, -13 -6 C -6 -4, -2 -7, 0 -10 Z" fill="#b4cfb6" stroke="#0b0f08" strokeWidth="1.3"></path>
                        <path d="M0 -13 C 6 -19, 12 -17, 13 -12 C 8 -9, 3 -10, 0 -13 Z" fill="#8fb356" stroke="#0b0f08" strokeWidth="1.3"></path>
                      </g>
                    </g>
                  </Fragment>))}
                  <g display={p.dBloom}>
                    <g transform="translate(-34 -50)"><circle r="7" fill="#c95851" stroke="#0b0f08" strokeWidth="1.4"></circle><circle r="2.6" fill="#f3c766"></circle></g>
                    <g transform="translate(30 -52)"><circle r="6" fill="#f3c766" stroke="#0b0f08" strokeWidth="1.4"></circle><circle r="2.2" fill="#c95851"></circle></g>
                    <g transform="translate(52 -24)"><circle r="5" fill="#c95851" stroke="#0b0f08" strokeWidth="1.4"></circle></g>
                  </g>
                  <g className={p.moonCls}>
                    {p.moons.map((m, m_i) => (<Fragment key={m_i}>
                      <circle cx={m.x} cy={m.y} r={m.r} fill={m.f} stroke={m.s} strokeWidth="1.8"></circle>
                    </Fragment>))}
                  </g>
                  <g display={p.dHere}><circle r="72" fill="none" stroke="#e58a80" strokeWidth="2.5" className="pl-pulse"></circle></g>
                  <g display={p.dSeal} transform="translate(46 46)">
                    <circle r="15" fill="#1b2315" stroke="#6f7a63" strokeWidth="1.8" strokeDasharray="3 3"></circle>
                    <circle cy="-3" r="3.6" fill="#a3a893"></circle>
                    <path d="M-2 -1 L 2 -1 L 3 7 L -3 7 Z" fill="#a3a893"></path>
                  </g>
                </svg>
              </button>
              <div className="pl-label" style={{left: `${p.lx}px`, top: `${p.ly}px`}}>
                <span className="mono pl-n" style={{color: p.subC}}>{p.n} · {p.sub}</span>
                <span className="disp pl-name" style={{color: p.nameC}}>{p.name}</span>
                <span className="mono pl-st" style={{color: p.stC}}>{p.statusText}</span>
              </div>
            </div>
          </Fragment>))}

          {hasHere && (<>
            <div className="here" style={{left: `${hereX}px`, top: `${hereY}px`}}>
              <span className="tag">You are here · {hereConcept}</span>
              <span className="stem"></span>
            </div>
          </>)}
        </div>

        {/* universe UI */}
        <div className="uv-ui uv-title">
          <p className="mono" style={{margin: `0 0 4px`, fontSize: `11.5px`, color: `#e2a93b`, letterSpacing: `.06em`}}>PLATE I · 8 SYSTEMS · 48 CONCEPTS</p>
          <p className="disp" style={{margin: `0`, fontSize: `28px`, lineHeight: `1.1`, color: `#ece6d6`}}>Chart of Known Python</p>
          <p style={{margin: `4px 0 0`, fontSize: `13px`, color: `#a3a893`}}>{uvSummary}</p>
        </div>

        <div className="uv-ui uv-legend" aria-label="Legend">
          <span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="#e2a93b"></circle></svg>Concept complete</span>
          <span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="#e58a80"></circle></svg>Current concept</span>
          <span><svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true"><path d="M1 7 H 21" stroke="#e2a93b" strokeWidth="2.5" strokeDasharray="2 5" strokeLinecap="round"></path></svg>Open route</span>
          <span><svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true"><path d="M1 7 H 21" stroke="#b4cfb6" strokeWidth="2" strokeDasharray="5 4"></path></svg>Charted</span>
          <span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="none" stroke="#8e9584" strokeWidth="1.5" strokeDasharray="2 2"></circle></svg>Sealed</span>
        </div>

        <div className="uv-ui uv-zoom" style={{right: `${zoomRight}px`}}>
          <button aria-label="Zoom out" onClick={zoomOut}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8 H 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg></button>
          <span className="pct mono">{zoomPct}</span>
          <button aria-label="Zoom in" onClick={zoomIn}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8 H 13 M8 3 V 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path></svg></button>
          <button aria-label="Re-centre the chart on your position" onClick={zoomReset}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.8"></circle><circle cx="8" cy="8" r="1.6" fill="currentColor"></circle><path d="M8 0.5 V 3 M8 13 V 15.5 M0.5 8 H 3 M13 8 H 15.5" stroke="currentColor" strokeWidth="1.8"></path></svg></button>
        </div>

        <div className="uv-ui uv-hint mono">drag to drift · scroll to zoom · click a world</div>

        {showPrev && (<>
          <div className="uv-ui uv-prev" style={{left: `${prev.x}px`, top: `${prev.y}px`}}>
            <p className="mono" style={{margin: `0 0 2px`, fontSize: `11.5px`, color: prev.subC}}>{prev.n} · {prev.sub}</p>
            <p className="disp" style={{margin: `0 0 6px`, fontSize: `21px`, color: `#ece6d6`}}>{prev.name}</p>
            <p style={{margin: `0 0 10px`, fontSize: `13px`, color: `#cfd2c2`, lineHeight: `1.45`}}>{prev.blurb}</p>
            <div style={{display: `flex`, gap: `5px`, marginBottom: `10px`}}>
              {prev.dots.map((d, d_i) => (<Fragment key={d_i}>
                <span style={{flex: `1`, height: `6px`, borderRadius: `3px`, background: d.c}}></span>
              </Fragment>))}
            </div>
            <p style={{margin: `0`, fontSize: `12.5px`, color: `#e2a93b`}}>{prev.next}</p>
          </div>
        </>)}

        {hasPanel && (<>
          <aside className="uv-ui uv-panel" aria-label="Specimen sheet">
            <div style={{display: `flex`, alignItems: `flex-start`, gap: `12px`, padding: `18px 18px 14px`, borderBottom: `1px solid #33402a`}}>
              <svg width="54" height="54" viewBox="-30 -30 60 60" aria-hidden="true" style={{flex: `none`}}><circle r="26" fill={pan.body} stroke="#0b0f08" strokeWidth="2"></circle><circle cx="8" cy="8" r="27" fill="#0b0f08" opacity="0.3"></circle><circle r="26" fill="none" stroke={pan.light} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8"></circle></svg>
              <div style={{flex: `1`, minWidth: `0`}}>
                <p className="mono" style={{margin: `0`, fontSize: `11.5px`, color: `#e2a93b`}}>SPECIMEN SHEET · SYSTEM {pan.n}</p>
                <p className="disp" style={{margin: `2px 0 2px`, fontSize: `25px`, lineHeight: `1.1`}}>{pan.name}</p>
                <p style={{margin: `0`, fontSize: `12.5px`, color: `#a3a893`}}>{pan.sub} · {pan.statusText}</p>
              </div>
              <button className="xbtn" aria-label="Close specimen sheet" onClick={closePanel}><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"></path></svg></button>
            </div>
            <div className="scroll-d" style={{flex: `1`, padding: `14px 14px 10px`}}>
              <p style={{margin: `0 4px 14px`, fontSize: `13.5px`, color: `#cfd2c2`, lineHeight: `1.5`}}>{pan.blurb}</p>
              {pan.concepts.map((c, c_i) => (<Fragment key={c_i}>
                <button type="button" className={`crow ${c.cls}`} disabled={!c.onOpen} onClick={c.onOpen} aria-label={c.aria}>
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" style={{flex: `none`}}>
                    <g display={c.dDone}><circle cx="10" cy="10" r="8" fill="#e2a93b"></circle><path d="M6 10.5 L 9 13 L 14 7.5" fill="none" stroke="#12180e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></g>
                    <g display={c.dCur}><circle cx="10" cy="10" r="8" fill="none" stroke="#e58a80" strokeWidth="2"></circle><circle cx="10" cy="10" r="4" fill="#e58a80"></circle></g>
                    <g display={c.dTodo}><circle cx="10" cy="10" r="7.5" fill="none" stroke="#6f7a63" strokeWidth="1.6"></circle></g>
                    <g display={c.dLock}><rect x="5" y="9" width="10" height="7.5" rx="1.5" fill="#46553a"></rect><path d="M7 9 V 7 A 3 3 0 0 1 13 7 V 9" fill="none" stroke="#6f7a63" strokeWidth="1.6"></path></g>
                  </svg>
                  <span className="ct" style={{color: c.tc}}>{c.name}</span>
                  <span className="mono" style={{fontSize: `11.5px`, color: c.sc}}>{c.state}</span>
                </button>
              </Fragment>))}
              {pan.locked && (<>
                <p style={{margin: `14px 4px 0`, padding: `12px 14px`, border: `1px dashed #5b6650`, borderRadius: `10px`, fontSize: `13px`, color: `#cfd2c2`, lineHeight: `1.5`}}>{pan.lockNote}</p>
              </>)}
            </div>
            <div style={{display: `flex`, gap: `8px`, padding: `12px 14px 14px`, borderTop: `1px solid #33402a`}}>
              {pan.canLearn && (<>
                <button className="btn-d" style={{flex: `1`}} onClick={pan.onLearn}>{pan.cta}</button>
              </>)}
              <button className="btn-d ghost" onClick={openMissions}>Missions</button>
            </div>
          </aside>
        </>)}
    </div>
  );
}
