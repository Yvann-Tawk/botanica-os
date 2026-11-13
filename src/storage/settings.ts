import { isAppId, type AppId } from '../content/apps';

export interface Settings {
  v: 1;
  /** 'system' follows the OS; 'reduce' forces the reduced-motion rules on. */
  motion: 'system' | 'reduce';
  /** What opens on launch. 'restore' brings back the last window layout. */
  openOnStart: 'restore' | 'desktop' | Exclude<AppId, 'settings'>;
  /** When false, Sprout only speaks when spoken to (petted or asked). */
  sproutChatty: boolean;
  /** 'auto' = Monaco on wide screens; 'simple' = the lightweight editor everywhere. */
  editor: 'auto' | 'simple';
}

export const DEFAULT_SETTINGS: Settings = { v: 1, motion: 'system', openOnStart: 'restore', sproutChatty: true, editor: 'auto' };

/** Fills defaults and drops invalid values so older or hand-edited data never breaks the app. */
export function normalizeSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof Settings, unknown>>;
  const s: Settings = { ...DEFAULT_SETTINGS };
  if (r.motion === 'system' || r.motion === 'reduce') s.motion = r.motion;
  if (r.openOnStart === 'restore' || r.openOnStart === 'desktop' || (isAppId(r.openOnStart) && r.openOnStart !== 'settings')) s.openOnStart = r.openOnStart;
  if (typeof r.sproutChatty === 'boolean') s.sproutChatty = r.sproutChatty;
  if (r.editor === 'auto' || r.editor === 'simple') s.editor = r.editor;
  return s;
}
