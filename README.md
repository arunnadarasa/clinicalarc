# HealthTech Protocol · Clinical Tempo

**Clinical Tempo** is the **core app** in this repository: an **NHS-aligned neighbourhood health** experience—**wallet-linked identity**, **GP access requests**, **care plans**, **social prescribing** (referrals and link-worker plans), **neighbourhood team coordination**, **remote monitoring** with proactive alerts, **transaction history**, and **Tempo / MPP** payment gates on selected service writes—plus **Stripe purl**, **Open Wallet Standard (OWS)**, **AgentMail**, and **TIP-20** flows. The **NHS hub** is at **`/`** and **`/nhs`**; feature screens live under **`/nhs/*`**.

**HealthTech Protocol** is the open **pattern stack** that powers it: verifiable payments, session metering, care pathways, remote monitoring, and AI-assisted workflows—**settled on [Tempo](https://tempo.xyz)** and **authorized via MPP / x402** so patients, clinicians, care teams, and agents can pay for APIs and services with predictable receipts. The repo also includes **reference demos** (legacy event-style flows such as **`/dance-extras`**, battle, coaching, beats) that exercise the same rails in another domain.

This is a **reference implementation**: React (Vite) front ends, a Node/Express API, and production-style persistence for NHS flows. **Treat [`HEALTHTECH_USE_CASES.md`](./HEALTHTECH_USE_CASES.md) as the behavioral contract** for routes, endpoints, and testing.

**This repository is [arunnadarasa/clinicaltempo](https://github.com/arunnadarasa/clinicaltempo)** — use it for **`git clone`**, **`git pull`**, and **`git push`**. **NHS / hackathon notes:** [`OPENCLAW_CLINICAL_HACKATHON_LEARNINGS.md`](./OPENCLAW_CLINICAL_HACKATHON_LEARNINGS.md). **Data safety:** use **dummy or synthetic** patient data in demos only — never real patient-identifiable data.

### Interaction modes (humans & agents)—one protocol, not four

HealthTech Protocol is **one** stack (Tempo settlement + MPP/x402 authorization). What changes is **who authorizes spend** and **who receives value**—often described informally as human↔human, human↔agent, or agent↔agent flows. Those labels are **use-case shorthand**, not separate protocols.

| Shorthand | Typical meaning here | How it maps in this repo |
|-----------|----------------------|----------------------------|
| **Human → human** | One person or org pays another (fees, passes, reimbursements, entry). | Wallet-mediated flows in **Clinical Tempo** (care and access requests); legacy routes also include battle / fan / clip **demos** in another domain. |
| **Human → agent** | A person approves payment; an **orchestrator** (UI wizard, MCP tool, script) calls your HTTP APIs. | **`/nhs/*`** and shared hub routes; the **human still signs** with the browser wallet unless you delegate. |
| **Agent → human** | Automated action delivers something to a person (email, alert, receipt, pass). | Ops bot + AgentMail, notifications; fulfillment after payment—not a second payment “protocol.” |
| **Agent → agent** | Service-to-service: backends, cron, or **machine payments** between APIs. | `402` + `mppx` on the server, **API keys** where allowed (e.g. AgentMail after MPP), webhooks, `POST /api/*` from trusted workers. |

**Roles (mental model):** **Payer** (human wallet vs server treasury vs delegated agent), **beneficiary** (human vs org vs system), **channel** (browser vs server). Ambient agents (e.g. coding assistants) consume **skills** like [`CLAWHUB.md`](./CLAWHUB.md), the **[ClawHub](https://clawhub.ai/)** skill for **Clinical Tempo** (search **clinicaltempo**), and repo **[`.cursor/skills/clawhub/`](./.cursor/skills/clawhub/README.md)**; runtime agents should call the **same** Express contracts with explicit trust boundaries.

---

## What this repo layers

| Layer | Role |
|--------|------|
| **Clinical Tempo (`/` · `/nhs/*`)** | **Core product:** NHS-aligned hub and flows—wallet identity, GP access, care plans, social prescribing, neighbourhood teams, monitoring, transactions, purl, OWS, AgentMail, TIP-20. |
| **Backend (`server/`)** | Express API: **`/api/nhs/*`** care coordination, audit, and Tempo-gated service requests; MPP intents; live payment verification; proxies to paid third-party APIs. |
| **Integrations** | Optional rails: AgentMail, StablePhone, StableSocial, StableTravel, Laso cards, Suno, Parallel, OpenWeather, OpenAI MPP (`/openai`), Google Maps, Aviationstack, KicksDB, TIP‑20 factory, OpenAI explainer. |
| **Reference demos** | **`/dance-extras`**, battle, coaching, beats, judges—**10+** flows that showcase the same protocol in a different domain (API previews + live MPP). |
| **Dedicated frontends** | Full-screen flows for **live Tempo testnet/mainnet** and complex UX (wallet, network, receipts, recovery). |

---

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 8  
- **Payments:** `mppx` (client + server), **viem** + **Tempo** chain actions (`viem/tempo`, `viem/chains`)  
- **Backend:** Node.js, Express 5  
- **Docs in repo:** [`HEALTHTECH_USE_CASES.md`](./HEALTHTECH_USE_CASES.md) — flows, endpoints, testing notes  
- **Landing / Lovable handoff:** [`HEALTH_TECH_PROTOCOL_AZ.md`](./HEALTH_TECH_PROTOCOL_AZ.md) — A–Z narrative + GitHub links for marketing sites  
- **Stripe `purl` CLI:** routes **`/purl`** and **`/nhs/purl`** — copy-paste `curl` + `purl` for **testnet + mainnet**; long-form [`docs/PURL_CLINICAL_TEMPO.md`](./docs/PURL_CLINICAL_TEMPO.md) · NHS-focused [`docs/PURL_NHS.md`](./docs/PURL_NHS.md)  
- **EVVM:** optional **`npm run evvm:vendor`** (full upstream clone + `./evvm install`); Solidity library: **`npm install @evvm/testnet-contracts`** when you need imports; route **`/evvm`** — deploy on **Tempo testnet only**; long-form [`docs/EVVM_TEMPO.md`](./docs/EVVM_TEMPO.md) (skip global registry until EVVM lists Tempo)  
- **Tempo Wallet CLI (official):** route **`/tempo-wallet`** — in-app showcase + copy-paste for [`tempoxyz/wallet`](https://github.com/tempoxyz/wallet); verification log [`docs/TEMPO_WALLET_TEST.md`](./docs/TEMPO_WALLET_TEST.md)  
- **Agent / tribal knowledge:** [`CLAWHUB.md`](./CLAWHUB.md) — successes, failures, debugging checklists  
- **MPPScan / AgentCash discovery:** **`GET /openapi.json`** — OpenAPI 3.1 for agents; validate with **`npm run discovery`** (requires **`npm run server`**). Long-form [`docs/MPPSCAN_DISCOVERY.md`](./docs/MPPSCAN_DISCOVERY.md)  
- **LLM context bundle (single file):** [`public/llm-full.txt`](./public/llm-full.txt) — concatenated README + use cases + ClawHub + protocol docs; **regenerate** with `npm run build:llm`. **Download** from the running app at **`/llm-full.txt`** (hub button: “Download LLM context bundle”) or from GitHub raw after push.
- **GitHub Copilot:** [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) — short project hints. **Published ClawHub skill:** **[clawhub.ai/arunnadarasa/clinicaltempo](https://clawhub.ai/arunnadarasa/clinicaltempo)** — **[ClawHub](https://clawhub.ai/)** versioned skill dock; mirrors repo **`.cursor/skills/clawhub/`** with the same **package rigor** as [self-improving-agent](https://clawhub.ai/pskoett/self-improving-agent): **`SKILL.md`**, **`references/`** (incl. **`openclaw-integration.md`**, **`hooks-setup.md`**), **`assets/`** (templates, optional **`learnings/`** stubs), **`scripts/`** (`verify-clinical-tempo-context.sh`, **`activator.sh`**, **`error-detector.sh`**, **`extract-skill.sh`**), optional **`hooks/openclaw/`** (**`clinicaltempo-clawhub`**), **`_meta.sample.json`**. Install: `npx clawhub@latest install arunnadarasa/clinicaltempo` (or site UI). Zip the folder to publish updates. **OpenClaw (optional):** `openclaw plugins install @anyway-sh/anyway-openclaw` — pair with the skill + **`references/openclaw-clinical-tempo.md`**.

### Local dev (Vite + API)

| Command | What runs |
|--------|------------|
| `npm run dev` | Vite only — **proxies `/api` → `http://localhost:8787`** |
| `npm run server` | Express API (default **port 8787**) |
| `npm run dev:full` | Both (recommended for live MPP flows) |

If the UI shows **`Cannot POST /api/...`** (HTML 404), the backend on **8787** is missing that route (often an **old** `node server/index.js` still running). **Restart** `npm run server`. Quick checks: **`GET http://localhost:8787/openapi.json`** (OpenAPI) or **`GET http://localhost:8787/api/dance-extras/live`** (legacy demo JSON with `flowKeys`).

---

## Tempo & MPP (quick reference)

- **Tempo testnet (Moderato):** chain ID `42431` — typical fee/path asset: **pathUSD**  
- **Tempo mainnet:** chain ID `4217` — common fee token: **USDC** (e.g. bridged USDC.e where configured)  
- **MPP (Machine Payments Protocol):** server creates/verifies intents; browser can pay via injected wallet (`MetaMask` / Tempo wallet) using `MppxClient` + `tempoClient`.  
- **x402:** some third-party APIs return `402` + `WWW-Authenticate`; the app forwards challenges so `mppx` can pay and retry.

### MPP service directory (`mpp.dev`)

The **[Machine Payments Protocol service catalog](https://mpp.dev/services)** lists hosted integrations (base URLs, `POST` paths, and per-call pricing). Use it when adding new rails or checking upstream contracts. Agent-oriented discovery is often linked from that site as **`llms.txt`**.

**How this repo maps to the catalog**

| Catalog idea | In Clinical Tempo |
|--------------|----------------|
| Wallet pays via **402 → `mppx`** on **Tempo mainnet** | Same pattern on `/music` (Suno), `/travel`, `/kicks`, `/card`, etc.; NHS **payment-gated** routes under **`/api/nhs/*`** follow the same server MPP verification pattern where applicable. |
| **AgentMail** has two entry points | **`AGENTMAIL_BASE_URL`** (`https://api.agentmail.to`) for Bearer/API-key flows; **`AGENTMAIL_MPP_BASE_URL`** (`https://mpp.api.agentmail.to`) for wallet-paid MPP passthrough — both are named in `.env.example` and match [AgentMail on MPP](https://mpp.dev/services#agentmail). |
| **Suno** at `suno.mpp.paywithlocus.com` | **`SUNO_BASE_URL`** + `/suno/generate-music` — no vendor “Suno API key” in the UI; payment is MPP headers from the wallet. |
| **Parallel** at `parallelmpp.dev` | **`PARALLEL_BASE_URL`** — `/parallel` proxies search / extract / task (+ task poll). |
| **OpenWeather** at `weather.mpp.paywithlocus.com` | **`OPENWEATHER_BASE_URL`** — `/weather` uses wallet MPP; optional **`OPENWEATHER_API_KEY`** for server `appid`. |
| **OpenAI** at `openai.mpp.tempo.xyz` | **`OPENAI_MPP_BASE_URL`** — `/openai` proxies chat, images, speech & transcription (see `POST /api/openai/*`). |

---

## Routes

### Clinical Tempo (core NHS app)

| Path | Purpose |
|------|---------|
| `/` · `/nhs` | **NHS hub** — wallet identity, patient bootstrap, directory to all **`/nhs/*`** flows |
| `/nhs/gp-access` | Same-day **GP access** request workflow |
| `/nhs/care-plans` | **Care plans** — create and update personalised plans |
| `/nhs/social-prescribing` | **Social prescribing** — referral + link-worker plan |
| `/nhs/neighbourhood-teams` | **Neighbourhood (MDT) coordination** |
| `/nhs/monitoring` | **Remote monitoring** — readings + proactive alerts |
| `/nhs/transactions` | **Transaction history** (Tempo) |
| `/nhs/purl` | **Stripe [purl](https://www.purl.dev/)** — free / paid CLI demos against Tempo MPP |
| `/nhs/ows` | **Open Wallet Standard** — install **`ows`** ([installer](https://docs.openwallet.sh/install.sh)); see **`docs/OWS_NHS.md`** |
| `/nhs/agentmail` | **AgentMail** — MPP send + inbox patterns |
| `/nhs/tip20` | **TIP-20** — on-chain factory (testnet + mainnet) |

**API:** **`/api/nhs/*`** — identity bootstrap, GP access, care plans, social prescribing, neighbourhood coordination, monitoring, alerts, patient timeline, audit. **Discovery:** **`GET /openapi.json`**.

### Reference demos & integration showcases

| Path | Purpose |
|------|---------|
| `/battle` | Battle entry + auto payout (live testnet/mainnet) |
| `/coaching` | Coaching minutes marketplace (live payments) |
| `/beats` | Beat API licensing (live payments) |
| `/dance-extras` | HealthTech-pattern demos (judge, cypher, clips, reputation, studio AI, bot, fan pass); **simulate** mock APIs or **Live Tempo MPP** via `POST /api/dance-extras/live/:flowKey/:network` |
| `/card` | Virtual debit card (Laso / MPP + demo fallback) |
| `/travel` | StableTravel, Aviationstack, Google Maps |
| `/email` | AgentMail ops (wallet-paid relay + send) |
| `/ops` | AgentMail + StablePhone console |
| `/social` | StableSocial |
| `/music` | Suno |
| `/parallel` | Parallel search / extract / task (MPP) |
| `/weather` | OpenWeather current conditions (MPP) |
| `/openai` | OpenAI chat completions (MPP gateway) |
| `/kicks` | KicksDB (live MPP + simulate) |
| `/tip20` | TIP‑20 token launch & post-launch ops (non-NHS entry) |
| `/tempo-wallet` | Showcase: [Tempo Wallet CLI](https://github.com/tempoxyz/wallet) (MPP + `tempo request`; pairs with `/dance-extras` live routes) |
| `/purl` | Showcase: [Stripe purl](https://github.com/stripe/purl) — `curl` + `purl --dry-run` / live pay for **testnet + mainnet** live MPP URLs |
| `/evvm` | [EVVM](https://www.evvm.info/) — `evvm:vendor` + deploy on **Tempo testnet (42431)**; optional `npm i @evvm/testnet-contracts` for Solidity; registry step deferred |

---

## Core HealthTech capabilities

**Clinical Tempo (NHS)** — implemented in **`/api/nhs/*`** and the **`/nhs/*`** apps:

- **Identity** — wallet-linked bootstrap and role-aware actions (`patient`, `gp`, `nhc_provider` where configured).  
- **Access & care** — GP access requests; care plan CRUD and updates; social prescribing referrals and link-worker plans.  
- **Neighbourhood** — team coordination events.  
- **Monitoring** — sessions, readings, proactive alerts, and resolution paths.  
- **Payments & audit** — Tempo payment gates on gated service requests; **audit** and **patient timeline** surfaces for traceability.  
- **Wallet ecosystem** — purl, OWS, AgentMail, TIP-20 from the NHS section of the app.

**Reference demos** (`/dance-extras`, battle, coaching, beats — same protocol, different domain) remain documented end-to-end for the paid-API patterns they illustrate:

1. **Battle entry + auto payout** — intents, results, payout execution  
2. **Judge score submission** — paid write API pattern  
3. **Cypher micropot** — session-style sponsorship  
4. **Coaching minutes** — start / tick usage / end + receipt  
5. **Beat licensing** — intent, grant access, recovery helpers  
6. **Clip marketplace** — listing + purchase scaffold  
7. **Fan reputation attestations**  
8. **Studio AI usage billing**  
9. **Tournament ops bot** — actions + AgentMail / phone / travel hooks  
10. **Fan membership battle pass**  

Full step-by-step and endpoint list: **[`HEALTHTECH_USE_CASES.md`](./HEALTHTECH_USE_CASES.md)**.

---

## Quick start

```bash
git clone https://github.com/arunnadarasa/clinicaltempo.git
cd clinicaltempo
npm install
cp .env.example .env
# Edit .env: API keys, MPP_RECIPIENT, Tempo flags, third-party URLs as needed.

# Terminal 1 — API (default port 8787)
npm run server

# Terminal 2 — Vite dev server (proxies /api → backend)
npm run dev
```

Or one command:

```bash
npm run dev:full
```

Open **http://localhost:5173/** (NHS hub) or **http://localhost:5173/nhs/gp-access** and other **`/nhs/*`** paths. Reference demos: e.g. **http://localhost:5173/dance-extras**.

**Production build:**

```bash
npm run build
npm run preview   # optional static preview; API still needs `npm run server` or your host
```

---

## Environment variables

Copy **`.env.example`** → **`.env`**. Never commit **`.env`** (it is gitignored).

Typical groups:

- **OpenAI** — `OPENAI_API_KEY` (optional; hub explainer + optional Bearer on MPP proxy), `OPENAI_MPP_BASE_URL` (default `https://openai.mpp.tempo.xyz`), `OPENAI_MODEL` (hub explainer default)  
- **MPP / Tempo** — `MPP_RECIPIENT`, `TMPO_TESTNET`, `PAYMENT_MODE`, etc.  
- **AgentMail** — `AGENTMAIL_API_KEY` (optional), `AGENTMAIL_BASE_URL` (direct API), **`AGENTMAIL_MPP_BASE_URL`** (wallet-paid host; default matches [mpp.dev#agentmail](https://mpp.dev/services#agentmail)), `AGENTMAIL_INBOX_ID`, `AGENTMAIL_SEND_FEE`  
- **Integrations** — KicksDB, StablePhone, StableSocial, Laso, Suno (`SUNO_BASE_URL`), Parallel (`PARALLEL_BASE_URL`), OpenWeather (`OPENWEATHER_BASE_URL`, optional `OPENWEATHER_API_KEY`), OpenAI MPP (`OPENAI_MPP_BASE_URL`), maps, aviation, etc.  

See `.env.example` for the full list and placeholders.

---

## Agents & LLM context

| Resource | Purpose |
|----------|---------|
| [`public/llm-full.txt`](./public/llm-full.txt) | Single-file bundle (README + use cases + ClawHub + protocol + purl/wallet/EVVM/MPPScan docs). **Regenerate:** `npm run build:llm` |
| [`CLAWHUB.md`](./CLAWHUB.md) | Tribal debugging — what worked / failed |
| [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Hints for GitHub Copilot |
| **ClawHub skill** | Bundled as **`.cursor/skills/clawhub/`** — install from [ClawHub](https://clawhub.ai/) (search **clinicaltempo**); manifest: **[`.cursor/skills/clawhub/README.md`](./.cursor/skills/clawhub/README.md)** |
| **OpenClaw Anyway plugin (optional)** | `openclaw plugins install @anyway-sh/anyway-openclaw` — extra runtime tools; pair with the skill · **`.cursor/skills/clawhub/references/openclaw-clinical-tempo.md`** |
| EVVM upstream | [`https://www.evvm.info/llms-full.txt`](https://www.evvm.info/llms-full.txt) (not vendored; attach when doing deep EVVM work) |
| **MPPScan discovery** | **`GET /openapi.json`** on the API (OpenAPI 3.1 + `x-payment-info` for live MPP routes). Validate: **`npm run discovery`** (server on **8787**). Guide: [`docs/MPPSCAN_DISCOVERY.md`](./docs/MPPSCAN_DISCOVERY.md) · [mppscan.com/discovery](https://www.mppscan.com/discovery) |
| **Ecosystem synergy** | [docs/ECOSYSTEM_SYNERGY.md](./docs/ECOSYSTEM_SYNERGY.md) — MPP + Tempo vs **mpp-nanogpt-modal**; nanoGPT / nanochat / autoresearch vs Clinical Tempo; OpenClaw skill + plugins |

---

## Repository layout

```
├── src/              # React apps (App + route-specific *App.tsx); routes in main.tsx + hubRoutes.ts
├── server/           # Express API (index.js, payments.js)
├── public/           # Static assets; llm-full.txt generated here
├── scripts/          # build-llm-full.mjs, install-evvm.mjs
├── docs/             # PURL, wallet, EVVM, MPPScan, ECOSYSTEM_SYNERGY, …
├── .cursor/skills/clawhub/  # ClawHub / Cursor skill (hooks, references, assets)
├── .github/          # copilot-instructions.md
├── HEALTHTECH_USE_CASES.md
├── HEALTH_TECH_PROTOCOL_AZ.md  # A–Z protocol copy for landing pages (e.g. Lovable)
├── CLAWHUB.md        # Learning notes, failures, debugging playbooks
├── OPENCLAW_CLINICAL_HACKATHON_LEARNINGS.md  # Hackathon / OpenClaw participant notes
├── LOVABLE_HANDOFF.md
└── vite.config.ts    # dev proxy: /api → http://localhost:8787
```

---

## Security & operations

- Keep **secrets in `.env`** only; rotate keys if exposed.  
- **Live mainnet** flows spend real assets — test on **testnet** first.  
- Transaction hashes can be recorded locally (see hub + dedicated pages) for audit; explorers: [Tempo mainnet](https://explore.tempo.xyz), [testnet](https://explore.testnet.tempo.xyz).  

---

## Contributing / fork

1. Fork or clone **`https://github.com/arunnadarasa/clinicaltempo.git`**  
2. Configure `.env` for the use cases you need  
3. Extend `server/index.js` or add a new `src/*App.tsx` + route in `src/main.tsx` and **`src/hubRoutes.ts`** (hub directory)  
4. After editing docs that feed **`llm-full.txt`**, run **`npm run build:llm`** before committing  

---

## License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE).

---

**HealthTech Protocol** · **Clinical Tempo** — *Tempo + MPP for health: one reference stack.*
