# Terraform OS — architecture and world rollout

Terraform OS is the operating system. **Orbis** is its hub. **Botanica** (Python) is the first learning world and,
in V1.0, the only open one. **Lithic**, **Aether** and **Ironworks** are planned worlds, shown in Orbis as previews.

This document covers how Orbis was integrated into the existing Botanica app (2026-11-15), how the pieces fit, and
where future worlds go. Botanica's own architecture is in [ARCHITECTURE.md](ARCHITECTURE.md) and is unchanged.

## Naming

| Name | What it is | Where it appears |
|---|---|---|
| Terraform OS | The product and the OS shell | Browser title, PWA manifest, Orbis menu bar, backups, update prompts |
| Orbis | The hub: world atlas, Journal, Settings | The default launch screen |
| Botanica | The Python world (the original Botanica OS app) | Its own menu bar, lessons, curriculum, Sprout |
| Lithic · Aether · Ironworks | Future worlds | Orbis previews only |

Internal identifiers were deliberately **not** renamed: the IndexedDB database is still `botanica`, the localStorage
prefix is still `botanica:`, and backups still carry `app: 'botanica-os'`. Renaming them would need a data migration
for no user-visible benefit, so existing progress keeps working untouched.

## World structure and release plan

The registry is [`src/terraform/worlds.ts`](../src/terraform/worlds.ts). Orbis renders it; nothing else in the hub
hard-codes a world.

| World | Theme | Languages (release) | Status |
|---|---|---|---|
| Botanica | Botanical | Python (V1.0) | Available |
| Lithic | Geological, crystalline | HTML (V2.0), DAX (V3.0), Power Query M (V4.0) | Coming soon |
| Aether | Ethereal, floating isles | JavaScript (V5.0), CSS (V6.0) | Coming soon |
| Ironworks | Industrial, mechanical | C# (V7.0), SQL (V8.0) | Coming soon |

Versions only, never dates. (The design file showed placeholder `v0.x` numbers; the registry uses the release plan.)

## How the app is put together

```
main.tsx → boot.ts (reads settings, progress, layouts, `orbis` prefs; decides the place)
  └─ TerraformOS (src/terraform/TerraformOS.tsx)       shared settings, live progress, fullscreen, history
       ├─ Orbis (src/terraform/Orbis.tsx)              the hub: desktop, Orbis Explorer, Journal, Settings, Cygnus
       └─ Botanica = App.tsx (lazy)                    the existing app, unchanged apart from optional hooks
```

- **One shell, two places.** `TerraformOS` shows either Orbis or Botanica. Each place is mounted the first time it is
  shown and then kept alive (hidden and `inert`) when you leave it, so a running Python worker, open editors and
  window layouts survive a round trip. A Botanica deep link never mounts Orbis at all, so it boots exactly as
  Botanica always did.
- **One window manager.** `shell/windowReducer.ts` now exports `createShell(apps)`. Botanica's shell is
  `createShell(APPS)` under its old names; Orbis builds `hubShell` from its own three apps. Both use the same
  `<Window>` chrome component and `<MenuBar>` (which gained `brand` and an optional `streak`).
- **Two designs, no shared theme.** Botanica keeps `prototype.css` verbatim. Orbis's stylesheet
  (`styles/orbis.css`) is the design's CSS with every selector scoped under `.orbis` and every keyframe prefixed
  `ob-`, so neither design can restyle the other. The Orbis artwork (`terraform/art.tsx`) is the design's SVG,
  copied path for path.
- **Botanica's hooks are opt-in.** `App.tsx` accepts optional props (`active`, `settings` / `onSettingsChange`,
  `onLearning`, `onExitToOrbis`, `fullscreen` / `onToggleFullscreen`, `resume`). Without them it behaves exactly as
  before, which is how the existing tests still render it.

The approved design source is kept in `reference/terraform-os-orbis-source/` (with its handoff notes and tokens).

## Navigation flow

1. Terraform OS opens on **Orbis** (`/`).
2. Orbis Explorer lists the four worlds; selecting one docks its dossier (selection is celestial cyan).
3. **Enter Botanica** shows the design's short transit card (0.9 s; instant with reduced motion), then mounts the real
   Botanica app. The URL becomes `/#/botanica`.
4. In Botanica, **Go ▸ Return to Orbis** goes back to the hub. The browser's Back and Forward buttons move between
   the two as well.
5. Journal ▸ **Resume in Botanica** enters Botanica and opens the next lesson.
6. Coming-soon worlds show a disabled **Coming soon** button and their planned versions. They never navigate.

Deep links: `/#/botanica`, `/?start=<app>` and `/?demo=<preset>` open Botanica directly (so old bookmarks and the
end-to-end tests keep working). Refreshing inside Botanica stays in Botanica.

Shortcuts: in Orbis, ⌘1 Orbis Explorer, ⌘2 Botanica, ⌘3 Journal, ⌘, Settings. In Botanica, its own ⌘1–6 and ⌘,.
Only the place on screen listens.

## Shared progression

There is one learner profile: Botanica's existing `progress` (concept completion) and `progression` (the event log
that XP, levels, streaks and achievements derive from). Orbis **stores nothing of its own about learning**.
`terraform/journal.ts` builds the Journal and the menu-bar XP from those records: total XP and level, lessons done,
missions done (project missions plus Seed / Sprout / Bloom lesson missions), day streak, the next lesson, and the most
recent achievements. While Botanica is mounted it reports changes live (`onLearning`); before that Orbis uses what
`boot.ts` loaded.

No records were duplicated and no schema changed, so no migration was needed. New storage:

| Key | Contents |
|---|---|
| `orbis` | Orbis-only preferences: show Cygnus, accretion disk, selected world, hub window layout |

`settings` is now shared by both places (Orbis's Reduce motion is the same setting as Botanica's Motion). Backups
include `orbis` automatically because they export every key.

### When a second world ships

Per-world progress (completed lessons, missions, mastery, projects, achievements) should stay with that world, keyed
by world, while XP, level and streak stay global. The least disruptive path:

1. Keep Botanica's keys as they are (they are Botanica's). New worlds prefix theirs, e.g. `lithic:progress`.
2. Tag new event-log entries with their world (an optional `world` field on `LearnEvent`, defaulting to `botanica`
   when absent, so existing events need no migration). Global XP stays the sum of all events.
3. Give `buildJournal` a per-world summary and show it in the Journal; the menu-bar XP stays global.

## Adding a world

1. Build the learning environment beside the existing apps (for example `src/worlds/lithic/`), reusing the runtime,
   editor, checker and window manager where they fit.
2. In `worlds.ts`, set the world's `status` to `'available'` and give it an `entry`.
3. In `TerraformOS.tsx`, add a `Place` for it and mount it the way Botanica is mounted (lazy, kept alive, hash route).
4. In `Orbis.tsx`, point the dossier's Enter button at the new entry (Botanica's `enterBotanica` is the template).

Nothing else in Orbis needs to change: the catalog, dossier, chips and counts are all driven by the registry.

## Mascots

- **Sprout** (Botanica) no longer speaks unprompted. The launch greeting and the timed streak greeting are gone. Milestone
  reactions (lesson complete, level up) only appear when Settings ▸ Sprout ▸ "react to milestones" is on, which is
  now **off by default** for new learners. Learners who already saved that preference keep their choice. Petting
  Sprout and Help ▸ "Ask Sprout for a nudge" still get an answer. The bubble ignores the pointer, so it never blocks
  a click on a window under it, and it never takes keyboard focus.
- **Cygnus** (Orbis) is part of the approved hub design. It only speaks when clicked, and can be hidden in Orbis
  Settings.

## Fullscreen

Orbis Settings ▸ Fullscreen and Botanica's Window ▸ Enter fullscreen both call the Fullscreen API on the whole
document, so fullscreen carries across worlds. The button label follows `fullscreenchange` (Esc exits too). Where the
API is blocked (some embedded frames, iOS Safari for non-video elements) a toast says so and nothing else changes.

## Deviations from the design file

- Planned versions use the release plan (V2.0–V8.0) instead of the placeholder `v0.2`–`v0.4`.
- Sample numbers (1,240 XP, 11 lessons, 4 missions, 6-day streak, the three sample achievements) are replaced by real
  data; with no achievements yet, the Journal says so. The design's level table is replaced by Botanica's real one.
- "Enter Botanica" opens the real app instead of a simulated overlay; the overlay remains as the transit card.
- Accessibility: two text colours that fail WCAG AA contrast (the dossier labels, and the Journal kicker on cream)
  were darkened.
- Phone widths: the menu bar drops the focused-app name and clock below 560px, and stacked Journal cards size to their
  content.

## Known limitations

- Only Botanica has a learning engine; the other worlds are previews by design.
- The app icons (favicon, PWA icons) are still the Botanica artwork; no Terraform OS icon was part of the handoff.
- The handoff contained no rendered screenshots, so fidelity was checked against the design source, not images.
- `?demo=` presets show demo progress in Orbis too (display-only, never saved).
- Fullscreen depends on browser support; inside embedded previews it may be refused.
