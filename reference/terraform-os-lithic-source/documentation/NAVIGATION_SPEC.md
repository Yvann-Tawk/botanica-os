# NAVIGATION_SPEC.md — Lithic

## Hierarchy (as built), mapped to the brief's terms
```
Terraform OS
└─ Orbis (hub)            ← separate world; Lithic only hands back to it (SIM)
   └─ LITHIC (System 02)  ← this prototype = the Lithic home / Survey
      ├─ The Foundation   (Planet 01 · HTML · OPEN)
      │   ├─ concept mini-planet 01  (brief's "Mini-Planet / module")  → 5 lessons
      │   ├─ concept mini-planet 02                                     → 5 lessons
      │   ├─ … (5 concept mini-planets)
      │   └─ each lesson → [content · examples · exercises · recap · 3 missions]  (Stage 2, not designed)
      ├─ The Crystal Matrix (Planet 02 · DAX · SEALED)  → 4 concept mini-planets (locked)
      └─ The Refinery       (Planet 03 · Power Query M · SEALED) → 4 concept mini-planets (locked)
```
Terminology bridge: the brief's **"mini-planet (learning module)"** = the prototype's **concept node**; the
brief's **"lesson"** = the prototype's **lesson node** (5 per concept, the `LESSON_ARC`).

## Entry point
- Launched from Orbis (SIM in this prototype). On entry the **Survey** window is open on the Lithic chart,
  auto-framed (`resetView`) to show all three planets; companion greets. `start` prop = `survey` (default) or
  `desktop` (shell only). See `INTEGRATION_GUIDE.md §A`.

## The three navigation tiers (all IMPL in prototype)
1. **Planet selection.** Click a dig-site planet → `selectPlanet(id)`: zoom/center on it, dim the other two
   (opacity .28), bloom its **concept mini-planets** on dashed spokes, dock the **SpecimenSheet** (discipline →
   list of concepts). Hovering a planet (not selected) shows a `HoverPreview` bubble.
2. **Mini-planet (module) selection.** Click a concept mini-planet → `selectConcept(i)`: zoom further, promote
   that concept to a hub (size 110), fan its **5 lessons** around it on spokes; SpecimenSheet switches to the
   lesson set with an Enter/back control.
3. **Lesson selection.** Click a lesson node → **SIM** transition card ("Enter the first lesson"). Real lesson
   UI is Stage 2 (`LESSON_UI_SPEC.md`).

## State semantics (exactly as rendered)
- **Current** (coral pulse `#e58a80`): The Foundation planet (the "you are here" marker) and, inside its first
  concept, the first lesson (`Warm-up`).
- **Open / available** (amber `#e2a93b`): The Foundation and its first concept; "Next" lessons (Walk-through,
  Practice) are open but not current.
- **Locked** (dashed ring + padlock, muted `#6f6450`): sealed disciplines (Matrix, Refinery) and all their
  concepts/lessons; later lessons of open concepts.
- **Completed:** not represented yet (no progression engine) — reserve the Botanica "mastered" treatment
  (filled amber check) for the port.

## Return / back navigation (IMPL)
- Empty-space click = **step up one tier** (lessons → concepts → three-planet view).
- Hub mini-planet click, or SpecimenSheet **"← The Foundation"** = back to concept tier.
- SpecimenSheet **"Orbis"**, menubar/dock/desktop **Orbis**, or Window menu "Return to Orbis" = SIM hand-off.
- `resetView` (zoom pad recenter) returns to the framed three-planet view.

## Continue Learning (IMPL as entry, SIM as destination)
- Desktop `ResumeNote` ("Lay the First Stone → The Foundation · HTML · Module 01", button "Open the Survey")
  and dock/menubar "Continue" affordances open the Survey and `selectPlanet('foundation')`. Destination lesson
  is Stage 2.

## Progression animations
- Planet expand: siblings fade (`opacity .35s`); mini-planets `nodeIn` scale-in staggered (.05s/node);
  spokes draw with `route-lit` dash. Pan/zoom use `.glide` (`.6s` ease-out). All gated by reduced-motion.
- **Not yet designed:** lesson-complete, concept-complete, planet-complete, XP-gain celebrations — reuse
  Botanica's celebration card + XP-fly (documented in `INTERACTIONS.md` / `MISSION_UI_SPEC.md`).

## Implemented vs simulated (summary)
- **Implemented:** all pan/zoom/hover/select/expand/back, window management, specimen sheet, HUD, companion.
- **Simulated:** Enter (any lesson/discipline), Return to Orbis, XP value, Journal; everything past a lesson node.
