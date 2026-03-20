---
name: clawhub
description: Explain DanceTempo superapp capabilities and troubleshoot Tempo/MPP (x402) + AgentMail integration issues. Use when the user asks for repo learning, “superapp” capability summaries, debugging payment/provider errors, or quick setup/runbook guidance.
---

# ClawHub Skill: DanceTempo Superapp + Troubleshooting

## Purpose
Answer questions about this repo as an “agent playbook”, specifically:
1) explaining what the DanceTempo superapp can do,
2) giving a repeatable debugging path for Tempo/MPP (x402/402) and integration issues,
3) providing “what to run / what to check” guidance without needing the user to open multiple files.

## Quick Reference (choose your path)
| User asks… | The skill should do… |
|---|---|
| “What can the superapp do?” | Use the superapp explanation template (layers + routes + how payments work + where to read next). |
| “Why am I stuck on 402?” | Run the “x402/402 loop” diagnosis checklist and recommend the first concrete fix. |
| “AgentMail fails: Inbox not found” | Run the AgentMail inbox scope checklist and recommend the API-key send strategy (if configured). |
| “StableSocial jobs fail / 401/403” | Explain SIWX/auth requirements for polling and ask for wallet-consistency details. |
| “Laso card create/polling fails” | Explain the Laso flow and when the repo falls back to demo mode. |
| “How do I run locally?” | Provide the exact `npm run dev:full` + `.env` copy steps + ports. |
| “Add/modify docs” | Suggest doc structure (superapp definition + route list + quick start) and avoid README template-bulk merges. |

## Repo Primer (ground truth)
This repo is a **DanceTech superapp** built around:
- **Tempo**: on-chain payments and receipts (L1)
- **MPP**: handled via `mppx` (client/server-side solving of `402 Payment Required`)
- **Frontend hub + dedicated route apps**: full-screen flows for major use cases
- **Backend**: Express API that creates/verifies payment intents and integrates/polls third parties.

Key files you should use as the authoritative source of truth:
- `README.md`: user-facing superapp definition + quick start + route list
- `DANCETECH_USE_CASES.md`: canonical flow steps + API mappings + testing runbook
- `CLAWHUB.md`: success/failure history + best practices + debugging patterns
- `server/index.js`: the actual integration behavior (especially x402 passthrough and AgentMail send)
- `vite.config.ts`: dev proxy (`/api` -> backend on `http://localhost:8787`)

## Superapp Explanation Template (self-contained)
When the user requests an explanation, respond using this structure (fill in the obvious values):

### 1) One-liner
DanceTempo is a super app for the DanceTech industry combining Tempo payments, MPP/x402 integration handling, and a hub of dedicated use-case flows.

### 2) Architecture in layers
- **Hub (`/`)**: main entry + “use-case selection” experience + global transaction history.
- **Dedicated frontends**: full-screen flows per use case (live testnet/mainnet UX, wallet flow, receipts, recovery).
- **Backend (`server/`)**: Express API that:
  - creates/verifies payment intents and emits receipts,
  - returns upstream `402` challenges so `mppx` can solve,
  - proxies/integrates with paid APIs (AgentMail, StablePhone, StableSocial, StableTravel, Laso, Suno, weather/maps/logistics, etc.).
- **Integrations**: paid rails for operations and commerce-style endpoints (the repo demonstrates a consistent “pay then poll / pay then send” pattern).

### 3) Dedicated routes (what’s where)
- `/`: main hub (all use cases + global transaction history)
- `/battle`: battle entry + auto payout (live)
- `/coaching`: coaching minutes marketplace (live)
- `/beats`: beat API licensing (live)
- `/card`: virtual debit card (Laso/MPP + demo fallback)
- `/travel`: travel + logistics integrations (StableTravel, Aviationstack, Google Maps)
- `/email`: AgentMail ops (wallet-paid relay + send)
- `/ops`: AgentMail + StablePhone console
- `/social`: StableSocial
- `/music`: Suno
- `/kicks`: KicksDB (live MPP + simulate)
- `/tip20`: TIP-20 token launch & post-launch ops

### 4) How payments work (the short mental model)
- Some third-party endpoints are **x402**: they respond with `402 Payment Required` plus a challenge.
- The repo’s backend should **preserve and return** that `402` challenge back to the client.
- The `mppx` client then solves the challenge and retries, resulting in an authorized response.

### 5) Where to read next
- For flow-by-flow details and endpoint mappings: `DANCETECH_USE_CASES.md`
- For implementation + provider edge cases: `server/index.js`

## Tempo & MPP Cheat Sheet (DanceTempo-specific)
Networks used by the repo:
- **Tempo testnet (Moderato)**: chain id `42431`, typical fee/path asset: `pathUSD`
- **Tempo mainnet**: chain id `4217`, common fee token: `USDC` (as configured)

Payment patterns you should assume:
- **`charge`**: a direct paid operation (often one-time settlement)
- **`session`**: metered or repeat usage pattern (e.g., “ticks over time”)

Critical protocol behavior:
- If upstream returns `402`, you generally must return that upstream challenge to the `mppx` client, not swallow it into a generic error.

## Local Runbook (fastest way to reproduce)
1. Install:
   - `npm install`
2. Configure env:
   - `cp .env.example .env`
3. Run:
   - Terminal 1: `npm run server` (backend on `PORT`, default `8787`)
   - Terminal 2: `npm run dev` (Vite frontend, typical `5173`)
   - Or one command: `npm run dev:full`
4. Visit:
   - `http://localhost:5173` (hub)
   - `http://localhost:5173/<route>` (e.g. `/battle`)

Repo-provided dev proxy:
- Vite proxies `/api` -> `http://localhost:8787`.

## Environment Variables (minimum set)
Use `.env.example` as the canonical list. Common ones for the flows covered by this skill:

OpenAI (optional, for server-side explanation proxy):
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default `gpt-4o-mini`)

Tempo / MPP:
- `TMPO_TESTNET=true|false`
- `MPP_RECIPIENT`
- `PAYMENT_MODE` (often `mock` while scaffolding)

AgentMail (email/ops):
- `AGENTMAIL_API_KEY` (if set, repo uses API-key send strategy)
- `AGENTMAIL_BASE_URL` (default `https://api.agentmail.to`)
- `AGENTMAIL_MPP_BASE_URL` (default `https://mpp.api.agentmail.to`)
- `AGENTMAIL_INBOX_ID` (used by send + inbox create flows)

Other integrations (depending on route):
- KicksDB: `KICKSDB_API_KEY`, `KICKSDB_BASE_URL`, `KICKSDB_SEARCH_PATH`
- Laso: `CARD_PROVIDER`, `LASO_BASE_URL`, `LASO_MPP_PATH`, `LASO_CARD_STATUS_PATH`
- StablePhone: `STABLEPHONE_BASE_URL`, `STABLEPHONE_CALL_PATH`, `STABLEPHONE_STATUS_PATH`
- StableSocial: `STABLESOCIAL_BASE_URL`, `STABLESOCIAL_INSTAGRAM_PROFILE_PATH`, `STABLESOCIAL_JOBS_PATH`
- StableTravel + weather/maps/logistics: their respective `*_API_KEY` + `*_BASE_URL` values in `.env.example`

## Troubleshooting Playbooks

### A) “My payment keeps returning 402” (x402/402 loop)
Goal: stop the loop by verifying the repo is returning upstream challenges and forwarding the solved auth correctly.

Diagnosis checklist (in order):
1. Network mismatch:
   - Ensure user-selected network (testnet/mainnet) matches the endpoint and the backend config.
2. Wrong endpoint base URL for the paid service:
   - Many paid endpoints require the specific x402-capable base.
3. Backend error handling:
   - If upstream returns `402`, the backend should return the upstream `402` response/challenge to the client.
4. Header forwarding:
   - In “passthrough” mode (or when forwarding solved auth), ensure the request includes the correct `payment` / `payment-receipt` headers (the repo’s helper forwards `authorization`, `payment`, `payment-receipt` when present).
5. Amount formatting:
   - The server’s payment handlers expect a decimal-string amount and often use `toFixed(2)`; don’t pass base units.

What to ask the user (minimal):
- Which route did they use and which backend route hit (or the failing path)?
- Did the backend return an actual `402` challenge body/headers, or did it translate it into a generic error?
- Which network (testnet/mainnet)?

Likely first fix:
- Verify the backend handler for the failing route preserves `402` and returns it (do not swallow).

### B) AgentMail errors: `Inbox not found` or inbox scope mismatch
Goal: get a working end-to-end send by using the repo’s best-practice strategy.

Common causes (recognize quickly):
1. `AGENTMAIL_INBOX_ID` not set and `inbox_id` not provided in request body.
2. Inbox ID doesn’t match the scope / access that the send expects.
3. Using passthrough mode when the integration expects API-key based send behavior.

The working strategy (preferred when `AGENTMAIL_API_KEY` exists):
1. Wallet pays the backend via Tempo MPP (`mppx` server charge).
2. Backend sends the message via AgentMail’s API endpoint using:
   - `Authorization: Bearer <AGENTMAIL_API_KEY>`
   - endpoint pattern:
     - `${AGENTMAIL_BASE_URL}/v0/inboxes/{inbox_id}/messages/send`
3. Backend returns the upstream result wrapped with an MPP receipt.

If `AGENTMAIL_API_KEY` is NOT set:
- The backend falls back to a passthrough flow:
  - it forwards the `payment` / `payment-receipt` headers to AgentMail’s MPP base endpoint
  - and must preserve `402` so the client can solve and retry.

What to ask the user:
- Do they have `AGENTMAIL_API_KEY` set?
- What is the exact error text and which endpoint returned it?
- Are they using the same inbox id everywhere (`AGENTMAIL_INBOX_ID` vs `inbox_id`)?

Likely first fix:
- If API key is configured, set `AGENTMAIL_INBOX_ID` and use the send flow that calls `POST /api/ops/agentmail/send`.

### C) StableSocial polling fails (401/403)
Symptom pattern:
- Trigger calls work, but `/jobs` polling fails.

Why:
- Polling requires SIWX-authenticated access, and it must come from the same wallet that paid the paid request.

Likely fixes:
- Ensure the same wallet/session is used for:
  - the paid trigger call, and
  - the subsequent polling call using the `token` param.

What to ask:
- Which exact polling endpoint / status code?
- Did the user re-auth with a different wallet before polling?

### D) Laso virtual card issues (create vs poll)
Repo behavior to know:
- Route `/api/card/create` can:
  - charge via MPP when Laso returns `402`,
  - retry Laso with payment headers,
  - fallback to local mock/demo if Laso rejects with geo restrictions (e.g., “US only”).
- Route `/api/card/:id` polls:
  - uses Laso `/get-card-data` (via stored `id_token/refresh_token`),
  - if missing those tokens, returns an error or mock demo telemetry.

Likely fixes:
- If “restricted/geo” rejection occurs:
  - accept demo fallback (repo will return `demo: true` and `demoReason`),
  - otherwise ensure Laso restrictions match your region.
- If polling fails:
  - confirm you’re using the same `cardId` returned by create.

What to ask:
- What do they see for `cardId` + `status` after create?
- Which error occurs on poll: missing auth tokens vs upstream failure?

### E) Invalid fee/token/network errors
Likely causes:
- Wrong network selection (testnet vs mainnet)
- Wrong `MPP_RECIPIENT` or missing recipient config
- Wrong amount format (decimal string vs base units)

Fix:
- Use testnet first.
- Ensure `.env` values match the route and provider expectations.

## Output Contracts (how you should write your answer)
1. For “explain superapp”:
   - include layers + route table + payment mental model.
2. For debugging:
   - Diagnose (most likely cause first),
   - Give 2-5 concrete next steps,
   - Ask for only the smallest set of missing info.

## Safety / Guardrails
- Never ask the user to paste secrets from `.env`.
- If the user mentions staging mainnet:
  - suggest “testnet first” before spending real assets.
- When editing docs:
  - keep `README.md` coherent and avoid template-bulk merges.


