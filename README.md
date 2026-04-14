# HealthTech Protocol · Clinical Arc

**Clinical Arc** is the **core app** in this repository: an **NHS-aligned neighbourhood health** experience—wallet-linked identity, GP access requests, care plans, social prescribing, neighbourhood team coordination, remote monitoring with proactive alerts, transaction history, and **Arc Testnet + Circle Gateway x402** payment gates on selected service writes—plus **Open Wallet Standard (OWS)**, **AgentMail**, and optional **TIP-20** (via `viem/tempo`) demos. The **NHS hub** is at **`/`** and **`/nhs`**; feature screens live under **`/nhs/*`**.

**HealthTech Protocol** is the open **pattern stack**: verifiable payments, session metering, care pathways, remote monitoring, and AI-assisted workflows—**settled on [Arc](https://docs.arc.network/arc/references/connect-to-arc)** with **USDC nanopayments** via [Circle Gateway](https://developers.circle.com/gateway/nanopayments) and the **x402** HTTP payment protocol ([overview](https://developers.circle.com/gateway/nanopayments/concepts/x402)). Reference demos (e.g. **`/dance-extras`**, battle, coaching) exercise the same rails in another domain.

This is a **reference implementation**: React (Vite) front ends, a Node/Express API, and production-style persistence for NHS flows. **Treat [`HEALTHTECH_USE_CASES.md`](./HEALTHTECH_USE_CASES.md) as the behavioral contract** for routes, endpoints, and testing notes.

**Primary remote:** **[arunnadarasa/clinicalarc](https://github.com/arunnadarasa/clinicalarc)**. **NHS / hackathon notes:** [`OPENCLAW_CLINICAL_HACKATHON_LEARNINGS.md`](./OPENCLAW_CLINICAL_HACKATHON_LEARNINGS.md). **Data safety:** use **dummy or synthetic** patient data in demos only — never real patient-identifiable data.

### Interaction modes (humans & agents)

HealthTech Protocol is **one** stack (Arc Testnet + Circle Gateway x402). What changes is **who authorizes spend** and **who receives value**.

| Shorthand | Typical meaning here | How it maps in this repo |
|-----------|----------------------|----------------------------|
| **Human → human** | One person or org pays another. | Wallet-mediated flows in **Clinical Arc** (care and access requests); legacy demos in other routes. |
| **Human → agent** | A person approves payment; an orchestrator calls your HTTP APIs. | **`/nhs/*`** and shared hub routes; the **human still signs** with the browser wallet unless you delegate. |
| **Agent → human** | Automated action delivers something to a person. | Ops bot + AgentMail, notifications. |
| **Agent → agent** | Service-to-service backends or workers. | `402` + gateway settlement, API keys where allowed, `POST /api/*` from trusted workers. |

**Roles:** **Payer** (human wallet vs server treasury vs delegated agent), **beneficiary**, **channel** (browser vs server). Ambient agents can use [`CLAWHUB.md`](./CLAWHUB.md) and repo **[`.cursor/skills/clawhub/`](./.cursor/skills/clawhub/README.md)**.

---

## What this repo layers

| Layer | Role |
|--------|------|
| **Clinical Arc (`/` · `/nhs/*`)** | **Core product:** NHS-aligned hub and flows—wallet identity, GP access, care plans, social prescribing, neighbourhood teams, monitoring, transactions, HTTP pay notes, OWS, AgentMail, TIP-20. |
| **Backend (`server/`)** | Express API: **`/api/nhs/*`** care coordination, audit, and x402-gated service requests; live payment verification; proxies to paid third-party APIs. |
| **Integrations** | Optional rails: AgentMail, StablePhone, StableSocial, StableTravel, Laso cards, Suno, Parallel, OpenWeather, OpenAI gateway, Google Maps, Aviationstack, KicksDB, TIP‑20 factory, OpenAI explainer. |
| **Reference demos** | **`/dance-extras`**, battle, coaching, beats — flows that showcase paid HTTP patterns in another domain. |
| **Dedicated frontends** | Full-screen flows for wallet, network, receipts, recovery. |

---

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 8  
- **Payments:** **Circle Gateway** x402 (`@circle-fin/x402-batching`), **x402** stack (`@x402/core`, `@x402/fetch`, `@x402/evm`), **viem** + **Arc Testnet** (`arcTestnet`, chain id **5042002**)  
- **Backend:** Node.js, Express 5  
- **Docs:** [`HEALTHTECH_USE_CASES.md`](./HEALTHTECH_USE_CASES.md), [`docs/ARC_X402_NOTES.md`](./docs/ARC_X402_NOTES.md), [`docs/OPENAPI_DISCOVERY.md`](./docs/OPENAPI_DISCOVERY.md)  
- **Landing / Lovable handoff:** [`HEALTH_TECH_PROTOCOL_AZ.md`](./HEALTH_TECH_PROTOCOL_AZ.md)  
- **Agent / tribal knowledge:** [`CLAWHUB.md`](./CLAWHUB.md)  
- **LLM context bundle:** [`public/llm-full.txt`](./public/llm-full.txt) — **regenerate:** `npm run build:llm`  

### Local dev (Vite + API)

| Command | What runs |
|--------|------------|
| `npm run dev` | Vite only — **proxies `/api` → `http://localhost:8787`** |
| `npm run server` | Express API (default **port 8787**) |
| `npm run dev:full` | Both (recommended for live x402 flows) |

If the UI shows **`Cannot POST /api/...`**, restart the backend on **8787**. Quick checks: **`GET http://localhost:8787/openapi.json`** or **`GET http://localhost:8787/api/dance-extras/live`**.

---

## Arc Testnet (quick reference)

- **Chain ID:** `5042002` (`eip155:5042002`)  
- **Settlement:** Circle Gateway x402 + USDC-style nanopayments  
- **Faucet:** [faucet.circle.com](https://faucet.circle.com) (linked from the app)  
- **Explorer:** [testnet.arcscan.app](https://testnet.arcscan.app)  

---

## Routes (selected)

### NHS hub

| Path | Purpose |
|------|---------|
| `/` · `/nhs` | **NHS hub** |
| `/nhs/gp-access` | GP access requests |
| `/nhs/care-plans` | Care plans |
| `/nhs/social-prescribing` | Social prescribing |
| `/nhs/neighbourhood-teams` | Neighbourhood coordination |
| `/nhs/monitoring` | Remote monitoring |
| `/nhs/transactions` | Transaction history |
| `/nhs/http-pay` | **HTTP + Arc** curl / CLI notes (legacy **`/nhs/purl`** redirects to the same screen) |
| `/nhs/ows` | Open Wallet Standard |
| `/nhs/agentmail` | AgentMail |
| `/nhs/tip20` | TIP-20 token factory demo |

**API:** **`/api/nhs/*`** — **`GET /openapi.json`** for discovery.

### Reference demos

| Path | Purpose |
|------|---------|
| `/dance-extras` | Pattern demos; live **`POST /api/dance-extras/live/:flowKey/:network`** |
| `/battle`, `/coaching`, `/beats` | Legacy paid demos |
| `/card`, `/travel`, `/kicks`, `/music`, `/parallel`, `/weather`, `/openai` | Integration showcases |

---

## Quick start

```bash
git clone https://github.com/arunnadarasa/clinicalarc.git
cd clinicalarc
npm install
cp .env.example .env
# Edit .env: API keys, X402_SELLER_ADDRESS / seller, third-party URLs as needed.

npm run server    # Terminal 1 — API (default 8787)
npm run dev       # Terminal 2 — Vite (proxies /api)
```

Or: `npm run dev:full`

Open **http://localhost:5173/** (NHS hub) or **http://localhost:5173/nhs/gp-access**.

**Production build:** `npm run build` then `npm run preview` (API still needs `npm run server` or your host).

---

## Environment variables

Copy **`.env.example`** → **`.env`**. Never commit **`.env`**.

Typical groups: **OpenAI**, **Arc / x402** (`X402_SELLER_ADDRESS`, `ARC_TESTNET`, …), **AgentMail**, **integration base URLs** — see `.env.example`.

---

## Agents & LLM context

| Resource | Purpose |
|----------|---------|
| [`public/llm-full.txt`](./public/llm-full.txt) | Single-file bundle — **regenerate:** `npm run build:llm` |
| [`CLAWHUB.md`](./CLAWHUB.md) | Debugging notes |
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Copilot hints |

---

## Repository layout

```
├── src/              # React apps; routes in main.tsx + hubRoutes.ts
├── server/           # Express API (index.js, payments.js)
├── public/           # Static assets; llm-full.txt generated here
├── scripts/          # build-llm-full.mjs, …
├── docs/             # ARC_X402_NOTES, OPENAPI_DISCOVERY, OWS_NHS, …
├── .cursor/skills/clawhub/  # Cursor skill
├── HEALTHTECH_USE_CASES.md
├── CLAWHUB.md
└── vite.config.ts    # dev proxy: /api → http://localhost:8787
```

---

## Security & operations

- Keep **secrets in `.env`** only.  
- **Live mainnet** flows spend real assets — test on **testnet** first.  
- Transaction hashes can be recorded locally; use **[testnet.arcscan.app](https://testnet.arcscan.app)** for Arc Testnet.

---

## Contributing

1. Fork **`https://github.com/arunnadarasa/clinicalarc`**  
2. Configure `.env` for the use cases you need  
3. Extend `server/index.js` or add `src/*App.tsx` + route in `src/main.tsx` and **`src/hubRoutes.ts`**  
4. After doc edits that feed **`llm-full.txt`**, run **`npm run build:llm`** before committing  

---

## License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE).

---

**HealthTech Protocol** · **Clinical Arc** — *Arc Testnet + Circle Gateway x402 for health use cases.*
