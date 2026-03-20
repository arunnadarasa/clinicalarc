# ClawHub Learning Notes (DanceTempo)

This is a “tribal knowledge” file for quickly onboarding OpenClaw (and any future agent) to the DanceTempo repository:

- what the repo is (Tempo + MPP superapp),
- what succeeded,
- what failed and why,
- and the repeatable best practices that prevent re-learning the hard parts.

---

## What this repo is

DanceTempo is a super app for the DanceTech industry built around:

- **Tempo** (on-chain payments and receipts)
- **MPP** via `mppx` (client/server-side handling of `402 Payment Required` challenges)
- **Dedicated use-case routes** (hub + full-screen flows)
- A **Node/Express backend** that creates/verifies MPP intents and proxies/handles integrations.

Core docs to reuse:

- `README.md` (high-level “superapp” framing + route list)
- `DANCETECH_USE_CASES.md` (the flow-by-flow contract and API mappings)
- `server/index.js` (the real implementation patterns and integration edge handling)

---

## Successes (what worked)

1. **Superapp README now reflects the real architecture**
   - Added a “super app” definition that maps: hub vs dedicated routes vs backend vs integrations.
   - Included the dedicated route table so explanations don’t drift from implementation.
   - Documented quick start (`npm run server`, `npm run dev`, `npm run dev:full`) and environment guidance.

2. **GitHub push worked after unrelated-history + README conflict**
   - When the remote `main` already had commits, the first push failed (non-fast-forward).
   - Pulling unrelated histories caused a `README.md` conflict.
   - Resolution strategy: keep the README focused (short title/one-line description) and remove template bulk rather than trying to merge two incompatible README styles.

3. **AgentMail “email” flow got to a working end-to-end pattern**
   - Earlier attempts hit MPP/inbox scope mismatches (notably `Inbox not found`).
   - The final working approach:
     - the wallet pays **this backend** using **Tempo MPP** (`mppx` server charge),
     - then the backend sends the email via **AgentMail’s API key endpoint** (`AGENTMAIL_API_KEY`).
   - This preserves “wallet-paid UX” while avoiding fragile inbox scope behavior in passthrough mode.

4. **Server integration patterns are consistent**
   - For `402`-capable third-party endpoints:
     - if upstream returns `402`, the backend should pass that challenge back to the client (so `mppx` can solve).
   - For “paid endpoints then poll” integrations:
     - use the correct auth header strategy for the paid + polling phases (x402 vs SIWX vs bearer-token style).

---

## Failures (what broke) and how to recognize it

### 1) GitHub push: remote already had commits

**Symptom**
- Push rejected with a non-fast-forward error.

**Cause**
- The local repo history and remote `origin/main` history did not share a common base.

**Fix**
- Pull with `--allow-unrelated-histories`, resolve conflicts, then push.
- For docs conflicts, keep the README aligned to the repo’s current purpose instead of merging incompatible template text.

### 2) README merge conflicts

**Symptom**
- `README.md` conflict markers appeared after merging unrelated histories.

**Cause**
- A template README on the remote conflicted with the locally-generated template/short description.

**Fix**
- Prefer a single coherent README rather than trying to “merge” two styles.
- Keep the “superapp capability” content, route list, and setup instructions. Remove template bulk.

### 3) AgentMail: `Inbox not found` / inbox scope mismatch

**Symptom**
- AgentMail send returns an error indicating the inbox doesn’t exist or isn’t accessible.

**Common causes**
- `AGENTMAIL_INBOX_ID` not set and no `inbox_id` provided in the request body.
- Inbox ID mismatch vs the paid-scope the integration expects.
- Using passthrough MPP mode while the integration expects a specific inbox access scope.

**Fix pattern that worked**
- If `AGENTMAIL_API_KEY` is available:
  - pay via Tempo MPP to this backend,
  - send via AgentMail stable API endpoint using the API key,
  - return the upstream result.

### 4) MPP / x402 mismatch and recurring `402` loops

**Symptom**
- The frontend repeatedly encounters `402` (or can’t recover from an auth challenge).

**Common causes**
- Hitting the wrong base URL for the x402-capable endpoint.
- Not preserving `402` challenge headers/body back to the `mppx` client.
- Forwarding the wrong headers for the solved/authorized phase.

**Fix**
- Ensure the backend returns the upstream `402` response directly (not a generic error).
- Ensure “forwarding” of headers follows the solved payment stage (e.g. `payment`, `payment-receipt`).

### 5) Invalid payment parameters (e.g. `feeToken`, network, or amount format)

**Symptom**
- Payment failures that mention token/fee/address/chain inconsistencies.

**Common causes**
- Using the wrong chain network (Tempo testnet vs mainnet).
- Passing amount in base units when the `mppx` chain method expects a decimal-string amount (see server implementation).
- Misconfigured recipients/fee tokens for a specific provider method.

**Fix**
- Keep `testnet` as the default for “first get it working” debugging.
- Match the backend chain method config:
  - `tempoModerato` chain for testnet-like flows
  - `tempo` chain for mainnet-like flows
- Use decimal-string amounts (server uses `toFixed(2)` in key payment handlers).

---

## Best practices (repeatable habits)

### Documentation

1. Treat `DANCETECH_USE_CASES.md` as the contract source of truth.
2. Keep `README.md` as the “product layer” summary:
   - superapp definition,
   - stack,
   - route table,
   - quick start.
3. When asked to explain “superapp capabilities”, always map:
   - hub vs dedicated route vs backend endpoints vs integrations.

### Payment flow correctness

1. For x402 endpoints:
   - on upstream `402`, return the challenge response so `mppx` can solve.
2. For solved payment forwarding:
   - forward the correct auth headers from the incoming request.
3. Keep a consistent “two-stage” mental model:
   - paid endpoint interaction (x402 / Tempo MPP solve),
   - polling or follow-up calls (often SIWX or bearer-token style depending on provider).

### Engineering hygiene

1. Never commit `.env` (it is gitignored).
2. Prefer `AGENTMAIL_INBOX_ID` + `AGENTMAIL_API_KEY` configuration over fragile passthrough scope behavior when possible.
3. Use `npm run dev:full` for the fastest end-to-end loop:
   - Vite on `5173`,
   - Express API on port `8787`.

### Fast debugging checklist

1. Confirm network selection (`testnet` vs `mainnet`) matches the endpoint expectation.
2. Confirm amount format (decimal-string, not base units) and fee/path configuration.
3. For integration errors:
   - if `402`: preserve challenge response,
   - if `401/403`: check the correct post-payment auth phase (SIWX vs bearer token vs API key).
4. If AgentMail inbox errors appear:
   - check `AGENTMAIL_INBOX_ID`,
   - prefer the API-key send strategy if `AGENTMAIL_API_KEY` is set.

---

## “Where to look” map

1. Superapp overview + route table: `README.md`
2. Use-case API mappings and flow steps: `DANCETECH_USE_CASES.md`
3. Implementation patterns and provider edge cases:
   - `server/index.js` (integration handlers, `402` passthrough, AgentMail send/inbox create)
4. Dev proxy: `vite.config.ts` (proxy `/api` -> `http://localhost:8787`)

