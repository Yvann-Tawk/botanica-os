# Botanica OS — The Botanical Cosmos

Learn Python by exploring a botanical cosmos. Botanica OS is a playful, retro-futuristic "operating system" in your
browser: a star chart of eight Python systems to explore, an Academy that teaches with real code, missions and a
guided project, a terminal, and Sprout, a snake who lives in the tray.

Everything runs on your device. Python executes in your browser (via [Pyodide](https://pyodide.org)), your code is
never sent anywhere, there are no accounts, and progress is stored locally. It installs as an app and works offline.

## What's inside

- **The Universe**: a pannable, zoomable chart of 8 systems × 6 concepts. Your progress grows sprouts, lights
  constellations and opens routes.
- **The Academy**: 48 lessons from `print()` to `async`/`await`, each in five stages: Discover, Experiment,
  Practice, Challenge, Master. Exercises are checked by running your code, including hidden test cases, so different
  correct solutions pass.
- **Missions & the Seed Vault**: micro missions and a four-milestone guided project for the first galaxy.
- **Terminal**: real Python 3.12 with `input()`, a `>>>` prompt, Stop, saved files and snippets.
- **Pilot logbook**: XP and levels, streaks, mastery per concept, patches and collected artifacts.
- **Sprout**: reacts to your runs, errors, wins and naps when you're away. Explains tracebacks in plain words.

| Galaxy | Topics |
|---|---|
| 01 Origins | print, variables, types, operators, input · guided project: The Seed Vault |
| 02 The Flow | comparisons, if/elif/else, while, for & range, break & continue, nested logic |
| 03 The Archives | lists, tuples, dictionaries, sets, slicing, comprehensions |
| 04 The Engine | functions, parameters & return, scope, *args/**kwargs, modules, lambdas |
| 05 The Machines | classes, `__init__`, methods, inheritance, dunder methods, dataclasses |
| 06 The Network | files, exceptions, JSON, HTTP & APIs, automation, pathlib |
| 07 The Frontier | generators, decorators, context managers, type hints, async & await, testing |
| 08 The Expeditions | data, a tiny web router, bots, a text adventure, nearest neighbours, a capstone |

## Quick start

Requirements: Node.js 20 or newer to run and build. The full test suite runs real Python in Node and needs
WebAssembly stack switching (JSPI) for the `async` lessons: it is tested on Node.js 26.

```bash
npm install
npm run dev
```

Open the address Vite prints (usually <http://localhost:5173>). The first time you run code, the browser downloads
Python (about 10 MB); after that it's cached.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server (copies Pyodide into `public/pyodide` first) |
| `npm run build` | Typecheck and production build into `dist/` |
| `npm run preview` | Serve the production build (service worker included) |
| `npm test` | Unit, integration and content tests (Vitest; includes real Python in Node) |
| `npm run test:e2e` | End-to-end tests in a browser (Playwright). `PW_CHANNEL=chrome` uses your installed Chrome |
| `npm run typecheck` | TypeScript only |
| `npm run icons` | Regenerate PNG icons from `public/icon.svg` |

Handy URL parameters: `?start=universe|academy|terminal|missions|workshop|profile|settings|desktop` opens a window
first; `?demo=new|current|seasoned` shows sample progress (never saved).

## Browser support

Botanica OS is developed and tested in current Chrome (the end-to-end suite runs there). It should work in other
modern browsers, but Firefox and Safari have not been tested yet. Two features depend on the browser and the server:

- **Live `input()` and a gentle Stop** need *cross-origin isolation*: the server must send
  `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`. The dev server,
  `npm run preview` and the included `vercel.json` do. Without them the app runs in "limited mode" (the status bar
  says so).
- **`asyncio.run`** needs WebAssembly stack switching (JSPI), available in current Chrome and Edge. Everything else
  runs without it.

## Deploying

`npm run build` produces a static site in `dist/`. Host it anywhere that can send the two isolation headers above;
`vercel.json` configures Vercel. The app expects to be served from the site root.

## Privacy and safety

- No accounts, no analytics, no external services at runtime. Fonts, Python and the sample API are self-hosted.
- Progress, settings and code are stored in your browser (IndexedDB). Settings → Download backup exports them.
- Python runs in a Web Worker, isolated from the interface thread. It is **not a security sandbox**: it is meant for
  running your own code. See [SECURITY.md](SECURITY.md).
- Exercise checks run in your browser, so they can be read by anyone determined to. They are there to guide learning,
  not to grade it.

## Project docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the app is put together
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md): working on the code, the runtime and the checker
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): colours, type, materials, motion
- [docs/ROADMAP.md](docs/ROADMAP.md): milestones and what each delivered
- [CONTRIBUTING.md](CONTRIBUTING.md): how to contribute, including writing lessons
- [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md): steps for each release

## License

- Code: [MIT](LICENSE)
- Lessons, missions and other learning content: [CC BY 4.0](LICENSE-CONTENT.md)
- Third-party components: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) in all project spaces.
