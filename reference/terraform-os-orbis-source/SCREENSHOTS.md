# Visual references — capture guide

**Why there are no PNGs in this package:** `Main.dc.html` only renders on the Claude Design runtime
(`support.js`), which this export environment can't run, and the Design tool's own rules prevent me
from rendering/screenshotting the canvas. So rather than ship inaccurate images, here is exactly how to
capture the six required references from the **live** approved artifact — these are the ground truth for
visual fidelity.

## How to capture
Open the Design artifact **"Terraform OS — Orbis Hub"** and press **Play**. Capture at a desktop width
(≥ 1280px) unless noted. Save into a `screenshots/` folder with the names below.

| # | File | What to show | How to get the state |
|---|---|---|---|
| 1 | `01-desktop.png` | **Terraform OS desktop** — starfield wallpaper, menu bar, dock, desktop icons, Cygnus in the dock | Main board → **Window ▸ Minimize all** (or close the open window) so no app covers the desktop |
| 2 | `02-orbis-explorer.png` | **Orbis Explorer** window — catalog + dossier | Default state (Orbis opens on launch), or open the **"Orbis — Botanica selected"** reference board |
| 3 | `03-botanica-preview.png` | **Botanica world preview** — green planet plate, languages, **Enter Botanica** | In Orbis Explorer, select **Botanica** (first catalog row) |
| 4 | `04-lithic-coming-soon.png` | **Lithic Coming Soon** — crystal planet, disabled Enter, "planned · v0.4" | In Orbis Explorer, click the **Lithic** row (cyan selection) |
| 5 | `05-aether-coming-soon.png` | **Aether Coming Soon** — floating-isle planet, "planned · v0.3" | Click the **Aether** row, or open the **"Orbis — Coming-soon preview"** reference board |
| 6 | `06-ironworks-coming-soon.png` | **Ironworks Coming Soon** — turning-gears planet, "planned · v0.2" | Click the **Ironworks** row |

## Recommended extras (not required, but useful for QA)
- `07-journal.png` — the Journal window (XP/level ring, stats, recent marks).
- `08-settings.png` — the Settings window (fullscreen, reduce motion, show companion, accretion disk).
- `09-launch.png` — the **Enter Botanica** launch overlay (simulated transition).
- `10-cygnus.png` — Cygnus mid-stir (star being swallowed) — click the mascot, then capture.
- `11-mobile.png` — narrow the window < 760px to show the maximized single-app layout.

## Verifying fidelity
Compare each production screenshot against these, using `DESIGN_HANDOFF.md` §13 (fidelity checklist).
The selection highlight must be **celestial cyan** in every shot where something is selected.
