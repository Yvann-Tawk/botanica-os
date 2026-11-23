# DESIGN_TOKENS.md — Terraform OS / Lithic

Exact values taken from `source/project/Main.dc.html`. The shell tokens are **global Terraform OS** values,
copied verbatim from the Botanica OS source — **do not redefine them for Lithic.** Only the clearly-marked
*Lithic environmental* tokens are world-specific additions.

## A. GLOBAL — Terraform OS shell (shared; same as Botanica/Orbis)

### Color
| Token | Value | Use |
|---|---|---|
| `--os-paper` | `#efe8d6` | desktop background |
| `--os-surface` | `#f6f2e8` | window body, menus, buttons, cards |
| `--os-surface-2` | `#eae4d5` | title bar, chips, dock, inset panels |
| `--os-ink` | `#242820` | text, 1.5px borders, hard shadows |
| `--os-ink-soft` | `#63685c` | secondary text |
| `--os-moss` | `#345a04` | primary green accent / "moss" button |
| `--os-moss-2` | `#3e6510` | links, hover |
| `--os-coral` | `#c95851` | close button, primary "pri" button, current markers |
| `--os-coral-soft` | `#e58a80` | "you are here", current-lesson pulse |
| `--os-gold` | `#b47e00` | brass detail |
| `--os-amber` | `#e2a93b` | open/active highlight, mastered |
| `--os-amber-lt` | `#f3c766` | caret, sparkle |
| dark canvas (`.uv`) | `#12180e` | Botanica world void (Lithic overrides, see B) |

### Typography
- Display: **Young Serif** (`.disp`) — headings, planet names, window substance.
- UI: **Figtree** (400/500/600/700) — body/labels/buttons.
- Mono: **JetBrains Mono** (400/500/700) — kickers, chart labels, numbers, code.
- Sizes (px): display 15 (menubar) · 21–36 (planet/panel names) · body 13–15.5 · mono labels 10.5–12.
- Line-height: UI 1.45; lede 1.5–1.6.

### Border / radius / shadow / spacing
- Border: **1.5px solid `#242820`** (hairline ink) everywhere; 2px on inline SVG strokes.
- Radii: button `10px`; window `12px`; menu/bubble `10–14px`; dock `18px`; chips `999px`; small ctl `6px`.
- Tactile button shadow: **`0 3px 0 #242820`**, press → `translateY(3px)` + shadow `0 0 0`.
- Panel/note drop shadow: **`4px 5px 0 rgba(36,40,32,.16)`**; window `5px 6px 0 rgba(36,40,32,.16), 0 28px 60px -24px rgba(36,40,32,.5)`.
- Spacing rhythm: 6 / 8 / 10 / 12 / 14 / 18 / 22 / 24 px.
- Z-index: desktop `2` · windows `10–20+` (focus bumps `ztop`) · dock `9100` · menubar `9200` · scrim `9250` · menu `9300` · toasts `9400` · overlay/cele `9500`.

### Motion
- Durations: micro `.08s` (button), `.14–.22s` (bubble/menu/toast), `.3s` (slideIn/window), `.4–.6s` (pan glide, grow).
- Easings: `cubic-bezier(.2,.8,.2,1)` (ease-out UI), `cubic-bezier(.3,1.6,.5,1)` (springy pop), `cubic-bezier(.2,.9,.2,1)` (window).
- Keyframes (shared): `bubbleIn slideIn toastIn fadeIn popIn orbit pulseRing grow dash twinkle` + mascot set.
- `@media (prefers-reduced-motion: reduce)` neutralizes all animation/transition.

### Breakpoints
- `max-width: 760px` — shell mobile rules (dock shrinks, desktop note hidden, icons re-grid, window maximizes). This is the only shell breakpoint. See `RESPONSIVE_SPEC.md`.

## B. LITHIC — environmental tokens (world-specific additions only)

| Token | Value | Use |
|---|---|---|
| `--li-cavern` | `#17130d` | `.uv.lith` navigator void (overrides Botanica `#12180e`) |
| `--li-amethyst` | `#8A78A6` | The Crystal Matrix (DAX) — body/accent; world pill gem |
| `--li-amethyst-dk` | `#6f628a` / `#4e4368` | crystal facets, shadow |
| `--li-copper` | `#b06a3f` | The Refinery (Power Query M) — body |
| `--li-copper-dk` | `#8a4a24` / `#5c3418` | refinery accent/shadow |
| `--li-sandstone` | `#c69a3e` | The Foundation (HTML) — planet body |
| `--li-sandstone-lt` | `#e6c877` | Foundation light / wallpaper geode rim |
| `--li-sandstone-dk` | `#7a5410` / `#8a5a12` | Foundation shadow/accent |
| `--li-strata-1/2/3` | `#ddd3ba` / `#c6b48c` / `#8a6f3e` | wallpaper hill strata bands |
| ore flecks / dust | reuse `--os-gold`, `--os-coral`, `--li-amethyst` | star/fleck field in navigator |

Planet gradient triples (radial `cx .36 cy .3 r .8`): Foundation `#e6c877 → #c69a3e → #7a5410`;
Matrix `#c9bce0 → #8A78A6 → #4e4368`; Refinery `#d79a6f → #b06a3f → #5c3418`.

### Lithic-only component tokens (added in the `/* Lithic world additions */` CSS block)
- `.nodep` mini-planet button; `.node-label` caption; `@keyframes nodeIn` (scale-in, `cubic-bezier(.2,1.4,.4,1)`, .42s).
- `.wpill` world pill (menubar); `.orbisback` Return-to-Orbis pill.
- Expansion geometry: concept ring radius `size*0.62 + 104`; lesson ring radius `162`; node sizes — concept `96`, hub `110`, lesson `62`.
