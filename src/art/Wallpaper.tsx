// Ported verbatim from the prototype's wallpaper <svg> (Main.dc.html). Do not restyle.
import { Fragment } from 'react';
import { FERNS, FROND, WALL_STARS, WALL_TICKS } from './decoration';

const frondLeaves = FROND, wallTicks = WALL_TICKS, wallStars = WALL_STARS, ferns = FERNS;

export function Wallpaper() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{position: `absolute`, inset: `0`, width: `100%`, height: `100%`, display: `block`, pointerEvents: `none`}}>
      <defs>
        <pattern id="wpDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#242820" opacity="0.13"></circle></pattern>
        <clipPath id="wpPlanet"><circle cx="1010" cy="420" r="228"></circle></clipPath>
        <filter id="wpGrain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter>
        <symbol id="frond" viewBox="-30 -130 60 132">
          <path d="M0 0 C 2 -40, -3 -86, 5 -126" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
          {frondLeaves.map((fl, fl_i) => (<Fragment key={fl_i}>
            <path d={fl.d} fill="currentColor"></path>
          </Fragment>))}
        </symbol>
      </defs>
      <rect width="1440" height="900" fill="#efe8d6"></rect>
      <rect width="1440" height="900" fill="url(#wpDots)"></rect>
      {/* chart rings */}
      <g fill="none" stroke="#242820">
        <circle cx="1010" cy="420" r="300" strokeOpacity="0.16" strokeWidth="1.2"></circle>
        <circle cx="1010" cy="420" r="378" strokeOpacity="0.12" strokeDasharray="2 6"></circle>
        <circle cx="1010" cy="420" r="470" strokeOpacity="0.18" strokeWidth="1.2"></circle>
        <circle cx="1010" cy="420" r="600" strokeOpacity="0.1" strokeDasharray="10 8"></circle>
        {wallTicks.map((t, t_i) => (<Fragment key={t_i}>
          <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeOpacity={t.o} strokeWidth="1.2"></line>
        </Fragment>))}
        <path d="M1010 420 L 1460 120" strokeOpacity="0.1"></path>
        <path d="M1010 420 L 560 160" strokeOpacity="0.1"></path>
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#242820" fillOpacity="0.55" letterSpacing="1">
        <text x="1318" y="128">R.A. 04h 12m</text>
        <text x="548" y="148">DECL. +21° 06′</text>
        <text x="1260" y="836">PLATE IV — THE VIRIDIS EXPANSE</text>
        <text x="1260" y="852" fillOpacity="0.4">as observed from the vessel Hortensia</text>
      </g>
      {/* small moons */}
      <circle cx="1352" cy="214" r="22" fill="#eae4d5" stroke="#242820" strokeWidth="2"></circle>
      <circle cx="1345" cy="208" r="4" fill="#242820" opacity="0.12"></circle>
      <circle cx="1360" cy="222" r="6" fill="#242820" opacity="0.1"></circle>
      <circle cx="676" cy="250" r="9" fill="#c95851" stroke="#242820" strokeWidth="2"></circle>
      <path d="M676 250 m-300 -70" fill="none"></path>
      {/* stars */}
      {wallStars.map((s, s_i) => (<Fragment key={s_i}>
        <g transform={s.tf}><path d="M0 -8 L1.7 -1.7 L8 0 L1.7 1.7 L0 8 L-1.7 1.7 L-8 0 L-1.7 -1.7 Z" fill={s.c} className={s.cls}></path></g>
      </Fragment>))}
      {/* constellation */}
      <g fill="none" stroke="#242820" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="3 4">
        <path d="M430 120 L 486 168 L 560 150 L 610 214 L 700 196"></path>
      </g>
      <g fill="#b47e00" stroke="#242820" strokeWidth="1.4">
        <circle cx="430" cy="120" r="4"></circle><circle cx="486" cy="168" r="5"></circle><circle cx="560" cy="150" r="3.5"></circle><circle cx="610" cy="214" r="4.5"></circle><circle cx="700" cy="196" r="3.5"></circle>
      </g>
      <text x="430" y="100" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#242820" fillOpacity="0.6" letterSpacing="1">α HEDERA MINOR</text>
      {/* ringed planet */}
      <path d="M -330 0 A 330 62 0 0 1 330 0" transform="translate(1010 440) rotate(-12)" fill="none" stroke="#242820" strokeWidth="13"></path>
      <path d="M -330 0 A 330 62 0 0 1 330 0" transform="translate(1010 440) rotate(-12)" fill="none" stroke="#b47e00" strokeWidth="9"></path>
      <circle cx="1010" cy="420" r="228" fill="#b4cfb6" stroke="#242820" strokeWidth="2"></circle>
      <g clipPath="url(#wpPlanet)">
        <path d="M760 330 C 880 300, 980 350, 1100 320 S 1240 300, 1260 310 L 1260 360 C 1160 380, 1060 360, 960 390 S 800 380, 760 380 Z" fill="#9dbfa0"></path>
        <path d="M760 450 C 860 430, 1000 470, 1120 440 S 1240 430, 1260 440 L 1260 470 C 1150 490, 1040 470, 930 500 S 800 490, 760 490 Z" fill="#c9dcc9"></path>
        <path d="M760 540 C 900 520, 1000 560, 1260 520 L 1260 560 C 1100 590, 960 570, 760 590 Z" fill="#9dbfa0"></path>
        <circle cx="1090" cy="470" r="232" fill="#345a04" opacity="0.2"></circle>
        <ellipse cx="930" cy="360" rx="34" ry="18" fill="#3e6510" opacity="0.25"></ellipse>
      </g>
      <path d="M -330 0 A 330 62 0 0 0 330 0" transform="translate(1010 440) rotate(-12)" fill="none" stroke="#242820" strokeWidth="13"></path>
      <path d="M -330 0 A 330 62 0 0 0 330 0" transform="translate(1010 440) rotate(-12)" fill="none" stroke="#b47e00" strokeWidth="9"></path>
      <path d="M -300 10 A 300 50 0 0 0 300 10" transform="translate(1010 440) rotate(-12)" fill="none" stroke="#f3c766" strokeWidth="1.5" opacity="0.7"></path>
      {/* hills */}
      <path d="M0 640 C 200 590, 380 606, 560 640 S 900 700, 1100 652 S 1340 600, 1440 622 L1440 900 L0 900 Z" fill="#ddd3ba" stroke="#242820" strokeWidth="1.5"></path>
      <path d="M0 724 C 180 668, 340 690, 520 728 S 860 762, 1060 722 S 1320 684, 1440 702 V900 H0 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.5"></path>
      {/* observatory greenhouse */}
      <g transform="translate(250 668)">
        <path d="M-6 -46 L 52 -96" stroke="#242820" strokeWidth="5" strokeLinecap="round"></path>
        <path d="M-6 -46 L 52 -96" stroke="#b47e00" strokeWidth="2.5" strokeLinecap="round"></path>
        <path d="M-46 4 L -46 -22 A 46 40 0 0 1 46 -22 L 46 4 Z" fill="#eae4d5" stroke="#242820" strokeWidth="2"></path>
        <path d="M-30 -48 L -30 4 M0 -62 L 0 4 M30 -48 L 30 4 M-46 -22 L 46 -22" stroke="#242820" strokeWidth="1.3" opacity="0.6"></path>
        <rect x="-56" y="2" width="112" height="16" rx="2" fill="#c95851" stroke="#242820" strokeWidth="2"></rect>
        <rect x="-10" y="-8" width="20" height="12" fill="#f3c766" stroke="#242820" strokeWidth="1.5"></rect>
      </g>
      <g fill="#c95851" stroke="#242820" strokeWidth="1.2">
        <circle cx="420" cy="712" r="4"></circle><circle cx="446" cy="720" r="3"></circle><circle cx="1180" cy="700" r="4"></circle><circle cx="1210" cy="694" r="3"></circle>
      </g>
      <path d="M0 806 C 220 764, 420 792, 640 822 S 1000 846, 1200 808 S 1380 782, 1440 792 V900 H0 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.5"></path>
      {ferns.map((f, f_i) => (<Fragment key={f_i}>
        <use href="#frond" x={f.x} y={f.y} width={f.w} height={f.h} transform={f.tf} style={{color: f.c}}></use>
      </Fragment>))}
      <rect width="1440" height="900" filter="url(#wpGrain)" opacity="0.07" style={{mixBlendMode: `multiply`}}></rect>
    </svg>
  );
}
