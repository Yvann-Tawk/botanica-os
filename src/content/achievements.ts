// Achievements as data. The rule is declarative; src/progression/engine.ts evaluates it.
// `glyph` picks one of the prototype's seven embroidered patch designs.

export type AchievementRule =
  | { kind: 'event'; event: string }                 // a logged event happened at least once
  | { kind: 'concept'; id: string }                  // a concept completed
  | { kind: 'concepts'; count: number }              // any N concepts completed
  | { kind: 'region'; id: string }                   // all six concepts of a region completed
  | { kind: 'mission'; id: string }                  // a mission completed
  | { kind: 'missions'; type: string; count: number } // N missions of a type
  | { kind: 'streak'; days: number }                 // a run of N learning days
  | { kind: 'events'; event: string; count: number } // N different things logged with this event type
  | { kind: 'eventRef'; event: string; suffix: string }; // an event whose ref ends with suffix

export interface Achievement { id: string; name: string; desc: string; glyph: 0 | 1 | 2 | 3 | 4 | 5 | 6; color: string; rule: AchievementRule }

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-light', name: 'First Light', desc: 'Ran your first program', glyph: 0, color: '#b47e00', rule: { kind: 'event', event: 'run' } },
  { id: 'name-giver', name: 'Name-Giver', desc: 'Completed Variables', glyph: 1, color: '#3e6510', rule: { kind: 'concept', id: 'origins.variables' } },
  { id: 'six-suns', name: 'Six Suns', desc: 'Six-day streak', glyph: 2, color: '#c95851', rule: { kind: 'streak', days: 6 } },
  { id: 'error-whisperer', name: 'Error Whisperer', desc: 'Fixed a failing exercise', glyph: 3, color: '#345a04', rule: { kind: 'event', event: 'fixed' } },
  { id: 'specimen-clerk', name: 'Specimen Clerk', desc: 'First micro mission', glyph: 4, color: '#b47e00', rule: { kind: 'missions', type: 'Micro', count: 1 } },
  { id: 'origin-keeper', name: 'Origin Keeper', desc: 'Grew Origins in full', glyph: 1, color: '#c95851', rule: { kind: 'region', id: 'origins' } },
  // optional lesson missions (never required)
  { id: 'curious-seedling', name: 'Curious Seedling', desc: 'First optional mission', glyph: 0, color: '#3e6510', rule: { kind: 'events', event: 'lmission', count: 1 } },
  { id: 'full-bloom', name: 'Full Bloom', desc: 'Completed a Bloom mission', glyph: 2, color: '#b47e00', rule: { kind: 'eventRef', event: 'lmission', suffix: '-m3' } },
  { id: 'green-thumb', name: 'Green Thumb', desc: 'Twelve optional missions', glyph: 4, color: '#345a04', rule: { kind: 'events', event: 'lmission', count: 12 } },
  { id: 'loop-gardener', name: 'Loop Gardener', desc: 'Grow The Flow', glyph: 5, color: '#3e6510', rule: { kind: 'region', id: 'flow' } },
  { id: 'archivist', name: 'Archivist', desc: 'Grow The Archives', glyph: 6, color: '#c95851', rule: { kind: 'region', id: 'archives' } },
];
