import NhsShell from './NhsShell'
import { DocCodeBlock } from './components/DocCodeBlock'
import { LOCAL_API, buildCurlJudgeWire } from './danceExtrasJudgeWire'

const healthCheck = `curl -s "${LOCAL_API}/api/health"`

const judgeTestnet = buildCurlJudgeWire('testnet')

const judgeMainnet = buildCurlJudgeWire('mainnet')

export default function NhsArcCliApp() {
  return (
    <NhsShell
      title="HTTP + Arc Testnet (CLI)"
      subtitle="Copy-paste curl examples for the local API. Paid routes return HTTP 402 until a browser wallet completes Circle Gateway x402 authorization (see the in-app flows)."
    >
      {() => (
        <section className="grid">
          <article className="card">
            <h2>Arc Testnet</h2>
            <p>
              Chain ID <strong>5042002</strong>, USDC-style settlement via{' '}
              <a href="https://developers.circle.com/gateway/nanopayments" target="_blank" rel="noreferrer">
                Circle Gateway
              </a>
              . Fund a wallet with the{' '}
              <a href="https://faucet.circle.com" target="_blank" rel="noreferrer">
                Circle faucet
              </a>{' '}
              before running paid routes from the browser UI.
            </p>
            <p className="note">
              Explorer:{' '}
              <a href="https://testnet.arcscan.app" target="_blank" rel="noreferrer">
                testnet.arcscan.app
              </a>
              .
            </p>
          </article>

          <article className="card">
            <h2>Smoke the API</h2>
            <p>With <code>npm run server</code> (or <code>npm run dev:full</code>) running:</p>
            <DocCodeBlock label="bash" code={healthCheck} />
          </article>

          <article className="card">
            <h2>Dance extras (judge score) — unauthenticated curl</h2>
            <p>
              These calls hit the live demo route without wallet signing. Expect <strong>402 Payment Required</strong> for
              writes; use the <strong>/dance-extras</strong> UI &quot;Try in browser&quot; panel to pay with x402.
            </p>
            <h3 style={{ marginTop: '0.85rem', fontSize: '1.05rem' }}>Testnet path</h3>
            <DocCodeBlock label="bash" code={judgeTestnet} />
            <h3 style={{ marginTop: '0.85rem', fontSize: '1.05rem' }}>Mainnet path (demo label)</h3>
            <DocCodeBlock label="bash" code={judgeMainnet} />
          </article>

          <article className="card">
            <h2>NHS gated routes</h2>
            <p>
              POST bodies for <code>/api/nhs/*</code> flows include role and wallet headers from the shell. Use the feature
              screens under <code>/nhs/*</code> so the browser can complete x402 when the gate is enabled.
            </p>
          </article>
        </section>
      )}
    </NhsShell>
  )
}
