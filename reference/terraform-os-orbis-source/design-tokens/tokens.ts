/* Terraform OS — Orbis Hub · design tokens (TypeScript)
   Mirror of design-tokens/tokens.css for a React/TS implementation.
   Values are taken verbatim from the approved prototype. */

export const color = {
  space: { void: '#0a1024', bg: '#101827', chrome: '#121a33', panel: '#141c33', panel2: '#19223d', dock: '#161e3c', indigo: '#292D50', indigoSoft: '#1b2447' },
  brass: { gold: '#D6AC68', line: '#c9a86a', dim: '#b89a5e', deep: '#8a743f' },
  cyan:  { base: '#91DCE8', bright: '#bfeaf1', edge: '#5fb9cc' }, // ACTIVE / SELECTED
  ivory: { body: '#f6f2e8', palette: '#F4EDE0', cream: '#eae4d5', wbtn: '#e7dab9' },
  ink:   { base: '#242820', muted: '#63685c' },
  onSpace: { base: '#f4ede0', muted: '#9aa7cf', faint: '#737ea4' },
  terracotta: { base: '#c95851', ink: '#a8423c' },
  botanica: { moss: '#345a04', forest: '#3e6510', sage: '#b4cfb6' }, // RESERVED to the Botanica world
  status: { open: '#2f5204', openLit: '#a6d45f', soon: '#8a6000', soonLit: '#e2a93b' },
  cygnus: { diskHot: '#f0b35c', diskWarm: '#b86a3a', diskCore: '#ffe6a6', horizon: '#05060d', photon: '#dff2f6' },
} as const;

export const font = {
  display: "'Young Serif', Georgia, 'Times New Roman', serif",
  ui: "'Figtree', ui-sans-serif, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
} as const;

export const radius = { window: 12, button: 10, card: 12, chip: 9999, small: 6 } as const;

export const shadow = {
  window: '5px 6px 0 rgba(5,9,22,.55), 0 30px 64px -22px rgba(0,0,0,.65)',
  dock: '4px 6px 0 rgba(5,9,22,.5), inset 0 2px 0 rgba(201,168,106,.14)',
  button: '0 3px 0 #242820',
  card: '3px 4px 0 rgba(36,40,32,.1)',
  menu: '4px 6px 0 rgba(5,9,22,.5)',
} as const;

export const motion = {
  easePop: 'cubic-bezier(.3,1.7,.5,1)',
  easeSoft: 'cubic-bezier(.2,.8,.2,1)',
  durFast: 140,
  durWindow: 280,
} as const;

export const breakpoint = { windowMaximize: 760, desktop: 820 } as const;

/* Fonts load from Google Fonts — see README "Required dependencies".
   family=Young+Serif & family=Figtree:wght@400;500;600;700 & family=JetBrains+Mono:wght@400;500;700 */
