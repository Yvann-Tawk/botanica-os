// Sprout, ported verbatim from the prototype's dock pot. Visual flags come from spriteFlags().
import type { SproutSprite } from './sproutSprite';

export function SproutArt({ s }: { s: SproutSprite }) {
  return (
          <svg viewBox="0 0 124 108" width="104" height="90" aria-hidden="true" style={{overflow: `visible`, display: `block`}}>
            <ellipse cx="60" cy="101" rx="42" ry="5" fill="#242820" opacity="0.13"></ellipse>
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
                <g display={s.dOpen}><g className={s.blink}><circle cx="79" cy="27" r="5.4" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="94" cy="27" r="5.4" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="80" cy="28" r="2.7" fill="#242820"></circle><circle cx="95" cy="28" r="2.7" fill="#242820"></circle><circle cx="81" cy="26.6" r="0.9" fill="#f6f2e8"></circle><circle cx="96" cy="26.6" r="0.9" fill="#f6f2e8"></circle></g></g>
                <g display={s.dClosed}><path d="M74 28 Q 79 31.5 84 28 M89 28 Q 94 31.5 99 28" fill="none" stroke="#242820" strokeWidth="2" strokeLinecap="round"></path></g>
                <g display={s.dHappy}><path d="M74 29 Q 79 22.5 84 29 M89 29 Q 94 22.5 99 29" fill="none" stroke="#242820" strokeWidth="2.2" strokeLinecap="round"></path></g>
                <g display={s.dWide}><circle cx="79" cy="26" r="6.2" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="94" cy="26" r="6.2" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="79" cy="26" r="1.8" fill="#242820"></circle><circle cx="94" cy="26" r="1.8" fill="#242820"></circle></g>
                <g display={s.dConf}><circle cx="79" cy="26" r="6" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></circle><circle cx="80" cy="25" r="2.6" fill="#242820"></circle><path d="M89.5 28 L 99 26" stroke="#242820" strokeWidth="2" strokeLinecap="round"></path><path d="M73 18 L 84 20" stroke="#242820" strokeWidth="1.6" strokeLinecap="round"></path></g>
                <g display={s.dSmile}><path d="M86 38 Q 90 41 94 38" fill="none" stroke="#242820" strokeWidth="1.7" strokeLinecap="round"></path></g>
                <g display={s.dMOpen}><path d="M85 37 Q 90 44 95 37 Z" fill="#a8423c" stroke="#242820" strokeWidth="1.5" strokeLinejoin="round"></path></g>
                <g display={s.dWavy}><path d="M84 39 Q 86 37 88 39 Q 90 41 92 39 Q 94 37 96 39" fill="none" stroke="#242820" strokeWidth="1.6" strokeLinecap="round"></path></g>
                <g display={s.dBlush}><circle cx="74" cy="35" r="3.4" fill="#c95851" opacity="0.45"></circle><circle cx="100" cy="34" r="3" fill="#c95851" opacity="0.45"></circle></g>
                <g display={s.dTongue}><path className="sp-tongue" d="M99 37 L 106 39 M106 39 L 109 37 M106 39 L 108.5 42" fill="none" stroke="#c95851" strokeWidth="1.8" strokeLinecap="round"></path></g>
              </g>
            </g>
            <g display={s.dZ}><text className="sp-z" x="104" y="16" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="700" fill="#345a04">z</text><text className="sp-z2" x="113" y="5" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700" fill="#345a04">z</text></g>
            <g display={s.dQ}><text x="104" y="14" fontFamily="Young Serif, Georgia, serif" fontSize="22" fill="#8a6000">?</text></g>
            <g display={s.dSweat}><path d="M108 14 C 104 20, 104 24, 108 24 C 112 24, 112 20, 108 14 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.4"></path></g>
            <g display={s.dSpark} fill="#b47e00">
              <g transform="translate(110 10)"><path className="sp-spark" d="M0 -6 L 1.6 -1.6 L 6 0 L 1.6 1.6 L 0 6 L -1.6 1.6 L -6 0 L -1.6 -1.6 Z"></path></g>
              <g transform="translate(60 16)"><path className="sp-spark d2" d="M0 -5 L 1.3 -1.3 L 5 0 L 1.3 1.3 L 0 5 L -1.3 1.3 L -5 0 L -1.3 -1.3 Z"></path></g>
              <g transform="translate(118 40)"><path className="sp-spark d3" d="M0 -5 L 1.3 -1.3 L 5 0 L 1.3 1.3 L 0 5 L -1.3 1.3 L -5 0 L -1.3 -1.3 Z"></path></g>
            </g>
            <g display={s.dLeaf}>
              <g transform="translate(66 12)"><path className="sp-leaf" d="M0 0 C -4 -6, 0 -10, 5 -9 C 5 -4, 3 -1, 0 0 Z" fill="#8fb356" stroke="#242820" strokeWidth="1.2"></path></g>
              <g transform="translate(106 18)"><path className="sp-leaf d2" d="M0 0 C -2 -6, 2 -9, 6 -8 C 6 -3, 4 -1, 0 0 Z" fill="#b4cfb6" stroke="#242820" strokeWidth="1.2"></path></g>
            </g>
          </svg>  );
}
