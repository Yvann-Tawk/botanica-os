# LESSON_UI_SPEC.md — Lithic

## STATUS: NOT YET DESIGNED for Lithic (Stage 2)
No lesson screen, code editor, or language-specific preview exists in the approved Lithic prototype. The
prototype stops at the **lesson node** on the Survey; clicking it plays a simulated transition card. **Do not
treat any Lithic lesson UI as approved — none was created.**

**Source of truth to reuse:** Botanica (System 01) already ships a fully-designed, approved lesson system in the
same Terraform OS language. Lithic lessons must **reuse Botanica's lesson components** and change only content +
the language-specific editor/preview pane. The structures below describe Botanica's approved pattern (the thing
to port), with Lithic's language panes marked **MISSING — must be designed before build**.

## Lesson shell (reuse Botanica `Academy` window, approved)
Botanica component map (in its `Main.dc.html`): `.ac` / `.ac-head` / `.steps` step-rail / `.ac-split`
(lesson pane `.ac-lesson` + code pane `.ac-code`) / `.ac-nav` prev-next.
- **Lesson header:** `.kicker` (mono, module·lesson) + `.h2` (Young Serif title) + `.lede`.
- **Step rail (`.steps`/`.step`):** Learn → Practice → Challenge → Quiz → Recap, with done/current states.
- **Learning objectives:** `.ftip` dashed callout (reuse).
- **Instructional content:** `.lede`, `.h3`, inline `.inl` code, `.codeblock` (tokenized) — reuse verbatim.
- **Worked examples:** `.codeblock mono` with per-token color spans (the Botanica tokenizer output shape
  `{t,c}`), plus prose.
- **Exercise navigation:** `.ac-nav` prev/next + step rail. **Progress indicator:** step rail + menubar XP pill.
- **Completion controls:** reuse Botanica's check/advance (`.checks`, advance button, toast + XP-fly).

## Code editor (reuse Botanica `.ed` editor, approved shell — language pane differs)
Botanica's approved editor: `.ed-bar` tab + Run/Reset actions · `.ed-scroll` = `.ed-gutter` line numbers +
`.ed-area` (`.ed-hl` tokenized highlight layer under a transparent `.ed-ta` textarea; caret `#f3c766`) ·
`.con` console (`.con-bar` + `.con-body` + `.con-tip`). Dark theme `#171d12`. **Reuse this editor chassis for
every Lithic language.** What changes per language is only the right-hand **preview/output pane** and the
tokenizer/validator:

### HTML — The Foundation  **(preview MISSING — must design)**
- Editor: the Botanica editor chassis, HTML tokenizer (tags/attrs/text).
- **Live webpage preview:** a rendered output pane (sandboxed iframe or shadow DOM) showing the authored HTML.
  **No approved visual exists** — design a paper-framed prened pane consistent with the OS before build.
- **DOM validation feedback:** check-list pattern from Botanica `.checks` (ok/no states) applied to DOM
  assertions (e.g. "has a `<nav>`", "h1 before p"). Feedback copy tone: Botanica's warm checks.

### DAX — The Crystal Matrix  **(entire interface MISSING)**
- Formula editor: editor chassis + DAX tokenizer. **Dataset preview**, **calculation results** table, and
  **validation feedback** have **no approved design** — must be designed. Suggested reuse: a table styled with
  OS tokens (ink hairlines, paper rows) for dataset + results; `.checks` for validation.

### Power Query M — The Refinery  **(entire interface MISSING)**
- M editor: editor chassis + M tokenizer. **Source-data preview**, **applied-steps list**, **result preview**
  have **no approved design** — must be designed. Suggested reuse: an "applied steps" rail echoing the Survey's
  spoke/step visual language + OS-styled before/after tables.

## Honest limitations
- There is **no HTML/DAX/M runtime** anywhere in the prototype; Botanica's "run" is a simulated interpreter.
  The port must supply real sandboxed execution/validation; do not represent prototype validation as a runtime.
