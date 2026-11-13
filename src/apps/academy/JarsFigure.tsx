// Seed-bank jars from the prototype's Discover stage (variables as labels on jars).
export function JarsFigure() {
  return (
                    <svg viewBox="0 0 560 170" width="100%" role="img" aria-label="Three seed-bank jars, each with a tag: specimen holds Moonfern, age_days holds 42, height_cm holds 18.5" style={{display: `block`, margin: `0 0 16px`, maxWidth: `560px`}}>
                      <path d="M10 160 H 550" stroke="#242820" strokeWidth="2"></path>
                      <path d="M10 160 H 550" stroke="#b47e00" strokeWidth="6" opacity="0.35" transform="translate(0 4)"></path>
                      <g transform="translate(60 0)">
                        <rect x="0" y="40" width="96" height="118" rx="16" fill="#cfe0d0" stroke="#242820" strokeWidth="2"></rect>
                        <rect x="8" y="28" width="80" height="16" rx="4" fill="#3e6510" stroke="#242820" strokeWidth="2"></rect>
                        <path d="M48 140 C 30 120, 30 96, 48 78 C 66 96, 66 120, 48 140 Z" fill="#3e6510" stroke="#242820" strokeWidth="1.6"></path>
                        <path d="M48 140 V 86" stroke="#b4cfb6" strokeWidth="1.6"></path>
                        <path d="M84 36 C 104 30, 112 20, 118 12" fill="none" stroke="#242820" strokeWidth="1.4"></path>
                        <g transform="translate(96 0) rotate(8)"><path d="M10 0 H 92 V 30 H 10 L 0 15 Z" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></path><circle cx="12" cy="15" r="3" fill="none" stroke="#242820" strokeWidth="1.4"></circle><text x="22" y="20" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#242820">specimen</text></g>
                        <text x="48" y="64" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#345a04">"Moonfern"</text>
                      </g>
                      <g transform="translate(250 0)">
                        <rect x="0" y="62" width="82" height="96" rx="14" fill="#f3e6c4" stroke="#242820" strokeWidth="2"></rect>
                        <rect x="8" y="50" width="66" height="15" rx="4" fill="#b47e00" stroke="#242820" strokeWidth="2"></rect>
                        <text x="41" y="124" textAnchor="middle" fontFamily="Young Serif, Georgia, serif" fontSize="34" fill="#242820">42</text>
                        <path d="M72 58 C 92 50, 98 40, 104 30" fill="none" stroke="#242820" strokeWidth="1.4"></path>
                        <g transform="translate(84 16) rotate(6)"><path d="M10 0 H 92 V 30 H 10 L 0 15 Z" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></path><circle cx="12" cy="15" r="3" fill="none" stroke="#242820" strokeWidth="1.4"></circle><text x="22" y="20" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#242820">age_days</text></g>
                      </g>
                      <g transform="translate(424 0)">
                        <rect x="0" y="84" width="64" height="74" rx="12" fill="#f6dcd9" stroke="#242820" strokeWidth="2"></rect>
                        <rect x="6" y="73" width="52" height="14" rx="4" fill="#c95851" stroke="#242820" strokeWidth="2"></rect>
                        <text x="32" y="130" textAnchor="middle" fontFamily="Young Serif, Georgia, serif" fontSize="22" fill="#242820">18.5</text>
                        <path d="M56 80 C 70 70, 72 62, 70 52" fill="none" stroke="#242820" strokeWidth="1.4"></path>
                        <g transform="translate(30 30) rotate(-4)"><path d="M10 0 H 100 V 28 H 10 L 0 14 Z" fill="#f6f2e8" stroke="#242820" strokeWidth="1.6"></path><circle cx="12" cy="14" r="3" fill="none" stroke="#242820" strokeWidth="1.4"></circle><text x="22" y="19" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#242820">height_cm</text></g>
                      </g>
                    </svg>
  );
}
