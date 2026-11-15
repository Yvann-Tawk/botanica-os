# Terraform OS — Orbis Hub · Source Handoff

Developer handoff for the **approved** Orbis Hub design, for production implementation in Claude Code.

> **Please read `DESIGN_HANDOFF.md` §0 first.** The approved prototype is a **Claude Design canvas
> component** (`.dc.html` — one HTML file per screen, running on the platform's own runtime), **not** a
> pre-existing React project. There is therefore no original `src/`, `package.json`, or `node_modules`
> to export — those don't exist. This package ships the **real, unmodified source** plus a complete
> spec and design tokens so the production React app reproduces the design exactly. Nothing has been
> redesigned, simplified, or re-illustrated.

## Contents

```
terraform-os-orbis-source/
├─ README.md                     ← this file
├─ DESIGN_HANDOFF.md             ← architecture, interactions, integration points, fidelity checklist
├─ SCREENSHOTS.md                ← how to capture the 6 required visual references (see note below)
├─ MANIFEST.sha256               ← checksums for every file
├─ design-tokens/
│   ├─ tokens.css                ← colors, type, radii, shadows, breakpoints (verbatim)
│   └─ tokens.ts                 ← same, typed, for the React build
└─ source/
    └─ project/
        ├─ Main.dc.html          ← THE DESIGN: all markup, CSS, inline SVG art, and logic (~800 lines)
        ├─ Orbis.dc.html         ← reference board (mounts Main: Orbis open, Botanica selected)
        ├─ AetherPreview.dc.html ← reference board (mounts Main: Aether coming-soon dossier)
        └─ canvas.json           ← canvas index + the design sticky-notes
```

## Viewing the approved design

`Main.dc.html` depends on the Claude Design runtime (`support.js`, supplied by the platform) and so
does **not** render as a plain file in a browser. To see the approved pixels, open the live Design
artifact (title **"Terraform OS — Orbis Hub"**) and press Play. Use `SCREENSHOTS.md` to grab the six
verification shots from there.

## Running it as a web app (the production port)

There is no standalone runnable build to `npm start`, because the prototype runs inside Claude Design.
The intended production target is a small **Vite + React + TypeScript** app. Recommended setup (create
these yourself in Claude Code — they are intentionally **not** included so nothing here misrepresents
itself as the "original project"):

```bash
# 1. scaffold
npm create vite@latest terraform-os -- --template react-ts
cd terraform-os
npm install

# 2. add the fonts (index.html <head>)
#    <link rel="preconnect" href="https://fonts.googleapis.com">
#    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">

# 3. drop in the tokens
cp ../design-tokens/tokens.css  src/styles/tokens.css   # import in main.tsx
cp ../design-tokens/tokens.ts   src/styles/tokens.ts

# 4. build the components per DESIGN_HANDOFF.md §1, porting Main.dc.html 1:1
#    (window manager = one reducer; each SVG copied verbatim into an SVG component)

# dev / build / preview
npm run dev
npm run build
npm run preview
```

### Required dependencies
- `react`, `react-dom` (v18)
- Dev: `vite`, `typescript`, `@vitejs/plugin-react`
- Fonts: Google Fonts — Young Serif, Figtree (400/500/600/700), JetBrains Mono (400/500/700)
- **No** UI library, icon package, or CSS framework. All art is inline SVG (see `DESIGN_HANDOFF.md` §10).

### Porting order (fastest path to fidelity)
1. Global CSS: paste the `<style>` block from `Main.dc.html` into one stylesheet; swap literal hexes for the token vars if desired.
2. `<Window>` shell + window-manager reducer (`DESIGN_HANDOFF.md` §4) — the only non-trivial logic.
3. Starfield wallpaper, dock, menu bar (static-ish).
4. Orbis Explorer (catalog + dossier) from the `WORLDS` data.
5. Journal + Settings.
6. Cygnus mascot SVG + the stir interaction.
7. Wire the integration seams (`DESIGN_HANDOFF.md` §12).

## Known limitations
- **Not a prebuilt React project.** The real source is the `.dc.html` design; the React app is produced during porting (above).
- **`.dc.html` won't render as a loose file** — it needs the Design runtime. View via the live artifact.
- **Simulated behaviors** (don't treat as bugs): *Enter Botanica* shows a transition only; dashboard numbers are static sample data; Coming-Soon worlds have no destinations; fullscreen may be blocked by the host. Full list in `DESIGN_HANDOFF.md` §11.
- **Botanica is out of scope** and must stay unchanged — Orbis only hands off to it.
- **Screenshots** are not bundled as rendered PNGs (this environment can't run the Design runtime to render the file, and the design tool's rules bar me from rendering the canvas). `SCREENSHOTS.md` says exactly how to capture the six required shots from the live artifact.

## Verification done before shipping this package
- All four source files copied **byte-for-byte** from the approved prototype (verify with `MANIFEST.sha256`).
- Design tokens cross-checked against the values in `Main.dc.html`.
- Source sanity-checked for the key systems (window manager `geom`/`dragMove`, `enterBotanica`, cyan
  selection `.wrow.on`, Cygnus `bh-spin`, `requestFullscreen`).
- No design changes were made while preparing this handoff.

Check integrity after unzipping:
```bash
cd terraform-os-orbis-source && shasum -c MANIFEST.sha256
```
