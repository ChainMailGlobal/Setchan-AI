# Developing Setchan AI — v1 (Arrival · Shift Change Checklist)

Offline-first caregiver command companion for nursing home transitions. Static PWA: Vite + React + TypeScript + Dexie (IndexedDB) + Tailwind. No backend, no accounts, no server. Demo build — every person is fictional; no PHI.

Live: https://chainmailglobal.github.io/Setchan-AI/ (URL is case-sensitive).

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # Seven Rules check + typecheck
npm run build      # production build in dist/
npm run preview    # serve dist/ locally (service worker active)
```

## Where things live

```
content/                 every word of the product as data — no copy in code
  journey/arrival.json   Phase 1 journey data (title, resident, flows)
  checklists/shift-change.md   the Shift Change Checklist (sections, items, flags)
  ui.json                labels, buttons, messages
  personas.json          Sarah (caregiver), Maria R. (resident) — fictional
src/
  lib/clock.ts           DEMO_TODAY lives here and only here
  lib/db.ts              Dexie schema, export/import JSON
  lib/checklist.ts       markdown checklist parser
  lib/content.ts         loads the content files
  stages/                Home · PhaseView (Arrival) · ChecklistView · SettingsView
scripts/check-rules.mjs  build gate: no network, CSP, content present, no PHI patterns
RULES.md                 the Seven Rules and how this build enforces them
```

## Editing the checklist

`content/checklists/shift-change.md` is plain markdown with a front-matter block:

- `## Heading` starts a section
- `- [ ] text` is an item; `- [ ] !text` is a flagged item
- a line indented two spaces under an item is that item's detail text
- `**bold**` highlights a name

Edit it on GitHub or locally; the app reads it as-is. Every push to `main` redeploys in about two minutes, after the rules check passes.

## Demo ritual

1. Hard-reload before every showing.
2. Read the build stamp in the footer; it must match the build you expect.
3. Settings → Demo clock on (pinned to Tue Nov 17, 2026, 2:45 PM — 15 minutes before the 3:00 PM shift change).

## Deploy

GitHub Pages via `.github/workflows/deploy.yml` on push to `main` (Pages source: GitHub Actions). The workflow runs `npm test` first and sets `BASE_PATH=/<repo>/`.
