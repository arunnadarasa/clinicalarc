import { useState } from 'react'
import NhsShell from './NhsShell'
import { DocCodeBlock } from './components/DocCodeBlock'
import { AGENTMAIL_DEMO_INBOX_ID } from './agentmailDemo'
import { apiPost } from './nhsApi'
import type { NhsNetwork, NhsPaymentMode, NhsRole } from './nhsSession'

function AgentMailPanel({
  role,
  wallet,
  network,
  paymentMode,
}: {
  role: NhsRole
  wallet: string
  network: NhsNetwork
  paymentMode: NhsPaymentMode
}) {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('Clinical Arc — AgentMail test')
  const [text, setText] = useState('Hello from the NHS hackathon shell.')
  const [inboxId, setInboxId] = useState(AGENTMAIL_DEMO_INBOX_ID)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!wallet) {
      setStatus('Connect a wallet first.')
      return
    }
    if (!to.trim() || !subject.trim()) {
      setStatus('Fill in To and Subject.')
      return
    }
    setLoading(true)
    setStatus('Sending…')
    const res = await apiPost<Record<string, unknown>>(
      '/api/ops/agentmail/send',
      role,
      wallet,
      {
        to: to.trim(),
        subject: subject.trim(),
        text: text.trim(),
        inbox_id: inboxId.trim(),
      },
      { network, paymentMode },
    )
    setLoading(false)
    if (!res.ok) {
      setStatus(`Send failed: ${res.error}`)
      return
    }
    setStatus('Sent. Check server logs / inbox if upstream returned 201.')
  }

  const createInbox = async () => {
    if (!wallet) {
      setStatus('Connect a wallet first.')
      return
    }
    setLoading(true)
    setStatus('Creating inbox (may prompt for wallet payment)…')
    const res = await apiPost<Record<string, unknown>>(
      '/api/ops/agentmail/inbox/create',
      role,
      wallet,
      {},
      { network, paymentMode },
    )
    setLoading(false)
    if (!res.ok) {
      setStatus(`Inbox create failed: ${res.error}`)
      return
    }
    setStatus('Inbox create returned OK. Inspect response in devtools or server logs.')
  }

  return (
    <>
      <article className="card">
        <h2>Send email (wallet-paid path)</h2>
        {network === 'mainnet' ? (
          <div className="callout callout--caution">
            <strong>Mainnet label</strong>
            Sends may use real funds. For sandboxes, switch the header network to <strong>Arc testnet</strong> and use{' '}
            <strong>Get testnet funds</strong>.
          </div>
        ) : null}
        {paymentMode === 'x402' ? (
          <div className="callout callout--info">
            <strong>If MetaMask says “likely to fail” or fee is unavailable</strong>
            <ul>
              <li>
                The payment step needs enough <strong>USDC on Arc Testnet</strong> for the flow — use the Circle faucet
                linked from the header.
              </li>
              <li>
                Your wallet must match the <strong>Arc Testnet</strong> chain selected in the shell.
              </li>
              <li>
                If the server has <code>AGENTMAIL_API_KEY</code>, the backend may charge server-side first — same balance
                rules can still apply for wallet-paid fallbacks.
              </li>
            </ul>
          </div>
        ) : (
          <p className="note">
            <strong>Direct fetch</strong> mode skips browser x402; the server may still need AgentMail keys or upstream may
            return <code>402</code>. Prefer <strong>x402 wallet pay</strong> for the full wallet flow.
          </p>
        )}
        <p>
          This app calls <code>POST /api/ops/agentmail/send</code> on the Clinical Arc API. With <code>AGENTMAIL_API_KEY</code>{' '}
          on the server, the backend can send via AgentMail’s Bearer API. Without a key, the proxy may forward upstream and
          your wallet must satisfy any <code>402</code> challenge.
        </p>
        <p className="note">
          Always pass <code>inbox_id</code> (demo default below). See <code>CLAWHUB.md</code> for inbox scope pitfalls.
        </p>
        <div className="actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To (email)" />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Plain text body" />
          <input value={inboxId} onChange={(e) => setInboxId(e.target.value)} placeholder="inbox_id" />
          <button type="button" disabled={loading || !wallet} onClick={send}>
            {loading ? 'Working…' : 'Send via AgentMail'}
          </button>
        </div>
        {status ? <p className="intent">{status}</p> : null}
      </article>

      <article className="card">
        <h2>Create inbox (optional)</h2>
        <p>
          <code>POST /api/ops/agentmail/inbox/create</code> proxies to AgentMail; may return <code>402</code> for a
          wallet-paid inbox. Use x402 mode and confirm the payment in your wallet.
        </p>
        <div className="actions">
          <button type="button" className="secondary" disabled={loading || !wallet} onClick={createInbox}>
            Create inbox
          </button>
        </div>
      </article>
    </>
  )
}

export default function NhsAgentMailApp() {
  return (
    <NhsShell
      title="AgentMail — NHS hackathon integration"
      subtitle="Email for agents: send through this API with wallet x402 on Arc, or configure server-side AgentMail keys."
    >
      {(session) => (
        <section className="grid">
          <article className="card">
            <h2>What is AgentMail?</h2>
            <p>
              <strong>AgentMail</strong> provides programmable inboxes and outbound mail for automation. This repo exposes
              wallet-paid and API-key paths so demos can charge via x402 then deliver email reliably.
            </p>
            <ul className="log">
              <li>
                Docs:{' '}
                <a href="https://docs.agentmail.to/llms-full.txt" target="_blank" rel="noreferrer">
                  docs.agentmail.to
                </a>
              </li>
            </ul>
          </article>
          <AgentMailPanel
            role={session.role}
            wallet={session.wallet}
            network={session.network}
            paymentMode={session.paymentMode}
          />
          <article className="card">
            <h2>curl sketch</h2>
            <p>After you solve payment (or use API key on server), POST JSON like:</p>
            <DocCodeBlock
              label="bash"
              code={`curl -sS -X POST "$API/api/ops/agentmail/send" \\
  -H "Content-Type: application/json" \\
  -d '{"to":"you@example.com","subject":"Hi","text":"...","inbox_id":"${AGENTMAIL_DEMO_INBOX_ID}"}'`}
            />
          </article>
        </section>
      )}
    </NhsShell>
  )
}
