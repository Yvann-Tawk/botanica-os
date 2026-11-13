# Botanica OS — The Botanical Cosmos (source export)

An exact export of the Design canvas, exported 2026-11-13. Every file in `project/` is byte-identical to the published version. Nothing was redesigned, reformatted or simplified. `MANIFEST.sha256` lets you verify this.

## What's inside

```
project/
  canvas.json         Canvas index: artboard frames, order, titles, sticky notes (tokens, type, interactions, limits)
  Main.dc.html        The whole application: markup, all CSS, all SVG art, all logic (~2,700 lines)
  Desktop.dc.html     Reference board: mounts Main with start="desktop"
  Universe.dc.html    Reference board: mounts Main with start="universe"
  Academy.dc.html     Reference board: mounts Main with start="academy"
  Missions.dc.html    Reference board: mounts Main with start="missions"
  Profile.dc.html     Reference board: mounts Main with start="profile"
MANIFEST.sha256
README.md
```

### Where things live inside Main.dc.html

| Section | Contents |
|---|---|
| `<helmet><style>` | Every stylesheet: menu bar, desktop, dock, windows, shared controls, Universe, Academy, editor, Missions, Terminal, Profile, overlays, Sprout animations, keyframes, reduced-motion and ≤760px rules |
| Wallpaper `<svg>` | Star-chart wallpaper, ringed planet, hills, observatory, fern symbol, grain filter |
| `.dicons` / `.dock` | The six desktop-icon SVGs (Universe, Academy, Terminal, Missions, Workshop, Pilot) and the tray |
| `<section class="win">` ×6 | Universe, Academy, Terminal, Missions, Workshop and Pilot windows |
| `.pot` | Sprout, the mascot (all moods and evolution stages) |
| `<script type="text/x-dc">` | Syntax highlighter, the pocket Python interpreter, lesson/mission/region content, and the `Component` class (window manager, pan/zoom, editors, validation, XP, celebrations) |

## Assets and dependencies

- **Images:** none. Every illustration is inline SVG inside `Main.dc.html`.
- **Fonts:** loaded from Google Fonts at runtime: Young Serif, Figtree 400–700 and JetBrains Mono 400–700.
- **npm / build tooling:** none. There is no `package.json` because the project has no packages to install.
- **Runtime (not included):** these are Design Component files (`.dc.html`). They load `./support.js` and use the Design canvas templating (`<x-dc>`, `{{holes}}`, `<sc-if>`, `<sc-for>`, `<dc-import>`, `class Component extends DCLogic`). The canvas supplies that runtime; it is part of the canvas product, not the project, so it isn't in this export.

**Important:** opening `Main.dc.html` straight in a browser shows unrendered template markup. It runs inside the Design canvas, or after it's ported to a standard stack.

## Porting to a standalone app (e.g. with Claude Code)

The format maps almost one-to-one onto React:

- `{{x}}` holes become JSX expressions; `renderVals()` becomes the body of `render()`
- `<sc-if value>` becomes `{cond && …}`; `<sc-for list as>` becomes `.map()`
- `onClick="{{fn}}"` becomes `onClick={fn}`
- Inline `style="…"` strings become style objects
- SVG attributes become camelCase (`stroke-width` → `strokeWidth`)
- `display="{{…}}"` toggles on SVG groups can become conditionals
- `<helmet><style>` moves to a global CSS file
- The interpreter, highlighter and content constants are plain JS and can move as they are
- The five reference boards become a `?start=` route or prop

For the production build, the brief recommends replacing the pocket interpreter with Pyodide in a Web Worker and keeping the console and Sprout's error explanations.
