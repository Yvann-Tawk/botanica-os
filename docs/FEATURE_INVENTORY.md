# Botanica OS — Feature Inventory & Gap Analysis

Legend: ✅ works in prototype · 🟡 works but simulated/hardcoded · ❌ visual only / missing

## Shell
| Feature | Status | Notes |
|---|---|---|
| Menu bar (app menu, Go, Window, Help, XP pill, clock) | ✅ | Clock updates every 30s. Help menu shortcut rows just close the menu. |
| Desktop icons (select, double-click, keyboard) | ✅ | 6 apps. |
| Sticky note | 🟡 | Static text. |
| Windows: open, close, minimize, maximize, focus/z-order, drag, resize, dbl-click max | ✅ | Geometry clamped; auto-max <760px. Not persisted. |
| Window menu: arrange (cascade), minimize all, Universe full view | ✅ | |
| Dock / seed tray with running dots, tooltips | ✅ | |
| Toasts, XP fly-up, XP pill pulse, celebration modal | ✅ | |
| Settings | ❌ | None exist. |
| Persistence of anything | ❌ | Reload loses all state. |
| Keyboard: Esc to close menus/modals, focus trap in modal | ❌ | Not implemented. |

## Universe (cosmic map)
| Feature | Status | Notes |
|---|---|---|
| Pan (drag), wheel zoom, +/−/reset buttons, glide | ✅ | Zoom 0.3–1.5. |
| 8 planets with status: open / mastered / charted / sealed | 🟡 | Logic real, but driven by `journey` preset mastery arrays. |
| Moons = 6 concepts per region, “you are here” tag, lit routes | 🟡 | Same — preset data. |
| Hover preview, side panel with concept list, “Learn” button | ✅ | Learn opens Academy on the one built lesson. |
| Keyboard navigation of planets | 🟡 | Planets are buttons (focusable); no arrow-key nav. |
| Touch pinch zoom | ❌ | |

## Academy
| Feature | Status | Notes |
|---|---|---|
| Lesson shell with 5 stages: Discover · Experiment · Practice · Challenge · Master | ✅ | Brief asks for Discover→Understand→Experiment→Practice→Validate→Complete; map onto these. |
| Lessons | 🟡 | **Exactly one lesson** (“Lesson 03 — Variables & data types”), hardcoded in markup. No lesson engine. |
| Editor (textarea over highlighted layer, gutter, Tab indent, ⌘/Ctrl+Enter) | ✅ | Custom; no undo grouping, no autocomplete. |
| Run → console with traceback + Sprout explanation | 🟡 | Runs the JS pocket interpreter, not Python. |
| Practice/Challenge checks (type + output checks) | 🟡 | Real structured checks, but against the fake interpreter env. |
| Progressive hints (3 each) | ✅ | |
| Quiz (3 questions, explanations) | ✅ | Completion = quiz correct; awards 150 XP once per session. |
| Drafts persistence | ❌ | |

## Terminal
| Feature | Status | Notes |
|---|---|---|
| 3 files, tabs, run, validate (seed_bank) | 🟡 | Pocket interpreter. |
| REPL (`>>>`) sharing env with last run | 🟡 | Single-line only; blocks refused with “SproutLimit”. |
| `input()` | 🟡 | Always answers `"Ilse"`. |
| Saved snippets | 🟡 | Two fake entries; “save” only prepends a name in memory, no content stored. |

## Missions
| Feature | Status | Notes |
|---|---|---|
| Ticket list grouped Micro/Exploration/Boss/Expedition, locked states | 🟡 | 6 missions; only **Label the Specimen** is playable. Lock reasons are text. |
| Mission editor + 5 checks, celebration, +120 XP | 🟡 | Pocket interpreter. |

## Workshop
| Feature | Status |
|---|---|
| 3 project cards (all locked) | ❌ visual only |

## Pilot logbook (profile)
| Feature | Status | Notes |
|---|---|---|
| Name, level, level bar, streak | 🟡 | Hardcoded “Ilse Marrow”; streak from preset. |
| Badges/patches, specimen shelf, gallery | 🟡 | Partly reacts to `lessonDone/missionDone`; otherwise static. |
| Editable profile | ❌ | |

## Mascot
| Feature | Status |
|---|---|
| Moods, stages by level, petting, idle→sleep, contextual bubbles | ✅ |
| “Ask Sprout for a nudge” | 🟡 canned line |

## Progression
| Feature | Status | Notes |
|---|---|---|
| XP + 10 named levels | 🟡 | Real formula (`LV_T`), base XP from preset. |
| Anti-farming | 🟡 | Per-session booleans only. |
| Mastery | 🟡 | Integer per region from preset; lesson completion bumps Origins. |
| Achievements as data | ❌ | Badge names hardcoded in markup. |

## Accessibility audit (summary)
- Good: 52 `aria-label`s, semantic buttons, visible focus ring, reduced-motion support, stone-text contrast chosen for 4.5:1.
- Gaps: no Esc handling, no focus trap/restore on modal & menus, menus not `role="menu"`, Universe pan has no keyboard equivalent besides buttons, textarea editor invisible-text technique is weak for screen readers, toasts not in an `aria-live` region, windows not announced as dialogs.

## Reusable as-is
All CSS, all SVG art (wallpaper, icons, planets, Sprout), highlighter, `explain()` messages, level table, region/mission content, window geometry math, pan/zoom math.
