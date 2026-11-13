# Botanica OS — Design System (as found in the prototype)

Documented from `Main.dc.html`. Values are authoritative; do not “tidy” them.

## Color tokens

### Paper (desktop, light surfaces)
| Token | Hex | Use |
|---|---|---|
| paper | `#f6f2e8` | Window body, menubar, menus, buttons |
| cream | `#eae4d5` | Title bars, dock, chips, inline code |
| page-bg | `#efe8d6` | `body` background |
| blur-bar | `#f1ece0` | Unfocused title bar, lesson footer |
| logbook | `#ddd3ba` | Profile backdrop |
| ink | `#242820` | Text, every border, hard shadows |
| stone | `#777c70` | Decoration only |
| stone-text | `#63685c` | Small text (passes 4.5:1) |
| moss | `#3e6510` | Links |
| forest | `#345a04` | Selected states, success, `.btn.moss`, status bar |
| sage | `#b4cfb6` | Tape, step connectors, tips |
| terracotta | `#c95851` | Primary button, close button, focus ring |
| terracotta-text | `#a8423c` | Terracotta text on paper, error check |
| ochre | `#b47e00` | XP star, shelf |
| ochre-text | `#8a6000` | Kickers |
| hint-bg / border | `#f3e6c4` / `#d9bf7c` | Hint box |

### Cosmos (Universe)
`#12180e` ground · `#1b2315` panels · `#26301d` hover · `#33402a` / `#46553a` borders · `#ece6d6` text · `#a3a893` / `#8e9584` muted · `#e58a80` “you are here” / dark primary · `#e2a93b` bright ochre focus.

### Code (editor/console/terminal)
`#171d12` editor ground · `#11160d` console/terminal side · `#1b2315` bars · `#2c3624` / `#232c1c` dividers · `#5f6a55` gutter · caret `#f3c766`.
Syntax: kw/op `#ec9a8f`, const/num `#f0c06a`, str `#bcd8be`, comment `#8e9584`, builtin `#dccb8f`, fn `#e6dfcd`, id `#e9e3d3`, punct `#b7bba9`.
Console: out `#e9e3d3`, sys `#7f8a74`, err `#f0a79d`, ok `#bcd8be`; Sprout tip `#211c10` bg / `#5d4a1d` border / `#f0cf86` text.

### Planet palettes
Origins `#4f7a1c/#8fb356` · Flow `#6f9a78/#b4cfb6` · Archives `#b47e00/#dcae45` · Engine `#c95851/#e38a7f` · Machines `#8fae93/#cfe0d0` · Network `#345a04/#5f8a2a` · Frontier `#a8423c/#d4746b` · Expeditions `#d8cdb2/#f6f2e8`.

## Typography
| Role | Family | Notes |
|---|---|---|
| Display | Young Serif 400 | `.disp`, `.h2` 30px/1.12, planet names 36px, mission groups 15px |
| Interface | Figtree 400–700 | Base 14px / 1.45; lede 15.5px / 1.6; menus 13.5px; titles 13px 700 |
| Code | JetBrains Mono 400–700 | Ligatures off; editor 13.5px / 22px line; kickers 12px |

## Materials & shape
- **Window:** 1.5px ink border, 12px radius, hard shadow `5px 6px 0 rgba(36,40,32,.16)` + soft drop. Title bar 36px, cream, pinstripes `repeating-linear-gradient` either side of the title, colored dot per app. Close = terracotta circle; min/max = 22px rounded squares with inset bottom shadow.
- **Buttons:** “pressable” — 1.5px border, 10px radius, `0 3px 0 ink` shadow that collapses on `:active`.
- **Tickets & tags:** clipped-corner shapes (`clip-path` polygon) with a punched hole.
- **Paper note:** rotated 1.2°, washi tape.
- **Logbook:** two pages with ruled lines and inner gutter shadow.
- **Focus:** 2px terracotta outline, 2px offset (paper); 3px bright ochre on planets.

## Motion
Springy cubic-beziers (`.3,1.7,.5,1` for hover pops; `.2,.8,.2,1` for entrances). Named keyframes: sway, blink, bounce, shake, wiggle, breathe, tongue, zfloat, spark, leafUp, bubbleIn, slideIn, toastIn, fadeIn, popIn, orbit (140s moons), pulseRing, grow, dash (lit routes), twinkle, starOn, draw, xpfly, xpA/xpB, floatUp.
`prefers-reduced-motion`: all animations collapsed to ~0ms, particles hidden. Keep exactly.

## Layout
- Stage designed at 1440×900. Menubar 34px top; dock centered bottom; desktop icons column left; sticky note right.
- ≤760px: windows force-maximize, icons go 3-across, note hidden, dock compacts, terminal sidebar hidden.

## Mascot — Sprout
Snake in a pot, lives in the dock. Moods: idle (sway, blink, tongue), happy (hop), confused (tilt, ?), error (shake, sweat), celebrating (bounce, sparks), petted (wiggle, leaf), sleeping (breathe, Zz — after 40s idle). Stages by level: hatchling (egg), sprout, vine, canopy (crown). Speech bubble 250px, auto-dismiss ≥4.5s.

## Voice
Warm, dry, ship-board botany (“the Hortensia”, “the archive is fussy about types”). Errors never blame; Sprout “reads the traceback” and gives one concrete fix.

## Deliberate deviations from the prototype (accessibility)
| Where | Prototype | Now | Why |
|---|---|---|---|
| Dark-panel buttons (`.tm-tab`, `.btn-g`, …) | Intended colours lost to `.os button{color:inherit}` | Intended colours restored | Text was ≈1.1:1 on the dark panels |
| Sealed mission tickets | `opacity:.72` | Dimmer card `#ece6d7`, grey punch-hole | Faded text failed 4.5:1 |
| Code gutter numbers | `#5f6a55` | `#7f8a74` | 3.0:1 → ≈4.9:1 |
| Legend "Concept mastered" | — | "Concept complete" | Mastery is measured separately (M5) |
