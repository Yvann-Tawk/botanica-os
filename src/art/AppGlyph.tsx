// Enamel-pin app glyphs, ported verbatim from the prototype. `big` = desktop icon art, else the slimmer dock art.
import type { Glyph } from '../content/apps';

export function AppGlyph({ glyph, big }: { glyph: Glyph; big: boolean }) {
  const D = (k: Glyph) => (glyph === k ? 'inline' : 'none');
  const ic = { dU: D('U'), dA: D('A'), dT: D('T'), dM: D('M'), dW: D('W'), dP: D('P') };
  if (big) {
    return (
          <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden="true" style={{overflow: `visible`}}>
            <g display={ic.dU}>
              <ellipse cx="32" cy="57" rx="13" ry="3.6" fill="#345a04" stroke="#242820" strokeWidth="2"></ellipse>
              <path d="M32 43 V 55" stroke="#242820" strokeWidth="2.6"></path>
              <path d="M22 47 Q 32 41 42 47" fill="none" stroke="#b47e00" strokeWidth="3" strokeLinecap="round"></path>
              <ellipse cx="32" cy="28" rx="27" ry="10" fill="none" stroke="#242820" strokeWidth="1.8" strokeDasharray="3 3"></ellipse>
              <circle cx="32" cy="28" r="14" fill="#b4cfb6" stroke="#242820" strokeWidth="2"></circle>
              <path d="M19 25 Q 32 20 45 25" fill="none" stroke="#3e6510" strokeWidth="2.6"></path>
              <path d="M19.5 32 Q 32 37 44.5 32" fill="none" stroke="#3e6510" strokeWidth="2" opacity="0.55"></path>
              <path d="M11 31 Q 32 41 53 31" fill="none" stroke="#242820" strokeWidth="5.5" strokeLinecap="round"></path>
              <path d="M11 31 Q 32 41 53 31" fill="none" stroke="#b47e00" strokeWidth="3" strokeLinecap="round"></path>
              <circle cx="57" cy="24" r="4.5" fill="#c95851" stroke="#242820" strokeWidth="2"></circle>
              <path d="M32 14 V 9" stroke="#242820" strokeWidth="1.8"></path>
              <path d="M32 10 C 28 4, 23 4, 20.5 6 C 23.5 10.5, 28 11.5, 32 10 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
            </g>
            <g display={ic.dA}>
              <path d="M12 11 H 48 A 5 5 0 0 1 53 16 V 54 A 2 2 0 0 1 51 56 H 12 Z" fill="#3e6510" stroke="#242820" strokeWidth="2" strokeLinejoin="round"></path>
              <rect x="12" y="11" width="7" height="45" fill="#345a04" stroke="#242820" strokeWidth="2"></rect>
              <rect x="26" y="17" width="21" height="9" rx="1.5" fill="#eae4d5" stroke="#242820" strokeWidth="1.5"></rect>
              <path d="M30 21.5 H 43" stroke="#242820" strokeWidth="1.3" opacity="0.5"></path>
              <path d="M36 50 C 27 46, 26 36, 34 30 C 42 36, 43 45, 36 50 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
              <path d="M36 50 L 34.5 33" stroke="#3e6510" strokeWidth="1.3"></path>
              <path d="M42 54 V 62 L 45 59.5 L 48 62 V 54" fill="#c95851" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
            </g>
            <g display={ic.dT}>
              <path d="M7 21 A 6 6 0 0 1 13 15 H 51 A 6 6 0 0 1 57 21 V 45 A 6 6 0 0 1 51 51 H 13 A 6 6 0 0 1 7 45 Z" fill="#eae4d5" stroke="#242820" strokeWidth="2"></path>
              <rect x="13" y="20" width="31" height="25" rx="4" fill="#1b2315" stroke="#242820" strokeWidth="2"></rect>
              <path d="M18 28 L 22.5 31.5 L 18 35" fill="none" stroke="#b4cfb6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M25.5 36 H 33" stroke="#e2a93b" strokeWidth="2.2" strokeLinecap="round"></path>
              <circle cx="50.5" cy="26" r="2.6" fill="#c95851" stroke="#242820" strokeWidth="1.4"></circle>
              <circle cx="50.5" cy="35" r="2.6" fill="#b47e00" stroke="#242820" strokeWidth="1.4"></circle>
              <path d="M16 51 V 56 M48 51 V 56" stroke="#242820" strokeWidth="2.6" strokeLinecap="round"></path>
              <path d="M40 15 C 40 10, 42 7, 45 6" fill="none" stroke="#242820" strokeWidth="1.6" strokeLinecap="round"></path>
              <path d="M41 11 C 36 4, 30 5, 28 7 C 31 12, 36 13, 41 11 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
              <path d="M44 7 C 48 2, 54 2, 56 4 C 53 9, 48 9, 44 7 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
            </g>
            <g display={ic.dM}>
              <path d="M27 13 A 5 5 0 0 1 37 13" fill="none" stroke="#242820" strokeWidth="2.6"></path>
              <circle cx="32" cy="35" r="22" fill="#b47e00" stroke="#242820" strokeWidth="2"></circle>
              <circle cx="32" cy="35" r="16.5" fill="#f6f2e8" stroke="#242820" strokeWidth="2"></circle>
              <path d="M32 20.5 V 23.5 M32 46.5 V 49.5 M17.5 35 H 20.5 M43.5 35 H 46.5" stroke="#242820" strokeWidth="1.6"></path>
              <path d="M32 35 L 38.5 23.5 L 34.6 36.6 Z" fill="#c95851" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
              <path d="M32 35 L 25.5 46.5 L 29.4 33.4 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
              <circle cx="32" cy="35" r="2" fill="#242820"></circle>
              <path d="M51 4 V 18" stroke="#242820" strokeWidth="2"></path>
              <path d="M51 5 L 60 8 L 51 11 Z" fill="#c95851" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
            </g>
            <g display={ic.dW}>
              <rect x="9" y="50" width="46" height="7" rx="2" fill="#b47e00" stroke="#242820" strokeWidth="2"></rect>
              <path d="M15 50 V 29 A 17 17 0 0 1 49 29 V 50" fill="#cfe0d0" stroke="#242820" strokeWidth="2"></path>
              <path d="M20.5 31 A 12 12 0 0 1 27 21" fill="none" stroke="#f6f2e8" strokeWidth="2.6" strokeLinecap="round"></path>
              <circle cx="32" cy="9.5" r="3.6" fill="#eae4d5" stroke="#242820" strokeWidth="2"></circle>
              <path d="M32 13 V 12" stroke="#242820" strokeWidth="2"></path>
              <path d="M32 50 V 38" stroke="#345a04" strokeWidth="2"></path>
              <path d="M32 42 C 26 41, 23 36, 24 33 C 29 34, 32 38, 32 42 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
              <path d="M32 40 C 37 38, 40 34, 39 31 C 35 32, 32 35, 32 40 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
              <circle cx="32" cy="35" r="2.2" fill="#c95851" stroke="#242820" strokeWidth="1"></circle>
            </g>
            <g display={ic.dP}>
              <circle cx="32" cy="32" r="24" fill="#c95851" stroke="#242820" strokeWidth="2"></circle>
              <circle cx="32" cy="32" r="19.5" fill="none" stroke="#f6f2e8" strokeWidth="1.6" strokeDasharray="2.5 2.5"></circle>
              <path d="M29 35 C 21 35, 13 31, 11 25 C 19 24, 26 28, 29 35 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
              <path d="M35 35 C 43 35, 51 31, 53 25 C 45 24, 38 28, 35 35 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
              <path d="M32 19 L 34.7 26.8 L 42.5 27.2 L 36.3 32 L 38.6 39.6 L 32 35 L 25.4 39.6 L 27.7 32 L 21.5 27.2 L 29.3 26.8 Z" fill="#e2a93b" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
              <path d="M19 45 H 45 L 42 49 L 45 53 H 19 L 22 49 Z" fill="#eae4d5" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
            </g>
          </svg>    );
  }
  return (
        <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true" style={{overflow: `visible`}}>
          <g display={ic.dU}>
            <ellipse cx="32" cy="57" rx="13" ry="3.6" fill="#345a04" stroke="#242820" strokeWidth="2"></ellipse>
            <path d="M32 43 V 55" stroke="#242820" strokeWidth="2.6"></path>
            <ellipse cx="32" cy="28" rx="27" ry="10" fill="none" stroke="#242820" strokeWidth="1.8" strokeDasharray="3 3"></ellipse>
            <circle cx="32" cy="28" r="14" fill="#b4cfb6" stroke="#242820" strokeWidth="2"></circle>
            <path d="M19 25 Q 32 20 45 25" fill="none" stroke="#3e6510" strokeWidth="2.6"></path>
            <path d="M11 31 Q 32 41 53 31" fill="none" stroke="#242820" strokeWidth="5.5" strokeLinecap="round"></path>
            <path d="M11 31 Q 32 41 53 31" fill="none" stroke="#b47e00" strokeWidth="3" strokeLinecap="round"></path>
            <circle cx="57" cy="24" r="4.5" fill="#c95851" stroke="#242820" strokeWidth="2"></circle>
            <path d="M32 10 C 28 4, 23 4, 20.5 6 C 23.5 10.5, 28 11.5, 32 10 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
            <path d="M32 14 V 9" stroke="#242820" strokeWidth="1.8"></path>
          </g>
          <g display={ic.dA}>
            <path d="M12 11 H 48 A 5 5 0 0 1 53 16 V 54 A 2 2 0 0 1 51 56 H 12 Z" fill="#3e6510" stroke="#242820" strokeWidth="2" strokeLinejoin="round"></path>
            <rect x="12" y="11" width="7" height="45" fill="#345a04" stroke="#242820" strokeWidth="2"></rect>
            <rect x="26" y="17" width="21" height="9" rx="1.5" fill="#eae4d5" stroke="#242820" strokeWidth="1.5"></rect>
            <path d="M36 50 C 27 46, 26 36, 34 30 C 42 36, 43 45, 36 50 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
            <path d="M42 54 V 62 L 45 59.5 L 48 62 V 54" fill="#c95851" stroke="#242820" strokeWidth="1.6" strokeLinejoin="round"></path>
          </g>
          <g display={ic.dT}>
            <path d="M7 21 A 6 6 0 0 1 13 15 H 51 A 6 6 0 0 1 57 21 V 45 A 6 6 0 0 1 51 51 H 13 A 6 6 0 0 1 7 45 Z" fill="#eae4d5" stroke="#242820" strokeWidth="2"></path>
            <rect x="13" y="20" width="31" height="25" rx="4" fill="#1b2315" stroke="#242820" strokeWidth="2"></rect>
            <path d="M18 28 L 22.5 31.5 L 18 35" fill="none" stroke="#b4cfb6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M25.5 36 H 33" stroke="#e2a93b" strokeWidth="2.2" strokeLinecap="round"></path>
            <circle cx="50.5" cy="26" r="2.6" fill="#c95851" stroke="#242820" strokeWidth="1.4"></circle>
            <circle cx="50.5" cy="35" r="2.6" fill="#b47e00" stroke="#242820" strokeWidth="1.4"></circle>
            <path d="M16 51 V 56 M48 51 V 56" stroke="#242820" strokeWidth="2.6" strokeLinecap="round"></path>
            <path d="M41 11 C 36 4, 30 5, 28 7 C 31 12, 36 13, 41 11 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
          </g>
          <g display={ic.dM}>
            <circle cx="32" cy="35" r="22" fill="#b47e00" stroke="#242820" strokeWidth="2"></circle>
            <circle cx="32" cy="35" r="16.5" fill="#f6f2e8" stroke="#242820" strokeWidth="2"></circle>
            <path d="M32 35 L 38.5 23.5 L 34.6 36.6 Z" fill="#c95851" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
            <path d="M32 35 L 25.5 46.5 L 29.4 33.4 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
            <circle cx="32" cy="35" r="2" fill="#242820"></circle>
            <path d="M51 4 V 18" stroke="#242820" strokeWidth="2"></path>
            <path d="M51 5 L 60 8 L 51 11 Z" fill="#c95851" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
          </g>
          <g display={ic.dW}>
            <rect x="9" y="50" width="46" height="7" rx="2" fill="#b47e00" stroke="#242820" strokeWidth="2"></rect>
            <path d="M15 50 V 29 A 17 17 0 0 1 49 29 V 50" fill="#cfe0d0" stroke="#242820" strokeWidth="2"></path>
            <circle cx="32" cy="9.5" r="3.6" fill="#eae4d5" stroke="#242820" strokeWidth="2"></circle>
            <path d="M32 50 V 38" stroke="#345a04" strokeWidth="2"></path>
            <path d="M32 42 C 26 41, 23 36, 24 33 C 29 34, 32 38, 32 42 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
            <path d="M32 40 C 37 38, 40 34, 39 31 C 35 32, 32 35, 32 40 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.4" strokeLinejoin="round"></path>
          </g>
          <g display={ic.dP}>
            <circle cx="32" cy="32" r="24" fill="#c95851" stroke="#242820" strokeWidth="2"></circle>
            <circle cx="32" cy="32" r="19.5" fill="none" stroke="#f6f2e8" strokeWidth="1.6" strokeDasharray="2.5 2.5"></circle>
            <path d="M29 35 C 21 35, 13 31, 11 25 C 19 24, 26 28, 29 35 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
            <path d="M35 35 C 43 35, 51 31, 53 25 C 45 24, 38 28, 35 35 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
            <path d="M32 19 L 34.7 26.8 L 42.5 27.2 L 36.3 32 L 38.6 39.6 L 32 35 L 25.4 39.6 L 27.7 32 L 21.5 27.2 L 29.3 26.8 Z" fill="#e2a93b" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path>
          </g>
        </svg>  );
}
