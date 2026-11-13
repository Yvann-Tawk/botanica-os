# Release checklist

## First public release (one-time)

- [ ] Create the Git repository and push. `public/pyodide`, `dist/`, `node_modules/` and test output are already in
      `.gitignore`.
- [ ] Decide whether to publish `reference/` (the design prototype export) and `botanica-os-source.zip`. They are the
      design source; if they stay, they are covered by the repository's licenses. Remove them from the repository if
      they should stay private.
- [ ] Confirm the copyright line in `LICENSE` ("Botanica OS contributors") is how you want to be credited.
- [ ] Confirm the contact email in `CODE_OF_CONDUCT.md` and `SECURITY.md`.
- [ ] Enable GitHub private vulnerability reporting (Settings → Security), or keep email-only as `SECURITY.md` says.
- [ ] Add repository topics and a description; add a screenshot to the README.
- [ ] Deploy (e.g. Vercel with `vercel.json`) and confirm the isolation headers are present on the live site:
      `curl -sI <url> | grep -i cross-origin`.

## Every release

- [ ] `npm ci && npm run typecheck && npm test` pass (Node 26).
- [ ] `PW_CHANNEL=chrome npm run test:e2e` (or bundled Chromium) passes.
- [ ] Manual smoke test on the production build (`npm run build && npm run preview`):
  - [ ] First visit opens the Universe; dock and windows work; Sprout responds.
  - [ ] Terminal: run, `input()`, Stop on `while True: pass`.
  - [ ] Academy: complete a lesson; the chart updates; XP and the logbook update.
  - [ ] Settings: backup download and restore round-trip.
  - [ ] Install as an app; go offline; reload; Python runs.
  - [ ] Phone width (375 px): windows maximise, nothing overflows sideways.
- [ ] If Pyodide was upgraded: re-run the content tests, check `public/pyodide` contents and THIRD_PARTY_NOTICES.
- [ ] If the save format changed: a migration exists in `storage/db.ts`, and loaders accept old data.
- [ ] Update `version` in `package.json`, note changes in the release description.
- [ ] Tag the release (`git tag v0.x.y && git push --tags`) and create the GitHub release.
- [ ] After deploying: open the live site in a browser that had the previous version and confirm the
      "A new version is ready" prompt appears and reloading works.
