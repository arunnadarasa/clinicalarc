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
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="actions">
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
          <a className="secondary button-like" href="/nhs">Hub</a>
          <a className="secondary button-like" href="/nhs/gp-access">GP access</a>
          <a className="secondary button-like" href="/nhs/care-plans">Care plans</a>
          <a className="secondary button-like" href="/nhs/social-prescribing">Social prescribing</a>
          <a className="secondary button-like" href="/nhs/neighbourhood-teams">Neighbourhood teams</a>
          <a className="secondary button-like" href="/nhs/monitoring">Monitoring</a>
          <a className="secondary button-like" href="/nhs/transactions">Transactions</a>
        </div>
        {err ? <p className="error">{err}</p> : null}
        {faucetStatus ? <p className="note">{faucetStatus}</p> : null}
      </header>
      {children(session)}
    </main>
  )
}

