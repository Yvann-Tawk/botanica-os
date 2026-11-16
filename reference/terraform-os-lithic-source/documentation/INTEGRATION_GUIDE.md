# INTEGRATION_GUIDE.md — Lithic into Terraform OS

> Do **not** modify the production Terraform OS codebase as part of this handoff. This guide tells Claude Code
> how to add Lithic beside Botanica/Orbis, reusing the shared shell and leaving Botanica/Orbis untouched.

## A. Entry point — how Orbis launches Lithic
- Orbis is the hub; worlds are entries on its chart. Orbis already hands off to Botanica via a launch
  transition. Add **Lithic** as a second world: selecting it routes to the Lithic home.
- Lithic mounts with `start` = `survey` (Survey window open, auto-framed) or `desktop` (shell only). The Orbis→
  Lithic transition is **simulated** in this prototype (a `.cele` card); wire it to real routing in the port.
- Reverse: every "Orbis" control in Lithic (menubar pill, dock, desktop icon, specimen sheet) must route back
  to the Orbis hub.

## B. Shared shell — reuse, do not duplicate
Reuse the **existing Terraform OS shell** (built for Botanica) unchanged: `OSRoot`, `MenuBar`, `Dock`,
`Window` + window-manager, `Button`, `Toasts`, `TransitionCard`, the companion **rig**, type, tokens, keyframes.
Lithic passes world props (brand pill = "Lithic", palette = Lithic environmental tokens, wallpaper =
DesktopWallpaper, companion body = Flint). **Extract the shell into a shared package** (`@terraform-os/shell`)
if it is not already one; Botanica and Lithic both import it.

## C. World-specific components — keep independent
New under a Lithic module: `DesktopWallpaper` (geological), `SurveyWindow` + `PlanetBody` + `MiniPlanet` +
`Spokes` + `SpecimenSheet` (Lithic data/skins), `Companion` body (Flint), and the `REGIONS`/`lessonsFor` data.
`SurveyWindow` is the Lithic instance of Botanica's `Universe` window — **share the pan/zoom/drag engine**, keep
the data/skin local.

## D. Navigation — Orbis → Lithic → Planet → Mini-Planet → Lesson
Model as nested routes/state (see `NAVIGATION_SPEC.md`): world `sel`, concept `conc`, lesson index. The three
expansion tiers are implemented; the **Lesson** destination is Stage 2 — route a lesson node to the (to-build)
`LessonView`. Keep "step back one tier" and "Continue Learning" semantics.

## E. Progression — where XP/achievements/progress connect
XP (the menubar pill) and completion states must come from the **global Terraform OS progression store** shared
with Botanica — do not fork a Lithic-only system. Prototype XP (640) is static placeholder. Lesson/concept/
planet completion drive lock→unlock and the "current/completed" markers documented in `NAVIGATION_SPEC.md`.

## F. Learning systems — reuse Botanica
Lesson, editor, console, exercise, recap, and mission components are **approved in Botanica**. Lithic reuses
them and supplies: content data, HTML/DAX/M **tokenizers**, and the **language-specific preview/validation
panes that are not yet designed** (see `LESSON_UI_SPEC.md`, `EXERCISE_UI_SPEC.md`). Do not rebuild the lesson
shell; extend it.

## G. Styling — avoid CSS conflicts with Botanica
- Shell CSS is shared → import once from the shell package (single source; no copy per world).
- Lithic-only rules live in a scoped block (the `/* Lithic world additions */` section: `.uv.lith`, `.nodep`,
  `.node-label`, `.wpill`, `.orbisback`). Namespace world overrides under a world class/root
  (e.g. `[data-world="lithic"]`) so Botanica's `.uv` background and any shared selectors are never mutated.
- Never redefine global tokens for Lithic; only add environmental tokens (see `DESIGN_TOKENS.md §B`).

## H. Persistence — what needs to survive
Persist in app data (not ephemeral UI): per-lesson/mini-planet/planet **completion + current pointer**, global
**XP/level/achievements**, **mission completion**, "Continue Learning" target, and companion/reduce-motion
preferences. Transient UI (pan/zoom position, which planet is expanded, window geometry) can stay in session
state. The prototype persists nothing.

## I. Future expansion
Lessons/mini-planets are **data-driven** (`REGIONS[].concepts[]` → `lessonsFor`). Add a mini-planet = add a
concept entry; add lessons = extend its lesson set. Planets 02/03 (Matrix/Refinery) unseal by flipping status
once their content + language panes exist. Systems 03/04 (Aether/Ironworks) follow the same world pattern.

## J. Technical limitations (prototype-only)
Enter/Return transitions, XP value, Journal, and all lesson/exercise/mission validation are **simulated**; there
is **no HTML/DAX/M runtime**; lesson/editor/exercise/recap/mission screens are **not designed** (Stage 2). The
port must supply real routing, a progression store, sandboxed language execution, and the missing screens.
