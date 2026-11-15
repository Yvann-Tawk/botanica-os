// Orbis artwork, ported 1:1 from the approved design (terraform-os-orbis-source, Main.dc.html).
// Paths, colours and star seeds are copied verbatim; do not redraw. Each `display` toggle in the design
// became a switch on the glyph or world id.

import type { WorldId } from './worlds';

function rng(seed: number) {
  return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
type Star = { x: number; y: number; r: string; o: string; c: string; cls: string };
export function plateStars(seed: number): Star[] {
  const r = rng(seed), a: Star[] = [];
  for (let i = 0; i < 16; i++) a.push({ x: Math.round(r() * 640), y: Math.round(r() * 244), r: (0.6 + r() * 1.4).toFixed(2), o: (0.3 + r() * 0.6).toFixed(2), c: r() > 0.84 ? '#e2a93b' : '#ece6d6', cls: r() > 0.78 ? 'twk' : '' });
  return a;
}
const WALLSTARS: Star[] = (() => { const r = rng(7), a: Star[] = []; for (let i = 0; i < 48; i++) { const g = r(); a.push({ x: Math.round(r() * 1440), y: Math.round(r() * 660), r: (0.5 + r() * 1.7).toFixed(2), o: (0.3 + r() * 0.6).toFixed(2), c: g > 0.9 ? '#D6AC68' : (g > 0.78 ? '#91DCE8' : '#f4ede0'), cls: g > 0.8 ? 'twk' : '' }); } return a; })();

export function Starfield() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}>
      <defs>
        <pattern id="wpDots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#9fb0e0" opacity="0.06"></circle></pattern>
        <radialGradient id="wpNeb" cx="0.72" cy="0.18" r="0.95"><stop offset="0" stopColor="#23345f"></stop><stop offset="0.5" stopColor="#121c3c"></stop><stop offset="1" stopColor="#0a1024"></stop></radialGradient>
        <clipPath id="wpPlanet"><circle cx="1050" cy="300" r="150"></circle></clipPath>
        <filter id="wpGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter>
      </defs>
      <rect width="1440" height="900" fill="#0a1024"></rect>
      <rect width="1440" height="900" fill="url(#wpNeb)"></rect>
      <g>{WALLSTARS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} className={s.cls}></circle>)}</g>
      <rect width="1440" height="900" fill="url(#wpDots)"></rect>
      <g fill="none" stroke="#49598c">
        <circle cx="1050" cy="300" r="210" strokeOpacity="0.5"></circle>
        <circle cx="1050" cy="300" r="300" strokeOpacity="0.35" strokeDasharray="2 6"></circle>
        <circle cx="1050" cy="300" r="420" strokeOpacity="0.3" strokeDasharray="10 8"></circle>
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#91DCE8" fillOpacity="0.6" letterSpacing="1">
        <text x="1300" y="150">R.A. 04ʰ 12ᵐ</text>
        <text x="1230" y="840">PLATE I — THE TERRAFORM FIELD</text>
      </g>
      {/* constellation */}
      <g fill="none" stroke="#91DCE8" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="3 4"><path d="M250 150 L310 206 L390 182 L452 250 L540 220"></path></g>
      <g fill="#D6AC68" stroke="#0a1024" strokeWidth="1.4"><circle cx="250" cy="150" r="4"></circle><circle cx="310" cy="206" r="5"></circle><circle cx="390" cy="182" r="3.5"></circle><circle cx="452" cy="250" r="4.5"></circle><circle cx="540" cy="220" r="3.5"></circle></g>
      <text x="250" y="130" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#91DCE8" fillOpacity="0.7" letterSpacing="1">α TERRA MINOR</text>
      {/* ringed planet */}
      <path d="M -210 0 A 210 42 0 0 1 210 0" transform="translate(1050 316) rotate(-12)" fill="none" stroke="#242820" strokeWidth="11"></path>
      <path d="M -210 0 A 210 42 0 0 1 210 0" transform="translate(1050 316) rotate(-12)" fill="none" stroke="#b47e00" strokeWidth="7"></path>
      <circle cx="1050" cy="300" r="150" fill="#3c6675" stroke="#0a1024" strokeWidth="2"></circle>
      <g clipPath="url(#wpPlanet)">
        <path d="M900 250 C 980 234, 1040 266, 1120 248 S 1200 240, 1200 248 L1200 280 C 1120 296, 1040 282, 960 300 S 900 296 900 290 Z" fill="#2f4a12"></path>
        <path d="M900 330 C 1000 314, 1080 344, 1200 318 L1200 350 C 1080 372, 980 352, 900 366 Z" fill="#2f4a12"></path>
        <circle cx="1095" cy="332" r="152" fill="#0a1024" opacity="0.4"></circle>
        <path d="M-210 0 A 210 42 0 0 0 210 0" transform="translate(1050 316) rotate(-12)" fill="none" stroke="#91DCE8" strokeWidth="1.5" opacity="0.5"></path>
      </g>
      <path d="M -210 0 A 210 42 0 0 0 210 0" transform="translate(1050 316) rotate(-12)" fill="none" stroke="#242820" strokeWidth="11"></path>
      <path d="M -210 0 A 210 42 0 0 0 210 0" transform="translate(1050 316) rotate(-12)" fill="none" stroke="#b47e00" strokeWidth="7"></path>
      {/* small moon */}
      <circle cx="1320" cy="150" r="20" fill="#f4ede0" stroke="#0a1024" strokeWidth="1.5"></circle>
      <circle cx="1314" cy="145" r="4" fill="#0a1024" opacity="0.1"></circle>
      <circle cx="1328" cy="158" r="5" fill="#0a1024" opacity="0.08"></circle>
      {/* horizon */}
      <path d="M0 640 C 200 590, 380 606, 560 640 S 900 700, 1100 652 S 1340 600, 1440 622 L1440 900 L0 900 Z" fill="#172142" stroke="#2a3a66" strokeWidth="1.2"></path>
      <path d="M0 724 C 180 668, 340 690, 520 728 S 860 762, 1060 722 S 1320 684, 1440 702 V900 H0 Z" fill="#111a38" stroke="#243356" strokeWidth="1.2"></path>
      {/* observatory greenhouse */}
      <g transform="translate(250 668)">
        <path d="M-6 -46 L 52 -96" stroke="#242820" strokeWidth="5" strokeLinecap="round"></path>
        <path d="M-6 -46 L 52 -96" stroke="#b47e00" strokeWidth="2.5" strokeLinecap="round"></path>
        <path d="M-46 4 L -46 -22 A 46 40 0 0 1 46 -22 L 46 4 Z" fill="#eae4d5" stroke="#242820" strokeWidth="2"></path>
        <path d="M-30 -48 L -30 4 M0 -62 L 0 4 M30 -48 L 30 4 M-46 -22 L 46 -22" stroke="#242820" strokeWidth="1.3" opacity="0.6"></path>
        <rect x="-56" y="2" width="112" height="16" rx="2" fill="#c95851" stroke="#242820" strokeWidth="2"></rect>
        <rect x="-10" y="-8" width="20" height="12" fill="#f3c766" stroke="#242820" strokeWidth="1.5"></rect>
      </g>
      <path d="M0 806 C 220 764, 420 792, 640 822 S 1000 846, 1200 808 S 1380 782, 1440 792 V900 H0 Z" fill="#0b1230" stroke="#1c2b50" strokeWidth="1.2"></path>
      <g stroke="#2a3f63" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M120 806 C 118 786, 110 778, 120 762 M120 790 C 108 788, 104 778, 108 772 M120 790 C 132 786, 136 778, 132 770"></path>
        <path d="M1300 798 C 1298 778, 1290 770, 1300 754 M1300 782 C 1288 780, 1284 770, 1288 764 M1300 782 C 1312 778, 1316 770, 1312 762"></path>
      </g>
      <rect width="1440" height="900" filter="url(#wpGrain)" opacity="0.07" style={{ mixBlendMode: 'multiply' }}></rect>
    </svg>
  );
}

export type HubGlyph = 'orbis' | 'botanica' | 'journal' | 'settings';

/** Desktop icons (big) and dock icons (the design's slightly simpler dock variants). */
export function HubIcon({ k, dock = false }: { k: HubGlyph; dock?: boolean }) {
  const size = dock ? 44 : 58;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" style={{ overflow: 'visible' }}>
      {k === 'orbis' && <g>
        <circle cx="32" cy="32" r="24" fill="#345a04" stroke="#242820" strokeWidth="2"></circle>
        {!dock && <circle cx="32" cy="32" r="24" fill="none" stroke="#b4cfb6" strokeWidth="1.4" strokeDasharray="2 3" transform="scale(.78)" style={{ transformOrigin: '32px 32px' }}></circle>}
        <ellipse cx="32" cy="32" rx="26" ry="9" fill="none" stroke="#b47e00" strokeWidth="2.4" transform="rotate(-24 32 32)"></ellipse>
        <path d="M32 18 L35 27.5 L45 27.5 L37 33.5 L40 43 L32 37 L24 43 L27 33.5 L19 27.5 L29 27.5 Z" fill="#f3c766" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
        <circle cx="54" cy="20" r="4" fill="#c95851" stroke="#242820" strokeWidth="2"></circle>
      </g>}
      {k === 'botanica' && <g>
        <ellipse cx="32" cy="57" rx="13" ry="3.6" fill="#345a04" stroke="#242820" strokeWidth="2"></ellipse>
        <path d="M32 43 V 55" stroke="#242820" strokeWidth="2.6"></path>
        {!dock && <path d="M22 47 Q 32 41 42 47" fill="none" stroke="#b47e00" strokeWidth="3" strokeLinecap="round"></path>}
        <ellipse cx="32" cy="28" rx="27" ry="10" fill="none" stroke="#242820" strokeWidth="1.8" strokeDasharray="3 3"></ellipse>
        <circle cx="32" cy="28" r="14" fill="#b4cfb6" stroke="#242820" strokeWidth="2"></circle>
        <path d="M19 25 Q 32 20 45 25" fill="none" stroke="#3e6510" strokeWidth="2.6"></path>
        <path d="M11 31 Q 32 41 53 31" fill="none" stroke="#242820" strokeWidth="5.5" strokeLinecap="round"></path>
        <path d="M11 31 Q 32 41 53 31" fill="none" stroke="#b47e00" strokeWidth="3" strokeLinecap="round"></path>
        <circle cx="57" cy="24" r="4.5" fill="#c95851" stroke="#242820" strokeWidth="2"></circle>
        <path d="M32 10 C 28 4, 23 4, 20.5 6 C 23.5 10.5, 28 11.5, 32 10 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
        {!dock && <path d="M32 14 V 9" stroke="#242820" strokeWidth="1.8"></path>}
      </g>}
      {k === 'journal' && <g>
        <path d="M12 11 H 48 A 5 5 0 0 1 53 16 V 54 A 2 2 0 0 1 51 56 H 12 Z" fill="#b47e00" stroke="#242820" strokeWidth="2" strokeLinejoin="round"></path>
        <rect x="12" y="11" width="7" height="45" fill="#8a6000" stroke="#242820" strokeWidth="2"></rect>
        <rect x="26" y="18" width="21" height="9" rx="1.5" fill="#f6f2e8" stroke="#242820" strokeWidth="1.5"></rect>
        <path d="M26 34 H47 M26 40 H47 M26 46 H40" stroke="#f6f2e8" strokeWidth="1.6" strokeLinecap="round" opacity="0.8"></path>
        <path d="M42 54 V 62 L 45 59.5 L 48 62 V 54" fill="#c95851" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
      </g>}
      {k === 'settings' && <g>
        <circle cx="32" cy="34" r="20" fill="#eae4d5" stroke="#242820" strokeWidth="2"></circle>
        <g fill="#345a04" stroke="#242820" strokeWidth="1.6"><path d="M32 8 L36 14 L28 14 Z"></path><path d="M32 60 L36 54 L28 54 Z"></path><path d="M6 34 L12 38 L12 30 Z"></path><path d="M58 34 L52 38 L52 30 Z"></path><path d="M14 16 L21 18 L16 23 Z"></path><path d="M50 52 L43 50 L48 45 Z"></path><path d="M50 16 L43 18 L48 23 Z"></path><path d="M14 52 L21 50 L16 45 Z"></path></g>
        <circle cx="32" cy="34" r="9" fill="#b4cfb6" stroke="#242820" strokeWidth="2"></circle>
        <path d="M32 34 C 28 32, 27 27, 32 24 C 37 27, 36 32, 32 34 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.2"></path>
      </g>}
    </svg>
  );
}

/** Small catalog planet (Orbis Explorer list rows). */
export function WorldIcon({ id, glow }: { id: WorldId; glow: string }) {
  return (
    <svg className="wi" viewBox="-50 -50 100 100" aria-hidden="true" style={{ overflow: 'visible' }}>
      <circle r="46" fill={glow} opacity="0.18"></circle>
      {id === 'botanica' && <g><circle r="30" fill="#3e6510" stroke="#0e2a05" strokeWidth="2"></circle><circle cx="10" cy="9" r="31" fill="#0b1f02" opacity="0.26"></circle><path d="M-26 4 C -12 -2, 4 6, 20 0 S 28 -2 28 2 L28 18 C 12 24, 0 16, -14 22 S -26 16 -26 10 Z" fill="#345a04"></path><circle cx="-6" cy="-14" r="4" fill="#c95851"></circle><ellipse rx="40" ry="12" fill="none" stroke="#b4cfb6" strokeWidth="1.5" strokeOpacity="0.6" transform="rotate(-18)"></ellipse></g>}
      {id === 'lithic' && <g><circle r="28" fill="#6b5a7a" stroke="#241f2e" strokeWidth="2"></circle><circle cx="9" cy="8" r="29" fill="#1c1726" opacity="0.3"></circle><g stroke="#241f2e" strokeWidth="1.4" strokeLinejoin="round"><path d="M-6 -30 L4 -36 L10 -20 L0 -12 Z" fill="#b47e00"></path><path d="M-18 -14 L-8 -22 L-2 -4 L-14 2 Z" fill="#8a6000"></path><path d="M8 -16 L18 -20 L22 -2 L10 0 Z" fill="#e2a93b"></path></g></g>}
      {id === 'aether' && <g><circle r="28" fill="#7fa6b8" stroke="#2b3f4a" strokeWidth="2"></circle><circle cx="9" cy="8" r="29" fill="#20323b" opacity="0.26"></circle><path d="M-24 6 C -18 -4, -2 -4, 4 2 C 12 -2, 22 0, 24 8 C 18 16, -20 16, -24 6 Z" fill="#cfe0d8"></path><path d="M-4 2 L-2 -12 L8 -14 L10 0" fill="#3e6510" stroke="#2b3f4a" strokeWidth="1"></path><ellipse cx="-12" cy="20" rx="10" ry="3" fill="#f6f2e8" opacity="0.6"></ellipse></g>}
      {id === 'ironworks' && <g><circle r="28" fill="#8a7a66" stroke="#241c12" strokeWidth="2"></circle><circle cx="9" cy="8" r="29" fill="#241c12" opacity="0.3"></circle><g className="rot" style={{ transformOrigin: '-4px -2px' }}><g transform="translate(-4 -2)" fill="#b49a68" stroke="#241c12" strokeWidth="1.2"><circle r="12" fill="#8a743f"></circle><circle r="4" fill="#2b2622"></circle><path d="M0 -16 L3 -16 L2.5 -12 L-2.5 -12 L-3 -16 Z M0 16 L3 16 L2.5 12 L-2.5 12 L-3 16 Z M-16 0 L-16 3 L-12 2.5 L-12 -2.5 L-16 -3 Z M16 0 L16 3 L12 2.5 L12 -2.5 L16 -3 Z"></path></g></g></g>}
    </svg>
  );
}

/** The dossier's dark "plate": per-world star field, chart rings and the large woodcut world. */
export function WorldPlate({ id, n, figName }: { id: WorldId; n: number; figName: string }) {
  const stars = plateStars(figName.length * 7 + 5);
  return (
    <svg viewBox="0 0 640 244" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="640" height="244" fill="#12180e"></rect>
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={s.o} className={s.cls}></circle>)}
      <g fill="none" stroke="#33402a" strokeWidth="1"><circle cx="430" cy="122" r="120" strokeDasharray="3 8"></circle><circle cx="430" cy="122" r="170"></circle></g>
      <g transform="translate(430 122)">
        {id === 'botanica' && <g><circle r="74" fill="#3e6510" stroke="#0b1f02" strokeWidth="3"></circle><circle cx="22" cy="20" r="76" fill="#061502" opacity="0.3"></circle><path d="M-64 10 C -30 -6, 10 18, 48 -4 S 72 -8 72 6 L72 44 C 36 60, 0 36, -36 52 S -64 40 -64 28 Z" fill="#345a04"></path><circle cx="-16" cy="-34" r="8" fill="#c95851" stroke="#0b1f02" strokeWidth="1.5"></circle><circle cx="36" cy="38" r="6" fill="#b47e00" stroke="#0b1f02" strokeWidth="1.5"></circle><ellipse rx="104" ry="30" fill="none" stroke="#b4cfb6" strokeWidth="2.5" strokeOpacity="0.6" transform="rotate(-18)"></ellipse></g>}
        {id === 'lithic' && <g><circle r="70" fill="#6b5a7a" stroke="#1c1726" strokeWidth="3"></circle><circle cx="22" cy="20" r="72" fill="#120d1a" opacity="0.32"></circle><g stroke="#1c1726" strokeWidth="2" strokeLinejoin="round"><path d="M-14 -70 L10 -84 L24 -48 L0 -30 Z" fill="#b47e00"></path><path d="M-44 -34 L-20 -52 L-6 -8 L-34 6 Z" fill="#8a6000"></path><path d="M18 -42 L44 -54 L52 -6 L24 -2 Z" fill="#e2a93b"></path></g><path d="M-58 28 L-20 44 L16 28 L54 40" fill="none" stroke="#cfe0d8" strokeWidth="2" opacity="0.5"></path></g>}
        {id === 'aether' && <g><circle r="70" fill="#7fa6b8" stroke="#20323b" strokeWidth="3"></circle><circle cx="22" cy="20" r="72" fill="#16252c" opacity="0.28"></circle><path d="M-60 14 C -44 -8, -8 -8, 6 4 C 26 -4, 52 0, 56 20 C 44 38, -48 38, -60 14 Z" fill="#cfe0d8"></path><path d="M-12 4 L-8 -34 L20 -36 L24 2" fill="#3e6510" stroke="#20323b" strokeWidth="2"></path><path d="M-12 -34 C -12 -46, 20 -46, 20 -36" fill="#4f7a1c"></path><ellipse cx="-30" cy="46" rx="26" ry="6" fill="#f6f2e8" opacity="0.5"></ellipse></g>}
        {id === 'ironworks' && <g><circle r="70" fill="#8a7a66" stroke="#241c12" strokeWidth="3"></circle><circle cx="22" cy="20" r="72" fill="#140f0a" opacity="0.32"></circle><g className="rot" style={{ transformOrigin: '-12px -8px' }}><g transform="translate(-12 -8)" fill="#b49a68" stroke="#140f0a" strokeWidth="2"><circle r="30" fill="#8a743f"></circle><circle r="10" fill="#2b2622"></circle><path d="M0 -38 L6 -38 L5 -30 L-5 -30 L-6 -38 Z M0 38 L6 38 L5 30 L-5 30 L-6 38 Z M-38 0 L-38 6 L-30 5 L-30 -5 L-38 -6 Z M38 0 L38 6 L30 5 L30 -5 L38 -6 Z"></path></g></g><g className="rot-s" style={{ transformOrigin: '34px 26px' }}><g transform="translate(34 26)" fill="#e2a93b" stroke="#140f0a" strokeWidth="1.6"><circle r="18" fill="#b47e00"></circle><circle r="6" fill="#2b2622"></circle></g></g></g>}
      </g>
      <text x="26" y="228" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#8e9584" letterSpacing="2">FIG. {n} — {figName}</text>
    </svg>
  );
}

/** Botanica's disc on the Journal's "continue" card. */
export function BotanicaDisc() {
  return (
    <svg className="cdisc" viewBox="-30 -30 60 60" aria-hidden="true"><circle r="26" fill="#3e6510" stroke="#0e2a05" strokeWidth="2"></circle><circle cx="9" cy="8" r="27" fill="#0b1f02" opacity="0.26"></circle><path d="M-24 4 C -10 -2, 4 6, 18 0 S 26 -2 26 2 L26 16 C 12 20, 0 14, -12 18 S -24 14 -24 10 Z" fill="#345a04"></path><circle cx="-6" cy="-12" r="3" fill="#c95851"></circle><ellipse rx="34" ry="10" fill="none" stroke="#b4cfb6" strokeWidth="1.2" strokeOpacity="0.5" transform="rotate(-18)"></ellipse></svg>
  );
}

/** The launch overlay's portal: Botanica inside a turning dashed orbit. */
export function TransitPortal() {
  return (
    <svg width="150" height="150" viewBox="-70 -70 140 140" aria-hidden="true" style={{ display: 'block', margin: '0 auto 14px' }}>
      <circle r="60" fill="none" stroke="#b47e00" strokeWidth="2" strokeDasharray="4 10" className="rot" style={{ transformOrigin: 'center' }}></circle>
      <circle r="34" fill="#3e6510" stroke="#0e2a05" strokeWidth="2"></circle>
      <circle cx="12" cy="10" r="35" fill="#0b1f02" opacity="0.26"></circle>
      <path d="M-30 4 C -14 -4, 6 8, 24 -2 S 34 -4 34 4 L34 22 C 16 30, 0 18, -16 24 S -30 20 -30 14 Z" fill="#345a04"></path>
      <circle cx="-8" cy="-16" r="4" fill="#c95851"></circle>
      <ellipse rx="46" ry="14" fill="none" stroke="#b4cfb6" strokeWidth="2" strokeOpacity="0.6" transform="rotate(-18)"></ellipse>
    </svg>
  );
}

/** Cygnus, the hub's black-hole companion. spin = accretion-disk class; react = mid-stir (swallows a star). */
export function Cygnus({ spin, react }: { spin: string; react: boolean }) {
  return (
    <svg viewBox="0 0 124 108" width="104" height="92" aria-hidden="true" style={{ overflow: 'visible', display: 'block' }}>
      <ellipse cx="62" cy="99" rx="30" ry="4" fill="#05070e" opacity="0.4"></ellipse>
      <circle cx="62" cy="50" r="42" fill="#D6AC68" opacity="0.16" className="bh-glow"></circle>
      <path d="M18 50 A 44 20 0 0 1 106 50" fill="none" stroke="#bfeaf1" strokeWidth="2.4" strokeLinecap="round" opacity="0.85"></path>
      <g transform="rotate(-16 62 50)">
        <ellipse cx="62" cy="50" rx="50" ry="15" fill="none" stroke="#b86a3a" strokeWidth="10"></ellipse>
        <ellipse cx="62" cy="50" rx="50" ry="15" fill="none" stroke="#f0b35c" strokeWidth="5"></ellipse>
        <g className={spin} style={{ transformOrigin: '62px 50px' }}><ellipse cx="62" cy="50" rx="50" ry="15" fill="none" stroke="#ffe6a6" strokeWidth="2" strokeDasharray="2 10"></ellipse></g>
      </g>
      <circle cx="62" cy="50" r="18" fill="#05060d"></circle>
      <circle cx="62" cy="50" r="18.6" fill="none" stroke="#dff2f6" strokeWidth="1.6"></circle>
      <circle cx="62" cy="50" r="18" fill="#05060d"></circle>
      <path d="M16 56 Q 62 74 108 52" fill="none" stroke="#f0b35c" strokeWidth="6" strokeLinecap="round"></path>
      <g className={spin} style={{ transformOrigin: '62px 50px' }}><path d="M16 56 Q 62 74 108 52" fill="none" stroke="#ffe6a6" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 11"></path></g>
      <path d="M48 34 Q 62 29 76 34" fill="none" stroke="#f6fbfc" strokeWidth="2" strokeLinecap="round"></path>
      {react && <g className="bh-star"><path d="M104 38 L106 44 L112 45 L107 49 L109 55 L104 51 L99 55 L101 49 L96 45 L102 44 Z" fill="#91DCE8"></path></g>}
    </svg>
  );
}
