import { isWorldId, type WorldId } from './worlds';

/** Orbis-only preferences, stored under the `orbis` key. Shared preferences (motion, Sprout, editor) stay in `settings`. */
export interface OrbisPrefs {
  v: 1;
  /** Keep Cygnus in the Orbis dock. */
  showComp: boolean;
  /** Let Cygnus's accretion disk turn. */
  sway: boolean;
  /** The world last selected in Orbis Explorer. */
  world: WorldId;
  /** The hub's window layout (validated by the Orbis shell's fromLayout). */
  layout?: unknown;
}

export const DEFAULT_ORBIS: OrbisPrefs = { v: 1, showComp: true, sway: true, world: 'botanica' };

export function normalizeOrbis(raw: unknown): OrbisPrefs {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof OrbisPrefs, unknown>>;
  const p: OrbisPrefs = { ...DEFAULT_ORBIS };
  if (typeof r.showComp === 'boolean') p.showComp = r.showComp;
  if (typeof r.sway === 'boolean') p.sway = r.sway;
  if (isWorldId(r.world)) p.world = r.world;
  if (r.layout && typeof r.layout === 'object') p.layout = r.layout;
  return p;
}

export type Place = 'orbis' | 'botanica';
export const BOTANICA_HASH = '#/botanica';

/**
 * Where Terraform OS opens. Orbis is the front door; a Botanica deep link (#/botanica, ?start= or ?demo=)
 * goes straight into the Python world, which also keeps older bookmarks and tests working.
 */
export function resolvePlace(search: string, hash: string): Place {
  const q = new URLSearchParams(search);
  if (hash === BOTANICA_HASH || q.has('start') || q.has('demo')) return 'botanica';
  return 'orbis';
}
