import { isAppId } from './content/apps';
import { fromLayout, initialShell, type ShellState } from './shell/windowReducer';
import type { KV } from './storage/db';
import { normalizeSettings, type Settings } from './storage/settings';
import { demoProgress, normalizeProgress } from './progression/progress';
import { normalizeProgression } from './progression/engine';

/** The prototype opened on the Universe; that stays the first-visit default. */
export const FIRST_VISIT_START = 'universe' as const;

/** Decides the launch state: `?start=` beats settings, settings beat the saved layout. */
export function resolveStart(search: string, settings: Settings, layout: unknown): ShellState {
  const q = new URLSearchParams(search).get('start');
  if (q === 'desktop') return initialShell('desktop');
  if (isAppId(q)) return initialShell(q);
  if (settings.openOnStart === 'restore') return layout ? fromLayout(layout, initialShell('desktop')) : initialShell(FIRST_VISIT_START);
  return initialShell(settings.openOnStart);
}

export async function boot(kv: KV, search: string) {
  const [rawSettings, layout, rawProgress, rawProgression] = await Promise.all(['settings', 'layout', 'progress', 'progression'].map((k) => kv.get(k).catch(() => undefined)));
  const settings = normalizeSettings(rawSettings);
  const demoKey = new URLSearchParams(search).get('demo');
  const demo = demoKey ? demoProgress(demoKey) : null;
  return { settings, shell: resolveStart(search, settings, layout), progress: demo ?? normalizeProgress(rawProgress), progression: demo ? normalizeProgression(null) : normalizeProgression(rawProgression), demo: demo ? demoKey : null };
}
