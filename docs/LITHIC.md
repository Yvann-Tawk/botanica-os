# Lithic — System 02 (HTML · DAX · Power Query M)

Lithic is the second Terraform OS learning world, integrated on branch `feature/lithic`. It sits beside Botanica
(Python) and is reached from Orbis exactly as Botanica is. Botanica's code, design and data are untouched.

This document covers Lithic's structure, the three disciplines and their **limited, honestly-labelled** language
engines, how the shared Academy is generalised, how progression is kept separate-but-summed, and where to add more
content or more worlds. The Orbis integration itself is in [TERRAFORM.md](TERRAFORM.md); Botanica's architecture is in
[ARCHITECTURE.md](ARCHITECTURE.md).

The approved design source (the Survey home) is vendored in `reference/terraform-os-lithic-source/`.

## World shape

```
Lithic (System 02)
├─ The Foundation   · HTML          · OPEN   · 8 mini-planets × 5 lessons = 40 lessons
├─ The Crystal Matrix · DAX         · OPEN   · 4 mini-planets × 5 lessons = 20 lessons
└─ The Refinery     · Power Query M · OPEN   · 4 mini-planets × 5 lessons = 20 lessons
```

Every lesson has the same five-stage arc as Botanica (Discover → Experiment → Practice → Challenge → Master), a
recap, and exactly three optional missions (Seed / Sprout / Bloom = 15 / 30 / 50 XP). The curriculum graph is
`src/lithic/curriculum.ts` (planets → mini-planets → lessons, stable ids `lithic.<lang>.<mini>[.l<n>]`); lesson text
lives in `src/lithic/content/` and loads lazily with the Academy, exactly as Botanica splits its curriculum index
from its lesson content.

## The Survey (the approved home)

`src/lithic/survey/` is the port of the approved design — a pannable/zoomable chart with three dig-site planets that
expand: **planet → mini-planet nodes → lesson nodes**. It reuses Botanica's pan/zoom camera engine
(`apps/universe/model.ts`) with Lithic data and geological skins; the three expansion tiers are Lithic's own.
Lock / current / done states are driven by **real progress**, never placeholder data. Sealed disciplines would
render locked with an honest "unseals when ready" note; all three are open now. CSS additions are scoped in
`src/styles/lithic.css` (`.uv.lith`, `.nodep`, `.node-label`, env tokens); the shared shell CSS is untouched.

`src/lithic/LithicApp.tsx` is the world shell (geological desktop, Lithic menu bar, a single workspace window that
shows the Survey or the open lesson's Academy, dock, Return to Orbis). It is mounted lazily and kept alive beside
Botanica by `TerraformOS.tsx`, with its own `#/lithic` history entry.

## The generic Academy

`src/lithic/academy/LithicAcademy.tsx` is the five-stage / recap / mission shell, **generic over the discipline**: it
takes a `runChecks(code, checks)` function and a `Workspace` component, so each language plugs in its own validator
and output pane while the shell stays shared. The lesson schema is generic too — `Lesson<C>` in
`content/types.ts`, with `HtmlLesson = Lesson<HtmlCheck>`, `DaxLesson = Lesson<DaxCheck>`, `MLesson = Lesson<MCheck>`.
Awards are decoupled from the check type (they read only ids and XP).

| Discipline | Workspace | Validator | Lesson content |
|---|---|---|---|
| HTML | `HtmlWorkspace` — editor + sandboxed live preview | `runHtmlChecks` (DOM) | `content/html/*.ts` |
| DAX | `DaxWorkspace` — formula editor + live result | `runDaxChecks` | `content/dax/*.ts` |
| M | `MWorkspace` — M editor + live result | `runMChecks` | `content/m/*.ts` |

## Language execution — honest, limited engines

Each discipline executes real learner code, but within a **documented subset** that is labelled as educational, never
presented as the full product. Validation is behaviour-based: any code producing the required result passes.

### HTML — `src/lithic/runtime/`
- **Validation:** `htmlChecks.ts` parses learner markup with `DOMParser` (no script execution, no network, no reach
  into the parent page) and asserts on the inert DOM. Check kinds: `has`, `count`, `text`, `attr`, `absent`, `every`
  (accessibility, e.g. every `img` has non-empty `alt`), `order`, `source`, `doctype`.
- **Preview:** `HtmlPreview.tsx` renders markup in an `iframe` via `srcdoc` with an **empty `sandbox`** (scripts
  blocked, opaque origin) plus an injected CSP. External resources are blocked by the CSP, so image lessons validate
  the markup (`src`/`alt`), not a fetched render — and say so.

### DAX — `src/lithic/runtime/dax/`
A tokenizer + recursive-descent parser + evaluator over a fixed two-table model (`Sales → Products`, one
many-to-one relationship). Supported: arithmetic & `&`, comparisons, `Table[Col]`/`[Col]` references, `VAR … RETURN`,
the aggregations, `DIVIDE`, the `SUMX`-family iterators (row context), `CALCULATE`/`FILTER`/`ALL` (filter context),
and `RELATED` across the relationship. Anything else returns a clear "not supported in this limited engine" error.
**Not modelled:** cross-relationship filter propagation, and time intelligence (no date table) — those lessons use
syntax checks and say plainly they are not executed. Checks (`checks.ts`): `value`/`runs` actually evaluate;
`uses`/`source` are syntax-level.

### Power Query M — `src/lithic/runtime/m/`
A tokenizer + parser + evaluator over a deliberately-messy sample `Source` table. Supported: `let … in`,
`if … then … else`, `each` (implicit `_`), numbers/text/true/false/null, list `{…}` and record `[…]` literals,
column projection `Table[Col]`, record-field / list-item / table-row access, operators (`+ - * / &`, `and`/`or`/`not`,
comparisons, `??`), and a curated library (`List.*`, `Text.*`, `Number.*`, `Table.*`, `Record.*`). Anything else
returns a clear "not supported" error. **Not modelled:** date values and the `Date.*` family — that lesson uses
syntax checks and says so. Checks (`checks.ts`): `value`/`rows`/`list`/`runs` evaluate; `uses`/`source` are
syntax-level.

## Progression — separate keys, one global total

Lithic owns its learning state in **its own kv keys** (`lithic-progress`, `lithic-progression`), so Botanica's data
is never read or written by Lithic — no clobbering, no duplicated awards (`src/lithic/store.ts`). The progression
store was Python-locked (`progress.ts` validated every completion against Botanica's regions); it now validates
against a **world-agnostic concept registry** (`progression/conceptRegistry.ts`) that each curriculum registers its
ids into at import time. Botanica's behaviour is unchanged. The XP shown in the Lithic shell is the **sum** of
Botanica's and Lithic's totals; concept completion persists so the Survey's states become real as lessons finish.

| Key | Contents |
|---|---|
| `lithic-progress` | Lithic concept completion (one learner profile, separate from Botanica's `progress`) |
| `lithic-progression` | Lithic event log (XP, missions, activity) |
| `li-lesson:<id>` | Per-lesson saved work (editor code, stage state) |

## Adding content or worlds

- **Add lessons to a mini-planet:** extend its content array (e.g. `content/html/stone.ts`) and the matching
  `curriculum.ts` entry; the Academy and Survey are data-driven.
- **Add a mini-planet:** add a `module(...)` entry under its planet in `curriculum.ts` and a content file.
- **Open a sealed discipline:** author its content, then flip the planet's `status` to `'open'` in `curriculum.ts`
  and bump `worlds.ts`'s `open` count.
- **Add a new world (Aether, Ironworks):** follow the same pattern — a curriculum module, a discipline engine +
  workspace + checks, content, a `Lesson<C>` alias, and routing in `LithicApp`/`TerraformOS`/`worlds.ts`. The generic
  Academy already supports any discipline.

## Tests

- Engines: `tests/lithicHtml.test.ts`, `tests/lithicDax.test.ts`, `tests/lithicM.test.ts`.
- Content integrity + **solution-formula value verification** (every authored exercise's expected value is evaluated
  against the engine): `tests/lithicContent.test.ts`, `tests/lithicDaxContent.test.ts`, `tests/lithicMContent.test.ts`.
- Shell/flow: `tests/terraform.test.tsx` (Orbis → Lithic → Survey → return).

## Known limitations

- The three language engines are **documented subsets**, not the real products; every workspace says so, and
  non-executable topics (DAX time intelligence, M dates, cross-relationship DAX filters) are taught with syntax checks
  that state they are not executed.
- Lithic's XP is summed with Botanica's for display; the two event logs are separate (by design, to protect
  Botanica's data). A future unification could lift a single store into `TerraformOS`.
- The handoff shipped no rendered screenshots; Survey fidelity was checked against the design source and in-browser.
