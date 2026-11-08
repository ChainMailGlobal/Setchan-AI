# The Boardroom — a Mixture of Specialists

**Pomaik'AI's five-model AI C-suite, seated in a Switch room, founding Setchan AI.**

Not a mixture of experts. A mixture of specialists.

Building it yourself? Run notes and the live demo live in [DEVELOPING.md](DEVELOPING.md).

## What this is

A solo founder (Daniel Kaneshiro, Honolulu) chaired a board of five AI
executives — five different open models from five different labs, running on
the Nebius Token Factory API — inside a private Switch (Mattermost) channel.
The board deliberated for real, reached real decisions, and distilled one
master prompt, which the chair handed to a coding agent (Claude Code, seated
in the room as "Builder"). The Builder is building the board's product:
**Setchan AI**, a navigator for family caregivers.

## The board

| Seat | Name | Model | Lab |
|------|------|-------|-----|
| CPO | Hermes | Hermes 4 405B | Nous Research |
| CTO | Kimi | Kimi-K3 | Moonshot AI |
| COO | Nemo | Nemotron 3.5 Super VL | NVIDIA |
| CMO | Mise | Muse Spark Open | Meta |
| CRO | Glam | GLM-5.3 † | Z.ai |

† Upgraded in-family from GLM-5.2 on Nov 7, after the founding session.

Chair: DK (founder-CEO), directing by voice via Wispr Flow.
Chief of Staff: UNI — keeps the board's memory, minutes, and spend ledger,
and carries the executives' words into the room verbatim. The executives are
NOT Switch agents: Switch offers no OpenAI-compatible provider door, so they
could not be seated natively. We refused to fake them with personas on a
single model. Only the Builder is a native Switch agent — because it really
is Claude Code.

## The record (Sat Nov 7, 2026, HST)

- 6:59am — #boardroom channel created (private), after three PC reboots, a
  Docker engine blink, a Claude Code update (2.1.92 → 2.1.319) and a fresh
  OAuth sign-in.
- 7:21am — Builder seated, briefed: acts only on a master prompt from the
  chair; never on deliberation; restates the plan; keeps a build log.
- 7:36am — Chair calls the Boardroom to order. Introductions around the table.
- 7:50am — Founder's story and the Setchan framework tabled (board copy —
  fictional case only: caregiver Sarah, resident Maria R.).
- 7:51am — Founding round: full five-seat deliberation ($0.087).
- 8:00am — Master prompt handed to Builder. Setchan AI under construction.

## What the board decided

Setchan AI v1 = Pillar 1 (Clinical Command), Phase 1 (Arrival): the Shift
Change Checklist. Static PWA — Vite + React + TypeScript + Dexie + Tailwind.
No backend, no accounts, no server. Offline-first. All product copy lives in
content files, never in code. A pinned DEMO_TODAY clock. No PHI, ever.
Facilities pay (DEMO pricing); caregivers never pay.

## Run the board

The Boardroom runner (charters, session engine, $5/day hard-capped spend
ledger) lives in the founding team's repo. It requires a Nebius Token
Factory API key in the environment:

    python3 run_boardroom.py --live --question "Your decision before the board"

Every session writes a transcript and a decision memo. Total cost of the
Nov 7 founding session: $0.087. The same board, self-hosted in 2025, cost
over $2,000/month. On frontier subscriptions before that: ~$80/month of
chat windows. MoS is the point: different models genuinely disagree and
check each other; the founder is the router.

## Governance

The board runs on a Seven-Rule Governance Framework (anti-drift,
anti-self-certification, meta-audit, source scope control, human parameter
ownership). All demo data is fictional. Raw records never leave the
founder's custody.

## Our ask of Switch

Add a bring-your-own OpenAI-compatible provider door, so real specialist
models behind APIs like Nebius Token Factory can sit in a Switch room as
first-class agents. Filed upstream as a GitHub issue.

## What's next

Setchan AI heads to Techstars Spring 2027 — application due Nov 17, 2026.
