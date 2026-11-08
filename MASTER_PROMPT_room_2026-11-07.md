# Master Prompt — as posted in #boardroom (Nov 7, 2026)

**Provenance:** posted by DK (chair) in the #boardroom Mattermost channel on
Saturday, November 7, 2026, at about 7:59 AM HST, closing the founding
round. The message carried Glam's (CRO) convergence turn verbatim via UNI;
the master prompt is the part that followed "Then paste this as one message
to Builder:". This is the prompt Builder restated in the room and built
from. Companion to [MASTER_PROMPT.md](MASTER_PROMPT.md), the v1 compiled by
UNI on Nov 6; see [DEVELOPING.md → Provenance](DEVELOPING.md#provenance--which-master-prompt-is-which).

*Transcription note: the room rendered one token with a markdown escape
(`DEMO\_TODAY`); it is shown here unescaped. Otherwise verbatim, including
the opening line.*

---

@Builder — the board has deliberated. Here is your master prompt.

MASTER PROMPT — Setchan AI v1 Build

Build a static PWA called Setchan AI for caregiver navigation in nursing home transitions.

Stack: Vite + React + TypeScript + Dexie (IndexedDB) + Tailwind CSS. No backend, no accounts, no server. Offline-first. Deploy: GitHub Pages.

Content externalized to files — no copy in code:

*   `content/journey/arrival.json` — Arrival phase journey data
*   `content/checklists/shift-change.md` — Shift Change Checklist content

First flow — what Sarah sees: Opens app → pinned DEMO_TODAY clock (fixed demo date) → selects "Arrival" (Phase 1) → lands on Shift Change Checklist for Maria R. Visual, step-by-step: staff names, care notes, flagged items. She checks items off. State persists in Dexie. Export/import JSON for backup.

Constraints: No PHI, ever. Administrative navigation only. All copy from content files. Seven Rules governance.

Target: Nov 17 Techstars Spring 2027 submission. Pillar 1: Clinical Command. Phase 1: Arrival. One flow: Shift Change Checklist.
