---
name: clawhub
description: Explain DanceTempo superapp capabilities and troubleshoot Tempo/MPP (x402) + AgentMail integration issues. Use when the user asks for repo learning, “superapp” capability summaries, debugging payment/provider errors, or quick setup/runbook guidance.
---

# ClawHub Skill

## Instructions

1. **Load the repo learning docs first**
   - Read `CLAWHUB.md` for the success/failure history and best practices.
   - Read `README.md` for the user-facing “superapp” framing + route table.
   - Read `DANCETECH_USE_CASES.md` for the canonical flow steps and API mappings.
   - If the task involves payment/integration behavior, also consult `server/index.js`.

2. **If the user asks for an explanation (“what can the superapp do?”)**
   - Describe the architecture in terms of layers:
     - hub (main landing and use-case entry),
     - dedicated routes (full-screen flows),
     - backend payment/intents + receipt verification,
     - integrations and how they are paid.
   - Include the dedicated route list (from `README.md`) and map each route to its category/intent type when relevant (`charge` vs `session`).
   - Give a short “how payment works” mental model:
     - x402 endpoints trigger a `402 Payment Required` challenge,
     - `mppx` solves the challenge,
     - the backend returns the challenge response on `402` so the client can proceed.

3. **If the user asks for debugging/troubleshooting**
   - Ask for (or infer) these inputs:
     - `testnet` vs `mainnet`,
     - the failing endpoint URL/path (or the route the user is in),
     - the exact error text/code (e.g. `Inbox not found`, `feeToken` issues, `402` loop, `401/403`),
     - which env vars are set (at minimum: `AGENTMAIL_INBOX_ID`, `AGENTMAIL_API_KEY`, network/MPP config).
   - Use the failure patterns from `CLAWHUB.md` to propose root causes.
   - Provide the most direct fix first, then optional alternatives:
     - For AgentMail `Inbox not found`: if `AGENTMAIL_API_KEY` exists, prefer the pattern “wallet pays backend via Tempo MPP, backend sends via AgentMail API key endpoint”.
     - For x402 loops: ensure the backend *preserves and returns* upstream `402` challenges so `mppx` can solve.
     - For invalid fee/token/network: align Tempo chain method config and amount formatting (decimal-string amounts in the server payment handlers).

4. **If the user asks to create/modify docs**
   - Keep `README.md` coherent and focused on the superapp capability and route mapping.
   - Avoid template-bulk merges; if conflicts happen, resolve by choosing one consistent README style.
   - Prefer referencing `DANCETECH_USE_CASES.md` for detailed endpoint lists/flow steps.

## Examples (trigger prompts)

1. User: “Explain the superapp capability.”
   - Output: hub vs dedicated routes vs backend vs integrations, plus a route table summary and payment mental model.

2. User: “AgentMail send fails with `Inbox not found`.”
   - Output: check `AGENTMAIL_INBOX_ID`/`inbox_id`, then suggest the API-key send strategy if `AGENTMAIL_API_KEY` exists.

3. User: “Why does the payment keep returning 402?”
   - Output: mention the need to return upstream `402` challenges and verify correct x402 base URL + header forwarding.

## Default assumptions

- The user is working in the Tempo repo and wants answers grounded in `README.md`, `DANCETECH_USE_CASES.md`, and `server/index.js`.
- If live mainnet behavior is involved, prefer “testnet first” guidance from `CLAWHUB.md`.

