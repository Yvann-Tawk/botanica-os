# Terraform OS — Lithic (System 02) · Developer Handoff

Design-to-development handoff for the **approved Lithic home experience**, for implementation in Claude Code
and integration into the existing Terraform OS application.

---

## 0. READ THIS FIRST — what this package is (and is not)

**The approved prototype is a Claude Design canvas**, authored as **Claude Design Component files** (`.dc.html`,
one HTML file per artboard, running on the platform's own runtime `support.js`). It is **not** a pre-existing
React/Vite project. There is therefore **no original `src/`, `package.json`, `node_modules`, `.tsx`, or compiled
bundle to export — those never existed.** This package ships:

1. The **real, unmodified source** of the approved design (`source/project/*.dc.html` + `canvas.json`).
2. A **complete visual + interaction + token spec** so the production React app reproduces it exactly.
3. An **integration guide** for slotting Lithic into Terraform OS beside Botanica and Orbis.

Nothing here is a reconstruction presented as the original. Where the production stack (React/TS/Vite) is
discussed, it is the **target you build during porting** — intentionally *not* bundled so nothing misrepresents
itself as "the original project."

### What was actually designed and approved (this is the whole approved surface)
- The **Terraform OS shell as applied to Lithic**: desktop + geological wallpaper, menu bar, dock, window frame,
  tactile buttons, type, the companion mascot — **all reused verbatim from the Botanica OS shell**, re-skinned
  only in environment.
- The **Lithic Survey** — the world navigator: a pannable/zoomable chart with three planet dig-sites
  (**The Foundation / The Crystal Matrix / The Refinery**), each of which **expands into its concept
  mini-planets**, each of which **expands again into its five lessons**. Hover previews, a right-hand specimen
  sheet, legend, zoom pad, "you are here", and simulated Enter / Return-to-Orbis overlays.

### What was NOT designed yet (do not expect it in `source/`, and do not invent it)
The following are **requested in the handoff brief but have no approved design in the prototype.** Each spec doc
documents the *intended* structure and the Botanica pattern to reuse, and marks the screen **NOT YET DESIGNED**:
- Lesson interface (header, objectives, content, examples, progress) — `LESSON_UI_SPEC.md`
- Language editors + previews: **HTML** editor/live preview/DOM feedback, **DAX** formula editor/results,
  **Power Query M** editor/step preview — `LESSON_UI_SPEC.md`
- Exercises (fill-in, predict-output, debug, write, challenge) — `EXERCISE_UI_SPEC.md`
- Lesson recap — `RECAP_UI_SPEC.md`
- Missions (The Seed / The Sprout / The Bloom, 3 per lesson) — `MISSION_UI_SPEC.md`

These are **Stage 2** and were explicitly deferred pending approval of the home experience (which is what this
package delivers). Botanica already implements real, approved versions of every one of them, so the specs point
Claude Code at those as the source of truth rather than at a Lithic design that does not exist.

### Honest status of behaviours in the prototype (do not treat as bugs)
- **Enter the Foundation / Enter a lesson / Return to Orbis** play a transition card only — no destination.
- **XP (640)** is static sample data. There is no progression engine.
- **Lesson/exercise/mission validation** does not exist; there is **no HTML/DAX/M runtime** in the prototype.
- **Botanica and Orbis are out of scope** and must not be modified. Lithic only hands back to Orbis.

---

## 1. Contents

```
terraform-os-lithic-handoff/
├─ README.md                      ← this file
├─ MANIFEST.sha256                ← checksums for every shipped file
├─ source/
│  └─ project/
│     ├─ Main.dc.html             ← THE DESIGN: all markup, CSS, inline-SVG art, and logic (~1210 lines)
│     ├─ Desktop.dc.html          ← reference board — OS desktop, no window (mounts Main, start=desktop)
│     ├─ Hub.dc.html              ← reference board — Survey, The Foundation selected (mounts Main)
│     ├─ Preview.dc.html          ← reference board — a sealed discipline (mounts Main, site=refinery)
│     └─ canvas.json              ← canvas index + sticky-note annotations
└─ documentation/
   ├─ COMPONENT_INVENTORY.md
   ├─ NAVIGATION_SPEC.md
   ├─ LESSON_UI_SPEC.md
   ├─ EXERCISE_UI_SPEC.md
   ├─ RECAP_UI_SPEC.md
   ├─ MISSION_UI_SPEC.md
   ├─ DESIGN_TOKENS.md
   ├─ ASSET_MANIFEST.md
   ├─ INTERACTIONS.md
   ├─ RESPONSIVE_SPEC.md
   └─ INTEGRATION_GUIDE.md
└─ screenshots/
   └─ SCREENSHOTS.md              ← how to capture the reference shots from the live artifact (see §4)
```

## 2. Viewing the approved design
`Main.dc.html` depends on the Claude Design runtime (`support.js`, supplied by the platform) and does **not**
render as a loose file in a browser. To see the approved pixels, open the live Design artifact **"Terraform OS —
Lithic"** and press Play. The three reference boards show fixed states.

## 3. Running it as a web app (the production port)
There is no standalone `npm start` build, because the prototype runs inside Claude Design. The intended target
is a small **Vite + React + TypeScript** app. Recommended setup (create this yourself in Claude Code — it is
intentionally **not** included so nothing here misrepresents itself as the "original project"):

```bash
npm create vite@latest terraform-os -- --template react-ts
cd terraform-os && npm install
# Fonts (index.html <head>):
#   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
# Then port per documentation/INTEGRATION_GUIDE.md and COMPONENT_INVENTORY.md.
```
No UI library, icon package, or CSS framework. **All art is inline SVG** — copy each `<svg>` verbatim into an
SVG component. Dependencies: `react`, `react-dom` (v18); dev `vite`, `typescript`, `@vitejs/plugin-react`.

## 4. Screenshots
Rendered PNGs are **not** bundled: this environment cannot run the Design runtime to render the canvas, and the
design tool's rules bar rendering/screenshotting it. `screenshots/SCREENSHOTS.md` specifies exactly which states
to capture from the live artifact and how to reach each — these become the visual-regression references.

## 5. Verification performed before shipping (see §17 of the brief)
- All available source files copied **byte-for-byte** from the approved prototype (`MANIFEST.sha256`).
- Tag/structure and JS syntax of `Main.dc.html` checked (balanced `sc-if`/`sc-for`/`div`; `node --check` on the
  component script).
- Design tokens cross-checked against the literal values in `Main.dc.html`.
- **No design changes** were made while preparing this handoff.
- Checks **not** performed, and why: no production build was run (there is no buildable project here — the port
  is created in Claude Code); no PNG rendering (runtime unavailable, see §4).
