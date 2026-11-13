// App registry. Geometry and window chrome come from the prototype's APPS table and title bars.

export type AppId = 'universe' | 'academy' | 'terminal' | 'missions' | 'workshop' | 'profile' | 'settings';
export type Glyph = 'U' | 'A' | 'T' | 'M' | 'W' | 'P';

export interface AppDef {
  id: AppId;
  name: string;      // menubar / icon label
  longName: string;  // dock tooltip, Go menu
  sub: string;       // title-bar subtitle
  dot: string;       // title-bar dot color
  glyph?: Glyph;     // desktop + dock art; apps without one live only in menus
  x: number; y: number; w: number; h: number; minW: number;
  dark?: boolean;    // body sits on the cosmos/code ground
}

export const APPS: AppDef[] = [
  { id: 'universe', name: 'Universe', longName: 'Universe', sub: 'Chart of Known Python', dot: '#b4cfb6', glyph: 'U', x: 300, y: 54, w: 1060, h: 640, minW: 560, dark: true },
  { id: 'academy', name: 'Academy', longName: 'Academy', sub: 'Galaxy 01 · Origins', dot: '#3e6510', glyph: 'A', x: 110, y: 46, w: 1220, h: 720, minW: 760 },
  { id: 'terminal', name: 'Terminal', longName: 'Terminal', sub: 'scratch.py', dot: '#1b2315', glyph: 'T', x: 380, y: 110, w: 900, h: 590, minW: 560, dark: true },
  { id: 'missions', name: 'Missions', longName: 'Missions', sub: 'Expedition board', dot: '#b47e00', glyph: 'M', x: 150, y: 54, w: 1160, h: 712, minW: 760 },
  { id: 'workshop', name: 'Workshop', longName: 'Workshop', sub: 'Practical projects', dot: '#cfe0d0', glyph: 'W', x: 520, y: 150, w: 660, h: 440, minW: 420 },
  { id: 'profile', name: 'Pilot', longName: 'Pilot logbook', sub: 'Logbook', dot: '#c95851', glyph: 'P', x: 200, y: 44, w: 1080, h: 724, minW: 620 },
  { id: 'settings', name: 'Settings', longName: 'Settings', sub: 'Ship systems', dot: '#eae4d5', x: 460, y: 90, w: 560, h: 560, minW: 420 },
];

export const APP_IDS = APPS.map((a) => a.id);
export const appById = (id: AppId): AppDef => APPS.find((a) => a.id === id)!;
export const isAppId = (v: unknown): v is AppId => typeof v === 'string' && (APP_IDS as string[]).includes(v);
