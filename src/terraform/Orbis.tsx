// Orbis, the Terraform OS hub: a 1:1 port of the approved design (terraform-os-orbis-source, Main.dc.html),
// wired to real state. Windows run on the shared window manager (createShell); the menu bar is Botanica's
// MenuBar component under Orbis styling. Numbers come from buildJournal(), never from sample data.

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { MenuBar, type MenuItem } from '../shell/MenuBar';
import { Toasts, type Toast } from '../shell/Toasts';
import { Window } from '../shell/Window';
import { createShell, geom, type MenuKey } from '../shell/windowReducer';
import type { Settings } from '../storage/settings';
import { BotanicaDisc, Cygnus, HubIcon, Starfield, TransitPortal, WorldIcon, WorldPlate, type HubGlyph } from './art';
import type { JournalVals } from './journal';
import type { OrbisPrefs } from './prefs';
import { langLine, versionLine, WORLDS, worldById, type WorldId } from './worlds';

type HubId = 'orbis' | 'journal' | 'settings';
const HUB_APPS = [
  { id: 'orbis' as const, name: 'Orbis Explorer', longName: 'Orbis Explorer', sub: 'World Atlas', dot: '#b47e00', x: 150, y: 58, w: 1040, h: 648, minW: 620 },
  { id: 'journal' as const, name: 'Journal', longName: 'Journal', sub: 'Pilot log', dot: '#c95851', x: 250, y: 92, w: 904, h: 616, minW: 560 },
  { id: 'settings' as const, name: 'Settings', longName: 'Settings', sub: 'Terraform OS', dot: '#345a04', x: 430, y: 140, w: 560, h: 452, minW: 420 },
];
export const hubShell = createShell<HubId>(HUB_APPS);

const PETS = ['Careful — I have an appetite for stray photons.', 'Time runs slow this close to me. Take all you need.', 'Botanica is the green world. Enter it before I get hungry.', 'I swallowed a whole star once. Very filling. No regrets.'];
const ICONS: { id: HubId | 'botanica'; name: string; glyph: HubGlyph }[] = [
  { id: 'orbis', name: 'Orbis Explorer', glyph: 'orbis' }, { id: 'botanica', name: 'Botanica', glyph: 'botanica' },
  { id: 'journal', name: 'Journal', glyph: 'journal' }, { id: 'settings', name: 'Settings', glyph: 'settings' },
];
/** How long the transit card shows before Botanica takes over (skipped with reduced motion). */
export const TRANSIT_MS = 900;

interface Props {
  active: boolean;
  journal: JournalVals;
  settings: Settings;
  onSettings: (s: Settings) => void;
  prefs: OrbisPrefs;
  onPrefs: (p: OrbisPrefs) => void;
  fullscreen: boolean;
  onToggleFullscreen: () => Promise<boolean>;
  /** Hand off to a world's app; a lesson id resumes that lesson. Routed by the world's `entry`. */
  onEnterWorld: (worldId: WorldId, lessonId?: string) => void;
}

const fmt = (n: number) => n.toLocaleString('en');

export function Orbis({ active, journal: j, settings, onSettings, prefs, onPrefs, fullscreen, onToggleFullscreen, onEnterWorld }: Props) {
  const [shell, dispatch] = useReducer(hubShell.shellReducer, prefs.layout, (l) => hubShell.fromLayout(l, hubShell.initialShell('orbis')));
  const [size, setSize] = useState({ W: 1440, H: 900 });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [launching, setLaunching] = useState<{ world: WorldId; lessonId?: string } | null>(null); // null = closed
  const [comp, setComp] = useState({ react: false, bubble: null as string | null, pets: 0 });
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const prefsRef = useRef(prefs); prefsRef.current = prefs;
  const rm = settings.motion === 'reduce';
  const world = worldById(prefs.world);

  const later = (k: string, fn: () => void, ms: number) => { clearTimeout(timers.current[k]); timers.current[k] = setTimeout(fn, ms); };
  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);
  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => ts.concat([{ id, text }]).slice(-3));
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 3600);
  }, []);

  /* ---- measure the stage; a hidden hub (inside Botanica) keeps its last size ---- */
  useLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const measure = () => setSize((s) => (!el.offsetWidth || (s.W === el.offsetWidth && s.H === el.offsetHeight)) ? s : { W: el.offsetWidth, H: el.offsetHeight });
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  const scale = useCallback(() => { const el = root.current; return el && el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth || 1 : 1; }, []);

  /* ---- layout persists with the Orbis preferences ---- */
  useEffect(() => {
    const t = setTimeout(() => onPrefs({ ...prefsRef.current, layout: hubShell.toLayout(shell) }), 300);
    return () => clearTimeout(t);
  }, [shell.wins, shell.ztop, shell.focus]);

  /* ---- focus follows windows, as in Botanica ---- */
  const prevWins = useRef(shell.wins);
  useEffect(() => {
    const prev = prevWins.current; prevWins.current = shell.wins;
    for (const a of HUB_APPS) {
      const was = prev[a.id].open && !prev[a.id].min, is = shell.wins[a.id].open && !shell.wins[a.id].min;
      if (!was && is) root.current?.querySelector<HTMLElement>(`section[data-app="${a.id}"]`)?.focus({ preventScroll: true });
    }
  }, [shell.wins]);

  /* ---- actions ---- */
  const openApp = useCallback((id: HubId) => dispatch({ type: 'open', id }), []);
  const selectWorld = (id: WorldId) => {
    onPrefs({ ...prefsRef.current, world: id });
    if (!shell.wins.orbis.open || shell.wins.orbis.min) openApp('orbis');
  };
  /** Launch a specific world (defaults to the one selected in Explorer). */
  const enterWorld = useCallback((worldId: WorldId, lessonId?: string) => {
    dispatch({ type: 'menu', menu: null });
    setLaunching({ world: worldId, lessonId });
  }, []);
  /** Jump straight into Botanica from the hub's Botanica affordances. */
  const enterBotanica = useCallback((lessonId?: string) => enterWorld('botanica', lessonId), [enterWorld]);
  useEffect(() => {
    if (!launching) return;
    const t = setTimeout(() => { onEnterWorld(launching.world, launching.lessonId); setLaunching(null); }, rm ? 0 : TRANSIT_MS);
    return () => clearTimeout(t);
  }, [launching, rm, onEnterWorld]);
  const stir = () => {
    dispatch({ type: 'menu', menu: null });
    if (!prefs.showComp) { toast('Cygnus is dormant — enable the companion in Settings'); return; }
    const n = comp.pets + 1;
    setComp({ react: true, bubble: PETS[Math.min(n - 1, PETS.length - 1)], pets: n });
    later('mood', () => setComp((c) => ({ ...c, react: false })), 1400);
    later('bub', () => setComp((c) => ({ ...c, bubble: null })), 5000);
  };
  const toggleFs = async () => {
    const ok = await onToggleFullscreen();
    if (!ok) toast('Fullscreen is not available here');
  };
  const onIcon = (id: HubId | 'botanica') => { if (id === 'botanica') enterBotanica(); else openApp(id); };
  const onDock = (id: HubId | 'botanica') => {
    if (id === 'botanica') return enterBotanica();
    const w = shell.wins[id];
    if (w.open && !w.min && shell.focus === id) dispatch({ type: 'minimize', id }); else openApp(id);
  };

  /* ---- keyboard: the design's ⌘1–3 and ⌘, (only while Orbis is on screen) ---- */
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shell.menu) { dispatch({ type: 'menu', menu: null }); return; }
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      if (e.key === '1') { e.preventDefault(); openApp('orbis'); }
      else if (e.key === '2') { e.preventDefault(); enterBotanica(); }
      else if (e.key === '3') { e.preventDefault(); openApp('journal'); }
      else if (e.key === ',') { e.preventDefault(); openApp('settings'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, shell.menu, openApp, enterBotanica]);

  const menus: Record<MenuKey, MenuItem[]> = {
    go: [
      { label: 'Orbis Explorer', hint: '⌘1', run: () => openApp('orbis') },
      { label: 'Botanica', hint: '⌘2', run: () => enterBotanica() },
      { label: 'Journal', hint: '⌘3', run: () => openApp('journal') },
      { label: 'Settings', hint: '⌘,', run: () => openApp('settings') },
    ],
    win: [
      { label: 'Arrange windows', hint: 'cascade', run: () => dispatch({ type: 'cascade' }) },
      { label: 'Minimize all', hint: 'to the dock', run: () => dispatch({ type: 'minimizeAll' }) },
    ],
    help: [
      { label: 'Stir Cygnus', hint: '?', run: stir },
      { label: 'Drag a window by its title', hint: 'move', run: () => dispatch({ type: 'menu', menu: null }) },
      { label: 'Double-click a title', hint: 'maximize', run: () => dispatch({ type: 'menu', menu: null }) },
    ],
  };

  const focusApp = HUB_APPS.find((a) => a.id === shell.focus);
  const avail = world.status === 'available', n = WORLDS.indexOf(world) + 1;
  const circ = 2 * Math.PI * 46;
  const compSpin = rm || !prefs.sway ? '' : comp.react ? 'bh-spin fast' : 'bh-spin';
  const win = (id: HubId, body: React.ReactNode, sub?: string) => {
    const app = HUB_APPS.find((a) => a.id === id)!, w = shell.wins[id];
    return (
      <Window key={id} app={app} win={w} g={geom(w, size.W, size.H)} focused={shell.focus === id} dispatch={dispatch} onActivity={() => {}} scale={scale} sub={sub}>
        <div className="wbody">{body}</div>
      </Window>
    );
  };

  return (
    <div className={'os orbis' + (rm ? ' rm' : '')} ref={root}
      style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '640px', overflow: 'hidden', background: '#efe8d6' }}>

      {/* DESKTOP WALLPAPER */}
      <div className="desk" onPointerDown={(e) => { if (e.target === e.currentTarget || (e.target as Element).tagName?.toLowerCase() === 'svg') dispatch({ type: 'selectIcon', id: null }); }}>
        <Starfield />

        {/* DESKTOP ICONS */}
        <div className="dicons">
          {ICONS.map((ic) => (
            <button key={ic.id} className={'dicon' + (shell.selIcon === ic.id ? ' is-sel' : '')} aria-label={'Open ' + ic.name}
              onClick={() => { if (ic.id !== 'botanica') dispatch({ type: 'selectIcon', id: ic.id }); }} onDoubleClick={() => onIcon(ic.id)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onIcon(ic.id); } }}>
              <HubIcon k={ic.glyph} />
              <span className="lbl">{ic.name}</span>
            </button>
          ))}
        </div>

        {/* pinned note */}
        <div className="note">
          <span className="tape" aria-hidden="true"></span>
          <p className="mono" style={{ margin: '0 0 6px', fontSize: '11.5px', color: '#8a6000' }}>Terraform OS · bulletin</p>
          <p className="disp" style={{ margin: '0 0 4px', fontSize: '20px', lineHeight: '1.15' }}>Four worlds charted</p>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#63685c' }}>Botanica is open. Lithic, Aether &amp; Ironworks are terraforming.</p>
          <button className="btn moss sm" style={{ width: '100%' }} onClick={() => openApp('orbis')}>Open Orbis Explorer</button>
        </div>
      </div>

      {/* ORBIS EXPLORER WINDOW */}
      {win('orbis', (
        <div className="obx">
          <aside className="obx-list">
            <div className="obx-lh"><p className="disp" style={{ margin: '0' }}>Destinations</p><p className="mono" style={{ margin: '2px 0 0' }}>{WORLDS.length} worlds · {j.worldsOpen} open</p></div>
            <div className="obx-rows scroll">
              {WORLDS.map((w) => {
                const on = prefs.world === w.id, a = w.status === 'available';
                return (
                  <button key={w.id} className={'wrow' + (on ? ' on' : '')} onClick={() => selectWorld(w.id)} aria-pressed={on}>
                    <WorldIcon id={w.id} glow={w.color} />
                    <span className="wt"><b>{w.name}</b><span>{langLine(w)}</span></span>
                    <span className="wchip" style={{ color: on ? '#0e1630' : (a ? '#2f5204' : '#8a6000') }}>{a ? 'Open' : 'Soon'}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div className="obx-detail scroll">
            <div className="plate">
              <span className="pnum mono">SYSTEM {n} / {WORLDS.length}</span>
              <span className="pst"><span className="chip" style={{ color: avail ? '#a6d45f' : '#e2a93b', background: avail ? 'rgba(143,179,86,.2)' : 'rgba(226,169,59,.18)', borderColor: avail ? '#a6d45f' : '#e2a93b' }}><span className="sdot" style={{ background: avail ? '#a6d45f' : '#e2a93b' }}></span>{avail ? 'Available' : 'Coming soon'}</span></span>
              <span className="pframe"></span>
              <WorldPlate id={world.id} n={n} figName={world.figName} />
            </div>
            <div className="dbody">
              <p className="dkick">Orbis Atlas · {world.theme}</p>
              <h2>{world.name}</h2>
              <p className="dtheme">{world.sub}</p>
              <p className="blurb">{world.blurb}</p>
              <div className="drow"><span className="dk2">Languages</span><span className="langs">{world.langs.map((l) => <span key={l.name} className="langchip">{l.name}</span>)}</span></div>
              <div className="drow"><span className="dk2">Status</span><span style={{ fontSize: '14px' }}>{avail ? 'Available now — enter any time.' : 'Terraforming · preview only.'}</span></div>
              <div className="drow"><span className="dk2">{avail ? 'Release' : 'Planned'}</span><span className="mono" style={{ fontSize: '13px' }}>{versionLine(world)}</span></div>
              <div className="dact">
                {avail && <button className="btn moss" onClick={() => enterWorld(world.id)}><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#f6f2e8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 8 H12 M8 3 L13 8 L8 13"></path></svg>Enter {world.name}</button>}
                {!avail && <><button className="btn" disabled>Coming soon</button><span className="mono" style={{ fontSize: '12px', color: '#8a6000' }}>Preview only · {versionLine(world)}</span></>}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* JOURNAL WINDOW */}
      {win('journal', (
        <div className="jr scroll">
          <div className="jr-top">
            <div className="card cream jr-cont">
              <p className="dkick">Current world · continue</p>
              <div className="cont">
                <BotanicaDisc />
                <div style={{ minWidth: '0' }}><div className="cn disp">{j.next.title}</div><div className="cm">{j.next.where}</div></div>
              </div>
              <div className="prog"><i style={{ width: `${Math.round((j.next.done / Math.max(1, j.next.of)) * 100)}%` }}></i></div>
              <p className="mono" style={{ fontSize: '11.5px', color: '#63685c', margin: '0' }}>{j.next.note}</p>
              <div style={{ marginTop: '14px' }}><button className="btn moss sm" onClick={() => enterBotanica(j.next.lessonId ?? undefined)}>{j.lessonsDone ? 'Resume in Botanica' : 'Start in Botanica'}</button></div>
            </div>
            <div className="card jr-ring">
              <svg width="110" height="110" viewBox="-60 -60 120 120" role="img" aria-label={`Level ${j.level.n}, ${Math.round(j.level.frac * 100)} percent to the next`} style={{ flex: 'none' }}>
                <circle r="46" fill="none" stroke="#d6cdb5" strokeWidth="9"></circle>
                <circle r="46" fill="none" stroke="#b47e00" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(circ * j.level.frac).toFixed(1)} ${circ.toFixed(1)}`} transform="rotate(-90)"></circle>
                <text y="-2" textAnchor="middle" fontFamily="Young Serif, Georgia, serif" fontSize="30" fill="#242820">{j.level.n}</text>
                <text y="18" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#63685c" letterSpacing="1">LEVEL</text>
              </svg>
              <div><div className="disp" style={{ fontSize: '26px', lineHeight: '1' }}>{fmt(j.xp)} <span style={{ fontSize: '15px' }}>XP</span></div><p style={{ margin: '5px 0 0', fontSize: '12.5px', color: '#63685c' }}>{j.level.name} · {fmt(j.level.toNext)} XP to level {j.level.n + 1}</p></div>
            </div>
          </div>
          <div className="jr-stats">
            <div className="stat"><div className="sv">{j.lessonsDone}<span style={{ fontSize: '16px', color: '#63685c' }}> / {j.lessonsTotal}</span></div><div className="sl">Lessons done</div></div>
            <div className="stat"><div className="sv">{j.missionsDone}</div><div className="sl">Missions</div></div>
            <div className="stat"><div className="sv">{j.streak}</div><div className="sl">Day streak</div></div>
            <div className="stat"><div className="sv">{j.worldsOpen}<span style={{ fontSize: '16px', color: '#63685c' }}> / {j.worldsTotal}</span></div><div className="sl">Worlds open</div></div>
          </div>
          <p className="jr-h">Recent marks <small>Botanica</small></p>
          {j.marks.map((a, i) => (
            <div className="achv" key={i}><span className="am"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 12 L10 17 L19 7"></path></svg></span><div className="at"><b>{a.name}</b><span>{a.when}</span></div></div>
          ))}
          {!j.marks.length && <p style={{ margin: '0', fontSize: '13.5px', color: '#63685c' }}>No marks yet. Finish your first Botanica lesson to earn one.</p>}
        </div>
      ), j.pilotName ? `Logbook of ${j.pilotName}` : 'Pilot log')}

      {/* SETTINGS WINDOW */}
      {win('settings', (
        <div className="setb scroll">
          <p className="disp" style={{ fontSize: '20px', margin: '0 0 2px' }}>Preferences</p>
          <p className="mono" style={{ fontSize: '12px', color: '#63685c', margin: '0 0 10px' }}>Motion is shared with Botanica</p>
          <div className="setrow"><div className="srt"><b>Fullscreen</b><span>Use the whole screen for Terraform OS</span></div><button className="btn sm" onClick={toggleFs}>{fullscreen ? 'Exit' : 'Enter'}</button></div>
          <div className="setrow"><div className="srt"><b>Reduce motion</b><span>Still the swaying, drifting and spins</span></div><button className={'toggle' + (rm ? ' on' : '')} role="switch" aria-checked={rm} aria-label="Reduce motion" onClick={() => onSettings({ ...settings, motion: rm ? 'system' : 'reduce' })}><i></i></button></div>
          <div className="setrow"><div className="srt"><b>Show companion</b><span>Keep Cygnus in the dock</span></div><button className={'toggle' + (prefs.showComp ? ' on' : '')} role="switch" aria-checked={prefs.showComp} aria-label="Show companion" onClick={() => { setComp((c) => ({ ...c, bubble: null })); onPrefs({ ...prefs, showComp: !prefs.showComp }); }}><i></i></button></div>
          <div className="setrow"><div className="srt"><b>Accretion disk</b><span>Let Cygnus&#39;s disk keep turning</span></div><button className={'toggle' + (prefs.sway ? ' on' : '')} role="switch" aria-checked={prefs.sway} aria-label="Accretion disk" onClick={() => onPrefs({ ...prefs, sway: !prefs.sway })}><i></i></button></div>
        </div>
      ))}

      {/* MENUBAR */}
      <MenuBar brand="Terraform OS" focusName={focusApp ? focusApp.name : 'Desktop'} menu={shell.menu} setMenu={(m) => dispatch({ type: 'menu', menu: m })}
        menus={menus} xpText={fmt(j.xp)} onActivity={() => {}} />

      {/* DOCK + COMPANION */}
      <nav className="dock" aria-label="Terraform dock">
        {ICONS.map((ic) => {
          const running = ic.id !== 'botanica' && shell.wins[ic.id].open;
          return (
            <button key={ic.id} className="dk" data-dock={ic.id} onClick={() => onDock(ic.id)} aria-label={'Open ' + ic.name}>
              <HubIcon k={ic.glyph} dock />
              <span className="tip">{ic.name}</span>
              {running && <span className="run"></span>}
            </button>
          );
        })}
        <span className="dsep" aria-hidden="true"></span>
        <div className="pot">
          {prefs.showComp && <>
            <button className="sprout-btn" onClick={stir} aria-label="Stir Cygnus, the hub's black hole"><Cygnus spin={compSpin} react={comp.react && !rm} /></button>
            {comp.bubble && <div className="bubble" role="status"><span className="who">Cygnus</span>{comp.bubble}</div>}
          </>}
        </div>
      </nav>

      {/* LAUNCH OVERLAY: a short transit, then the real world takes over */}
      {launching && (() => { const w = worldById(launching.world); return (
        <div className="cele" role="dialog" aria-modal="true" aria-label={`Entering ${w.name}`}>
          <div className="cele-card">
            <TransitPortal />
            <p className="mono" style={{ margin: '0 0 6px', fontSize: '12px', color: '#8a6000', letterSpacing: '.04em' }}>TRANSIT · ORBIS → {w.name.toUpperCase()}</p>
            <p className="disp" style={{ margin: '0 0 10px', fontSize: '30px' }}>Entering {w.name}</p>
            <p style={{ margin: '0 auto 18px', fontSize: '14.5px', lineHeight: '1.55', color: '#3c4036', maxWidth: '400px' }}>Opening {w.name} exactly as you left it. Your XP, lessons and missions come with you.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}><button className="btn pri" onClick={() => setLaunching(null)}>Back to Orbis</button></div>
          </div>
        </div>
      ); })()}

      <Toasts toasts={toasts} />
    </div>
  );
}
