# RESPONSIVE_SPEC.md — Lithic

## What is actually designed
The shell is **fluid** and carries **one approved breakpoint, `max-width: 760px`** (inherited verbatim from the
Botanica OS shell). The Survey navigator is intrinsically responsive (the plane pans/zooms within whatever
window size it has). There are **no separately-designed tablet/laptop layouts** beyond this breakpoint — do not
invent them; document gaps instead.

## Root
`.os` root: `width:100%`, `height:100vh`, `min-height:720px` (desktop) / `620px` (mobile measure). A
ResizeObserver feeds `W/H` into window `geom()`.

## Desktop / laptop (≥ 760px)
- Full shell: menubar, draggable/resizable Survey window, dock, desktop icons + resume note.
- Survey: full pan/zoom; SpecimenSheet docks right at 340px wide (zoom pad shifts left when open).
- Windows clamp to viewport via `geom()` (`gw = min(w, W-16)`, `gh = min(h, H-top-12)`).

## Tablet / mobile (< 760px) — approved shell rules
From the shared `@media (max-width:760px)`:
- Windows **force-maximize** (`geom()` returns full-viewport); drag/resize disabled.
- Desktop icons re-grid to `repeat(3,96px)` centered; **resume note hidden**.
- Dock shrinks (`.dk` 44px, tighter padding, pot 64px).
- Terminal/side rails (Botanica) hide; Academy padding reduces.
- Survey SpecimenSheet (`.uv-panel`) inherits Botanica behavior (full-width/stacked under the chart).
- Touch: pan = drag (pointer events already unify mouse/touch); zoom via ± pad (pinch is **not** implemented —
  gap to close in port).

## Editor usability on small screens (GAP — not designed)
The lesson code editor is Stage 2 and undesigned, so no small-screen editor layout exists. Requirement to meet
in the port: keep the editor usable < 760px (stack editor over preview, keep Run reachable, avoid tiny targets).
Mark as **to-design**, consistent with Botanica's `.ac-split` wrap behavior (`flex-wrap`).

## Overflow / touch targets
- Panels scroll with `.scroll`/`.scroll-d` (thin styled scrollbars).
- Touch targets meet ≥44px for primary controls; some icon buttons (zoom 36px, window 22px) are below 44px —
  **flag for the port** to enlarge on coarse pointers.

## Missing responsive states to design in the port
Lesson/editor/exercise/recap/mission responsive layouts (none designed); pinch-zoom; keyboard pan/zoom;
coarse-pointer target sizes on shell micro-buttons.
