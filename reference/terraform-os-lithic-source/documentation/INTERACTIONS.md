# INTERACTIONS.md — Lithic

Each row: Trigger → Initial → Result → Animation / Duration / Easing → Nav effect → A11y.
**R** = real/implemented, **S** = simulated in prototype.

## Shell (SHARED with Terraform OS — reuse Botanica interactions)
- **Button hover/press** (R): hover lightens to `#fff`; press `translateY(3px)`, shadow→0; `.08s`. A11y: real
  `<button>`, `:focus-visible` 2px coral ring.
- **Window drag** (R): pointerdown on `.tbar` → move; pointer capture; scale-compensated. No animation while
  dragging. A11y: title bar buttons have `aria-label`; drag is pointer-only (keyboard users use menus).
- **Window min/max/close** (R): close/min hide with `.16–.2s` fade+scale; maximize snaps to viewport. Double-
  click title = maximize.
- **Focus** (R): pointerdown anywhere on a window bumps its `z` to `ztop`; blurred windows get `.is-blur`.
- **Menu open** (R): click Go/Window/Help → dropdown `bubbleIn .14s`; scrim closes. `aria-expanded` set.
- **Dock launch** (R): click app → open/focus window (Survey) or SIM action; hover tooltip `.15s`; running dot.
- **Companion pet** (R): click Flint → mood `petted`, blush+sparkle, `.bubble` line, `sp-wiggle`. Idle→sleep
  after 40s. A11y: `aria-label`, `role="status"` bubble.
- **Toast** (R): appears `toastIn .3s`, auto-dismiss 4.2s. A11y: `aria-live="polite"`.

## Survey navigator (Lithic core)
- **Pan** (R): drag empty chart → `ux/uy` follow (scale-compensated); `.is-panning` grab cursor; parallax
  starfield at 0.35×. A11y: pointer-only; planets/nodes are focusable buttons for keyboard reach.
- **Zoom** (R): wheel or ± pad → `us` 0.3–1.5 about cursor/centre; `.glide .6s` on pad. Recenter button = `resetView`.
- **Planet hover** (R): `HoverPreview` bubble `bubbleIn .16s`; planet glow ↑; cursor pointer. A11y: `onFocus`
  mirrors hover; `aria-label` states name/language/status.
- **Planet select → expand** (R): click → `selectPlanet`; zoom-in `.glide`; siblings fade to .28; concept
  mini-planets `nodeIn .42s` staggered; spokes animate (`route-lit dash`); SpecimenSheet `slideIn .3s`.
- **Mini-planet (concept) select → expand** (R): click → `selectConcept`; promote to hub; 5 lesson nodes
  `nodeIn` staggered on spokes; SpecimenSheet swaps to lesson set.
- **Lesson select** (S): click lesson node → `TransitionCard` (`fadeIn .25s` + `popIn .5s`). No destination.
- **Step back** (R): empty click or back control → up one tier with re-frame `.glide`.
- **Coming-Soon / sealed** (R visual): sealed planets/concepts/lessons show dashed ring + padlock; click a
  sealed lesson → toast "sealed · <version>". Versions are shown, **never dates**.

## Not-yet-designed interactions (reuse Botanica; see linked specs)
- Lesson open transition, exercise submit/feedback, hint reveal, reset, recap transition, mission select,
  completion + XP-reward animation — **S/N/A**. Patterns in `LESSON_UI_SPEC.md`, `EXERCISE_UI_SPEC.md`,
  `RECAP_UI_SPEC.md`, `MISSION_UI_SPEC.md`.

## Accessibility baseline (as built)
Real semantic `<button>`/`<nav>`/`<aside>`; `aria-label` on every icon-only control; `aria-hidden` on
decorative SVG; `:focus-visible` rings; `aria-live` toasts; full `prefers-reduced-motion` path. Known gap to
close in the port: keyboard pan/zoom and arrow-key traversal between planets/nodes.
