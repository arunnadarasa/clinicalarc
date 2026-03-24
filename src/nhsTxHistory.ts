import type { NhsNetwork } from './nhsSession'

export type NhsTxItem = {
  txHash: string
  network: NhsNetwork
  endpoint: string
  createdAt: string
}

const KEY = 'nhs_tx_history_v1'

export function listNhsTxHistory(): NhsTxItem[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as NhsTxItem[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && typeof item.txHash === 'string' && typeof item.network === 'string')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } catch {
    return []
  }
}

export function addNhsTxHistory(item: NhsTxItem) {
  const prev = listNhsTxHistory()
  const deduped = prev.filter((p) => !(p.txHash === item.txHash && p.network === item.network))
  const next = [item, ...deduped].slice(0, 500)
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function clearNhsTxHistory() {
  localStorage.removeItem(KEY)
}

export function explorerUrl(network: NhsNetwork, txHash: string) {
  return network === 'mainnet'
    ? `https://explore.tempo.xyz/receipt/${txHash}`
    : `https://explore.testnet.tempo.xyz/receipt/${txHash}`
}

