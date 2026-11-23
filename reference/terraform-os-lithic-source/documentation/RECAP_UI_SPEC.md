# RECAP_UI_SPEC.md — Lithic

## STATUS: NOT YET DESIGNED for Lithic (Stage 2)
No Lithic recap screen exists in the approved prototype. Recaps must **preserve Botanica's recap design
language** and change content only. Botanica's recap is the final `.step` ("Recap") in its Academy flow.

## Structure (reuse Botanica recap pattern; one recap per lesson)
- **Key takeaways:** `.ftip`/`.task` cards, 3–5 bullets in Figtree; Young Serif section head (`.h3`).
- **Syntax cheat sheet:** `.codeblock mono` (tokenized) + `.ttag` labelled tags grid (`.tags`/`.ttag`) — reuse
  the Botanica "types/tags" component for compact syntax reference.
- **Common mistakes:** `.hint`-style amber cards (warning tone) or `.task` with coral accents.
- **Optional conceptual questions:** `.qcard`/`.qopt` quiz (optional — never blocks).
- **Continue Learning:** primary `.btn pri` → next lesson/mini-planet (returns to Survey + advances state).
- **Optional Missions:** entry into the 3 lesson missions (see `MISSION_UI_SPEC.md`), rendered as a mission
  row/board; optional, non-blocking.

## Content-vs-structure rule
The recap **component structure is fixed**; only its content (takeaways, cheat-sheet rows, mistakes, questions)
changes per lesson. Drive it from lesson data so every recap is visually identical across lessons and across
Botanica/Lithic — this is the consistency the brief requires.

## Language note
HTML/DAX/M cheat-sheets differ in content only; the cheat-sheet component (codeblock + tag grid) is shared.
