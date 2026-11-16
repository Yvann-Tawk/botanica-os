# MISSION_UI_SPEC.md — Lithic

## STATUS: NOT YET DESIGNED for Lithic (Stage 2)
No Lithic mission interface exists in the approved prototype. Reuse **Botanica's approved mission system**
(`.ms` Missions window: `.ms-list` ticket rail + `.ms-brief` + `.ms-work` editor + `.ms-runbar`).

## Scope rule (critical — from the brief)
**Three missions per LESSON** (not per mini-planet). Every individual lesson offers exactly three optional
missions. They are **optional and must never block progression**.

## The three missions (Lithic naming TBD — brief specifies the Botanica-style trio)
| Mission | Difficulty | Reward | Reuse |
|---|---|---|---|
| **The Seed** | Easy | **+15 XP** | `.mticket` (standard) |
| **The Sprout** | Medium | **+30 XP** | `.mticket` (standard) |
| **The Bloom** | Challenging | **+50 XP** | `.mticket.is-boss` styling for emphasis |
> Note: "The Seed / Sprout / Bloom" is Botanica's botanical mission language. Confirm whether Lithic keeps these
> names or takes geological equivalents; the **interface** is identical either way. This is a naming decision,
> **not** a redesign.

## Interface (reuse Botanica, approved)
- **Mission selection:** `.mticket` tickets (clipped-corner stubs) with `.mmeta` (difficulty pips + XP); boss
  variant for The Bloom. Difficulty pips reuse Botanica's `.diff` leaf/drop SVG (Lithic may swap the glyph).
- **Mission details / brief:** `.ms-brief` prose panel (objective, constraints, reward).
- **Reward display:** XP chip (`.chip` gold) in brief + menubar XP pill.
- **Mission editor:** `.ms-work` = the shared `.ed` editor + `.con` console.
- **Hints / validation / retry:** reuse `.hint`/`.hintbtn`, `.checks`, free retry (as exercises).
- **Completion:** success → **celebration card** (`.cele`/`.cele-card`, reuse) + **XP reward animation**
  (`.xpfly` pill fly-up, `floatUp` particles) + toast; returns to lesson/recap.
- **Return navigation:** back to recap/lesson; missions never gate the next lesson.

## Honest note
Mission validation in Botanica is simulated (no real runtime); Lithic missions inherit that until the port adds
real execution. Do not present simulated mission checks as a runtime.
