# The Seven Rules — Setchan AI governance

Source: *Setchan AI — Caregiver Journey Framework (Board Copy)*, §6 "Governance, Verification, and Implementation Directives". Rules 1–4 below are from the board copy. **The board copy ends at Rule 4; Rules 5–7 are held open for the chair.**

1. **Verification Mode vs. Discovery Mode.** All legal briefs, regulatory filings and clinical care directives are generated under strict Verification Mode: every factual assertion, clinical metric or legal citation must be directly traceable to verified primary source documents. Exploratory analysis is restricted to Discovery Mode and explicitly flagged as preliminary.
2. **Elimination of Generator Self-Certification.** Outputs claiming de-identification or legal compliance must be independently audited for implicit data leaks. Template generation must never embed patient-specific clinical metrics (such as exact cognitive scores or recall retention figures) into documents labeled as generic or de-identified.
3. **Citation and Statutory Precision.** Legal and regulatory citations must reflect current, verified statutory pinpoints: 42 CFR § 483.70(m)(1) and (m)(1)(v) under survey tags F847/F848; 42 CFR § 483.15(a)(3) under tag F620; Hawaiʻi Administrative Rules Chapter 11-94.2 (effective September 16, 2022), specifically § 11-94.2-36; Restatement (Second) of Contracts § 15(1); Federal Arbitration Act § 2 (9 U.S.C. § 2).
4. **Human-in-the-Loop Legal Directive.** Setchan AI is an analytical and evidentiary synthesis tool. All legal addenda, contract reservation-of-rights notices and formal regulatory complaints it generates are work-product drafts requiring final review, modification and execution approval by a licensed elder law attorney.
5. *Open — to be supplied by the chair.*
6. *Open — to be supplied by the chair.*
7. *Open — to be supplied by the chair.*

## How the v1 build enforces them

`npm run check:rules` (also part of `npm test` and the deploy workflow) fails the build when any of these slip:

- **No PHI, ever.** All personas are fictional (board copy §5). Content files are scanned for PHI-shaped patterns: SSN-like numbers, "DOB" / "date of birth", "MRN", phone numbers, cognitive scores. (Rule 2.)
- **Administrative navigation only.** The checklist is who / what / when coordination: staff on shift, notes to say out loud, flagged items to raise. No dosing, no clinical parameters, no medical advice.
- **No network, no backend.** App code may not contain `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon` or any external URL; `index.html` carries a Content-Security-Policy with `connect-src 'self'`. There is no server, no account, no analytics. Nothing leaves the device.
- **Content as files.** Every word the app shows comes from `content/` (`journey/arrival.json`, `checklists/shift-change.md`, `ui.json`, `personas.json`). The check verifies the files exist and parse.
- **DEMO_TODAY pinned in one place.** `src/lib/clock.ts`, and only there.
- **Stale-build guard.** Build timestamp and version are burned into the footer; the service worker is versioned per build (`autoUpdate`, outdated caches cleaned, new worker claims clients immediately). Ritual before every showing: hard-reload, read the footer stamp.
