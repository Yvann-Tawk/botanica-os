# COMPONENT_INVENTORY.md — Lithic

One file holds the whole prototype: `source/project/Main.dc.html`. In the port, split it into the components
below. **"Origin" tells you whether to REUSE the existing Terraform OS/Botanica component or build a new
Lithic one.** Shared-shell components must reuse Botanica's implementation — do **not** duplicate them.

Legend — Origin: **SHARED** = reuse existing Terraform OS component unchanged · **SHARED+skin** = shared
structure, Lithic environment props · **LITHIC** = new, world-specific · Status: **IMPL** = interactive in
prototype · **SIM** = visual/simulated · **N/A** = not designed yet.

| # | Component | Source (in Main.dc.html) | Origin | Status | Purpose |
|---|---|---|---|---|---|
| 1 | `OSRoot` | `.os` root + `rootRef`/ResizeObserver | SHARED | IMPL | fluid OS surface, measures viewport for window geometry |
| 2 | `MenuBar` | `.mbar` + menus | SHARED+skin | IMPL | brand, **Lithic world pill**, app name, Go/Window/Help, Return-to-Orbis, XP, clock |
| 3 | `Dock` | `.dock` / `.dk` | SHARED+skin | IMPL | app launchers (Survey/Foundation/Journal/Orbis) + companion |
| 4 | `Window` | `.win` + `winVals`/`geom`/`dragStart`/`dragMove` | SHARED | IMPL | frame, title bar, close/min/max, drag, resize, focus z-order, maximize |
| 5 | `Button` (`.btn`,`.btn-d`) | shared CSS | SHARED | IMPL | tactile buttons (paper + dark-panel variants) |
| 6 | `Toasts` | `.toasts`/`.toast` | SHARED | IMPL | transient notices |
| 7 | `TransitionCard` | `.cele` / `.cele-card` | SHARED+skin | SIM | descend / enter / return overlay (reuses Botanica celebration card) |
| 8 | `DesktopWallpaper` | `.desk` inline `<svg>` | LITHIC | IMPL | geological surface: strata hills, cut geode, mine headframe, ore crystals, survey rings |
| 9 | `DesktopIcons` | `.dicons`/`.dicon` | SHARED+skin | IMPL | Survey/Foundation/Journal/Orbis icons (Lithic glyphs) |
| 10 | `ResumeNote` | `.note` | SHARED+skin | IMPL | "Next on your dig" pinned card |
| 11 | `SurveyWindow` | `.win` "Survey" + `.uv.lith` | LITHIC | IMPL | the world navigator (pan/zoom plane) — Lithic instance of Botanica's Universe window |
| 12 | `PlanetBody` | `.planet` + per-type `<g>` | SHARED+skin | IMPL | dig-site world (Foundation/Matrix/Refinery) with geological glyph, moons, here-pulse, seal |
| 13 | `MiniPlanet` | `.nodep` + `mkNode` | LITHIC | IMPL | concept node (tier 2) **and** lesson node (tier 3); expands/animates in |
| 14 | `Spokes` | plane `<svg>` `{{spokes}}` | LITHIC | IMPL | dashed links world→concept and concept→lesson |
| 15 | `HereMarker` | `.here` | SHARED | IMPL | "you are here" tag on current planet |
| 16 | `HoverPreview` | `.uv-prev` | SHARED+skin | IMPL | floating preview bubble on planet hover |
| 17 | `SpecimenSheet` | `.uv-panel` | SHARED+skin | IMPL | right dossier; level-aware (discipline → concepts → lessons) + CTA/back |
| 18 | `SurveyHUD` | `.uv-title`/`.uv-legend`/`.uv-zoom`/`.uv-hint` | SHARED+skin | IMPL | title, legend, zoom pad, hint |
| 19 | `Companion` (**Flint**) | `.pot`/`.sprout-btn` | LITHIC | IMPL | Lithic mascot (rock + crystal), reuses Botanica's eye/mood/bubble rig |
| 20 | `LessonView` | — | SHARED(Botanica)→extend | N/A | lesson shell — **not designed** (see LESSON_UI_SPEC.md) |
| 21 | `CodeEditor` (HTML/DAX/M) | — | SHARED(Botanica)→extend | N/A | editor + preview — **not designed** (LESSON_UI_SPEC.md) |
| 22 | `Exercise*` | — | SHARED(Botanica)→extend | N/A | exercise types — **not designed** (EXERCISE_UI_SPEC.md) |
| 23 | `RecapView` | — | SHARED(Botanica)→extend | N/A | recap — **not designed** (RECAP_UI_SPEC.md) |
| 24 | `MissionBoard` | — | SHARED(Botanica)→extend | N/A | 3 missions/lesson — **not designed** (MISSION_UI_SPEC.md) |

## Per-component detail (the implemented set)

### 4. Window (SHARED — reuse Botanica)
- **Props:** `id, title, subtitle, dotColor, geom{x,y,w,h,max}, focused, children`.
- **State (manager, lifted):** `wins{id:{x,y,w,h,open,min,max,z}}, ztop, focus`.
- **Interactions:** drag title (pointer events, scale-compensated via `scaleK()`), resize handle `.rsz`,
  close/min/max, double-click title = maximize, click = focus (z bump). `geom()` clamps to viewport and
  force-maximizes below 760px.
- **Deps:** `OSRoot` measurements. **Assets:** none (SVG glyph buttons inline). **Responsive:** maximizes < 760.
- **Reuse:** identical to Botanica — port once into the shared OS package.

### 11. SurveyWindow / 12. PlanetBody / 13. MiniPlanet / 14. Spokes / 17. SpecimenSheet (the Lithic core)
- **Props/data:** `REGIONS[]` (3 disciplines: id, name, sub(language), x/y/size on the 2600×1700 plane,
  palette triple, status `open|soon`, version, blurb, `concepts[]`); each concept → 5 lessons via `lessonsFor()`
  (`LESSON_ARC = [Warm-up, Walk-through, Practice, Challenge, Recap]`).
- **State:** `ux,uy,us` (pan x/y, zoom scale), `hov` (hovered planet), `sel` (selected discipline),
  `conc` (selected concept index | null), `panning, glide`.
- **Interactions:** pan (drag), zoom (wheel/pad, 0.3–1.5), hover→preview, click planet→`selectPlanet` (tier1
  expand + specimen), click mini-planet→`selectConcept` (tier2 expand to 5 lessons), click lesson→SIM enter,
  empty-click = step back one tier, `resetView` recenters.
- **Deps:** Window body, `scaleK`, `uvSize`. **Assets:** all inline SVG. **Responsive:** specimen sheet goes
  full-width under 760 (inherits Botanica `.uv-panel` behavior); zoom pad shifts left when sheet open.
- **Reuse:** SurveyWindow is the Lithic instance of Botanica's `Universe` window — **same pan/zoom/drag code
  and the same planet-render scaffold**; only `REGIONS` data, palettes, glyphs and the `.uv.lith` background
  differ. MiniPlanet + Spokes + the two extra expansion tiers are **new to Lithic** (Botanica stopped at
  planet→moons; Lithic adds concept and lesson tiers).

### 19. Companion "Flint" (LITHIC)
- Reuses Botanica mascot **rig** (eye/blink/mood states `idle|happy|petted|sleeping`, speech `.bubble`, pot,
  pet interaction) but a **new body** (rock + amethyst crystal). Port the rig as shared, the body as a Lithic asset.
