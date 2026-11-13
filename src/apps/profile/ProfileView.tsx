// Pilot logbook view: markup ported verbatim from the prototype (Main.dc.html, Profile section).
// Values come from ProfileApp; the pilot's name is editable (the prototype's was fixed).
import { Fragment, type ReactNode } from 'react';
import type { ProfileVals } from './model';

export function ProfileView(v: ProfileVals & { initials: string; nameSlot: ReactNode }) {
  const { artCount, artifacts, badgeCount, badges, cBranches, cLabels, cLeaves, cNodes, constAria, constDone, constList, gallery, lvAria, lvName, lvNum, masteredCount, masteredOf, recent, ringDash, ringLeaves, sproutStage, streakAria, streakText, week, xpNext, xpText, initials, nameSlot } = v;
  return (
    <div className="wbody pf scroll" tabIndex={0} role="region" aria-label="Pilot logbook pages">
      <div className="book">
        {/* left page */}
        <div className="page l">
          <div style={{display: `flex`, justifyContent: `space-between`, alignItems: `baseline`, gap: `10px`}}>
            <p className="mono" style={{margin: `0`, fontSize: `11.5px`, color: `#8a6000`, letterSpacing: `.04em`}}>LOGBOOK · VESSEL HORTENSIA</p>
            <p className="mono" style={{margin: `0`, fontSize: `11.5px`, color: `#63685c`}}>Vol. I</p>
          </div>
          <div style={{display: `flex`, alignItems: `center`, gap: `16px`, marginTop: `16px`}}>
            <div style={{width: `74px`, height: `74px`, flex: `none`, borderRadius: `50%`, border: `1.5px solid #242820`, background: `#b4cfb6`, display: `grid`, placeItems: `center`, boxShadow: `inset 0 0 0 5px #f6f2e8, inset 0 0 0 6.5px #242820`}}>
              <span className="disp" style={{fontSize: `26px`, color: `#345a04`}}>{initials}</span>
            </div>
            <div style={{minWidth: `0`}}>
              {nameSlot}
              <p style={{margin: `4px 0 0`, fontSize: `14px`, color: `#3c4036`}}>{lvName} · Level {lvNum}</p>
            </div>
          </div>

          <div style={{display: `flex`, flexWrap: `wrap`, alignItems: `center`, gap: `18px`, marginTop: `22px`}}>
            <svg width="150" height="150" viewBox="-80 -80 160 160" role="img" aria-label={lvAria} style={{flex: `none`}}>
              <circle r="62" fill="none" stroke="#d6cdb5" strokeWidth="10"></circle>
              <circle r="62" fill="none" stroke="#b47e00" strokeWidth="10" strokeLinecap="round" strokeDasharray={ringDash} transform="rotate(-90)"></circle>
              <circle r="74" fill="none" stroke="#242820" strokeWidth="1" strokeDasharray="2 5" opacity="0.5"></circle>
              {ringLeaves.map((lf, lf_i) => (<Fragment key={lf_i}>
                <g transform={lf.tf}><path d="M0 0 C -5 -5, -4 -11, 0 -14 C 4 -11, 5 -5, 0 0 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.2"></path></g>
              </Fragment>))}
              <text y="-4" textAnchor="middle" fontFamily="Young Serif, Georgia, serif" fontSize="38" fill="#242820">{lvNum}</text>
              <text y="18" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#63685c" letterSpacing="1">LEVEL</text>
            </svg>
            <div style={{flex: `1`, minWidth: `160px`}}>
              <p className="disp" style={{margin: `0`, fontSize: `34px`, lineHeight: `1`}}>{xpText} <span style={{fontSize: `18px`}}>XP</span></p>
              <p style={{margin: `6px 0 12px`, fontSize: `13.5px`, color: `#3c4036`}}>{xpNext}</p>
              <p style={{margin: `0 0 6px`, fontSize: `13px`, fontWeight: `700`}}>{streakText}</p>
              <div style={{display: `flex`, gap: `6px`}} aria-label={streakAria}>
                {week.map((d, d_i) => (<Fragment key={d_i}>
                  <div style={{display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `3px`}}>
                    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                      <circle cx="13" cy="13" r="11.5" fill={d.bg} stroke={d.ring} strokeWidth="1.5" strokeDasharray={d.dash}></circle>
                      <g display={d.dOn}><circle cx="13" cy="8.6" r="3" fill="#f3c766"></circle><circle cx="17.4" cy="12" r="3" fill="#f3c766"></circle><circle cx="15.6" cy="17" r="3" fill="#f3c766"></circle><circle cx="10.4" cy="17" r="3" fill="#f3c766"></circle><circle cx="8.6" cy="12" r="3" fill="#f3c766"></circle><circle cx="13" cy="13" r="2.2" fill="#c95851"></circle></g>
                    </svg>
                    <span className="mono" style={{fontSize: `10.5px`, color: `#63685c`}}>{d.l}</span>
                  </div>
                </Fragment>))}
              </div>
            </div>
          </div>

          <p className="pf-h">Recently completed <small>{masteredCount}</small></p>
          <div style={{display: `flex`, flexDirection: `column`, gap: `2px`}}>
            {recent.map((r, r_i) => (<Fragment key={r_i}>
              <div style={{display: `flex`, alignItems: `center`, gap: `10px`, padding: `6px 0`, borderBottom: `1px dashed rgba(36,40,32,.2)`, fontSize: `14px`}}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15 V 7" stroke="#345a04" strokeWidth="1.6"></path><path d="M8 9 C 4 9, 2 6, 2.5 3 C 6 3, 8 5.5, 8 9 Z M8 8 C 11.5 8, 13.5 5.5, 13 2.5 C 10 2.5, 8 4.5, 8 8 Z" fill="#3e6510"></path></svg>
                <span style={{flex: `1`}}>{r.name}</span>
                <span className="mono" style={{fontSize: `11.5px`, color: `#63685c`}}>{r.where} · {r.when}</span>
              </div>
            </Fragment>))}
          </div>

          <p className="pf-h">Field notes on Sprout <small>{sproutStage}</small></p>
          <div className="gal">
            {gallery.map((s, s_i) => (<Fragment key={s_i}>
              <figure>
                <svg viewBox="0 0 124 108" width={s.size} height={s.sizeH} aria-hidden="true" style={{overflow: `visible`, display: `block`}}>
                  <ellipse cx="60" cy="101" rx="42" ry="5" fill="#242820" opacity="0.12"></ellipse>
                  <g className={s.anim}>
                    <g display={s.dEgg}><path d="M14 101 L 18 86 L 26 94 L 34 82 L 42 94 L 50 84 L 56 101 Z" fill="#f6f2e8" stroke="#242820" strokeWidth="2" strokeLinejoin="round"></path></g>
                    <path d="M24 90 C 8 90, 8 70, 28 69 C 48 68, 56 86, 78 84 C 100 82, 102 60, 88 52 C 80 47, 79 41, 83 35" fill="none" stroke="#242820" strokeWidth="21" strokeLinecap="round"></path>
                    <path d="M24 90 C 8 90, 8 70, 28 69 C 48 68, 56 86, 78 84 C 100 82, 102 60, 88 52 C 80 47, 79 41, 83 35" fill="none" stroke={s.bodyC} strokeWidth="16.5" strokeLinecap="round"></path>
                    <path d="M24 90 C 8 90, 8 70, 28 69 C 48 68, 56 86, 78 84 C 100 82, 102 60, 88 52 C 80 47, 79 41, 83 35" fill="none" stroke="#dcae45" strokeWidth="5" strokeLinecap="round" strokeDasharray="2.5 9"></path>
                    <path d="M20 91 C 12 96, 4 94, 2 88 C 9 86, 16 87, 20 91 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
                    <g display={s.dVine} stroke="#242820" strokeWidth="1.4" strokeLinejoin="round">
                      <path d="M46 74 C 42 66, 48 61, 53 61 C 53 67, 50 72, 46 74 Z" fill="#b4cfb6"></path>
                      <path d="M70 92 C 70 100, 76 103, 80 102 C 80 97, 76 93, 70 92 Z" fill="#8fb356"></path>
                      <path d="M100 64 C 108 60, 112 64, 112 68 C 106 70, 102 68, 100 64 Z" fill="#b4cfb6"></path>
                    </g>
                    <g className={s.headCls}>
                      <ellipse cx="85" cy="29" rx="19.5" ry="16.5" fill={s.bodyC} stroke="#242820" strokeWidth="2"></ellipse>
                      <ellipse cx="89" cy="36" rx="11" ry="6.5" fill={s.snoutC}></ellipse>
                      <path d="M84 13 C 84 9, 85 6, 88 4" fill="none" stroke="#242820" strokeWidth="1.6" strokeLinecap="round"></path>
                      <path d="M84 12 C 80 4, 73 2, 67 4 C 70 11, 77 14, 84 12 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
                      <path d="M87 6 C 91 0, 98 -1, 102 2 C 98 8, 92 9, 87 6 Z" fill="#8fb356" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
                      <g display={s.dCrown}><circle cx="88" cy="3" r="5.5" fill="#c95851" stroke="#242820" strokeWidth="1.5"></circle><circle cx="88" cy="3" r="2" fill="#f3c766"></circle></g>
                      <g display={s.dOpen}><circle cx="79" cy="27" r="5.4" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="94" cy="27" r="5.4" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="80" cy="28" r="2.7" fill="#242820"></circle><circle cx="95" cy="28" r="2.7" fill="#242820"></circle><circle cx="81" cy="26.6" r="0.9" fill="#f6f2e8"></circle><circle cx="96" cy="26.6" r="0.9" fill="#f6f2e8"></circle></g>
                      <g display={s.dClosed}><path d="M74 28 Q 79 31.5 84 28 M89 28 Q 94 31.5 99 28" fill="none" stroke="#242820" strokeWidth="2" strokeLinecap="round"></path></g>
                      <g display={s.dHappy}><path d="M74 29 Q 79 22.5 84 29 M89 29 Q 94 22.5 99 29" fill="none" stroke="#242820" strokeWidth="2.2" strokeLinecap="round"></path></g>
                      <g display={s.dWide}><circle cx="79" cy="26" r="6.2" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="94" cy="26" r="6.2" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="79" cy="26" r="1.8" fill="#242820"></circle><circle cx="94" cy="26" r="1.8" fill="#242820"></circle></g>
                      <g display={s.dConf}><circle cx="79" cy="26" r="6" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="80" cy="25" r="2.6" fill="#242820"></circle><path d="M89.5 28 L 99 26" stroke="#242820" strokeWidth="2" strokeLinecap="round"></path><path d="M73 18 L 84 20" stroke="#242820" strokeWidth="1.6" strokeLinecap="round"></path></g>
                      <g display={s.dSmile}><path d="M86 38 Q 90 41 94 38" fill="none" stroke="#242820" strokeWidth="1.7" strokeLinecap="round"></path></g>
                      <g display={s.dMOpen}><path d="M85 37 Q 90 44 95 37 Z" fill="#a8423c" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path></g>
                      <g display={s.dWavy}><path d="M84 39 Q 86 37 88 39 Q 90 41 92 39 Q 94 37 96 39" fill="none" stroke="#242820" strokeWidth="1.6" strokeLinecap="round"></path></g>
                      <g display={s.dBlush}><circle cx="74" cy="35" r="3.4" fill="#c95851" opacity="0.45"></circle><circle cx="100" cy="34" r="3" fill="#c95851" opacity="0.45"></circle></g>
                    </g>
                  </g>
                  <g display={s.dZ}><text x="104" y="16" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700" fill="#345a04">z</text><text x="113" y="5" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700" fill="#345a04">z</text></g>
                  <g display={s.dQ}><text x="104" y="14" fontFamily="Young Serif, Georgia, serif" fontSize="22" fill="#8a6000">?</text></g>
                  <g display={s.dSweat}><path d="M108 14 C 104 20, 104 24, 108 24 C 112 24, 112 20, 108 14 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.4"></path></g>
                  <g display={s.dSpark} fill="#b47e00"><path d="M110 6 L 111.6 10.4 L 116 12 L 111.6 13.6 L 110 18 L 108.4 13.6 L 104 12 L 108.4 10.4 Z"></path><path d="M60 14 L 61.2 17.8 L 65 19 L 61.2 20.2 L 60 24 L 58.8 20.2 L 55 19 L 58.8 17.8 Z"></path></g>
                  <g display={s.dLeaf}><path d="M66 12 C 62 6, 66 2, 71 3 C 71 8, 69 11, 66 12 Z" fill="#8fb356" stroke="#242820" strokeWidth="1.2"></path><path d="M106 18 C 104 12, 108 9, 112 10 C 112 15, 110 17, 106 18 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.2"></path></g>
                </svg>
                <figcaption>{s.cap}<span>{s.note}</span></figcaption>
              </figure>
            </Fragment>))}
          </div>
        </div>

        {/* right page */}
        <div className="page r">
          <p className="pf-h" style={{marginTop: `0`}}>Mastery constellation <small>{masteredOf}</small></p>
          <svg viewBox="-250 -235 500 470" width="100%" role="img" aria-label={constAria} style={{display: `block`, maxWidth: `520px`, margin: `0 auto`}}>
            <circle r="210" fill="none" stroke="#242820" strokeOpacity="0.12" strokeDasharray="2 6"></circle>
            <circle r="120" fill="none" stroke="#242820" strokeOpacity="0.1"></circle>
            {cBranches.map((b, b_i) => (<Fragment key={b_i}>
              <path d={b.d} fill="none" stroke={b.c} strokeWidth={b.w} strokeLinecap="round" strokeDasharray={b.dash}></path>
            </Fragment>))}
            {cLeaves.map((lf, lf_i) => (<Fragment key={lf_i}>
              <g transform={lf.tf}><path d="M0 0 C -5 -5, -4 -12, 0 -15 C 4 -12, 5 -5, 0 0 Z" fill="#3e6510" stroke="#242820" strokeWidth="1"></path></g>
            </Fragment>))}
            {cNodes.map((nd, nd_i) => (<Fragment key={nd_i}>
              <circle cx={nd.x} cy={nd.y} r={nd.r} fill={nd.f} stroke={nd.s} strokeWidth="1.5"></circle>
            </Fragment>))}
            {cLabels.map((lb, lb_i) => (<Fragment key={lb_i}>
              <text x={lb.x} y={lb.y} textAnchor={lb.a} fontFamily="Figtree, sans-serif" fontSize="13" fontWeight="700" fill={lb.c}>{lb.t}</text>
            </Fragment>))}
            <circle r="16" fill="#f3e6c4" stroke="#242820" strokeWidth="1.6"></circle>
            <ellipse cx="0" cy="1" rx="6" ry="8" transform="rotate(-20)" fill="#b47e00" stroke="#242820" strokeWidth="1.2"></ellipse>
          </svg>

          <p className="pf-h">Constellations <small>{constDone}</small></p>
          <div style={{display: `flex`, flexWrap: `wrap`, gap: `8px`}}>
            {constList.map((c, c_i) => (<Fragment key={c_i}>
              <span className="chip" style={{color: c.c, background: c.bg, borderColor: c.b, padding: `4px 11px`, fontSize: `12.5px`}}>{c.t}</span>
            </Fragment>))}
          </div>

          <p className="pf-h">Achievements <small>{badgeCount}</small></p>
          <div className="patches">
            {badges.map((bg, bg_i) => (<Fragment key={bg_i}>
              <div className={`patch ${bg.cls}`}>
                <svg width="62" height="62" viewBox="-32 -32 64 64" aria-hidden="true">
                  <circle r="28" fill={bg.fill} stroke={bg.stroke} strokeWidth="1.8"></circle>
                  <circle r="23" fill="none" stroke={bg.stitch} strokeWidth="1.4" strokeDasharray="2.5 2.5"></circle>
                  <g display={bg.g0}><circle r="8" fill={bg.ink}></circle><path d="M0 -17 V -12 M0 12 V 17 M-17 0 H -12 M12 0 H 17 M-12 -12 L -9 -9 M12 12 L 9 9 M-12 12 L -9 9 M12 -12 L 9 -9" stroke={bg.ink} strokeWidth="2.2" strokeLinecap="round"></path></g>
                  <g display={bg.g1}><path d="M-6 -14 H 14 V 12 H -6 L -13 -1 Z" fill="none" stroke={bg.ink} strokeWidth="2.2" strokeLinejoin="round"></path><circle cx="-5" cy="-1" r="2.4" fill={bg.ink}></circle></g>
                  <g display={bg.g2}><circle cx="-8" cy="4" r="4" fill={bg.ink}></circle><circle cx="2" cy="-4" r="4" fill={bg.ink}></circle><circle cx="11" cy="6" r="4" fill={bg.ink}></circle><path d="M-8 4 L 2 -4 L 11 6" fill="none" stroke={bg.ink} strokeWidth="1.6"></path><path d="M-16 13 H 16" stroke={bg.ink} strokeWidth="2" strokeLinecap="round"></path></g>
                  <g display={bg.g3}><circle cx="-2" cy="-2" r="9" fill="none" stroke={bg.ink} strokeWidth="2.4"></circle><path d="M5 5 L 13 13" stroke={bg.ink} strokeWidth="3" strokeLinecap="round"></path></g>
                  <g display={bg.g4}><path d="M-12 -10 H 12 V 12 H -12 Z" fill="none" stroke={bg.ink} strokeWidth="2.2"></path><path d="M-6 -2 L -1 3 L 7 -6" fill="none" stroke={bg.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></g>
                  <g display={bg.g5}><path d="M-14 6 C -8 -6, 8 6, 14 -6" fill="none" stroke={bg.ink} strokeWidth="2.4" strokeLinecap="round"></path><path d="M-14 -4 C -8 -16, 8 -4, 14 -16" fill="none" stroke={bg.ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.6"></path><path d="M10 10 L 14 6 L 10 2" fill="none" stroke={bg.ink} strokeWidth="2" strokeLinecap="round"></path></g>
                  <g display={bg.g6}><rect x="-13" y="-12" width="7" height="24" fill={bg.ink}></rect><rect x="-3" y="-8" width="7" height="20" fill={bg.ink} opacity="0.7"></rect><rect x="7" y="-14" width="7" height="26" fill={bg.ink} opacity="0.85"></rect></g>
                </svg>
                <b>{bg.name}</b>
                <span>{bg.desc}</span>
              </div>
            </Fragment>))}
          </div>

          <p className="pf-h">Collected artifacts <small>{artCount}</small></p>
          <div className="shelf">
            {artifacts.map((a, a_i) => (<Fragment key={a_i}>
              <div style={{width: `104px`, display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `6px`, textAlign: `center`}}>
                <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" style={{opacity: a.op}}>
                  <g display={a.g0}><g transform="rotate(-6 32 32)"><rect x="8" y="14" width="48" height="36" rx="2" fill="#f6f2e8" stroke="#242820" strokeWidth="2"></rect><rect x="40" y="18" width="12" height="14" fill="#c95851" stroke="#242820" strokeWidth="1.4"></rect><path d="M13 22 H 33 M13 29 H 30 M13 36 H 34" stroke="#3e6510" strokeWidth="2" strokeLinecap="round"></path><circle cx="20" cy="43" r="3" fill="#b47e00"></circle></g></g>
                  <g display={a.g1}><g transform="rotate(8 32 32)"><path d="M18 10 H 48 V 54 H 18 L 10 32 Z" fill="#eae4d5" stroke="#242820" strokeWidth="2"></path><circle cx="19" cy="32" r="3.4" fill="none" stroke="#242820" strokeWidth="1.6"></circle><path d="M26 20 H 42 M26 28 H 42 M26 36 H 38 M26 44 H 40" stroke="#345a04" strokeWidth="2.2" strokeLinecap="round"></path><path d="M10 32 C 4 30, 2 22, 6 18" fill="none" stroke="#b47e00" strokeWidth="1.6"></path></g></g>
                  <g display={a.g2}><circle cx="24" cy="24" r="12" fill="none" stroke={a.ink} strokeWidth="5"></circle><path d="M32 32 L 54 54 M44 44 L 50 38 M50 50 L 56 44" stroke={a.ink} strokeWidth="5" strokeLinecap="round"></path></g>
                  <g display={a.g3}><path d="M32 58 C 30 40, 34 22, 32 6" fill="none" stroke={a.ink} strokeWidth="2.4"></path><path d="M32 18 C 22 16, 16 10, 16 4 C 24 4, 30 10, 32 18 Z M32 28 C 44 26, 50 20, 50 14 C 42 14, 34 20, 32 28 Z M32 40 C 20 38, 14 32, 14 26 C 22 26, 30 32, 32 40 Z" fill={a.ink}></path></g>
                </svg>
                <b style={{fontSize: `12.5px`, lineHeight: `1.25`}}>{a.name}</b>
                <span style={{fontSize: `11.5px`, color: `#63685c`, lineHeight: `1.3`}}>{a.desc}</span>
              </div>
            </Fragment>))}
          </div>
        </div>
      </div>
    </div>
  );
}
