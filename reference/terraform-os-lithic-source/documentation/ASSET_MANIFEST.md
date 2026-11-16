# ASSET_MANIFEST.md — Lithic

## Asset model: there are NO binary assets
Every visual in the Lithic prototype is **inline SVG or CSS drawn in `Main.dc.html`** — there are **no PNG/JPG/
WebP images, no icon fonts, and no external illustration files.** Fonts load from Google Fonts by `<link>`.
Therefore this manifest lists **inline SVG art blocks** (copy each verbatim into an SVG component during the
port), not files on disk. "Unavailable as a file" is expected and correct here.

| Art block | Where (in Main.dc.html) | Format | Intended use | Component | Responsive | Animated |
|---|---|---|---|---|---|---|
| Desktop wallpaper scene | `.desk` `<svg viewBox 0 0 1440 900>` | inline SVG | Lithic surface backdrop | DesktopWallpaper | `slice` scales to viewport | grain filter, static |
| ↳ survey chart rings + ticks | wallpaper `<g>` + `{{wallTicks}}` | inline SVG | geological survey motif | DesktopWallpaper | — | no |
| ↳ cut geode specimen | wallpaper `#wpSpec` clip group | inline SVG | hero specimen (amethyst) | DesktopWallpaper | — | no |
| ↳ strata hills | wallpaper hill paths | inline SVG | foreground terrain | DesktopWallpaper | — | no |
| ↳ mine headframe | wallpaper `translate(250 668)` | inline SVG | structure (was observatory) | DesktopWallpaper | — | no |
| ↳ ore crystals + flecks | `{{crystals}}`, `{{wallStars}}` | inline SVG | scatter detail | DesktopWallpaper | — | twinkle (opt) |
| Desktop/dock icons ×4 | `{{deskIcons}}` / `{{dockItems}}` glyphs | inline SVG 64×64 | Survey/Foundation/Journal/Orbis | DesktopIcons/Dock | fixed | hover lift |
| Planet body (Foundation) | `.planet` `dFound` group | inline SVG 200vb | HTML dig-site | PlanetBody | scales with `size` | here-pulse, glow |
| Planet body (Crystal Matrix)| `.planet` `dMatrix` group | inline SVG | DAX dig-site (sealed) | PlanetBody | — | glow |
| Planet body (Refinery) | `.planet` `dRefin` group | inline SVG | M dig-site (sealed) | PlanetBody | — | glow |
| Mini-planet (concept/lesson)| `.nodep` `{{nodes}}` | inline SVG 100vb | module + lesson nodes | MiniPlanet | scales with `size` | `nodeIn`, pulse |
| Spokes | plane `{{spokes}}` | inline SVG lines | expansion links | Spokes | — | dash flow |
| Navigator void + strata/neb | `.uv.lith` plane `<svg 2600×1700>` | inline SVG | underground chart field | SurveyWindow | plane transform | parallax stars |
| Companion "Flint" | `.pot` `{{companion}}` SVG 124×108 | inline SVG | mascot (rock+crystal) | Companion | fixed | mood rig |
| Window/menu/toast glyphs | inline per control | inline SVG | close/min/max/zoom/etc | shell | fixed | micro |
| Transition art (cele) | `.cele-card` SVG | inline SVG | descend/enter/return | TransitionCard | fixed | popIn |

## Fonts (external, by link — not bundled)
Young Serif · Figtree (400/500/600/700) · JetBrains Mono (400/500/700), from `fonts.googleapis.com`.

## Missing / to-produce
- No lesson/editor/exercise/recap/mission art exists (those screens are not designed) — see their specs.
- If the production app wants rasterized social/preview images, they must be produced from the live render.
