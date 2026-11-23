# EXERCISE_UI_SPEC.md — Lithic

## STATUS: NOT YET DESIGNED for Lithic (Stage 2)
No Lithic exercise interface exists in the approved prototype. Reuse **Botanica's approved exercise patterns**
(same Terraform OS language); design only the language-specific validation surfaces, which are **MISSING**.

## Reusable Botanica exercise surfaces (approved — port these)
- **Task card** `.task` (white, ink border, `3px 4px 0` shadow) holds the prompt.
- **Checklist** `.checks`/`.ck` with `ok` (moss) / `no` (coral) states → correct/incorrect per-assertion.
- **Hints** `.hint` (amber paper) revealed by `.hintbtn` ("Ask for a nudge"), progressive (hint 1..n).
- **Quiz** `.qcard`/`.qopt` radio options with `is-sel` / `is-right` / `is-wrong` states + `.qdot`.
- **Editor exercises** reuse the `.ed` editor + `.con` console (see LESSON_UI_SPEC).
- **Run/Reset/Submit** reuse `.btn-run` / `.btn-g` dark action buttons.

## Exercise types (brief) → mapping
| Type | Reuse | Submit | Feedback | Missing bit |
|---|---|---|---|---|
| Fill-in-the-code | `.ed` editor, blanks in template | Run → `.checks` | ok/no per blank | lang validator |
| Predict-the-output | `.qcard` options | select + Submit | `is-right`/`is-wrong` | — (reusable) |
| Debugging | `.ed` editor (broken code) + `.con` | Run → traceback in `.con` | `.con-tip` explain note | real runtime |
| Code-writing | `.ed` editor (blank) | Run → `.checks` | checklist + console | real runtime |
| Practical challenge | `.task` + `.ed` + `.checks` | Run | checklist | real runtime |
| Scenario-based | `.task` prose + `.ed`/`.qcard` | varies | checklist/quiz | content |

## Feedback states (reuse Botanica treatments; design per-language validators)
- **Correct:** moss `.ck.ok`, success toast + `+XP` fly, companion "happy", advance enabled.
- **Incorrect:** coral `.ck.no`, inline reason, companion "confused/error", retry stays open.
- **Partial:** mixed checklist (some ok, some pending) — progression not blocked by optional items.
- **Loading:** **MISSING** — none designed; add OS-consistent inline spinner/skeleton per RESPONSIVE/INTERACTIONS.
- **Validation error (bad input):** reuse `.con` error line + `.con-tip`.
- **Unavailable execution:** **must** show an explicit "execution not available" state — the prototype has no
  runtime; never present simulated validation as a real one.

## Retry / Reset / Completion
- Retry: re-run freely (no lock). Reset: `.btn-g` restores starter code (Botanica `resetEd`). Completion: check
  all required assertions → XP + toast + advance; optional items never gate.
