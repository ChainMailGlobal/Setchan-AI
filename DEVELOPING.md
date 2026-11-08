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

## Provenance — which master prompt is which

Two master prompts exist, and both are kept:

- [MASTER_PROMPT.md](MASTER_PROMPT.md) — v1 as converged by the Boardroom on Nov 6, 2026 and compiled by UNI (Chief of Staff): Next.js + SQLite, four stages (Arrival / The Table / The Clock / The Fork), a 4D memory engine, a pricing route, the Seven Rules enforced in code.
- [MASTER_PROMPT_room_2026-11-07.md](MASTER_PROMPT_room_2026-11-07.md) — the prompt DK actually posted in #boardroom on Nov 7, 2026 and handed to Builder. On demo day v1 was narrowed to one flow on a static PWA: Vite + React + TypeScript + Dexie + Tailwind, Phase 1 Arrival, the Shift Change Checklist, offline-first, no backend. That is what this repo implements.

Two Seven Rules texts now coexist:

- `MASTER_PROMPT.md` §3 — Rules 1–7 as drafted in session by Nemo (COO) for the demo's policy layer. The prompt itself says a verbatim constitution text, if supplied, replaces them.
- `RULES.md` — Rules 1–4 from the founder's board copy of the Setchan framework, with 5–7 open for the chair.

They have not been reconciled here; that is the chair's call.
