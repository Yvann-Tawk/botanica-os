import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import { APPS, appById, type AppId } from './content/apps';
import { conceptById, lessonMetaForConcept, REGIONS } from './content/curriculum';
import { missionById } from './content/missions';
import { spriteFlags, stageForLevel } from './mascot/sproutSprite';
import { useSprout } from './mascot/useSprout';
import { exportBackup, importBackup, type KV } from './storage/db';
import { normalizeSettings, type Settings } from './storage/settings';
import { normalizeProgress, regionStatus, type Progress } from './progression/progress';
import { normalizeProgression, streak, type Progression } from './progression/engine';
import { useLearning, type Notify } from './progression/useLearning';
import { onAnyRun } from './runtime/usePython';
import { pwa, subscribePwa } from './pwa';
import { nextStep } from './apps/academy/nextLesson';
import { Celebration, type CelebrationData } from './shell/Celebration';
import { Desktop } from './shell/Desktop';
import { Dock } from './shell/Dock';
import { MenuBar, type MenuItem } from './shell/MenuBar';
import { Toasts, type Toast } from './shell/Toasts';
import { Window } from './shell/Window';
import { fromLayout, geom, shellReducer, toLayout, type MenuKey, type ShellState } from './shell/windowReducer';

const AcademyApp = lazy(() => import('./apps/academy/AcademyApp'));
const SettingsApp = lazy(() => import('./apps/SettingsApp'));
const UniverseApp = lazy(() => import('./apps/universe/UniverseApp'));
const TerminalApp = lazy(() => import('./apps/terminal/TerminalApp'));
const MissionsApp = lazy(() => import('./apps/missions/MissionsApp'));
const ProfileApp = lazy(() => import('./apps/profile/ProfileApp'));
const WorkshopApp = lazy(() => import('./apps/workshop/WorkshopApp'));

const GREETING = 'Psst. Double-click anything that looks curious. I live here in the tray.';
const LAYOUT_SAVE_MS = 300;
const pad = (n: number) => String(n).padStart(2, '0');

interface Props {
  kv: KV; initialSettings: Settings; initialShell: ShellState; initialProgress: Progress;
  initialProgression?: Progression;
  /** Set when a ?demo= preset is showing; progress is then display-only and never saved. */
  demo?: string | null;
}

export default function App({ kv, initialSettings, initialShell: init, initialProgress, initialProgression, demo = null }: Props) {
  const [shell, dispatch] = useReducer(shellReducer, init);
  const [settings, setSettings] = useState(initialSettings);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lessonRoute, setLessonRoute] = useState<string | null>(null);
  const [missionRoute, setMissionRoute] = useState<string | null>(null);
  const [academySub, setAcademySub] = useState<string | undefined>();
  const [cele, setCele] = useState<CelebrationData | null>(null);
  const [fly, setFly] = useState<{ n: number; key: number } | null>(null);
  const [xpPulse, setXpPulse] = useState(0);
  const [fitSignal, setFitSignal] = useState(0);
  const [termFile, setTermFile] = useState<string | undefined>();
  const [size, setSize] = useState({ W: 1440, H: 900 });
  const root = useRef<HTMLDivElement>(null);
  const sprout = useSprout(GREETING, settings.sproutChatty);
  const { poke, say } = sprout;

  const toast = useCallback((text: string, xpText?: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => ts.concat([{ id, text, xp: xpText }]).slice(-3));
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 4200);
  }, []);

  /* ---- measure the stage (windows clamp to it; <760px maximizes) ---- */
  useLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const measure = () => setSize((s) => (s.W === el.offsetWidth && s.H === el.offsetHeight) || !el.offsetWidth ? s : { W: el.offsetWidth, H: el.offsetHeight });
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  const scale = useCallback(() => { const el = root.current; return el && el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth || 1 : 1; }, []);

  /* ---- actions ---- */
  const open = useCallback((id: AppId, max?: boolean) => { poke(); dispatch({ type: 'open', id, max }); }, [poke]);
  const setMenu = (menu: MenuKey | null) => dispatch({ type: 'menu', menu });
  const openLesson = useCallback((lessonId: string) => { setLessonRoute(lessonId); open('academy'); }, [open]);
  const openMission = useCallback((missionId: string) => { setMissionRoute(missionId); open('missions'); }, [open]);
  const openChart = useCallback(() => { open('universe'); setFitSignal((n) => n + 1); }, [open]);
  const onDockIcon = (id: AppId) => {
    const w = shell.wins[id];
    if (w.open && !w.min && shell.focus === id) dispatch({ type: 'minimize', id }); else open(id);
  };

  /* ---- learning: XP, achievements and the moments worth celebrating ---- */
  const notify: Notify = {
    xp: (n) => { setFly({ n, key: Date.now() }); setXpPulse((p) => p + 1); setTimeout(() => setFly(null), 1500); },
    toast,
    say: (t, m) => say(t, m ?? 'happy', 2400, true),
    levelUp: (n, name) => { toast(`Level ${n} · ${name}`, 'level up'); say(`Level ${n}. ${name}. I can feel myself growing, metaphorically and also literally.`, 'celebrating', 3000, true); },
    conceptCompleted: (conceptId, p) => {
      const c = conceptById(conceptId), region = REGIONS.find((r) => r.concepts.some((x) => x.id === conceptId))!, ri = REGIONS.indexOf(region);
      const lit = regionStatus(p)[ri].done, full = lit === 6;
      const lesson = lessonMetaForConcept(conceptId), mission = c?.missionId ? missionById(c.missionId) : undefined;
      setCele({
        kicker: `${mission ? 'PROJECT COMPLETE' : 'DISCOVERY LOGGED'} · ${region.name.toUpperCase()}`,
        title: full ? `${region.name} is fully grown.` : lit >= 5 ? `${region.name} is nearly grown.` : `${region.name} stirs.`,
        body: `${lesson ? lesson.title : c?.name} is complete. A new sprout has broken the surface of ${region.name}, and a star of ${region.constellation} is lit.` + (full && REGIONS[ri + 1] ? ` The route to ${REGIONS[ri + 1].name} is open.` : ''),
        gains: [`${lit} of 6 ${region.name} concepts`, lesson ? `Lesson ${pad(lesson.number)} complete` : mission?.reward?.artifact ?? 'Project complete'],
        lit, constLabel: `${region.constellation.toUpperCase()} · ${lit} OF 6 STARS LIT`,
        primaryLabel: 'See it on the chart', onPrimary: () => { setCele(null); openChart(); },
      });
      say(full ? 'A WHOLE PLANET. In bloom. Because of you.' : 'WE GREW A SPROUT. I am not crying, it is condensation.', 'celebrating', 3000, true);
    },
  };
  const needRefresh = useSyncExternalStore(subscribePwa, () => pwa.needRefresh, () => false);
  const offlineReady = useSyncExternalStore(subscribePwa, () => pwa.offlineReady, () => false);
  useEffect(() => { if (offlineReady) toast('Botanica OS now opens offline', 'Python joins it after its first run'); }, [offlineReady, toast]);
  const learning = useLearning({ kv, demo: !!demo, initialProgress, initialProgression: initialProgression ?? normalizeProgression(null), notify });
  const { progress, progression, xp, level } = learning;
  useEffect(() => onAnyRun(learning.ran), [learning.ran]);

  /* ---- persistence ---- */
  useEffect(() => {
    const t = setTimeout(() => { kv.set('layout', toLayout(shell)).catch(() => {}); }, LAYOUT_SAVE_MS);
    return () => clearTimeout(t);
  }, [kv, shell.wins, shell.ztop, shell.focus]);
  const changeSettings = (s: Settings) => { setSettings(s); kv.set('settings', s).catch(() => toast('Settings could not be saved on this device')); };

  /* ---- focus follows windows: into a window when it opens, back to its dock button when it hides ---- */
  const prevWins = useRef(shell.wins);
  useEffect(() => {
    const prev = prevWins.current; prevWins.current = shell.wins;
    for (const a of APPS) {
      const was = prev[a.id].open && !prev[a.id].min, is = shell.wins[a.id].open && !shell.wins[a.id].min;
      const sec = root.current?.querySelector<HTMLElement>(`section[data-app="${a.id}"]`);
      if (!was && is) sec?.focus({ preventScroll: true });
      if (was && !is && (!document.activeElement || document.activeElement === document.body || sec?.contains(document.activeElement))) {
        root.current?.querySelector<HTMLElement>(`[data-dock="${a.id}"]`)?.focus() ?? root.current?.querySelector<HTMLElement>('.mitem')?.focus();
      }
    }
  }, [shell.wins]);

  /* ---- global keyboard ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      poke();
      if (e.key === 'Escape' && shell.menu) { dispatch({ type: 'menu', menu: null }); return; }
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      const n = Number(e.key);
      const withGlyph = APPS.filter((a) => a.glyph);
      if (n >= 1 && n <= withGlyph.length) { e.preventDefault(); open(withGlyph[n - 1].id); }
      else if (e.key === ',') { e.preventDefault(); open('settings'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shell.menu, open, poke]);

  /* ---- backup ---- */
  const doExport = async () => {
    const data = await exportBackup(kv);
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = `botanica-backup-${data.exportedAt.slice(0, 10)}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Backup downloaded');
  };
  const doImport = async (f: File) => {
    let parsed: unknown;
    try { parsed = JSON.parse(await f.text()); } catch { throw new Error('That file could not be read as JSON.'); }
    await importBackup(kv, parsed);
    setSettings(normalizeSettings(await kv.get('settings')));
    if (!demo) learning.replace(normalizeProgress(await kv.get('progress')), normalizeProgression(await kv.get('progression')));
    dispatch({ type: 'restore', state: fromLayout(await kv.get('layout'), shell) });
  };

  useEffect(() => { if (demo) toast(`Demo preset “${demo}”. Progress shown is not yours and is not saved.`); }, [demo, toast]);

  /* ---- a streak greeting, once per launch ---- */
  const days = useMemo(() => streak(progression), [progression]);
  useEffect(() => {
    const d = streak(progression);
    if (d >= 2) { const t = setTimeout(() => say(`Day ${d} of your streak. The seedlings noticed.`, 'happy', 2000), 8000); return () => clearTimeout(t); }
  }, []); // once

  /* ---- menus ---- */
  const next = nextStep(progress);
  const nudge = () => next.kind === 'done' ? 'Every system on the chart is grown. You charted the Known Python. I am, frankly, in awe.'
    : next.kind === 'mission' ? `${next.title} is waiting in Missions. Every lesson before it is done.`
    : `Next stop: ${next.lesson.title}, ${next.lesson.regionName} Lesson ${pad(next.lesson.number)}. I believe in you, mostly.`;
  const withGlyph = APPS.filter((a) => a.glyph);
  const menus: Record<MenuKey, MenuItem[]> = {
    go: [
      ...withGlyph.map((a, i) => ({ label: a.longName, hint: '⌘' + (i + 1), run: () => open(a.id) })),
      { label: 'Settings', hint: '⌘,', run: () => open('settings'), sep: true },
    ],
    win: [
      { label: 'Arrange windows', hint: 'cascade', run: () => dispatch({ type: 'cascade' }) },
      { label: 'Minimize all', hint: 'to the tray', run: () => dispatch({ type: 'minimizeAll' }) },
      { label: 'Enter the Universe', hint: 'full view', run: () => { open('universe', true); setFitSignal((n) => n + 1); }, sep: true },
    ],
    help: [
      { label: 'Ask Sprout for a nudge', hint: '?', run: () => { setMenu(null); say(nudge(), 'happy', 2000, true); } },
      { label: 'Close menus and pop-ups', hint: 'Esc', run: () => setMenu(null), sep: true },
      { label: 'Open an app', hint: '⌘ 1–6', run: () => setMenu(null) },
      { label: 'Maximize a window', hint: 'double-click title', run: () => setMenu(null) },
    ],
  };

  const focusApp = shell.focus ? appById(shell.focus) : null;
  const sprite = spriteFlags(sprout.mood, stageForLevel(level.n), true);

  const body = (id: AppId) => {
    switch (id) {
      case 'settings': return <SettingsApp settings={settings} onChange={changeSettings} storageKind={kv.kind} onExport={doExport} onImport={doImport}
        onResetLayout={() => { dispatch({ type: 'resetLayout' }); toast('Windows back where they started'); }} />;
      case 'universe': return <UniverseApp progress={progress} fitSignal={fitSignal} scale={scale} onOpenLesson={openLesson} onOpenMission={openMission}
        onOpenMissions={() => open('missions')} onSay={(t) => say(t, 'happy', 1800)} />;
      case 'terminal': return <TerminalApp kv={kv} editorMode={settings.editor} onToast={toast} onActiveFile={setTermFile} />;
      case 'academy': return <AcademyApp kv={kv} progress={progress} route={lessonRoute} editorMode={settings.editor} learning={learning}
        onSay={(t, m) => say(t, m ?? 'happy', 2200)} onOpenChart={openChart} onOpenMission={openMission} onSub={setAcademySub} />;
      case 'missions': return <MissionsApp kv={kv} progress={progress} learning={learning} route={missionRoute} editorMode={settings.editor}
        onSay={(t, m) => say(t, m ?? 'happy', 2200)} onOpenLesson={openLesson} />;
      case 'profile': return <ProfileApp learning={learning} />;
      case 'workshop': return <WorkshopApp progress={progress} onOpenMission={openMission} />;
    }
  };

  return (
    <div className={'os' + (settings.motion === 'reduce' ? ' rm' : '')} ref={root} onPointerDownCapture={poke}
      style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '720px', overflow: 'hidden', background: '#efe8d6' }}>
      <Desktop next={next} selIcon={shell.selIcon} onSelect={(id) => { poke(); dispatch({ type: 'selectIcon', id }); }}
        onOpen={(id) => open(id)} onOpenMission={openMission} onOpenLesson={openLesson} />

      {APPS.map((a) => {
        const w = shell.wins[a.id];
        return (
          <Window key={a.id} app={a} win={w} g={geom(w, size.W, size.H)} focused={shell.focus === a.id} dispatch={dispatch} onActivity={poke} scale={scale}
            sub={a.id === 'terminal' ? termFile : a.id === 'academy' ? academySub : a.id === 'profile' ? `Logbook of ${progression.pilotName || 'an unnamed pilot'}` : undefined}>
            {w.open && <Suspense fallback={<div className="wbody" />}>{body(a.id)}</Suspense>}
          </Window>
        );
      })}

      <MenuBar focusName={focusApp ? focusApp.name : 'Desktop'} menu={shell.menu} setMenu={setMenu} menus={menus}
        streak={days + '-day streak'} xpText={xp.toLocaleString('en')} xpCls={xpPulse ? (xpPulse % 2 ? 'xpA' : 'xpB') : ''} onActivity={poke} />

      <Dock wins={shell.wins} focus={shell.focus} onIcon={onDockIcon} sprite={sprite} bubble={sprout.bubble} onPet={sprout.pet} z={cele ? 9600 : 9000} />
      <Toasts toasts={toasts} />
      {needRefresh && (
        <div className="update-bar" role="status">
          <span>A new version of Botanica OS is ready. Your work is saved.</span>
          <button className="btn moss" onClick={() => pwa.update()}>Reload now</button>
        </div>
      )}
      {fly && <div className="xpfly" key={fly.key} aria-hidden="true">+{fly.n} XP</div>}
      {cele && <Celebration c={cele} onClose={() => setCele(null)} />}
    </div>
  );
}
