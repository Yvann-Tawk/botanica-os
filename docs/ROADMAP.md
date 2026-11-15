# Botanica OS — Roadmap

| # | Milestone | Depends on | Core deliverable |
|---|---|---|---|
| 0 | Audit & foundation | — | These docs ✅ |
| 1 | Functional OS shell | 0 | Vite/React/TS port of shell with pixel-faithful CSS; windows, menus, dock, Sprout, settings persisted ✅ |
| 2 | Cosmic map | 1 | Universe port; planets driven by a real progress store and curriculum graph ✅ |
| 3 | Python runtime | 1 | Pyodide worker, timeouts/stop, Monaco (lazy), console, drafts in IndexedDB ✅ |
| 4 | Academy | 2, 3 | Lesson engine + data schema; Galaxy 01 lessons 1–5; validation harness ✅ |
| 5 | Missions & progression | 4 | Mini-project, missions, XP rules, mastery, achievements data, Sprout reactions ✅ |
| 6 | PWA & polish | 3–5 | Manifest, service worker, offline Pyodide cache, a11y pass, Playwright suite ✅ |
| 7 | Open-source release | 6 | README, CONTRIBUTING, CoC, license choice, templates, release checklist ✅ |

Milestones 2 and 3 are independent once 1 lands and can be worked in parallel.

## Milestone 1 — implementation plan

**Goal:** the prototype's shell running as a real app, visually identical at 1440×900, with no fake learning features presented as real.

### Files
```
package.json, vite.config.ts, tsconfig.json (strict), index.html, .gitignore, vitest config
src/main.tsx, src/App.tsx
src/styles/{tokens,base,shell,sprout,overlays}.css         ← copied verbatim from Main.dc.html
src/styles/{universe,academy,editor,missions,terminal,profile}.css ← copied verbatim (used from M2+)
src/shell/Desktop.tsx        wallpaper SVG + icons + note
src/shell/Wallpaper.tsx      star chart, planet, hills, ferns (static decoration precomputed with the seeded rng)
src/shell/DesktopIcons.tsx, DeskIconArt.tsx
src/shell/MenuBar.tsx, Menus.tsx
src/shell/Dock.tsx
src/shell/Window.tsx         title bar, pinstripes, min/max/close, drag, resize, dbl-click
src/shell/windowReducer.ts   open/close/min/max/focus/move/resize/cascade/minimizeAll + geometry clamp
src/shell/apps.ts            APPS registry (id, title, dot color, default geometry, minW, lazy component)
src/shell/Toasts.tsx, Celebration.tsx, XpFly.tsx
src/shell/ShellContext.tsx   shell state + actions
src/mascot/Sprout.tsx, useSprout.ts
src/storage/db.ts            IndexedDB (v1: settings, windowLayout) with migration hook
src/storage/settings.ts      reducedMotion override, openOnStart, sound off, Sprout chattiness
src/apps/*/<App>.tsx         placeholder bodies that say “Coming in Milestone N” in the house style — no fake progress
src/apps/settings/SettingsApp.tsx  new small window, styled with existing window + control classes
tests/windowReducer.test.ts, tests/shell.test.tsx, tests/settings.test.ts
```

### Behaviour
- Everything the prototype's shell does (see FEATURE_INVENTORY → Shell) works the same.
- Adds: Esc closes menus/celebration; focus restore; `aria-live` toasts; menus as `role="menu"` with arrow keys; window layout + settings persist across reloads; `?start=universe` route replaces reference boards.
- Fake data (`journey`, Ilse Marrow, preset XP) removed; XP pill shows 0 until M5. A dev-only `?demo=current` fixture keeps the prototype views for visual comparison.

### Acceptance criteria
1. `npm run dev` / `npm run build` / `npm test` / `npm run typecheck` all pass.
2. Side-by-side screenshot of desktop at 1440×900 matches the prototype (manual review, then a Playwright visual baseline).
3. All window operations work with mouse and keyboard; layout survives reload.
4. ≤760px: windows auto-maximize, dock compacts, no horizontal scroll.
5. Reduced motion respected, both via OS and settings toggle.
6. Initial JS for the shell < 150 KB gzip; app windows lazy-loaded.
7. Unit tests cover window reducer and settings persistence (incl. storage failure fallback).

### Milestone 1 — as delivered (2026-11-13)
- Decisions taken (approved defaults): no Tailwind; self-hosted fonts via `@fontsource`; Settings window added; fake progress removed (XP 0, 0-day streak, logbook name later).
- Deviations from the plan above:
  - CSS kept as **one verbatim file** `src/styles/prototype.css` (plus `additions.css` for new rules) instead of per-section files. Splitting bought nothing and risked drift.
  - `Celebration` and `XpFly` are **deferred to M5**: nothing can earn XP honestly yet, so they would be dead code.
  - The `?demo=` fixture is deferred to M2, when there is a ported app view worth comparing. `?start=<app|desktop>` works now.
  - Art was ported with a mechanical converter (DC markup → JSX), not retyped, so SVG paths are byte-identical.
  - Added: backup download/restore (JSON), storage fallback IndexedDB → localStorage → memory, ⌘/Ctrl+1–6 and ⌘/Ctrl+, shortcuts (some browsers reserve ⌘+number).
- Verified: `npm run typecheck`, `npm test` (35 tests), `npm run build` (shell JS 57 KB gzip; app bodies lazy-loaded), desktop at 1440×900 and phone at 375×812 checked in a browser.
- Not yet done: Playwright visual baseline (planned for M6 with the e2e suite); the menu bar overflows below ~420px, the same as in the prototype.

### Milestone 2 — as delivered (2026-11-13)
- **Curriculum graph** (`src/content/curriculum.ts`): the prototype's 8 regions × 6 concepts, now with stable concept ids, prerequisites and lesson ids. Origins' six moons are the Galaxy 01 brief: Hello Python, Variables, Data types, Operators, User input, and the project "Seed Bank Ledger" (needs all five). This replaces the prototype's Origins list (print, comments, variables & types, numbers, strings, input).
- **Progress store** (`src/progression/progress.ts`): completions per concept, persisted under `progress`, included in backups. Unlock rules are the prototype's (open / charted / sealed, "you are here"), computed from real data. Nothing writes completions yet: that is the Academy (M4).
- **Universe window**: markup ported mechanically; drag, wheel and pinch zoom, buttons, hover preview, specimen sheet. New: keyboard drifting (arrows, +/−, 0), Esc closes the sheet, concept rows are buttons that open the lesson in the Academy (which shows which lesson was requested until M4).
- **Exploration over gating**: any concept with content can be opened from an open or charted system, not only the next one. Sealed systems stay closed.
- **Wording changes**: "mastered" → "complete" / "fully grown", since mastery is tracked separately in M5. The charted-route note no longer mentions The Seed Vault (that mission doesn't exist yet).
- **`?demo=new|current|seasoned`** shows the prototype's three journeys for visual comparison; a toast says so, and it is never saved.
- Verified: 50 tests, typecheck, build; checked in a browser at 1440×900 against the prototype (new, current, seasoned).

### Milestone 3 — as delivered (2026-11-13)
- **Python**: Pyodide 0.27.8 (CPython 3.12.7) in a module Web Worker, self-hosted from `public/pyodide` (copied by `scripts/copy-pyodide.mjs` before dev/build; not committed). Loaded lazily when a code surface opens.
- **Cross-origin isolation** is on (COOP/COEP in `vite.config.ts` and `vercel.json`). That enables:
  - real `input()`: Python blocks on a SharedArrayBuffer until the learner answers in the console;
  - a clean Stop: a KeyboardInterrupt first, then terminate + restart the worker after 1.5 s if Python ignores it.
  Without isolation the app runs in "limited mode": `input()` can only read lines supplied before the run, and Stop always restarts Python. The status bar says so.
- **Limits**: 10 s of run time per run (time waiting for input doesn't count), 200,000 characters of output per run. Each file run starts with fresh globals; the `>>>` line continues the last run's variables.
- **Errors**: tracebacks with the runtime's own frames removed; Sprout's explanations now cover real CPython messages (`src/runtime/explain.ts`).
- **Editor**: the prototype's lightweight editor appears instantly; Monaco (core + Python grammar only, themed to the prototype) replaces it on screens ≥ 760 px. A Settings option keeps the simple editor everywhere. Monaco is 840 KB gzip, loaded only when an editor opens.
- **Terminal**: the prototype's three files, drafts saved as you type, real saved snippets (save, open, edit, delete), Hint, Reset, Run/Stop, console, `>>>` prompt, status bar. The prototype's Validate button is gone until exercise validation exists (M4).
- **Reusable for M4/M5**: `usePythonSession` (run + console + input + tips), `CodeEditor`, `Console`.
- Security note: the worker isolates execution from the UI thread, not from the page's origin. It is meant for running your own code, not untrusted code.
- Verified: 76 tests (including 9 against real Python in Node), typecheck, production build; in the browser (dev and production build): run, `input()`, Stop on `while True`, error tips, drafts surviving reload.

### Milestone 4 — as delivered (2026-11-13)
- **Lesson schema** (`src/content/lessons/types.ts`): id, concept, number, title, description, objectives, difficulty, minutes, XP (awarded in M5), and five stages. Prerequisites come from the curriculum graph.
- **Stages**: the prototype's five, mapped onto the brief's flow: Discover (= Discover + Understand: explanation, objectives, worked example, reference tags) → Experiment (guided play in the live editor) → Practice (guided, validated) → Challenge (unguided, validated) → Master (knowledge check). A lesson **completes only when Practice, Challenge and Master all pass**. Opening or reading a lesson never completes it. Completed lessons can be revisited.
- **Galaxy 01 · Origins**: Hello Python, Variables, Data types (the prototype's lesson, nearly word for word), Operators, User input. Each has 3 objectives, a worked example, an experiment, a practice and a challenge with 3 progressive hints each, and a 3-question quiz. The guided project (6th Origins moon) is scheduled with Missions in M5.
- **Validation engine** (Python side, in `pyCore.ts`): runs the program silently with given `input()` lines and evaluates structured checks: `runs`, `output` (exact lines / contains / regex), `var` (exact type, value, non-empty), `source` (used sparingly), `cases` (re-run with other stdin: hidden test cases), `variants` (re-run with other starting values: hidden test cases), `call` (function return values, for later galaxies). Floats compare with tolerance; bool is never accepted as int.
- **Content is tested against real Python**: for every exercise, reference solutions and alternatives (e.g. `divmod`, `float()`, one `print` with `\n`) pass every check; starters and common wrong answers (hard-coded answers, wrong operator, no conversion) fail. 25 tests.
- **Honesty about checks**: the UI says checks run on the device and guide rather than grade; the code says they are readable by anyone.
- **Saved per lesson** (`lesson:<id>`): stage, code for each stage, passed gates, last check ticks, hints revealed, quiz answers, attempt counts (for M5 mastery). Completion goes to the progress store, which lights the chart, moves "You are here", and updates the desktop note.
- **Celebration** (deferred in M1) is now real: it appears on lesson completion and shows real constellation progress, without XP (M5).
- Verified: 104 tests, typecheck, build; in the browser, Lesson 1 completed end to end with real Python (failing starter → traceback + tip → fix → checks pass → quiz → celebration → chart shows 1 of 48 and "You are here · Variables" after a reload).

### Milestone 5 — as delivered (2026-11-13)
- **Event log** (`progression` in IndexedDB): every meaningful learning action is an event. XP, levels, streaks, mastery and achievements are all *derived* from it (`src/progression/engine.ts`, pure functions).
- **XP without farming**: XP comes from unique award keys (`ex:<lesson>:practice`, `quiz:<lesson>`, `lesson:<id>`, `mission:<id>`, `ms:vault:<n>`, `region:<id>`, `first-run`). Repeating work is logged but pays 0. Values: practice 40, challenge 60, quiz 30, lesson 100–150, milestones 50, missions 50–600, a fully grown region 200. Levels use the prototype's table and names.
- **Mastery ≠ XP ≠ completion**: per concept, from evidence: practice .25, challenge .35, quiz .25, independence .15 (challenge with ≤1 hint and quiz right first time), plus .1 per reinforcing mission. Levels: seen / practised / mastered (≥ .85). The logbook shows it per concept.
- **Achievements as data** (`src/content/achievements.ts`): the prototype's patches (First Light, Name-Giver, Six Suns, Error Whisperer, Specimen Clerk, Loop Gardener, Archivist) plus Origin Keeper, with declarative rules. Toast + Sprout on unlock.
- **Missions** (`src/content/missions.ts`): Hello Hortensia, Label the Specimen (the prototype's mission), Even Decks, and two sealed ones that need future galaxies. Locked missions say what's missing and link to the lesson.
- **Origins guided project: The Seed Vault**: one program built over four milestones (input → arithmetic → // and % → a decision), each validated with hidden cases before the next opens. Completing it completes the 6th Origins concept, grows Origins in full, and opens the route to The Flow. (The Flow's concepts show "No lesson yet": its content is future work.)
- **Pilot logbook**: the prototype's two-page book on real data: level ring, XP, streak week, recent completions with mastery, Sprout stages and moods, mastery constellation, constellations, patches, artifacts. The pilot's name is editable (replaces the prototype's fixed "Ilse Marrow").
- **Workshop**: The Seed Vault bench opens with the five lessons; other benches stay sealed until their systems exist.
- **Sprout**: reacts to checks, milestones, completions, achievements, level-ups, and greets a running streak.
- **Migration**: lessons completed in M4 (before the log existed) are credited once from their saved lesson records.
- Verified: 121 tests (including the project's four milestones in real Python and the XP-once rule), typecheck, build; in the browser: a real mission completed (+60 XP, two patches, 1-day streak), logbook and Workshop reflect it.

### Milestone 6 — as delivered (2026-11-13)
- **Installable PWA** (`vite-plugin-pwa`): manifest, icons (`public/icon.svg` → PNGs via `npm run icons`, including maskable and Apple touch), standalone display, paper theme colour.
- **Offline strategy** (explicit):
  - *Precached at install* (≈4.3 MB): HTML, all JS/CSS chunks including Monaco and its worker, self-hosted fonts, icons. The app opens offline.
  - *Python* (≈10 MB, `public/pyodide/`): cache-first at runtime, stored the first time it loads; Settings → Offline can store it ahead of time and shows whether it's on the device. `ignoreVary` is required: servers send `Vary: Origin` and module imports carry an Origin header, so a strict match missed the cache offline.
  - Cross-origin isolation survives offline (headers are kept on cached responses), so `input()` and Stop still work.
- **Updates**: prompt mode. A new version shows "A new version of Botanica OS is ready. Your work is saved." with **Reload now**; nothing swaps under the learner mid-run. The service worker is registered in production builds only.
- **End-to-end tests** (`npm run test:e2e`, Playwright against the production build): desktop + isolation, real Python in the Terminal (run, `input()`, Stop, REPL), Academy validation, offline reload with Python running, lazy loading (no Python/Monaco on the desktop), keyboard-only navigation, and an **axe WCAG 2.1 AA scan of the shell and every window**. `PW_CHANNEL=chrome` uses an installed Chrome instead of Playwright's download.
- **Accessibility fixes found by the scans** (design deviations, justified):
  - A prototype bug: `.os button{color:inherit}` outranked single-class button colours, so the Terminal's tabs and Hint/Save/Reset buttons were ink-on-dark (≈1.1:1). Fixed by restating the intended colours.
  - Sealed mission tickets used `opacity:.72`, dropping text below 4.5:1. They now use a dimmer card instead of fading text.
  - Code gutter numbers `#5f6a55` (3.0:1) → `#7f8a74` (≈4.9:1).
  - Scrollable text regions (lesson text, mission brief, logbook, Workshop, Settings, console) are keyboard-focusable and labelled.
- **Performance**: shell JS 60 KB gzip; desktop DOMContentLoaded < 3 s asserted; Python and Monaco are never requested until a code window opens (asserted).
- Verified: 121 unit/integration tests + 7 end-to-end tests in Chrome, typecheck, production build.

### Galaxies 02–08 — as delivered (2026-11-13, before Milestone 7)
- **42 new lessons**, six per galaxy, in the Galaxy 01 format (objectives, worked example, experiment, validated practice and challenge with 3 hints each, 3-question quiz):
  - **02 The Flow**: comparisons and truthiness · if/elif/else · while · for & range · break & continue · nested logic
  - **03 The Archives**: lists · tuples · dictionaries · sets · slicing · comprehensions
  - **04 The Engine**: defining functions · parameters & return · scope · *args/**kwargs · modules & imports · lambdas
  - **05 The Machines**: classes & objects · `__init__` · methods · inheritance · dunder methods · dataclasses
  - **06 The Network**: files · exceptions · JSON · HTTP & APIs · automation scripts · pathlib
  - **07 The Frontier**: generators · decorators · context managers · type hints · async & await · testing with assert & unittest
  - **08 The Expeditions**: data with csv & statistics · a tiny web router (with HTML escaping) · automation bots (dates) · a text adventure · k-nearest neighbours from scratch · capstone: Greenhouse Monitor
- **Browser-feasible substitutions** (the prototype named pandas, Flask, pygame, ML libraries and pytest, which this in-browser Python cannot load without ~30 MB+ of extra packages): each lesson teaches the same idea with the standard library and names the package to use outside the browser. "Testing with pytest" became "Testing with assert & unittest".
- **HTTP & APIs** uses `pyodide.http.open_url` (the browser's fetch, synchronous inside the worker) against a sample API that ships with the app (`public/data/forecast.json`): offline, private, precached.
- **Real async/await**: the runner now calls Python through `callPromising` (WebAssembly stack switching, JSPI) when the engine supports it, so `asyncio.run` works (Chrome/Edge today; elsewhere everything else still runs and the lesson says why `asyncio.run` may be unavailable).
- **Checker additions**: `expr` checks (evaluate expressions against the learner's objects, for classes), `call` with keyword arguments and expected printed output, type checks for list/tuple/dict/set, list-vs-tuple/set tolerant comparisons, and hidden-case starting values for sets, tuples, dates and multi-line strings.
- **Light shell**: the shell uses a lesson index in `curriculum.ts` (titles, minutes, XP); full lesson text loads only with the Academy (its chunk is 70 KB gzip for all 48 lessons). The Academy's lesson picker lists every lesson grouped by galaxy; lessons in a sealed system can be read and practised, with a note that the chart will catch up.
- **Verified**: every one of the 48 lessons is tested in real Python (240 content tests: model and alternative solutions pass, starters and common wrong answers fail, examples run). The HTTP and async lessons are additionally passed end-to-end in Chrome. Totals: 336 unit/integration tests + 9 end-to-end tests.

### Milestone 7 — as delivered (2026-11-13)
- **Licenses** (chosen by the project owner): code under **MIT** (`LICENSE`), learning content under **CC BY 4.0**
  (`LICENSE-CONTENT.md`, which lists exactly which files count as content). `THIRD_PARTY_NOTICES.md` covers Pyodide
  (MPL-2.0), CPython (PSF), Monaco and React (MIT), the fonts (OFL-1.1) and Workbox (MIT). `package.json` declares MIT.
- **Docs**: README (features, quick start, scripts, browser support, deploying, privacy), CONTRIBUTING (setup,
  ground rules, how to write a lesson and its model solutions), CODE_OF_CONDUCT (Contributor Covenant 2.1),
  SECURITY (reporting, and the runtime's limits), docs/DEVELOPMENT.md (runtime, checker reference, storage, tests),
  docs/RELEASE_CHECKLIST.md, and ARCHITECTURE.md rewritten to describe the app as built.
- **GitHub**: issue forms (bug, lesson feedback, feature), PR template, and a CI workflow (Node 26: typecheck, tests,
  build, Playwright end-to-end).
- **Not done here** (in the release checklist): creating the Git repository, deciding whether to publish the design
  prototype in `reference/`, deploying, and confirming the live site's headers.

## Technical risks
| Risk | Impact | Mitigation |
|---|---|---|
| Port drift from original visuals | High | Copy CSS verbatim; port markup mechanically; screenshot comparison per window. |
| Pyodide size (~10 MB) & cold start (2–5 s) | Medium | Lazy load on first Run, warm-up while lesson is read, clear “waking the interpreter” state, SW cache. |
| `input()` needs synchronous stdin | Medium | COOP/COEP + SharedArrayBuffer (works on Vercel, breaks some third-party embeds) or pre-collected input panel. |
| Infinite loops | Medium | Terminate + recreate worker on timeout; lose Python state (documented). |
| Monaco weight & mobile weakness | Medium | Lazy load; keep lightweight textarea editor on small screens. |
| Fixed-stage design vs. real responsiveness | Medium | Keep the ≤760 maximize rule; test tablet sizes. |
| Client-side tests are visible | Low | Say so; validation is for learning, not grading. |
| Google Fonts offline / privacy | Low | Self-host fonts via `@fontsource` (OFL-licensed). |

## Decisions needed
1. **Tailwind:** I recommend *not* adding it (keep original CSS). Agree?
2. **`input()` strategy:** cross-origin isolation (true interactive input) vs. pre-filled input panel. Recommend isolation.
3. **Pocket interpreter:** retire entirely in M3, or keep as instant fallback while Pyodide loads? Recommend retire (one Python semantics only).
4. **Fiction names:** the prototype's pilot is “Ilse Marrow”. Replace with the user's chosen name on first launch?
5. **Fonts:** self-host (recommended, needed for offline) vs. Google Fonts CDN.
6. **Settings window:** the prototype has none — OK to add one built only from existing window/control styles?
7. **License** (decided at M7): MIT / Apache-2.0 for code; content (lessons) possibly CC BY-SA. Options presented then.

### Lesson recaps and optional missions — as delivered (2026-11-15)
- **Schema**: `Lesson = LessonCore & { recap, missions }`. Recaps and missions live in `src/content/lessons/extras/`
  (one file per galaxy) and are merged into the lessons by id; the core lesson files are unchanged apart from a type import.
- **Recap** (every lesson, 48): what you learned (3–5), a syntax cheat sheet (snippets that run as written), common
  mistakes (why and how to avoid), an unscored knowledge check, and next steps (continue learning, explore missions).
  Opens once the lesson is complete; revisitable any time.
- **Optional missions** (3 per lesson, 144): The Seed (+15 XP), The Sprout (+30 XP), The Bloom (+50 XP), each with a
  briefing, objective, expected behaviour, starter code, progressive hints and checks run by the same Python checker,
  including hidden cases so several correct solutions pass and hard-coded answers fail. Open after the lesson is
  complete, in any order; never required. XP is paid once per mission (award key `lm:<id>`); progress is saved under
  `lmission:<id>`, separate from lesson progress. Missions count as reinforcement for mastery and feed three new
  optional achievements (Curious Seedling, Full Bloom, Green Thumb).
- **Verified**: 623 unit/integration/content tests (every recap snippet runs; every mission's starter and wrong answers
  fail and model solutions pass, in real Python) and 9 end-to-end tests including the axe scan.
