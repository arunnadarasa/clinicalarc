import { useMemo, useState, type ReactNode } from 'react'
import {
  getStoredNetwork,
  getStoredPaymentMode,
  getStoredRole,
  getStoredWallet,
  setStoredNetwork,
  setStoredPaymentMode,
  setStoredRole,
  setStoredWallet,
  type NhsNetwork,
  type NhsPaymentMode,
  type NhsRole,
} from './nhsSession'

function navLinkClass(href: string, pathname: string) {
  const active = pathname === href
  return `secondary button-like${active ? ' nav-link--active' : ''}`
}

const PATH_CONTEXT: Record<string, string> = {
  '/': 'Hub',
  '/nhs': 'Hub',
  '/nhs/gp-access': 'GP access',
  '/nhs/care-plans': 'Care plans',
  '/nhs/social-prescribing': 'Social prescribing',
  '/nhs/neighbourhood-teams': 'Neighbourhood teams',
  '/nhs/monitoring': 'Monitoring',
  '/nhs/transactions': 'Transactions',
  '/nhs/purl': 'purl',
  '/nhs/ows': 'OWS',
  '/nhs/agentmail': 'AgentMail',
  '/nhs/tip20': 'TIP-20',
}

function whereYouAre(pathname: string): string {
  return PATH_CONTEXT[pathname] ?? 'Clinical Tempo'
}

type Props = {
  title: string
  subtitle: string
  children: (session: { role: NhsRole; wallet: string; network: NhsNetwork; paymentMode: NhsPaymentMode }) => ReactNode
}

function isRole(value: string): value is NhsRole {
  return value === 'patient' || value === 'gp' || value === 'nhc_provider'
}

export default function NhsShell({ title, subtitle, children }: Props) {
  const [role, setRole] = useState<NhsRole>(getStoredRole())
  const [wallet, setWallet] = useState<string>(getStoredWallet())
  const [network, setNetwork] = useState<NhsNetwork>(getStoredNetwork())
  const [paymentMode, setPaymentMode] = useState<NhsPaymentMode>(getStoredPaymentMode())
  const [err, setErr] = useState('')
  const [faucetStatus, setFaucetStatus] = useState('')
  const [faucetLoading, setFaucetLoading] = useState(false)

  const session = useMemo(() => ({ role, wallet, network, paymentMode }), [role, wallet, network, paymentMode])
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  const connectWallet = async () => {
    setErr('')
    const provider = (window as Window & { ethereum?: { request: (args: { method: string }) => Promise<unknown> } }).ethereum
    if (!provider) {
      setErr('Wallet provider not found.')
      return
    }
    try {
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[]
      const selected = accounts?.[0]
      if (!selected) {
        setErr('No wallet account returned.')
        return
      }
      setWallet(selected)
      setStoredWallet(selected)
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Wallet connection failed.')
    }
  }

  const requestTestnetFunds = async () => {
    if (!wallet) {
      setFaucetStatus('Connect a wallet first.')
      return
    }
    if (network !== 'testnet') {
      setFaucetStatus('Faucet is testnet-only. Switch network to tempo testnet.')
      return
    }
    setFaucetLoading(true)
    setFaucetStatus('Requesting testnet funds...')
    try {
      const response = await fetch('/api/tempo/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: wallet }),
      })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (!response.ok) {
        setFaucetStatus(`Faucet failed: ${payload?.error || 'request failed'}`)
        return
      }
      setFaucetStatus('Funds requested. Confirm balance in your wallet in a few moments.')
    } catch (error) {
      setFaucetStatus(error instanceof Error ? `Faucet failed: ${error.message}` : 'Faucet request failed.')
    } finally {
      setFaucetLoading(false)
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-heading">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="hero-appbar">
          <p className="hero-context" aria-live="polite">
            <span className="hero-context__label">Where you are</span>
            <span className="hero-context__value">{whereYouAre(pathname)}</span>
          </p>

          <div className="actions hero-toolbar">
            <select
              value={role}
              onChange={(event) => {
                const next = event.target.value
                if (!isRole(next)) return
                setRole(next)
                setStoredRole(next)
              }}
            >
              <option value="patient">patient</option>
              <option value="gp">gp</option>
              <option value="nhc_provider">nhc_provider</option>
            </select>
            <select
              value={network}
              onChange={(event) => {
                const next = event.target.value === 'mainnet' ? 'mainnet' : 'testnet'
                setNetwork(next)
                setStoredNetwork(next)
              }}
            >
              <option value="testnet">tempo testnet</option>
              <option value="mainnet">tempo mainnet</option>
            </select>
            <select
              value={paymentMode}
              onChange={(event) => {
                const next = event.target.value === 'mpp' ? 'mpp' : 'direct'
                setPaymentMode(next)
                setStoredPaymentMode(next)
              }}
            >
              <option value="direct">direct fetch</option>
              <option value="mpp">mpp wallet pay</option>
            </select>
            <button onClick={connectWallet}>{wallet ? `Wallet ${wallet.slice(0, 10)}...` : 'Connect Wallet'}</button>
            <button
              className="secondary"
              disabled={!wallet || network !== 'testnet' || faucetLoading}
              onClick={requestTestnetFunds}
              title={network === 'testnet' ? 'Request tempo testnet funds' : 'Switch to testnet for faucet'}
            >
              {faucetLoading ? 'Requesting faucet...' : 'Get testnet funds'}
            </button>
            <a className="secondary button-like" href="/nhs">
              Hub
            </a>
            <a className="secondary button-like" href="/nhs/gp-access">
              GP access
            </a>
          </div>

          <nav className="hero-nav" aria-label="Clinical Tempo sections">
            <div className="hero-nav__group hero-nav__group--nhs">
              <span className="hero-nav__label">NHS care</span>
              <div className="hero-nav__links">
                <a className={navLinkClass('/nhs/care-plans', pathname)} href="/nhs/care-plans">
                  Care plans
                </a>
                <a className={navLinkClass('/nhs/social-prescribing', pathname)} href="/nhs/social-prescribing">
                  Social prescribing
                </a>
                <a className={navLinkClass('/nhs/neighbourhood-teams', pathname)} href="/nhs/neighbourhood-teams">
                  Neighbourhood teams
                </a>
                <a className={navLinkClass('/nhs/monitoring', pathname)} href="/nhs/monitoring">
                  Monitoring
                </a>
                <a className={navLinkClass('/nhs/transactions', pathname)} href="/nhs/transactions">
                  Transactions
                </a>
              </div>
            </div>
            <div className="hero-nav__group hero-nav__group--wallet">
              <span className="hero-nav__label">Wallet &amp; CLI</span>
              <div className="hero-nav__links">
                <a className={navLinkClass('/nhs/purl', pathname)} href="/nhs/purl">
                  purl
                </a>
                <a className={navLinkClass('/nhs/ows', pathname)} href="/nhs/ows">
                  OWS
                </a>
              </div>
            </div>
            <div className="hero-nav__group hero-nav__group--integrations">
              <span className="hero-nav__label">Integrations</span>
              <div className="hero-nav__links">
                <a className={navLinkClass('/nhs/agentmail', pathname)} href="/nhs/agentmail">
                  AgentMail
                </a>
                <a className={navLinkClass('/nhs/tip20', pathname)} href="/nhs/tip20">
                  TIP-20
                </a>
              </div>
            </div>
          </nav>

          {err ? <p className="error hero-appbar__feedback">{err}</p> : null}
          {faucetStatus ? <p className="note hero-appbar__feedback">{faucetStatus}</p> : null}
        </div>
      </header>
      <div className="app-content">{children(session)}</div>
    </main>
  )
}
