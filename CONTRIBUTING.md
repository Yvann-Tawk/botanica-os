# Contributing to Botanica OS

Thank you for helping. Botanica OS is built for absolute beginners, so clarity and kindness matter as much as code.
By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to help

- **Report a bug** or **suggest a feature** with the issue templates.
- **Improve a lesson**: unclear wording, a better hint, a missing edge case. The "Lesson feedback" template is perfect
  for quick notes; pull requests are welcome too.
- **Write code**: fixes, accessibility, performance, new lessons or missions.

## Getting set up

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit, integration and content tests
npx playwright install chromium   # once, for end-to-end tests
npm run test:e2e
```

`npm test` needs Node.js 26 (or another Node with WebAssembly JSPI enabled) for the async lessons.

Before opening a pull request, please run `npm run typecheck`, `npm test` and, for UI changes, `npm run test:e2e`.
CI runs the same.

## Ground rules

- **Keep the design.** `src/styles/prototype.css` is the original prototype's stylesheet, kept verbatim. Put new or
  overriding rules in `src/styles/additions.css` with a comment saying why. Don't restyle existing screens without a
  usability or accessibility reason; explain it in the PR. See [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
- **No fake functionality.** Progress, XP and completion must come from real learner actions. If something isn't
  built yet, say so in the UI.
- **Accessibility is a requirement**: keyboard access, visible focus, labels, WCAG AA contrast, reduced motion. The
  end-to-end suite runs axe on every window.
- **No new runtime services.** Everything must work offline and keep learner code on the device. New dependencies
  need a clear reason.
- **TypeScript strict**, small modules, and comments that explain *why*.

## Writing or editing a lesson

Lessons are data in `src/content/lessons/galaxyNN.ts` (schema in `types.ts`). Each lesson has five stages: Discover,
Experiment, Practice, Challenge, Master. Text accepts light markup: `` `code` `` and `**bold**`.

1. **Write for a beginner.** One idea per paragraph. Explain *why* before *how*. Errors are clues, never blame.
2. **Checks test behaviour, not wording.** Prefer `var`, `call`, `expr`, `cases` and `variants` checks over
   `source` checks, so that different correct solutions pass. Add a hidden case (`variants` or `cases`) whenever a
   learner could pass by hard-coding the expected answer.
3. **Three hints**, from a nudge to almost the answer.
4. **Add model solutions** to `tests/solutions/gNN.ts`: at least one per exercise, ideally an alternative style
   too, plus common wrong answers under `wrong`. `npm test` then checks, in real Python, that solutions pass every
   check, wrong answers and starters fail, and the examples run.
5. If you add a lesson, also add or update its concept in `src/content/curriculum.ts` (id, title, minutes, XP). The
   content test checks the two agree.

The available check kinds and their options are documented in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md#exercise-checks).

## Pull requests

- Keep PRs focused; describe what changed and why, with screenshots for visual changes.
- Note any design deviation and its justification.
- Lesson content is CC BY 4.0 and code is MIT; by contributing you agree your contribution is licensed the same way.
