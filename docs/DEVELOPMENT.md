# Development guide

How the pieces fit, and how to work on each. For the big picture see [ARCHITECTURE.md](ARCHITECTURE.md).

## Layout

```
src/
  main.tsx, App.tsx, boot.ts     start-up, the shell, launch state (?start=, ?demo=)
  shell/                         desktop, menu bar, dock, windows (windowReducer.ts), toasts, celebration
  apps/                          one folder per window: universe, academy, terminal, missions, profile, workshop
  editor/                        CodeEditor (simple editor + lazy Monaco), Console, highlighter
  runtime/                       Python: worker.ts, pyCore.ts (harness + checker), PythonRuntime.ts, usePython.ts, explain.ts
  content/                       curriculum.ts (the graph + lesson index), lessons/, missions.ts, achievements.ts
  progression/                   progress.ts (completion, gating), engine.ts (XP, levels, streaks, mastery), useLearning.ts
  mascot/                        Sprout's art, moods and timing
  storage/                       IndexedDB key-value store with fallbacks, settings, backups
  styles/                        prototype.css (verbatim original), additions.css (everything new)
tests/                           Vitest: unit, integration, content (real Python), solutions/ for content tests
e2e/                             Playwright: real browser, production build
public/                          icons, sample data (data/), pyodide/ (copied at build time, not committed)
reference/                       the original design prototype export
```

## Python runtime

- `worker.ts` loads Pyodide from `/pyodide/` and owns one interpreter. `pyCore.ts` installs a small harness: `_run`
  (fresh globals per file run), `_repl` (continues the last run's globals), `input()` that asks the page, and the
  exercise checker.
- `PythonRuntime.ts` is the page side: lazy start, one run at a time, a 10 s time limit (input waits don't count),
  `stop()` (KeyboardInterrupt, then terminate and replace the worker after 1.5 s), and `check()`.
- **Cross-origin isolation** enables `SharedArrayBuffer`: `input()` blocks on it, and Stop uses Pyodide's interrupt
  buffer. Without isolation, `input()` only reads lines supplied up front and Stop restarts the worker.
- **Stack switching (JSPI)**: Python is called through `callPromising` when supported, so `asyncio.run` works.
- `usePythonSession` connects an editor and console to the runtime; every code window uses it.

## Exercise checks

Checks run in Python against the learner's program (`_check` in `pyCore.ts`). The program first runs silently with
`inputs` (lines for `input()`). Each check returns pass/fail; the UI shows the label and, for the first failure, `fail`.

| Kind | What it checks | Notes |
|---|---|---|
| `runs` | No exception | |
| `output` | First run's output | `lines` (exact lines, trailing spaces ignored), `contains`, or `regex` (multiline) |
| `var` | A variable after the run | `type` (exact class name: `int`, `float`, `str`, `bool`, `list`, `tuple`, `dict`, `set`, `NoneType`), `equals`, `nonEmpty` |
| `source` | The source text | `matches` / `notMatches` regexes. Use sparingly; prefer behaviour |
| `cases` | Re-runs with other `input()` lines | per case: `regex` on output and/or `expect` on variables |
| `variants` | Re-runs with other starting values | replaces the first `name = …` assignment (including multi-line strings); `expect` on variables |
| `call` | Calls a function the learner defined | `args`, `kwargs`, `returns`, `prints` (exact lines) |
| `expr` | Evaluates an expression against the program's names | for objects and classes, e.g. `Plant("fern", 30).height` |

Expected values are JSON. A JSON list also matches a tuple, or a set ignoring order; numbers compare with a small
tolerance; `bool` never matches `int`. Starting values can use `{ "__set__": [...] }`, `{ "__tuple__": [...] }` and
`{ "__date__": "YYYY-MM-DD" }`.

**Honesty:** checks ship to the browser and can be read. They guide; they don't grade.

## Progress and XP

- `progress.ts`: which concepts are complete, and the chart's gating (open / charted / sealed, "you are here").
- `engine.ts`: an event log from which XP, levels, streaks, mastery and achievements are derived. Each award key
  pays once, so repeating work never farms XP.
- `useLearning.ts`: the app's store; apps report events (`exercise`, `quiz`, `lessonDone`, `milestone`,
  `missionDone`, `lessonMission`, `ran`) and it decides XP, achievements and celebrations.

Saved keys (IndexedDB `botanica` → `kv`): `settings`, `layout`, `progress`, `progression`, `terminal`,
`lesson:<id>`, `mission:<id>`, `lmission:<id>` (an optional lesson mission's code, ticks, hints and attempts;
kept apart from lesson progress). Schema changes go through `MIGRATIONS` in `storage/db.ts`; every loader normalises
old or hand-edited data.

## Offline

`vite-plugin-pwa` precaches the shell, code (Monaco included), fonts, icons and sample data. Python is cached
cache-first the first time it loads (`ignoreVary` matters, see the comment in `vite.config.ts`). The service worker
only registers in production builds; updates wait for the learner to press **Reload now**.

## Testing

| Suite | Command | Covers |
|---|---|---|
| Unit and integration | `npm test` | window manager, storage, progress, engine, runtime client (fake worker), UI flows (Testing Library) |
| Content | part of `npm test` | every lesson and mission in real Python: solutions pass, starters and wrong answers fail, examples run |
| End-to-end | `npm run test:e2e` | production build in a browser: real Python, input, Stop, validation, offline, lazy loading, keyboard, axe scans |

## Design rules

`prototype.css` is the original, untouched. New rules go in `additions.css` with a reason. Deliberate deviations are
listed in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
