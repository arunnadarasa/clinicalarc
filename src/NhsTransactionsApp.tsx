import { useMemo, useState } from 'react'
import NhsShell from './NhsShell'
import { clearNhsTxHistory, explorerUrl, listNhsTxHistory, type NhsTxItem } from './nhsTxHistory'

export default function NhsTransactionsApp() {
  const [rows, setRows] = useState<NhsTxItem[]>(() => listNhsTxHistory())
  const [tab, setTab] = useState<'testnet' | 'mainnet'>('testnet')

  const filtered = useMemo(() => rows.filter((row) => row.network === tab), [rows, tab])

  return (
    <NhsShell
      title="Transactions Audit"
      subtitle="Audit MPP transaction hashes from NHS write actions. Switch between testnet and mainnet views."
    >
      {() => (
        <section className="grid">
          <article className="card">
            <h2>Transaction history</h2>
            <div className="actions">
              <button className={tab === 'testnet' ? '' : 'secondary'} onClick={() => setTab('testnet')}>
                Testnet
              </button>
              <button className={tab === 'mainnet' ? '' : 'secondary'} onClick={() => setTab('mainnet')}>
                Mainnet
              </button>
              <button className="secondary" onClick={() => setRows(listNhsTxHistory())}>
                Refresh
              </button>
              <button
                className="secondary"
                onClick={() => {
                  clearNhsTxHistory()
                  setRows([])
                }}
                disabled={rows.length === 0}
              >
                Clear all
              </button>
            </div>
            <pre>
              {filtered.length === 0
                ? `No ${tab} transactions recorded yet.`
                : JSON.stringify(
                    filtered.map((row) => ({
                      network: row.network,
                      endpoint: row.endpoint,
                      txHash: row.txHash,
                      explorer: explorerUrl(row.network, row.txHash),
                      createdAt: row.createdAt,
                    })),
                    null,
                    2,
                  )}
            </pre>
          </article>
        </section>
      )}
    </NhsShell>
  )
}

