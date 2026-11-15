# Botanica — Architecture

> Since 2026-11-15 Botanica is the Python world inside **Terraform OS**, opened from the Orbis hub. The shell around
> it (Orbis, world registry, shared settings and progress, fullscreen, navigation) is described in
> [TERRAFORM.md](TERRAFORM.md). Everything below still describes Botanica itself, which is unchanged.

This describes the app as built (Milestones 1–7). The working details (runtime, checker reference, storage keys,
tests) are in [DEVELOPMENT.md](DEVELOPMENT.md); the history and decisions per milestone are in [ROADMAP.md](ROADMAP.md).

## Origin

Botanica OS began as a single-file interactive prototype from a design canvas (`reference/botanica-os-source/`,
`Main.dc.html`, ~2,700 lines of CSS, inline SVG and logic, with a small JavaScript "pocket interpreter"). The
production app is a mechanical port of that design to React, keeping its stylesheet verbatim and its SVG art byte for
byte, with the simulated parts replaced by real systems.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 5, TypeScript (strict) | Fast, simple, static output |
| UI | React 18, no state library | The prototype was already React-shaped; reducers and context are enough |
| Styling | The prototype's CSS verbatim (`prototype.css`) + `additions.css` | Design fidelity without a rewrite |
| Python | Pyodide 0.27 (CPython 3.12) in a module Web Worker, self-hosted | Real Python, off the UI thread, offline, private |
| Editor | The prototype's lightweight editor, upgraded to Monaco on wide screens (lazy) | Instant first paint; a full editor where it helps |
| Storage | IndexedDB (fallbacks: localStorage, memory), versioned with migrations | Local-first, no accounts |
| Offline | vite-plugin-pwa (Workbox), prompt-to-update | Installable; Python cached on first use |
| Tests | Vitest + Testing Library; real Python in Node; Playwright + axe | Behaviour, content correctness, accessibility |

No backend and no runtime services: the site is static. Cross-origin isolation headers (COOP/COEP) enable blocking
`input()` and clean interrupts; JSPI (stack switching) enables `asyncio.run` where the browser supports it.

## Modules

```
Shell (src/shell, App.tsx)        windows, menus, dock, toasts, celebration, keyboard, layout persistence
 ├─ Universe (apps/universe)       chart view-model from the curriculum graph + progress
 ├─ Academy (apps/academy)         lesson engine over content/lessons (lazy chunk)
 ├─ Missions, Workshop             missions and the guided project
 ├─ Terminal                       files, snippets, REPL
 ├─ Pilot logbook (apps/profile)   level, streaks, mastery, patches, artifacts
 └─ Settings
Runtime (src/runtime)              worker + harness + checker, page-side client, error explanations
Content (src/content)              curriculum graph and lesson index; lessons, missions, achievements as data
Progression (src/progression)      completion and gating; event log → XP, levels, streaks, mastery, achievements
Mascot (src/mascot)                Sprout's art, moods, timing
Storage (src/storage)              key-value store, settings, backup export/import
```

Dependencies point downward: apps use content, progression, runtime and storage; content and progression are pure
data and functions with no React.

## Data flow

1. Launch (`boot.ts`) loads settings, layout, progress and the event log from IndexedDB and decides what opens.
2. A learner runs or checks code: the app's `usePythonSession` sends it to the worker; output streams back to the
   console; checks return pass/fail per check.
3. The app reports what happened to `useLearning` (e.g. "practice passed with 1 hint"). It appends events, completes
   concepts when a lesson's three gates pass, pays each award once, and settles achievements and level-ups.
4. Progress changes flow to the chart (sprouts, constellations, routes, "you are here"), the logbook, the desktop
   note and Sprout.

## Decisions worth knowing

- **Design is preserved**, with a short, documented list of accessibility deviations (DESIGN_SYSTEM.md).
- **Nothing is faked**: XP, streaks, completion and mastery come only from learner actions.
- **Exploration over gating**: any lesson can be opened and practised; the chart shows what is officially open.
- **Packages beyond the standard library are not loaded** (size, offline, privacy). Later lessons teach the ideas
  with the standard library and name the packages to use outside the browser.
- **The worker is not a security sandbox**; it runs the learner's own code (see SECURITY.md).
