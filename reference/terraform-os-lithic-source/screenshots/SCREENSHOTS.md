# Screenshots — capture guide (no PNGs bundled; here's why and how)

**Why no PNGs:** `Main.dc.html` renders only on the Claude Design runtime (`support.js`), which this export
environment cannot run, and the design tool's rules bar rendering/screenshotting the canvas. Rather than ship
inaccurate images, capture these from the **live** artifact — they are the visual-regression ground truth.

## How
Open the Design artifact **"Terraform OS — Lithic"**, press **Play**, capture at ≥ 1440px wide unless noted.
Save into this `screenshots/` folder under the names below.

| # | File | State | How to reach it |
|---|---|---|---|
| 1 | `01-desktop.png` | Terraform OS desktop — Lithic surface, no window | Open the **Desktop** reference board (or close the Survey window) |
| 2 | `02-lithic-hub.png` | Survey — three planets framed | Main board, default view (after auto-frame) |
| 3 | `03-foundation-expanded.png` | The Foundation expanded into concept mini-planets | Click **The Foundation** (or open **Hub** board) |
| 4 | `04-foundation-lessons.png` | A concept expanded into its 5 lessons | From #3, click a concept mini-planet |
| 5 | `05-crystal-matrix-sealed.png` | The Crystal Matrix (DAX) sealed, expanded | Click **The Crystal Matrix** |
| 6 | `06-refinery-sealed.png` | The Refinery (M) sealed | Click **The Refinery** (or open **Preview** board) |
| 7 | `07-specimen-sheet.png` | Specimen sheet — discipline level | Any planet selected, read the right panel |
| 8 | `08-specimen-lessons.png` | Specimen sheet — lesson set | A concept selected |
| 9 | `09-hover-preview.png` | Planet hover preview bubble | Hover a planet without selecting |
| 10 | `10-transition-card.png` | Simulated Enter/Return overlay | Click "Enter the Foundation" or "Orbis" |
| 11 | `11-companion-flint.png` | Flint companion reacting | Tap Flint in the dock |
| 12 | `12-mobile.png` | < 760px shell (window maximized) | Narrow the window below 760px |

## NOT to capture (do not fabricate — these were never designed)
Lesson interface, HTML/DAX/M editors + previews, exercise feedback, lesson recap, mission selection, mission
completion. These are Stage 2; their specs document the intended (Botanica-reused) structure instead.
