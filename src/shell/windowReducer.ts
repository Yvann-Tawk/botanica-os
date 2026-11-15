import { APPS, type AppId } from '../content/apps';

// One window manager for every desktop in Terraform OS. Botanica and the Orbis hub each build a shell
// from their own app table with createShell(); the rules (clamping, z-order, cascade) are shared.

export interface WinState { x: number; y: number; w: number; h: number; open: boolean; min: boolean; max: boolean; z: number }
export type MenuKey = 'go' | 'win' | 'help';
export interface ShellState<Id extends string = AppId> {
  wins: Record<Id, WinState>;
  ztop: number;
  focus: Id | null;
  selIcon: Id | null;
  menu: MenuKey | null;
}
export interface Geom { x: number; y: number; w: number; h: number; max: boolean }
/** The slice of an app definition the window manager needs. */
export interface WinDef<Id extends string> { id: Id; x: number; y: number; w: number; h: number; minW: number }

export const MENUBAR_H = 34;
export const MIN_H = 340;
export const SMALL_W = 760;

/** On-screen geometry for a window: the prototype's clamp rules, and full-width below 760px. */
export function geom(w: WinState, W: number, H: number): Geom {
  if (w.max || W < SMALL_W) return { x: 0, y: MENUBAR_H, w: W, h: Math.max(300, H - MENUBAR_H - 92), max: true };
  const gw = Math.min(w.w, W - 16), gh = Math.min(w.h, H - MENUBAR_H - 12);
  return { x: clamp(w.x, -gw + 140, W - 100), y: clamp(w.y, MENUBAR_H, H - 60), w: gw, h: gh, max: false };
}

export function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

export type ShellAction<Id extends string = AppId> =
  | { type: 'open'; id: Id; max?: boolean }
  | { type: 'close'; id: Id }
  | { type: 'minimize'; id: Id }
  | { type: 'toggleMax'; id: Id }
  | { type: 'focus'; id: Id }
  | { type: 'move'; id: Id; x: number; y: number }
  | { type: 'resize'; id: Id; w: number; h: number }
  | { type: 'cascade' }
  | { type: 'minimizeAll' }
  | { type: 'selectIcon'; id: Id | null }
  | { type: 'menu'; menu: MenuKey | null }
  | { type: 'resetLayout' }
  | { type: 'restore'; state: ShellState<Id> };

export function createShell<Id extends string>(apps: readonly WinDef<Id>[]) {
  const ids = apps.map((a) => a.id) as string[];
  const isId = (v: unknown): v is Id => typeof v === 'string' && ids.includes(v);
  const byId = (id: Id) => apps.find((a) => a.id === id)!;

  function initialShell(start: Id | 'desktop'): ShellState<Id> {
    const wins = {} as Record<Id, WinState>;
    apps.forEach((a, i) => { wins[a.id] = { x: a.x, y: a.y, w: a.w, h: a.h, open: a.id === start, min: false, max: false, z: 10 + i }; });
    if (start !== 'desktop') wins[start].z = 20;
    return { wins, ztop: 20, focus: start === 'desktop' ? null : start, selIcon: null, menu: null };
  }

  function patch(s: ShellState<Id>, id: Id, p: Partial<WinState>): Record<Id, WinState> {
    return { ...s.wins, [id]: { ...s.wins[id], ...p } };
  }

  function shellReducer(s: ShellState<Id>, a: ShellAction<Id>): ShellState<Id> {
    switch (a.type) {
      case 'open': {
        const z = s.ztop + 1;
        return { ...s, wins: patch(s, a.id, { open: true, min: false, z, ...(a.max ? { max: true } : {}) }), ztop: z, focus: a.id, menu: null, selIcon: a.id };
      }
      case 'close':
        return { ...s, wins: patch(s, a.id, { open: false, max: false }), focus: s.focus === a.id ? null : s.focus };
      case 'minimize':
        return { ...s, wins: patch(s, a.id, { min: true }), focus: s.focus === a.id ? null : s.focus };
      case 'toggleMax': {
        const z = s.ztop + 1;
        return { ...s, wins: patch(s, a.id, { max: !s.wins[a.id].max, z }), ztop: z, focus: a.id };
      }
      case 'focus': {
        if (s.focus === a.id && s.wins[a.id].z === s.ztop) return s;
        const z = s.ztop + 1;
        return { ...s, wins: patch(s, a.id, { z }), ztop: z, focus: a.id };
      }
      case 'move':
        return { ...s, wins: patch(s, a.id, { x: Math.round(a.x), y: Math.round(a.y) }) };
      case 'resize':
        return { ...s, wins: patch(s, a.id, { w: Math.max(byId(a.id).minW, Math.round(a.w)), h: Math.max(MIN_H, Math.round(a.h)) }) };
      case 'cascade': {
        const wins = { ...s.wins };
        let z = s.ztop, n = 0;
        apps.forEach((app) => {
          if (wins[app.id].open) { z++; wins[app.id] = { ...wins[app.id], x: 130 + n * 40, y: 50 + n * 34, min: false, max: false, z }; n++; }
        });
        return { ...s, wins, ztop: z, menu: null };
      }
      case 'minimizeAll': {
        const wins = { ...s.wins };
        apps.forEach((app) => { wins[app.id] = { ...wins[app.id], min: true }; });
        return { ...s, wins, menu: null, focus: null };
      }
      case 'selectIcon':
        return { ...s, selIcon: a.id };
      case 'menu':
        return { ...s, menu: a.menu };
      case 'resetLayout': {
        const fresh = initialShell('desktop');
        const wins = { ...fresh.wins };
        apps.forEach((app) => { wins[app.id] = { ...wins[app.id], open: s.wins[app.id].open, min: s.wins[app.id].min }; });
        return { ...s, wins, ztop: fresh.ztop, menu: null };
      }
      case 'restore':
        return a.state;
    }
  }

  /** What gets persisted: window layout only. Menus and selection are transient. */
  function toLayout(s: ShellState<Id>) {
    return { v: 1 as const, wins: s.wins, ztop: s.ztop, focus: s.focus };
  }

  /** Validates a stored layout; anything malformed falls back to defaults per window. */
  function fromLayout(raw: unknown, fallback: ShellState<Id>): ShellState<Id> {
    if (!raw || typeof raw !== 'object') return fallback;
    const r = raw as { wins?: Record<string, Partial<WinState>>; ztop?: unknown; focus?: unknown };
    const wins = { ...fallback.wins };
    let ztop = typeof r.ztop === 'number' ? r.ztop : fallback.ztop;
    for (const app of apps) {
      const w = r.wins?.[app.id];
      if (!w) continue;
      const num = (v: unknown, d: number) => (typeof v === 'number' && isFinite(v) ? v : d);
      const d = fallback.wins[app.id];
      wins[app.id] = {
        x: num(w.x, d.x), y: num(w.y, d.y), w: Math.max(app.minW, num(w.w, d.w)), h: Math.max(MIN_H, num(w.h, d.h)),
        open: !!w.open, min: !!w.min, max: !!w.max, z: num(w.z, d.z),
      };
      ztop = Math.max(ztop, wins[app.id].z);
    }
    return { ...fallback, wins, ztop, focus: isId(r.focus) && wins[r.focus].open ? r.focus : null };
  }

  return { initialShell, shellReducer, toLayout, fromLayout };
}

/* Botanica's shell, under the names the rest of the app already uses. */
const botanica = createShell(APPS);
export const initialShell = botanica.initialShell;
export const shellReducer = botanica.shellReducer;
export const toLayout = botanica.toLayout;
export const fromLayout = botanica.fromLayout;
