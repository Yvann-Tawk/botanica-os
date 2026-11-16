// Terraform OS: the top-level shell. It owns the pieces every world shares (settings, the learner's
// progress as Botanica last reported it, fullscreen, history) and shows one place at a time: the Orbis hub
// or a world. Botanica is the existing app, mounted unchanged the first time it is entered and then kept
// alive (hidden) while the learner is back in Orbis, so a running Python session survives the round trip.

import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import type { KV } from '../storage/db';
import type { Settings } from '../storage/settings';
import type { Progress } from '../progression/progress';
import type { Progression } from '../progression/engine';
import type { ShellState } from '../shell/windowReducer';
import { buildJournal } from './journal';
import { Orbis } from './Orbis';
import { BOTANICA_HASH, LITHIC_HASH, type OrbisPrefs, type Place } from './prefs';
import { worldById, type WorldId } from './worlds';

const BotanicaApp = lazy(() => import('../App'));
const LithicApp = lazy(() => import('../lithic/LithicApp'));

interface Props {
  kv: KV;
  place: Place;
  settings: Settings;
  orbis: OrbisPrefs;
  /** Botanica's own boot data, passed through untouched. */
  botanica: { shell: ShellState; progress: Progress; progression: Progression; demo: string | null };
}

const hashFor = (place: Place) => place === 'botanica' ? BOTANICA_HASH : place === 'lithic' ? LITHIC_HASH : '';
const urlFor = (place: Place) => location.pathname + location.search + hashFor(place);
const placeForHash = (hash: string): Place => hash === BOTANICA_HASH ? 'botanica' : hash === LITHIC_HASH ? 'lithic' : 'orbis';

export default function TerraformOS({ kv, place: initialPlace, settings: initialSettings, orbis: initialOrbis, botanica }: Props) {
  const [place, setPlace] = useState<Place>(initialPlace);
  const [mounted, setMounted] = useState(initialPlace === 'botanica');
  const [lithicMounted, setLithicMounted] = useState(initialPlace === 'lithic');
  // Orbis mounts the first time it is shown, so a Botanica deep link boots exactly as Botanica always did
  const [hubMounted, setHubMounted] = useState(initialPlace === 'orbis');
  if (place === 'orbis' && !hubMounted) setHubMounted(true);
  const [settings, setSettings] = useState(initialSettings);
  const [orbis, setOrbis] = useState(initialOrbis);
  const [learning, setLearning] = useState({ progress: botanica.progress, progression: botanica.progression });
  const [resume, setResume] = useState<{ lessonId: string; key: number } | undefined>();
  const [lithicResume, setLithicResume] = useState<{ lessonId?: string; key: number } | undefined>();
  const [fullscreen, setFullscreen] = useState(() => typeof document !== 'undefined' && !!document.fullscreenElement);

  /* ---- places and the browser's back button ---- */
  useEffect(() => {
    const onPop = () => {
      const p = placeForHash(location.hash);
      if (p === 'botanica') setMounted(true);
      if (p === 'lithic') setLithicMounted(true);
      setPlace(p);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const enterBotanica = useCallback((lessonId?: string) => {
    if (lessonId) setResume({ lessonId, key: Date.now() });
    setMounted(true);
    setPlace('botanica');
    if (location.hash !== BOTANICA_HASH) history.pushState({ terraform: 'botanica' }, '', urlFor('botanica'));
  }, []);
  const enterLithic = useCallback((lessonId?: string) => {
    setLithicResume({ lessonId, key: Date.now() });
    setLithicMounted(true);
    setPlace('lithic');
    if (location.hash !== LITHIC_HASH) history.pushState({ terraform: 'lithic' }, '', urlFor('lithic'));
  }, []);
  /** Orbis routes every world launch here; dispatch by the world's `entry`. */
  const enterWorld = useCallback((worldId: WorldId, lessonId?: string) => {
    const entry = worldById(worldId).entry;
    if (entry === 'lithic') enterLithic(lessonId);
    else enterBotanica(lessonId);
  }, [enterBotanica, enterLithic]);
  const returnToOrbis = useCallback(() => {
    // Undo our own push when we made it, so Back and Forward keep making sense; otherwise rewrite the URL.
    if ((history.state as { terraform?: string } | null)?.terraform) { history.back(); return; }
    history.replaceState(null, '', urlFor('orbis'));
    setPlace('orbis');
  }, []);
  useEffect(() => { document.title = place === 'botanica' ? 'Botanica · Terraform OS' : place === 'lithic' ? 'Lithic · Terraform OS' : 'Terraform OS'; }, [place]);

  /* ---- shared settings: one record, written by whichever world changed it ---- */
  const changeSettings = useCallback((s: Settings) => { setSettings(s); kv.set('settings', s).catch(() => {}); }, [kv]);
  const changeOrbis = useCallback((p: OrbisPrefs) => { setOrbis(p); kv.set('orbis', p).catch(() => {}); }, [kv]);

  /* ---- fullscreen on the whole OS, so it carries across worlds ---- */
  useEffect(() => {
    const on = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);
  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) { await document.exitFullscreen(); return true; }
      if (!document.documentElement.requestFullscreen) return false;
      await document.documentElement.requestFullscreen();
      return true;
    } catch { return false; }
  }, []);

  const onLearning = useCallback((progress: Progress, progression: Progression) => setLearning({ progress, progression }), []);
  // recomputed when Botanica reports progress, and on every return to the hub so relative times stay fresh
  const journal = useMemo(() => buildJournal(learning.progress, learning.progression), [learning, place]);

  return (
    <>
      {hubMounted && <div hidden={place !== 'orbis'} {...({ inert: place === 'orbis' ? undefined : '' } as object)}>
        <Orbis active={place === 'orbis'} journal={journal} settings={settings} onSettings={changeSettings} prefs={orbis} onPrefs={changeOrbis}
          fullscreen={fullscreen} onToggleFullscreen={toggleFullscreen} onEnterWorld={enterWorld} />
      </div>}
      {lithicMounted && (
        <div hidden={place !== 'lithic'} {...({ inert: place === 'lithic' ? undefined : '' } as object)}>
          <Suspense fallback={<div className="os" style={{ height: '100vh', background: '#efe8d6' }} />}>
            <LithicApp progress={learning.progress} xpText={`${journal.xp.toLocaleString('en')} XP`}
              active={place === 'lithic'} fullscreen={fullscreen} onToggleFullscreen={toggleFullscreen}
              onExitToOrbis={returnToOrbis} resume={lithicResume} />
          </Suspense>
        </div>
      )}
      {mounted && (
        <div hidden={place !== 'botanica'} {...({ inert: place === 'botanica' ? undefined : '' } as object)}>
          <Suspense fallback={<div className="os" style={{ height: '100vh', background: '#efe8d6' }} />}>
            <BotanicaApp kv={kv} initialSettings={settings} initialShell={botanica.shell} initialProgress={botanica.progress}
              initialProgression={botanica.progression} demo={botanica.demo}
              active={place === 'botanica'} settings={settings} onSettingsChange={changeSettings} onLearning={onLearning}
              onExitToOrbis={returnToOrbis} fullscreen={fullscreen} onToggleFullscreen={toggleFullscreen} resume={resume} />
          </Suspense>
        </div>
      )}
    </>
  );
}
