# DanceTech Protocol — A to Z

**Use this document** to build a landing page (e.g. in Lovable), social copy, or investor one-pagers. It explains the protocol end-to-end and points to the open-source reference app on GitHub.

| | |
|---|---|
| **Protocol** | DanceTech Protocol — pattern stack for dance-industry money & ops on **Tempo** + **MPP/x402** |
| **Reference app** | **DanceTempo** — [`github.com/arunnadarasa/dancetempo`](https://github.com/arunnadarasa/dancetempo) |
| **Settlement** | [Tempo](https://tempo.xyz) (L1 tuned for payments) |
| **Machine payments** | [Machine Payments Protocol (MPP)](https://mpp.dev) · [Service catalog](https://mpp.dev/services) |

---

## Elevator pitch

**DanceTech Protocol** is an open **pattern stack** for the dance industry: the same ideas power battle entry fees, coaching minutes, beat licensing, judge scores, cypher pots, clip revenue splits, reputation attestations, studio AI metering, tournament ops automation, fan memberships—and the paid APIs (email, travel, music, intel) that surround real events.

Money and API access are **settled on Tempo** and **authorized through MPP and HTTP 402 (x402)** so flows stay **verifiable**, **composable**, and **agent-ready**: humans, scripts, and services can participate under explicit trust boundaries.

**DanceTempo** is the **reference implementation**: one hub, dedicated demos, and a production-style Node/Express API you can fork.

---

## A — Architecture (four layers)

1. **Experience** — Hub and full-screen apps (battle, coaching, beats, dance-extras, kicks, travel, …).  
2. **API** — Express routes that encode intents, receipts, and integration behavior.  
3. **Payments** — `mppx` on client and server; Tempo chain actions via `viem`.  
4. **Integrations** — Paid third parties (AgentMail, Suno, OpenWeather, KicksDB, …) via MPP catalog hosts or env-configured proxies.

---

## B — Blockchain: why Tempo?

Tempo is used as the **settlement layer**: fast finality, stable-asset patterns, and tooling that fits **machine-readable payments** (MPP) alongside human wallet UX. The protocol is **not** “one smart contract”—it’s **how you wire** industry flows to Tempo’s settlement and receipts.

---

## C — Charges & sessions

Two recurring **payment intents** in the stack:

- **`charge`** — One-shot payment (entry, license, attestation, pass).  
- **`session`** — Metered or repeated ticks (coaching minutes, micropot-style accumulation).

Both map to MPP semantics and show up across hub copy and `DANCETECH_USE_CASES.md`.

---

## D — DanceTempo (reference implementation)

**DanceTempo** encodes DanceTech Protocol in a real codebase:

- **Frontend:** React, TypeScript, Vite.  
- **Backend:** Express 5, payment verification, `402` passthrough, proxies.  
- **Repo:** [`github.com/arunnadarasa/dancetempo`](https://github.com/arunnadarasa/dancetempo) — clone, configure `.env`, run `npm run dev:full`.

---

## E — Ecosystem (mpp.dev)

The **[MPP service catalog](https://mpp.dev/services)** lists hosted integrations (base URLs, paths, pricing). DanceTempo wires many of the same vendors through **`server/index.js`** and documents env vars in **`.env.example`**.

---

## F — Forks & extensibility

The protocol is **meant to be forked**: add a route, add a `src/*App.tsx`, mirror the same **pay → receipt → side effect** pattern. Behavioral contracts live in **`DANCETECH_USE_CASES.md`**.

---

## G — Glossary (money on the internet)

- **x402 / 402** — HTTP *Payment Required*; challenge that `mppx` can solve so a client pays and retries.  
- **Receipt** — Proof linked to a payment or intent (audit trail for judges, ops, fans).  
- **TIP-20** — Token patterns on Tempo (e.g. factory demos in-repo).

---

## H — Humans & agents (one protocol)

DanceTech Protocol is **one** stack. “Human→human,” “human→agent,” “agent→human,” and “agent→agent” are **shorthand** for who **authorizes spend** and who **benefits**—not four separate specs.

| Shorthand | Meaning |
|-----------|--------|
| Human ↔ human | Wallet commerce (fees, passes, splits). |
| Human → agent | User approves; orchestrator calls the same HTTP APIs. |
| Agent → human | Automation delivers email, alerts, passes to people. |
| Agent ↔ agent | Service-to-service: machine payments, API keys after MPP, webhooks. |

---

## I — Integrations (examples)

Illustrative rails demonstrated or scaffolded: **AgentMail**, **StablePhone**, **StableSocial**, **StableTravel**, **Laso** cards, **Suno**, **Parallel**, **OpenWeather**, **OpenAI MPP**, **KicksDB**, **Google Maps**, **Aviationstack**, **Alchemy**, **Fal**, **Replicate**, **TIP-20** factory—not all required; enable via env.

---

## J — Justice & judging (paid writes)

Judge score submission is modeled as a **paid write API**: accountability and receipts for who scored whom, when—aligned with battle and event timelines.

---

## K — Keys & configuration

Operators use **`.env`**: `MPP_RECIPIENT`, optional vendor keys, AgentMail (`AGENTMAIL_API_KEY`, `AGENTMAIL_INBOX_ID`), OpenAI, KicksDB, etc. **Never commit secrets**; copy from **`.env.example`**.

---

## L — Live vs simulate

Many flows support **simulate** (mock API, no chain spend) and **live** (Tempo MPP with wallet). Example: **`/dance-extras`** → `POST /api/dance-extras/live/:flowKey/:network` after an MPP charge.

---

## M — MPP (Machine Payments Protocol)

MPP standardizes **how** machines and wallets pay for HTTP resources: challenges, retries, receipts. DanceTempo uses **`mppx`** client/server and forwards **402** responses so clients can complete payment.

---

## N — Networks

| Network | Chain ID | Notes |
|---------|-----------|--------|
| Tempo testnet (Moderato) | `42431` | Default for safe iteration; pathUSD-style fee patterns. |
| Tempo mainnet | `4217` | Real value; test thoroughly on testnet first. |

---

## O — Open source

License: **MIT** (see `LICENSE` in the repo). Use commercially; attribute; contribute back if you can.

---

## P — Product surfaces (routes)

Examples users can open in DanceTempo:

| Path | Idea |
|------|------|
| `/` | Hub — all use cases |
| `/battle` | Battle entry + payout |
| `/coaching` | Coaching minutes |
| `/beats` | Beat licensing |
| `/dance-extras` | Seven core DanceTech scaffolds + live MPP |
| `/kicks`, `/travel`, `/music`, `/email`, … | Vertical demos |

Full table: **`README.md`** in the repo.

---

## Q — Quality & ops

**CLAWHUB.md** in the repo captures **what worked and what failed** (AgentMail inbox scope, stale API processes, 402 loops)—useful for operators and coding agents.

---

## R — Receipts & auditability

Receipts tie **payment** to **business events** (scores, usage ticks, passes, clip sales). That’s the trust layer for organizers, dancers, and partners.

---

## S — Security

- Secrets only in **`.env`**.  
- **Testnet first** for new flows.  
- **Mainnet** spends real assets—match recipient config and network selection to your deployment.

---

## T — Tempo (settlement)

Tempo provides the **chain context** for settlement; pair with **explorers** (e.g. testnet/mainnet explorers linked from the app) for transaction hashes.

---

## U — Use cases (ten+)

Battle entry, judge scores, cypher micropot, coaching minutes, beat licensing, clip rights router, reputation attestations, studio AI billing, ops bot + email, fan battle pass—plus integrations above. Details: **`DANCETECH_USE_CASES.md`**.

---

## V — Verifiability

The protocol bias is **prove what happened**: payment proof, API receipt, optional on-chain hash exposure—so disputes and automation have a shared source of truth.

---

## W — Wallets

Users pay with **injected wallets** (e.g. MetaMask, Tempo-capable wallets). Server-side keys handle **delegated** or **post-payment** calls where appropriate (e.g. AgentMail after MPP charge).

---

## X — x402 (HTTP Payment Required)

Third-party APIs may return **402** + **WWW-Authenticate**. The backend **preserves** the challenge for `mppx`; swallowing 402 as a generic error breaks the payment loop.

---

## Y — You (who this is for)

- **Event orgs & platforms** — standardized payment patterns for competitions and community products.  
- **Builders** — fork DanceTempo, swap branding, connect your keys.  
- **Agents & automation** — same HTTP contracts; explicit trust for who signs and who pays.

---

## Z — Zero lock-in (philosophy)

The protocol is **patterns + reference code**, not a single vendor gate. Swap integrations via env; replace UIs; keep Tempo + MPP as the spine—or extract the API contract only.

---

## Suggested Lovable CTA block

**Headline:** *DanceTech Protocol — verifiable payments for the dance economy.*

**Sub:** *Built on Tempo & MPP. Ship faster with the open DanceTempo reference app.*

**Primary button:** [View on GitHub](https://github.com/arunnadarasa/dancetempo)

**Secondary:** [Try the docs — README](https://github.com/arunnadarasa/dancetempo/blob/main/README.md)

---

## Files to read next (in repo)

| File | Purpose |
|------|---------|
| `README.md` | Overview, routes, quick start |
| `DANCETECH_USE_CASES.md` | Flow-by-flow API mapping |
| `CLAWHUB.md` | Operational learnings |
| `.env.example` | Configuration surface |

---

*This file is maintained for landing-page and handoff use. Protocol naming: **DanceTech Protocol**; implementation: **DanceTempo** · [`github.com/arunnadarasa/dancetempo`](https://github.com/arunnadarasa/dancetempo).*
