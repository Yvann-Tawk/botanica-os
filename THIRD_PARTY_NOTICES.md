# Third-party notices

Botanica OS ships, or downloads at build time, the following third-party software. Each remains under its own license.

| Component | Version | License | Used for |
|---|---|---|---|
| [Pyodide](https://pyodide.org) | 0.27.8 | MPL-2.0 | Python in the browser (served from `public/pyodide/`, copied from the npm package at build time, unmodified) |
| CPython and its standard library (inside Pyodide) | 3.12.7 | PSF License | The Python interpreter and standard library |
| [Monaco Editor](https://github.com/microsoft/monaco-editor) | 0.52.2 | MIT | The code editor |
| [React](https://react.dev) and React DOM | 18.3.1 | MIT | User interface |
| [Fontsource](https://fontsource.org) packages for Young Serif, Figtree, JetBrains Mono | 5.x | SIL Open Font License 1.1 (fonts) | Self-hosted typefaces |
| Workbox (via vite-plugin-pwa, build-time; runtime in the service worker) | 7.x | MIT | Offline caching |

Pyodide's distribution bundles further components under their own licenses; see the Pyodide project for the complete
list. Development-only tools (Vite, TypeScript, Vitest, Testing Library, Playwright, axe-core) are not shipped to users.

## Design source

The visual design comes from the Botanica OS design prototype ("The Botanical Cosmos"), exported from a design canvas
and kept for reference in `reference/`. All illustrations are original inline SVG in that export.
