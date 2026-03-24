import { useEffect, useMemo, useState } from 'react'
import NhsShell from './NhsShell'
import { DocCodeBlock } from './components/DocCodeBlock'
import { isAddress } from 'viem'
import { launchTip20OnChain, mintTip20OnChain } from './tempoTip20Launch'
import { appendTip20Launch, readTip20Launches, type Tip20StoredLaunch } from './tip20Storage'
import { TEMPO_TIP20_DECIMALS } from './tempoMpp'
import type { NhsNetwork } from './nhsSession'

function explorerTxUrl(network: NhsNetwork, txHash: string) {
  return network === 'mainnet'
    ? `https://explore.tempo.xyz/tx/${txHash}`
    : `https://explore.testnet.tempo.xyz/tx/${txHash}`
}

function explorerAddressUrl(network: NhsNetwork, address: string) {
  return network === 'mainnet'
    ? `https://explore.tempo.xyz/address/${address}`
    : `https://explore.testnet.tempo.xyz/address/${address}`
}

function Tip20Panel({ wallet, network }: { wallet: string; network: NhsNetwork }) {
  const [name, setName] = useState('Neighbourhood Points')
  const [symbol, setSymbol] = useState('NHP')
  const [currency, setCurrency] = useState('USD')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [launchesTick, setLaunchesTick] = useState(0)
  const [mintAmount, setMintAmount] = useState('1000')
  const [mintTo, setMintTo] = useState(wallet)
  const [mintStatus, setMintStatus] = useState('')
  const [mintTxHash, setMintTxHash] = useState<string | null>(null)
  const [mintGrantIssuerTxHash, setMintGrantIssuerTxHash] = useState<string | null>(null)
  const [mintLoading, setMintLoading] = useState(false)

  const lastToken = useMemo(() => {
    void launchesTick
    const launches = readTip20Launches().filter((r) => r.network === network)
    if (launches.length === 0) return null
    const newest = [...launches].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    return { address: newest.tokenAddress as `0x${string}`, symbol: newest.symbol }
  }, [network, launchesTick])

  useEffect(() => {
    setMintTo(wallet)
  }, [wallet])

  useEffect(() => {
    const onRefresh = () => setLaunchesTick((t) => t + 1)
    window.addEventListener('tip20-launches-refresh', onRefresh)
    return () => window.removeEventListener('tip20-launches-refresh', onRefresh)
  }, [])

  const launch = async () => {
    if (!wallet) {
      setStatus('Connect a wallet first.')
      return
    }
    setLoading(true)
    setStatus('Confirm the TIP-20 factory transaction in your wallet…')
    try {
      const result = await launchTip20OnChain({
        network,
        walletAddress: wallet as `0x${string}`,
        name,
        symbol,
        currency,
      })
      const row: Tip20StoredLaunch = {
        launchId: `tip20_${Date.now()}`,
        network,
        name: result.name,
        symbol: result.symbol,
        currency: result.currency,
        ownerAddress: wallet,
        tokenAddress: result.tokenAddress,
        tokenId: result.tokenId,
        txHash: result.txHash,
        createdAt: new Date().toISOString(),
      }
      appendTip20Launch(row)
      setStatus(
        `Deployed ${result.symbol} at ${result.tokenAddress.slice(0, 10)}… — tx ${result.txHash.slice(0, 12)}…`,
      )
      window.dispatchEvent(new Event('tip20-launches-refresh'))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Launch failed.'
      setStatus(`Failed: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  const mint = async () => {
    if (!wallet || !lastToken) {
      setMintStatus('Connect a wallet and create a token first.')
      return
    }
    const to = mintTo.trim() as `0x${string}`
    if (!isAddress(to)) {
      setMintStatus('Enter a valid recipient address.')
      return
    }
    setMintLoading(true)
    setMintTxHash(null)
    setMintGrantIssuerTxHash(null)
    setMintStatus('Confirm in your wallet — if needed you will sign grant issuer, then mint.')
    try {
      const result = await mintTip20OnChain({
        network,
        walletAddress: wallet as `0x${string}`,
        tokenAddress: lastToken.address,
        to,
        amountHuman: mintAmount,
      })
      setMintTxHash(result.txHash)
      setMintGrantIssuerTxHash(result.grantIssuerTxHash ?? null)
      setMintStatus(
        result.grantIssuerTxHash
          ? `Granted issuer role, then minted ${mintAmount.trim()} ${lastToken.symbol}.`
          : `Minted ${mintAmount.trim()} ${lastToken.symbol} — tx ${result.txHash.slice(0, 12)}…`,
      )
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Mint failed.'
      setMintStatus(`Failed: ${msg}`)
    } finally {
      setMintLoading(false)
    }
  }

  return (
    <article className="card">
      <h2>On-chain TIP-20 launch</h2>
      <p>
        Calls <code>Actions.token.createSync</code> from <strong>viem/tempo</strong> against the Tempo TIP-20 factory on
        whichever network you select in the header (<strong>tempo testnet</strong> or <strong>tempo mainnet</strong>). You
        pay fees in the chain fee token.
      </p>
      <p className="note">
        Initial supply is <strong>not</strong> set here — the factory creates the token; minting or policy is separate
        TIP-20 flows. Default USDC-style tokens use <strong>{TEMPO_TIP20_DECIMALS}</strong> decimals on Tempo.
      </p>
      <div className="actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Token name" />
        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" />
        <input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="Currency (ISO, e.g. USD)" />
        <button type="button" disabled={loading || !wallet} onClick={launch}>
          {loading ? 'Waiting for wallet…' : 'Create token on-chain'}
        </button>
      </div>
      {status ? <p className="intent">{status}</p> : null}
      {lastToken ? (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border, #e5e7eb)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.05rem' }}>Mint {lastToken.symbol}</h3>
          <p className="note" style={{ marginTop: '0.35rem' }}>
            Calls <code>Actions.token.mintSync</code> on your latest token for this network ({lastToken.address.slice(0, 10)}…). Amount uses{' '}
            <strong>{TEMPO_TIP20_DECIMALS}</strong> decimals. Minting needs <strong>ISSUER_ROLE</strong>; if you are the factory admin but not yet an issuer, the app signs{' '}
            <code>Actions.token.grantRolesSync</code> with <code>issuer</code> first, then mints.
          </p>
          <div className="actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <input
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="Amount (human units, e.g. 1000)"
              inputMode="decimal"
            />
            <input
              value={mintTo}
              onChange={(e) => setMintTo(e.target.value)}
              placeholder="Mint to (address)"
            />
            <button type="button" disabled={mintLoading || !wallet} onClick={mint}>
              {mintLoading ? 'Waiting for wallet…' : 'Mint tokens on-chain'}
            </button>
          </div>
          {mintStatus ? <p className="intent">{mintStatus}</p> : null}
          {mintGrantIssuerTxHash ? (
            <p className="intent" style={{ marginTop: '0.35rem' }}>
              <a href={explorerTxUrl(network, mintGrantIssuerTxHash)} target="_blank" rel="noreferrer">
                View grant issuer transaction
              </a>
            </p>
          ) : null}
          {mintTxHash ? (
            <p className="intent" style={{ marginTop: mintGrantIssuerTxHash ? '0.2rem' : '0.35rem' }}>
              <a href={explorerTxUrl(network, mintTxHash)} target="_blank" rel="noreferrer">
                View mint transaction on explorer
              </a>
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

function LaunchesTable({ networkFilter }: { networkFilter: NhsNetwork }) {
  const [refreshTick, setRefreshTick] = useState(0)
  const rows = useMemo(() => {
    void refreshTick
    return readTip20Launches().filter((r) => r.network === networkFilter)
  }, [networkFilter, refreshTick])

  useEffect(() => {
    const onRefresh = () => setRefreshTick((t) => t + 1)
    window.addEventListener('tip20-launches-refresh', onRefresh)
    return () => window.removeEventListener('tip20-launches-refresh', onRefresh)
  }, [])

  return (
    <article className="card">
      <h2>Your launches ({networkFilter === 'mainnet' ? 'mainnet' : 'testnet'})</h2>
      <p className="intent" style={{ marginTop: 0 }}>
        Stored in this browser (localStorage). Switch the header network to see the other chain.
      </p>
      {rows.length === 0 ? (
        <p className="intent">No tokens recorded yet for this network.</p>
      ) : (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Token</th>
                <th>Tx</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.launchId}>
                  <td>
                    <strong>{r.symbol}</strong>
                    <div className="tx-muted" style={{ fontSize: '0.85rem' }}>
                      {r.name}
                    </div>
                  </td>
                  <td>
                    <a href={explorerAddressUrl(r.network, r.tokenAddress)} target="_blank" rel="noreferrer">
                      <code>{r.tokenAddress.slice(0, 10)}…</code>
                    </a>
                  </td>
                  <td>
                    <a href={explorerTxUrl(r.network, r.txHash)} target="_blank" rel="noreferrer">
                      <code>{r.txHash.slice(0, 12)}…</code>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  )
}

export default function NhsTip20App() {
  return (
    <NhsShell
      title="TIP-20 — Tempo token model"
      subtitle="Create real TIP-20 tokens on Tempo testnet or mainnet from your browser wallet (viem Actions.token.createSync)."
    >
      {(session) => (
        <section className="grid">
          <article className="card">
            <h2>Why TIP-20 here?</h2>
            <p>
              Stablecoins and app tokens on Tempo follow <strong>TIP-20</strong>. MPP and wallet errors often refer to{' '}
              <code>InsufficientBalance</code> with 6-decimal amounts for USDC-style assets — see{' '}
              <code>src/tempoMpp.ts</code> in this repo.
            </p>
            <p className="note">
              Use <strong>tempo testnet</strong> and <strong>Get testnet funds</strong> before mainnet; mainnet uses real
              USDC for fees.
            </p>
          </article>
          <Tip20Panel wallet={session.wallet} network={session.network} />
          <LaunchesTable networkFilter={session.network} />
          <article className="card">
            <h2>Implementation</h2>
            <p>
              Launch logic lives in <code>src/tempoTip20Launch.ts</code> (viem <code>Actions.token.createSync</code>). Shared
              chain config: <code>src/tempoChains.ts</code>.
            </p>
            <DocCodeBlock
              label="typescript"
              code={`import { Actions } from 'viem/tempo'
// wallet client + tempoActions() on tempo testnet or mainnet
await Actions.token.createSync(client, {
  name: 'My Token',
  symbol: 'MTK',
  currency: 'USD',
  admin: '0x…',
})`}
            />
          </article>
        </section>
      )}
    </NhsShell>
  )
}
