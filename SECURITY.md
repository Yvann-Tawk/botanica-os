# Security policy

## Reporting a vulnerability

Please report security problems privately to **yvannt02@gmail.com** rather than in a public issue. Include steps to
reproduce and the browser and version you used. Reports are acknowledged as soon as the maintainers can.

## How Botanica OS runs code

Botanica OS runs learner-written Python in the browser with Pyodide, inside a Web Worker. Know its limits:

- The worker keeps Python off the interface thread and lets the app stop runaway code, but it runs **with the page's
  own origin**. It is **not a security sandbox**. Botanica OS is meant for running *your own* code; do not paste and
  run code from people you do not trust.
- Learner code, progress and settings stay on the device (IndexedDB). The app makes no network requests at runtime
  except to its own origin (Python files, fonts, sample data). Code that a learner writes can make requests, like any
  web page.
- Exercise checks and hidden test cases ship to the browser and can be read by anyone. They guide learning; they are
  not an exam system.
- The site uses cross-origin isolation (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers).

## In scope

Issues in this repository's code: for example, a way for content or a crafted backup file to execute script in the
page, data from one site reaching another, or the service worker serving something it should not.

## Supported versions

Only the latest release receives fixes.
