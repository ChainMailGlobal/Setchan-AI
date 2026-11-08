# Master Prompt — Setchan AI Demo Prototype (v1)

**Provenance:** Converged live by The Boardroom (five models, five labs) on
Friday, November 6, 2026, and compiled by UNI (Chief of Staff) from the
seats' own MASTER PROMPT CONTRIBUTION blocks. Source session:
`memos/session-transcript-20261106-1121.json`; decision memo:
`memos/decision-memo-20261106-1121.md`. This file is the single prompt an
external coding agent (Claude Code via Switch Console) executes to build
the demo prototype.

**Board decision in one line:** Build the Setchan AI v1 demo — a
family-caregiver navigator for one fictional SNF stay, four stages,
governance enforced in code, zero real patient data — as the centerpiece
of a Techstars Spring 2027 application whose primary program is
**AI Health Baltimore** (board pick: Kimi, Nimo, Mise, Glam; Hermes
dissented for Anywhere/Remote — recorded, not adopted). Public-facing
sign-off on the program pick and on the fictional pricing tiers remains
DK's, per the charters (Glam's escalation, due Nov 6).

## Compiler's merge notes (UNI — read before executing; not part of the prompt)

1. **One fictional case.** The seats named it three ways. Resolved:
   caregiver persona **Sarah** (Hermes — the 58-year-old daughter,
   remote) and patient **Maria R., 82, post-stroke SNF admission**
   (Nimo's case file, the one the content architecture references).
   Mise's "Mari Sato, 78, post-hip" variant is superseded.
2. **Stage names.** Internal IDs are Kimi's state machine
   (ADMISSION → CARE_PLAN → NOMNC_WATCH → FORK). User-facing names are
   Mise's, from her main turn: **Arrival / The Table / The Clock / The
   Fork**; users never see the acronym "NOMNC" — the UI says
   **Coverage Watchdog**. The five alternate names in Mise's
   continuation block describe a pre-diagnosis journey and are out of
   v1 scope.
3. **Seven Rules.** Kimi's §3 demands the constitution's text verbatim
   and forbids paraphrase. The rule statements inserted in §3 are
   Nimo's, drafted by the COO in this session as the demo's operational
   rule set. If DK/UNI supply the constitution source text, it drops
   into the marked slot verbatim and governs over these statements.
4. **Memory engine.** Kimi's append-only event store (§4) is the
   implementation; Nimo's who/what/when/where schema maps onto its
   event fields, and her constraint stands: **no vector database, no
   paid service**.
5. **Documents.** Hermes asked for upload/scan; the PHI boundary
   (§2, Kimi + Nimo) forbids any upload path. Resolved in favor of the
   boundary: documents are pre-seeded fictional samples, associated to
   stages and locations — displayed, never ingested.
6. **Persistence.** Nimo's "no persistence beyond session" applies to
   user-supplied inputs. The event store persists only fictional seed
   and demo events.

---

# THE MASTER PROMPT

You are building **Setchan AI**, a demonstration prototype for
accelerator review. Execute the tasks in `/tasks/` in order; after every
task run the acceptance gates in §7.

## §0 — NON-NEGOTIABLES (preamble)

Three constraints override all others: (1) no real patient data, ever;
(2) the Seven-Rule governance constitution is enforced in code, not
prose; (3) the app runs offline on one laptop with zero paid services.
If any instruction conflicts with these, stop, record the conflict in
`/BUILD_LOG.md`, and do not improvise.

## §1 — LOCKED STACK

Next.js (App Router) + TypeScript + Tailwind; SQLite via Prisma. Only
MIT/Apache-2.0 dependencies. All stage content and copy lives in
`/content/*.yaml`, never hardcoded. `npm run dev` must start the
complete app with no external services.

## §2 — PHI BOUNDARY (STRUCTURAL ENFORCEMENT)

All data is synthetic, defined in `/seed/fictional-case.json` and
`/content/case_maria.yaml`. The data layer must not import upload, OCR,
email-ingest, or network modules. Every input field is labeled "Demo
only — do not enter real information." `/tests/phi-boundary.spec.ts`
must fail the build if: (a) any file-upload route exists, (b) any
runtime outbound request exists, (c) the pinned seed-file hash changes.

Additionally:

- **Demo-case lock:** the app references only the fictional case in
  `/content/case_maria.yaml`. It cannot invent new patient cases or
  accept user-supplied patient details.
- **Block message:** any UI path that would accept real documents or
  identifiers shows: *"Setchan AI works with fictional demo cases only.
  Real patient data is not accepted."*
- **Watermark:** every generated document, checklist, or letter carries
  the footer: *"DEMO PROTOTYPE — FICTIONAL CASE — NOT A LEGAL OR
  MEDICAL DOCUMENT."*
- **Screen disclosure (every screen):** *"Setchan AI is an AI
  companion, not medical advice. Built for a fictional family only —
  No real data, ever. No upload field, no pasted records."*

## §3 — SEVEN-RULE POLICY LAYER

Create `/policy/seven-rules.ts` exporting `RULES`: exactly seven objects
`{ id, statement, check(context) → { pass, note } }`. Rule statements:

1. **Fictional Cases Only** — All patient names, medical details,
   facility names, and dates are fictional. The system uses only the
   demo case "Maria R." defined in `/content/case_maria.yaml`. No real
   patient data is accepted, processed, or stored.
2. **No Real PHI** — The system must not accept, parse, or store real
   Protected Health Information. Attempts to upload real medical
   records or enter real patient identifiers are blocked with the §2
   block message.
3. **Caregiver First** — Every output is written for the overwhelmed
   adult-child caregiver, not for clinicians. Language is plain,
   jargon-free, and action-oriented. No medical advice; only
   care-navigation support.
4. **Stage-Gated Progression** — The user moves through four stages
   (Admission → Care-Plan Meetings → NOMNC Appeal Watch → Home-Prep vs.
   ARCH Fork). Stage N+1 content is not revealed until stage N's gate
   criteria are met.
5. **Content Externalized** — All stage content (checklists, copy,
   templates, fork logic) lives in `/content/*.yaml`. The app reads
   content; it does not hardcode copy.
6. **Spatial Memory Continuity** — The system maintains the 4D
   spatial-memory store (§4) tracking who, what, when, where. Prior
   context is carried across stages without re-explaining it.
7. **No Irreversible Actions** — The demo creates no real-world
   commitments, no legal filings, no provider contacts, and no data
   exports that could be mistaken for medical records. All outputs are
   marked "DEMO — NOT A LEGAL DOCUMENT."

*[If a verbatim constitution source is supplied in
`/policy/constitution-source.md`, its rule text replaces the statements
above verbatim — do not paraphrase or omit.]*

Every user-visible output calls `enforceRules(output, context)` before
render; every call appends to `/logs/governance.trace.jsonl`. Every
screen displays a badge naming which rules fired for that view.

## §4 — 4D SPATIAL-MEMORY ENGINE

Implement `/lib/memory/` as an append-only event store. Event =
`{ id, actorId, stageId, occurredAt, spatialRef { stage, location },
payload }`. Time is the fourth dimension and a first-class index.
Expose projections: `journeyState()`, `timeline(actorId)`,
`memoryAt(actorId, timestamp)`. No updates, no deletes; corrections are
new events carrying `supersedes: eventId`. No vector database.

## §5 — JOURNEY STATE MACHINE & STAGE MAP

Stages: **ADMISSION → CARE_PLAN → NOMNC_WATCH → FORK.** FORK resolves
to HOME_PREP or ARCH via `/content/fork.config.yaml`. NOMNC deadline
rules (appeal windows, notice timing) are data in
`/content/deadlines.yaml`, never constants in code. Gate criteria are
defined in each stage YAML under a `gate` key; the UI enforces them.

User-facing stage names (internal ID → display): ADMISSION →
**Arrival**; CARE_PLAN → **The Table**; NOMNC_WATCH → **The Clock**
(the words shown to users are "Coverage Watchdog," never "NOMNC");
FORK → **The Fork**.

Content files:

- `/content/case_maria.yaml` — fictional patient profile and stay
  timeline (Maria R., 82, post-stroke SNF admission)
- `/content/stage_admission.yaml` — admission checklist (7 items),
  care-team roster, admission packet summary
- `/content/stage_careplan.yaml` — meeting agenda, prep questions,
  post-meeting summary template, action-item format
- `/content/stage_nomnc.yaml` — fictional NOMNC notice, appeal deadline
  calculator, appeal-letter draft template
- `/content/stage_fork.yaml` — Home-Prep checklist (DME, home-health
  referral, medication reconciliation) and ARCH pathway with red-flag
  watchlist
- `/content/partners.yaml` — see §9

Gates: Admission completes at checklist 5/7 + user acknowledgment "I
understand who is in charge." Care-Plan completes when meeting notes
are logged and 3 follow-up items are captured. NOMNC Watch triggers on
the fictional notice date (Day 14 of the stay) and completes when an
appeal draft exists and the deadline is flagged. The Fork completes
when a path is selected and its items are tracked.

## §6 — DEMO CLOCK (NO DATE ROT)

All dates, countdowns, and deadline computations derive from
`DEMO_TODAY` (env variable), default **2026-11-10** — never from system
time. The demo must render identical numbers on any calendar day it is
run.

## §7 — ACCEPTANCE GATES

After every task: `npm run build && npm test` must pass, then commit
with the task ID. Decompose work into `/tasks/01..NN.md`; each task must
be independently resumable. Final gate: cold start under 5 seconds;
full demo runs with networking disabled; `/BUILD_LOG.md` enumerates
every stub and the reason.

## §8 — OUT OF SCOPE (STUB ONLY, LABELED "NOT IN DEMO")

No authentication, no EHR/FHIR connectors, no SMS/email sending, no
real appeal filing, no analytics, no accounts, no real document upload
or parsing, no billing or payment processing. Do not purchase or
provision any service; if a task requires one, stub it and log it.

## §9 — USER EXPERIENCE & PRODUCT FLOW (CPO MANDATE)

1. **Core persona:** Design for "Sarah," a 58-year-old daughter
   managing her 82-year-old mother's SNF stay remotely. Sarah is
   tech-comfortable but time-poor and emotionally drained. Every
   interaction prioritizes clarity, speed, and reducing her cognitive
   load.
2. **Stage wins:** Arrival — "I feel oriented. I know where things are
   and who to ask." The Table — "I feel heard. I have a clear record
   of what we decided." The Clock — "I feel empowered. I know my
   rights and the steps to take." The Fork — "I feel prepared for the
   next step, whatever it is."
3. **Spatial-temporal demonstration:** The prototype must let Sarah:
   view a simple floor plan of the fictional SNF wing; see pinned
   locations (Mom's room, nursing station, therapy room, meeting
   room); see a "Care-Plan Meeting" event note associated with the
   meeting room and a date/time; and answer the query *"Show me notes
   from the meeting in the West Wing conference room last Tuesday"*
   from the event store.
4. **Documents:** Pre-seeded fictional sample documents (admission
   form, NOMNC notice) are stored (simulated), displayed, and
   associated with the correct stage and location. There is no upload
   path (§2).
5. **Action tracking:** The Table stage lets Sarah define action items,
   assign them (to herself or "Staff Nurse"), and set a reminder date;
   the prototype shows a simple list of open/closed actions.
6. **Tone:** All interface text is empathetic, jargon-free, and
   action-oriented: "Let's get you oriented." "What are your key
   questions for this meeting?" "Here's what we decided."

## §10 — NARRATIVE LAYER (CMO MANDATE)

- We never open with tech. The product story is: *"For every family
  sitting in a care-plan meeting right now, not knowing what's
  coming."* Recognition before guidance, guidance before action.
- The 4D engine is presented to families as the **Memory Palace**:
  Time + Papers + People + Decisions, pinned to places they can walk
  back to. Engineering terms stay in engineering docs.
- Governance is presented as care, not compliance: **privacy by
  absence of data.**
- Positioning, one voice, for the application and all public copy:
  **consumer AI for families, not an enterprise EHR plugin** —
  *"We're building for the daughter with the folder full of bills, not
  the CIO with a procurement checklist."* Health-system integration
  comes after trust is earned in the home.

## §11 — REVENUE LAYER (CRO MANDATE)

**§ REVENUE_MODEL** — The demo must include a visible `/pricing` route
with three tier cards:

1. **Family Navigator — Free** — admission checklist, care-plan prep,
   NOMNC reminder
2. **Facility Partner — $8/bed/month** — family engagement dashboard,
   discharge readiness metrics, satisfaction scoring
3. **Health System Partner — Custom** — multi-facility analytics,
   referral tracking, ARCH fork routing

Banner on page: "DEMO PRICING — NOT REAL — FOR INVESTOR DEMONSTRATION
ONLY."

**§ PARTNER_FACILITY_DATA** — `/content/partners.yaml` contains exactly
one fictional SNF:

- name: "Maplewood Skilled Nursing and Rehabilitation"
- location: "Baltimore, MD"
- beds: 120
- admin_contact: "fictional — Patricia Vance, Administrator"
- demo_note: "This is a fictional facility for demonstration purposes
  only."

**§ REVENUE_NARRATIVE** — The about/mission page must include:
"Setchan AI is a B2B2C platform — families navigate for free,
facilities pay for engagement. Built on a PHI-hardened spatial memory
engine."

---

*End of master prompt. Build order (CTO): journey shell → memory engine
→ stage screens → governance trace; content drops in last from
`/content/*.yaml`.*
