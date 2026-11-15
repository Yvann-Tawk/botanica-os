# Terraform OS — Orbis Hub · Design Handoff

Approved prototype → production implementation (Claude Code).
This document describes the finalized Orbis Hub so it can be re-implemented faithfully in React.

---

## 0. Read this first — what the "source" actually is

The approved design was authored on the **Claude Design canvas**. Its native format is a
**Design Component** file (`.dc.html`) — one self-contained HTML file per screen that runs on the
Design canvas's own runtime (`<x-dc>` markup, `{{…}}` holes, `<sc-for>`/`<sc-if>`, and a
`class Component extends DCLogic` logic block). **It is not, and never was, a React/TypeScript
multi-file project**, so there is no pre-existing component tree, `package.json`, or `src/` folder to
"export" — those would have to be fabricated. This package therefore contains:

1. `source/project/` — the **authoritative, unmodified source** of the approved design (the real files).
2. `design-tokens/` — colors, type, radii, shadows, breakpoints extracted verbatim.
3. This document — a complete spec + a `.dc` → React mapping so the production build reproduces it exactly.

Nothing here has been redesigned, simplified, or re-illustrated. The `.dc.html` files are the design.

### The three source files
| File | Role | Notes |
|---|---|---|
| `source/project/Main.dc.html` | **The entire Orbis Hub** | ~800 lines: all markup, all CSS (in `<helmet><style>`), all SVG art, and the full logic class. This is the single source of truth. |
| `source/project/Orbis.dc.html` | Reference board | Thin wrapper that mounts `Main` with `open="orbis" world="botanica"` for review. |
| `source/project/AetherPreview.dc.html` | Reference board | Mounts `Main` with `world="aether"` to show a Coming-Soon dossier. |
| `source/project/canvas.json` | Canvas index | Board frames, titles, and the sticky design notes. |

### `.dc.html` → React mapping (how to port)
| `.dc` construct | React equivalent |
|---|---|
| `class Component extends DCLogic { renderVals() { return {…} } }` | A component tree whose root holds the state; `renderVals()` returns the "view model" — split it per component. |
| `this.state` / `this.setState` | `useState`/`useReducer` (a single reducer for the window manager is cleanest). |
| `{{hole}}` | `{expr}` in JSX. |
| `<sc-for list="{{xs}}" as="x">` | `xs.map(x => …)`. |
| `<sc-if value="{{c}}">` | `{c && …}`. |
| `onClick="{{fn}}"` | `onClick={fn}`. |
| `<helmet><style>` | a global stylesheet or CSS-modules; tokens → `design-tokens/`. |
| `ref="{{rootRef}}"` | `useRef` + `ResizeObserver`. |
| `support.js` (platform runtime) | **not needed** in React — it only provides the `.dc` runtime. Do not try to ship it. |

Fonts and React (18) are injected by the canvas at runtime; in production you add them yourself (see README).

---

## 1. Component hierarchy (recommended React structure)

```
<TerraformOS>                      // root; owns all state; class "os" (+ "rm" when reduced-motion)
├─ <Starfield/>                    // fixed wallpaper SVG: nebula gradient + <WallStars/> + chart rings,
│                                  //   constellation, ringed planet, moon, dark horizon, lit observatory
├─ <MenuBar>                       // .mbar — navy+brass
│  ├─ Terraform logo + menus (Go / Window / Help)
│  ├─ app name (focused window)
│  └─ XP pill + clock
├─ <Desktop>                       // .desk (pointerdown clears icon selection)
│  ├─ <DesktopIcons/>              // .dicons — Orbis Explorer, Botanica, Journal, Settings (enamel-pin SVGs)
│  └─ <PinnedNote/>                // .note — bulletin, "Open Orbis Explorer"
├─ <WindowLayer>                   // absolutely-positioned windows, z-ordered
│  ├─ <Window app="orbis"><OrbisExplorer/></Window>
│  ├─ <Window app="journal"><Journal/></Window>
│  └─ <Window app="settings"><Settings/></Window>
├─ <Dock>                          // .dock — navy+brass
│  ├─ app icons (running dot)
│  └─ <Cygnus/>                    // .pot — black-hole mascot + speech bubble
├─ <Menus/>                        // Go/Window/Help dropdowns + scrim
├─ <LaunchOverlay/>                // .cele — "Entering Botanica" transition (simulated)
└─ <Toasts/>                       // .toasts
```

`<Window>` is one reusable shell (title bar with pinstripes, round terracotta close, square brass
min/max, body, resize grip). `OrbisExplorer`, `Journal`, `Settings` are its contents.

---

## 2. Application structure (state)

All state lives on the root `Component` (`Main.dc.html`, see `constructor`). Fields:

| State | Meaning |
|---|---|
| `wins` | per-app `{x,y,w,h,open,min,max,z}` for `orbis`/`journal`/`settings` (see `APPS`). |
| `ztop`, `focus` | top z-index counter; currently focused app id. |
| `selIcon` | highlighted desktop icon. |
| `menu` | open menu bar dropdown (`go`/`win`/`help`/`null`). |
| `world` | selected world in Orbis Explorer (`botanica`/`lithic`/`aether`/`ironworks`). |
| `launching` | Botanica launch overlay visible. |
| `compMood` (`idle`/`react`), `compBubble`, `compLine`, `pets` | Cygnus mascot. |
| `rm`, `showComp`, `sway`, `focusMode` | settings toggles (reduce-motion, show mascot, accretion disk, fullscreen). |
| `toasts`, `W`, `H`, `now` | transient UI, measured size, clock. |

Static data (top of the logic block): `WORLDS` (4), `ACHV` (3), `APPS` (3), `LV_T`/`LV_N` (levels),
`SAMPLE` (xp/lessons/missions/streak), `PETS` (Cygnus lines), `WALLSTARS` (precomputed star field).

---

## 3. Navigation flow

```
Desktop (Terraform OS)
  ├─ double-click a desktop icon ──► opens that app window
  ├─ click a dock icon ───────────► opens app (or minimizes if already focused)
  ├─ menu bar ▸ Go ▸ <app> ───────► opens app
  └─ "Open Orbis Explorer" (note) ► opens Orbis Explorer

Orbis Explorer (the world atlas)
  ├─ left catalog: click a world ─► docks its dossier on the right (selection = cyan)
  ├─ Botanica dossier ▸ "Enter Botanica" ─► LaunchOverlay (SIMULATED hand-off)
  └─ Lithic/Aether/Ironworks dossier ─► "Coming soon" (disabled; preview only)

Journal  = personal learning overview (continue-in-Botanica, XP/level ring, stats, recent marks)
Settings = fullscreen, reduce motion, show companion, accretion disk
```

Every window: close / minimize / maximize (double-click title) / drag / resize / raise-on-focus.
"Return to desktop" = minimize or close windows (or Window ▸ Minimize all).

---

## 4. Window management (the one non-trivial system)

In `Main.dc.html`: `geom`, `focusWin`, `openApp`, `closeWin`, `minWin`, `toggleMax`, `dragStart`,
`dragMove`, `dragEnd`, `winVals`, plus `measure`/`scaleK`.

- **Positioning** `geom(id)` clamps a window into the viewport (top offset 34px for the menu bar,
  ~92px reserved for the dock). **Below `--bp-window-maximize` (760px) every window force-maximizes.**
- **Z-order / focus** `focusWin` bumps a monotonic `ztop`; `.is-blur` dims unfocused title bars.
- **Dragging** uses Pointer Events with `setPointerCapture`. **Important:** deltas are divided by
  `scaleK()` (the artboard's rendered-width ÷ offset-width) so dragging tracks the cursor when the
  canvas is scaled. In a real browser `scaleK()` is `1`, but keep the division — it's harmless at 1:1
  and correct inside any zoomed/embedded host.
- **Resize** bottom-right grip, min width per app (`APPS[].minW`), min height 320.
- **Open/close** animated via `.win` / `.is-hidden` (opacity + translateY + scale, `--ease-soft`).

---

## 5. World selection & Coming-Soon states

- `WORLDS` holds `{id,name,lang,langs[],status,color,theme,sub,blurb,figName,version,verLabel}`.
- The catalog renders `worldsList`; the detail panel renders the `dos` view-model for `state.world`.
- **Selection color is celestial cyan (`--cyan`) system-wide** — selected catalog row, active menu
  item, selected desktop icon, toggles "on", focus ring, and text selection. Gold/brass is reserved
  for structure (frames, pinstripes, dock), terracotta for the close button, green for the Botanica world only.
- **Available** (Botanica): dossier shows **Enter Botanica**.
- **Coming soon** (Lithic/Aether/Ironworks): dossier shows a **disabled** button + "Preview only ·
  planned vX". Planned versions are `v0.4`/`v0.3`/`v0.2` — **deliberately version numbers, never dates**,
  and these worlds never launch anything.

Each world has a distinct inline-SVG illustration in a shared woodcut style (lush Botanica, faceted
Lithic crystals, Aether floating isle, Ironworks turning gears). The detail "plate" is the dark cosmos
inset (`#12180e`) with a per-world star field.

---

## 6. Fullscreen behavior

`toggleFocus()` calls `element.requestFullscreen()` on the root (with `exitFullscreen`), wrapped in
try/catch. If the Fullscreen API is unavailable/blocked it flips a `focusMode` flag and toasts instead.
In production, wire this to the real app root; expect it to be blocked inside sandboxed iframes.

---

## 7. Animation behavior (all CSS; respects `prefers-reduced-motion`)

| Name / class | Where | Trigger |
|---|---|---|
| `bubbleIn` | menus, speech bubble | on mount |
| window open/close | `.win` / `.is-hidden` | open/minimize/close |
| `rot` | Ironworks gears, launch portal | continuous |
| `bh-spin` (uses `rot`) | Cygnus accretion disk | continuous; `.fast` while reacting; gated by the "Accretion disk" toggle |
| `bhpulse` (`.bh-glow`) | Cygnus glow | continuous |
| `swallow` (`.bh-star`) | Cygnus infalling star | once, when the mascot is stirred |
| `toastIn` | toasts | on toast |
| `popIn` / `fadeIn` | launch overlay | on open |
| `twinkle` (`.twk`) | wallpaper + plate stars | continuous (subset of stars) |
| `dockIn`, legacy `sway`/`blink` | (dock, unused mascot states) | — |

**Reduced motion:** add `rm` to the root class. CSS both honors `@media (prefers-reduced-motion)` and
force-stops the named animations via `.os.rm .bh-spin, …{animation:none}`. Settings ▸ Reduce motion
sets this manually.

---

## 8. Responsive breakpoints

- **≤ 820px** (`--bp-desktop`): desktop icons reflow to a 3-column centered grid; the pinned note hides;
  Orbis Explorer's catalog + detail stack vertically; Journal's top row stacks.
- **≤ 760px** (`--bp-window-maximize`): `geom()` force-maximizes every window (full-bleed app, no chrome
  to drag). This is the phone/tablet mode — one app fills the screen under the menu bar and above the dock.
- The layout is fluid (the artboard is a PAGE / `expand:fill`); there are no fixed-width containers.

---

## 9. Dependencies

- **Runtime (production target):** React 18 + ReactDOM. (The prototype relies on the canvas to supply
  React; you provide it.)
- **Fonts (Google Fonts):** `Young Serif` (display), `Figtree` (UI, weights 400/500/600/700),
  `JetBrains Mono` (400/500/700). One `<link>` to `fonts.googleapis.com/css2?...` — see README.
- **No other third-party UI libraries.** No component library, no icon package, no CSS framework.
- **No build-time assets** beyond the fonts (everything else is inline SVG — see §10).
- `support.js` referenced in the `.dc` files is the **Design-canvas runtime only**; it is **not** a
  dependency of the production app and must not be shipped.

---

## 10. Asset locations

**Every illustration is inline SVG inside `Main.dc.html`.** There are **no** external images, sprite
sheets, or icon fonts, and no binary assets. Inventory:

| Asset | Where in `Main.dc.html` |
|---|---|
| Wallpaper (nebula, star field, chart rings, constellation, ringed planet, moon, dark horizon, lit observatory) | `.desk` `<svg>` block |
| App / desktop icons (Orbis astrolabe, Botanica plant-in-orbit, Journal book, Settings gear-leaf) | `deskIcons` loop + dock loop (`display` toggles per glyph) |
| World planets (Botanica, Lithic, Aether, Ironworks) — list icons + large "plate" versions | Orbis Explorer markup (`dBot/dLit/dAet/dIro` display groups) |
| Cygnus (black-hole mascot: horizon, photon ring, accretion disk, lensed halo, infalling star) | `.pot` / `.sprout-btn` `<svg>` |
| Level/growth ring, achievement glyphs, status chips | Journal markup |

When porting, keep each SVG as a React component (e.g. `<WallpaperSvg/>`, `<WorldPlanet id=…/>`,
`<CygnusMascot mood=…/>`). **Do not replace or redraw them** — copy the paths exactly.

---

## 11. Functional vs. simulated

**Functional (works as real UI):**
- Window manager: open, close, minimize, maximize, double-click-title maximize, drag, resize, focus/z-order.
- Menu bar menus; dock (open / minimize-on-reclick / running indicator); desktop icons (select / double-click open).
- Orbis Explorer world selection + dossier; cyan selection state.
- Journal rendering from the data model; Settings toggles (reduce motion, show companion, accretion disk, fullscreen attempt).
- Cygnus mascot: click-to-stir, star-swallow animation, one speech line per click (no idle/random dialogue).
- Toasts; reduced-motion; responsive reflow/maximize.

**Simulated (intentionally not wired — these are the integration seams, §12):**
- **Enter Botanica** → shows the launch overlay only; it does **not** boot the Botanica app.
- **Dashboard numbers** (`SAMPLE`: 1,240 XP, Level, 11 lessons, 4 missions, 6-day streak) are **static sample data**.
- **Coming-Soon worlds** have no destinations; planned versions are placeholders (no real build attached).
- **Fullscreen** uses the browser API and may be blocked by the host; then it falls back to a flag + toast.

---

## 12. Integration points (into the existing product)

Terraform OS (shell) ▸ Orbis (this hub) ▸ Botanica (existing Python env) + three future worlds.
**Botanica must remain unchanged — Orbis only hands off to it.**

Wire these seams during integration:

| Seam (in `Main.dc.html`) | Today | Production intent |
|---|---|---|
| `enterBotanica()` | sets `launching:true` (overlay) | Navigate/mount the **existing** Botanica app (route change, window, or micro-frontend). Do not modify Botanica. |
| `SAMPLE` + Journal view-model | static | Read live progress (XP, level, lessons, missions, streak) from Botanica/user state. |
| `WORLDS[].status` / `version` | hard-coded | Drive from a world registry; flipping a world to `available` + giving it an entry action is the only change needed to "open" it. |
| `selectWorld(id)` / `openApp(id)` | local state | Keep as the hub's navigation API; emit events the shell can observe. |
| Coming-Soon dossiers | disabled | When Lithic/Aether/Ironworks ship, point their action at the same hand-off mechanism as Botanica. |
| `toggleFocus()` | root `requestFullscreen` | Point at the real app root element. |

**Entry points / navigation actions to expose:**
`openApp('orbis'|'journal'|'settings')`, `selectWorld(worldId)`, `enterBotanica()` (→ Botanica),
and the menu/dock/desktop-icon openers. These are the hub's public surface.

---

## 13. Fidelity checklist (verify against the approved prototype)

- [ ] Stellar wallpaper: nebula + star field + chart rings + constellation + ringed planet + moon + dark horizon + lit observatory.
- [ ] Window chrome: pinstripe title bar, round terracotta close, square brass min/max, hard-offset shadow, resize grip.
- [ ] Navy+brass menu bar & dock; warm-ivory window bodies.
- [ ] Selection = celestial cyan everywhere (rows, menus, icons, toggles, focus, text selection).
- [ ] Four distinct world illustrations in one woodcut style; dark cosmos "plate".
- [ ] Coming-Soon = disabled Enter + planned `v0.x` (no dates), never launches.
- [ ] Cygnus mascot: spinning disk, lensed halo, star-swallow on stir, click-only dialogue.
- [ ] Type: Young Serif / Figtree / JetBrains Mono.
- [ ] Reduced-motion stills all named animations; ≤760px maximizes windows; ≤820px reflows.
