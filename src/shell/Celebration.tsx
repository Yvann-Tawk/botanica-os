// The prototype's celebration card, shown when real progress happens (a lesson completes).
import { useEffect, useRef } from 'react';
import { rng } from '../art/decoration';

export interface CelebrationData {
  kicker: string;
  title: string;
  body: string;
  gains: string[];
  /** Constellation stars lit, out of 6. */
  lit: number;
  constLabel: string;
  primaryLabel: string;
  onPrimary: () => void;
}

const CP = [[110, 70], [170, 34], [250, 28], [320, 50], [380, 84], [430, 52]];
const PR = rng(5);
const PARTICLES = Array.from({ length: 14 }, (_, pi) => ({ x: Math.round(PR() * 96), y: Math.round(30 + PR() * 64), d: (PR() * 2.4).toFixed(2), leaf: pi % 2 === 0, c: ['#b4cfb6', '#f3c766', '#8fb356', '#e58a80'][pi % 4] }));

export function Celebration({ c, onClose }: { c: CelebrationData; onClose: () => void }) {
  const card = useRef<HTMLDivElement>(null);
  const before = useRef<Element | null>(null);
  useEffect(() => {
    before.current = document.activeElement;
    card.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => { (before.current as HTMLElement | null)?.focus?.(); };
  }, []);
  // Keep Tab inside the dialog; Escape closes it.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (e.key !== 'Tab') return;
    const btns = Array.from(card.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); btns[btns.length - 1]?.focus(); }
    else if (!e.shiftKey && i === btns.length - 1) { e.preventDefault(); btns[0]?.focus(); }
  };
  const stars = CP.map((p, i) => ({ tf: `translate(${p[0]} ${p[1]})`, c: i < c.lit ? '#f0c06a' : '#4a5442', d: (0.15 + i * 0.18).toFixed(2) }));
  const lines = CP.slice(0, -1).map((p, i) => { const on = i + 1 < c.lit; return { x1: p[0], y1: p[1], x2: CP[i + 1][0], y2: CP[i + 1][1], c: on ? '#e2a93b' : '#3a4532', dash: on ? '200' : '3 6', d: (0.3 + i * 0.18).toFixed(2) }; });
  return (
    <div className="cele" role="dialog" aria-modal="true" aria-label={c.title} onKeyDown={onKey}>
      {PARTICLES.map((pa, i) => (
        <svg key={i} className="particle pa" width="20" height="20" viewBox="-10 -10 20 20" aria-hidden="true" style={{ left: `${pa.x}%`, top: `${pa.y}%`, animationDelay: `${pa.d}s` }}>
          {pa.leaf ? <path d="M0 8 C -7 2, -6 -5, 0 -8 C 6 -5, 7 2, 0 8 Z" fill={pa.c} stroke="#242820" strokeWidth="1"></path> : <path d="M0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill={pa.c}></path>}
        </svg>
      ))}
      <div className="cele-card" ref={card}>
        <svg viewBox="0 0 500 130" width="100%" aria-hidden="true" style={{ display: 'block', margin: '-6px 0 10px', background: '#12180e', borderRadius: '12px', border: '1.5px solid #242820' }}>
          {lines.map((l, i) => <line key={i} className="cele-line" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.c} strokeWidth="2" strokeDasharray={l.dash} style={{ animationDelay: `${l.d}s` }}></line>)}
          {stars.map((s, i) => <g key={i} transform={s.tf}><path className="cele-star" d="M0 -11 L 2.6 -2.6 L 11 0 L 2.6 2.6 L 0 11 L -2.6 2.6 L -11 0 L -2.6 -2.6 Z" fill={s.c} style={{ animationDelay: `${s.d}s` }}></path></g>)}
          <text x="250" y="120" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#a3a893" letterSpacing="2">{c.constLabel}</text>
        </svg>
        <p className="mono" style={{ margin: '0 0 4px', fontSize: '12px', color: '#8a6000', letterSpacing: '.04em' }}>{c.kicker}</p>
        <p className="disp" style={{ margin: '0 0 10px', fontSize: '32px', lineHeight: 1.08 }}>{c.title}</p>
        <p style={{ margin: '0 0 16px', fontSize: '15px', lineHeight: 1.55, color: '#3c4036' }}>{c.body}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {c.gains.map((g) => <span key={g} className="chip" style={{ color: '#345a04', background: '#dfe9d6', fontSize: '13px', padding: '4px 12px' }}>{g}</span>)}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button className="btn pri" onClick={c.onPrimary}>{c.primaryLabel}</button>
          <button className="btn" onClick={onClose}>Keep exploring</button>
        </div>
      </div>
    </div>
  );
}
