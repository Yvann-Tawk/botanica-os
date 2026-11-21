// The Lithic world shell: the Terraform OS shell (menu bar, window, dock) re-skinned geological, hosting the
// Survey navigator and the HTML Academy. Modeled on how Orbis renders its own shell — reuses MenuBar, Window
// and createShell. The single workspace window shows the Survey, or the open lesson's Academy. Authored lessons
// open the Academy; unauthored ones (not yet written) open an honest "coming soon" card.

import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { MenuBar, type MenuItem } from '../shell/MenuBar';
import { Window, type WinChrome } from '../shell/Window';
import { createShell, geom, type MenuKey, type WinDef } from '../shell/windowReducer';
import { isDone } from '../progression/progress';
import type { KV } from '../storage/db';
import { lithicLessonById } from './curriculum';
import { useLithicLearning } from './store';
import { htmlLessonById, daxLessonById, AUTHORED_LESSON_IDS } from './content';
import { runHtmlChecks } from './runtime/htmlChecks';
import { runDaxChecks } from './runtime/dax/checks';
import { HtmlWorkspace } from './academy/HtmlWorkspace';
import { DaxWorkspace } from './academy/DaxWorkspace';
import type { AcademyAwards } from './academy/LithicAcademy';

const SurveyApp = lazy(() => import('./survey/SurveyApp'));
const LithicAcademy = lazy(() => import('./academy/LithicAcademy'));
interface Saved { code: Record<string, string>; passed: Record<string, boolean>; hints: Record<string, number>; done: Record<string, boolean> }

type LithicId = 'survey';
const LITHIC_APPS: readonly WinDef<LithicId>[] = [{ id: 'survey', x: 60, y: 64, w: 1060, h: 624, minW: 520 }];
const lithicShell = createShell<LithicId>(LITHIC_APPS);
const CHROME: Record<LithicId, WinChrome<LithicId>> = {
  survey: { id: 'survey', name: 'Survey', longName: 'Survey', sub: 'Lithic — The World Beneath', dot: '#c6b48c' },
};

function Wallpaper() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}>
      <defs>
        <pattern id="liWpDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#242820" opacity="0.13"></circle></pattern>
      </defs>
      <rect width="1440" height="900" fill="#efe8d6"></rect>
      <rect width="1440" height="900" fill="url(#liWpDots)"></rect>
      <g fill="none" stroke="#242820">
        <circle cx="1010" cy="420" r="300" strokeOpacity="0.16" strokeWidth="1.2"></circle>
        <circle cx="1010" cy="420" r="470" strokeOpacity="0.18" strokeWidth="1.2"></circle>
      </g>
      <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#242820" fillOpacity="0.5" letterSpacing="1">
        <text x="1206" y="836">PLATE II — THE LITHIC SHELF</text>
      </g>
      {/* the great specimen: a cut geode */}
      <circle cx="1010" cy="420" r="228" fill="#c6b48c" stroke="#242820" strokeWidth="2"></circle>
      <circle cx="1010" cy="420" r="150" fill="#8A78A6" opacity="0.9" stroke="#242820" strokeWidth="2"></circle>
      {/* strata hills */}
      <path d="M0 640 C 200 598, 380 612, 560 640 S 900 700, 1100 656 S 1340 606, 1440 626 L1440 900 L0 900 Z" fill="#ddd3ba" stroke="#242820" strokeWidth="1.5"></path>
      <path d="M0 724 C 180 672, 340 694, 520 728 S 860 762, 1060 724 S 1320 688, 1440 704 V900 H0 Z" fill="#c6b48c" stroke="#242820" strokeWidth="1.5"></path>
      <path d="M0 806 C 220 768, 420 792, 640 822 S 1000 846, 1200 810 S 1380 786, 1440 794 V900 H0 Z" fill="#8a6f3e" stroke="#242820" strokeWidth="1.5"></path>
    </svg>
  );
}

interface Props {
  kv: KV;
  /** Botanica's XP, so the shell shows a single global total (Botanica + Lithic). */
  baseXp: number;
  active: boolean;
  fullscreen: boolean;
  onToggleFullscreen: () => Promise<boolean>;
  onExitToOrbis: () => void;
  /** Bumped when Orbis hands off; optionally frames a planet / resumes a lesson. */
  resume?: { lessonId?: string; key: number };
}

export default function LithicApp({ kv, baseXp, active, fullscreen, onToggleFullscreen, onExitToOrbis, resume }: Props) {
  const learn = useLithicLearning(kv);
  const [shell, dispatch] = useReducer(lithicShell.shellReducer, undefined, () => lithicShell.initialShell('survey'));
  const [size, setSize] = useState({ W: 1440, H: 860 });
  const [fitSignal, setFitSignal] = useState(1);
  const [framePlanet, setFramePlanet] = useState<string | null>(null);
  const [lessonCard, setLessonCard] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved | undefined>();
  const root = useRef<HTMLDivElement>(null);
  const xpText = (baseXp + learn.xp).toLocaleString('en');

  useLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const measure = () => setSize((s) => (!el.offsetWidth || (s.W === el.offsetWidth && s.H === el.offsetHeight)) ? s : { W: el.offsetWidth, H: el.offsetHeight });
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  const scale = useCallback(() => { const el = root.current; return el && el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth || 1 : 1; }, []);

  // On hand-off from Orbis: re-fit the Survey; if resuming a known lesson, frame its planet.
  useEffect(() => {
    if (!resume) return;
    const l = resume.lessonId ? lithicLessonById(resume.lessonId) : null;
    setFramePlanet(l ? planetIdForLesson(l.id) : null);
    setFitSignal((n) => n + 1);
    dispatch({ type: 'open', id: 'survey' });
  }, [resume]);

  // Authored lessons open the Academy (loading any saved work); the rest open the honest "coming soon" card.
  const openLesson = useCallback((lessonId: string) => {
    if (!AUTHORED_LESSON_IDS.has(lessonId)) { setLessonCard(lessonId); return; }
    setSaved(undefined);
    kv.get(`li-lesson:${lessonId}`).catch(() => undefined).then((raw) => setSaved((raw as Saved) ?? { code: {}, passed: {}, hints: {}, done: {} }));
    setOpenLessonId(lessonId);
  }, [kv]);
  const saveLesson = useCallback((id: string, s: Saved) => { setSaved(s); kv.set(`li-lesson:${id}`, s).catch(() => {}); }, [kv]);
  const closeLesson = useCallback(() => { setOpenLessonId(null); setFitSignal((n) => n + 1); }, []);

  const toggleFs = useCallback(() => { void onToggleFullscreen(); dispatch({ type: 'menu', menu: null }); }, [onToggleFullscreen]);
  const setMenu = useCallback((m: MenuKey | null) => dispatch({ type: 'menu', menu: m }), []);
  const menus: Record<MenuKey, MenuItem[]> = useMemo(() => ({
    go: [
      { label: 'Survey', hint: '⌘1', run: () => { dispatch({ type: 'open', id: 'survey' }); setFitSignal((n) => n + 1); } },
      { label: 'Return to Orbis', hint: '⌘⌫', run: onExitToOrbis, sep: true },
    ],
    win: [
      { label: fullscreen ? 'Exit fullscreen' : 'Enter fullscreen', hint: '⌃⌘F', run: toggleFs },
      { label: 'Re-centre the Survey', hint: '0', run: () => setFitSignal((n) => n + 1) },
    ],
    help: [{ label: 'The Lithic Survey', hint: '', run: () => setFitSignal((n) => n + 1) }],
  }), [fullscreen, toggleFs, onExitToOrbis]);

  // keyboard shortcuts (only while this world is active)
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === '1') { e.preventDefault(); dispatch({ type: 'open', id: 'survey' }); setFitSignal((n) => n + 1); }
      else if (mod && (e.key === 'Backspace')) { e.preventDefault(); onExitToOrbis(); }
      else if (e.key === 'Escape' && lessonCard) { e.preventDefault(); setLessonCard(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onExitToOrbis, lessonCard]);

  const g = geom(shell.wins.survey, size.W, size.H);
  const lesson = lessonCard ? lithicLessonById(lessonCard) : null;
  const htmlLesson = openLessonId ? htmlLessonById(openLessonId) : null;
  const daxLesson = openLessonId && !htmlLesson ? daxLessonById(openLessonId) : null;
  const academyLesson = htmlLesson ?? daxLesson;
  const winSub = academyLesson ? `${htmlLesson ? 'The Foundation' : 'The Crystal Matrix'} · ${academyLesson.title}` : 'Lithic — The World Beneath';

  return (
    <div className="os" ref={root} style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '720px', overflow: 'hidden', background: '#efe8d6' }}>
      <MenuBar brand="Lithic" focusName={academyLesson ? 'Academy' : 'Survey'} menu={shell.menu} setMenu={setMenu} menus={menus} xpText={xpText} onActivity={() => {}} />

      <div className="desk">
        <Wallpaper />
      </div>

      <Window app={CHROME.survey} win={shell.wins.survey} g={g} focused={shell.focus === 'survey'} dispatch={dispatch} onActivity={() => {}} scale={scale} sub={winSub}>
        <Suspense fallback={<div className="wbody" style={{ background: '#17130d' }} />}>
          {htmlLesson && saved
            ? <div className="wbody"><LithicAcademy lesson={htmlLesson} completed={isDone(learn.progress, htmlLesson.conceptId)} initial={saved} awards={learn.awards as AcademyAwards} onSave={(s) => saveLesson(htmlLesson.id, s)} onExit={closeLesson} kicker="The Foundation · HTML" fileName="page.html" runChecks={(code, checks) => runHtmlChecks(code, checks as Parameters<typeof runHtmlChecks>[1])} Workspace={HtmlWorkspace} /></div>
            : daxLesson && saved
            ? <div className="wbody"><LithicAcademy lesson={daxLesson} completed={isDone(learn.progress, daxLesson.conceptId)} initial={saved} awards={learn.awards as AcademyAwards} onSave={(s) => saveLesson(daxLesson.id, s)} onExit={closeLesson} kicker="The Crystal Matrix · DAX" fileName="measure.dax" runChecks={(code, checks) => runDaxChecks(code, checks as Parameters<typeof runDaxChecks>[1])} Workspace={DaxWorkspace} /></div>
            : academyLesson
            ? <div className="wbody" style={{ background: '#f6f2e8' }} />
            : <SurveyApp progress={learn.progress} fitSignal={fitSignal} framePlanet={framePlanet} scale={scale} onOpenLesson={openLesson} onReturnToOrbis={onExitToOrbis} />}
        </Suspense>
      </Window>

      {/* dock */}
      <nav className="dock" aria-label="Lithic dock">
        <button className="dk" onClick={() => { dispatch({ type: 'open', id: 'survey' }); setFitSignal((n) => n + 1); }} aria-label="Open the Survey">
          <span className="tip">Survey</span>
          <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true"><path d="M10 14 L26 10 L40 14 L54 10 V 50 L40 54 L26 50 L10 54 Z" fill="#eae4d5" stroke="#242820" strokeWidth="2" strokeLinejoin="round"></path><path d="M26 10 V 50 M40 14 V 54" stroke="#242820" strokeWidth="1.6" opacity="0.6"></path><circle cx="33" cy="30" r="3.4" fill="#c95851" stroke="#242820" strokeWidth="1.6"></circle></svg>
          {shell.wins.survey.open && <span className="run"></span>}
        </button>
        <div className="dsep"></div>
        <button className="dk" onClick={onExitToOrbis} aria-label="Return to Orbis">
          <span className="tip">Return to Orbis</span>
          <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="#1b2440" stroke="#242820" strokeWidth="2"></circle><ellipse cx="32" cy="32" rx="26" ry="8" fill="none" stroke="#b47e00" strokeWidth="2.4" transform="rotate(-18 32 32)"></ellipse><circle cx="32" cy="32" r="8" fill="#0d1226"></circle></svg>
        </button>
      </nav>

      {/* honest Stage-2 placeholder for a lesson node */}
      {lesson && (
        <div className="cele" role="dialog" aria-modal="true" aria-label="Lesson workspace">
          <div className="cele-card">
            <p className="mono" style={{ margin: '0 0 6px', fontSize: '12px', color: '#8a6000', letterSpacing: '.04em' }}>THE FOUNDATION · HTML</p>
            <p className="disp" style={{ margin: '0 0 10px', fontSize: '28px' }}>{lesson.title}</p>
            <p style={{ margin: '0 auto 18px', fontSize: '14.5px', lineHeight: 1.55, color: '#3c4036', maxWidth: '420px' }}>
              The Survey and your progress are live. The HTML lesson workspace — editor, live sandboxed preview, exercises, recap and three missions — is being built and lands in the next update.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              <button className="btn pri" onClick={() => setLessonCard(null)}>Back to the Survey</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Which planet a lesson id belongs to (ids are `li-<lang>-<mini>-l<n>`; only HTML maps to a planet today). */
function planetIdForLesson(lessonId: string): string | null {
  if (lessonId.startsWith('li-html-')) return 'foundation';
  if (lessonId.startsWith('li-dax-')) return 'matrix';
  if (lessonId.startsWith('li-m-')) return 'refinery';
  return null;
}
