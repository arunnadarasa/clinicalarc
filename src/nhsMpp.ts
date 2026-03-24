import { Mppx as MppxClient, tempo as tempoClient } from 'mppx/client'
import { createWalletClient } from 'viem'
import { tempo as tempoMainnet, tempoModerato } from 'viem/chains'
import { tempoActions } from 'viem/tempo'
import {
  TEMPO_MPP_SESSION_MAX_DEPOSIT,
  tempoBrowserWalletTransport,
  type BrowserEthereumProvider,
} from './tempoMpp'
import type { NhsNetwork } from './nhsSession'

const tempoTestnetChain = tempoModerato.extend({
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  feeToken: '0x20c0000000000000000000000000000000000001',
  blockTime: 30_000,
})

const tempoMainnetChain = tempoMainnet.extend({
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  feeToken: '0x20c000000000000000000000b9537d11c60e8b50',
  blockTime: 30_000,
})

function toHexChainId(id: number) {
  return `0x${id.toString(16)}`
}

async function ensureWalletOnNetwork(ethereum: BrowserEthereumProvider, network: NhsNetwork) {
  const chain = network === 'mainnet' ? tempoMainnetChain : tempoTestnetChain
  const chainId = toHexChainId(chain.id)
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    } as { method: string; params: unknown[] })
  } catch (error) {
    const e = error as { code?: number }
    if (e?.code !== 4902) throw error
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: [chain.rpcUrls.default.http[0]],
          blockExplorerUrls: chain.blockExplorers?.default?.url ? [chain.blockExplorers.default.url] : [],
        },
      ],
    } as { method: string; params: unknown[] })
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    } as { method: string; params: unknown[] })
  }
}

export async function nhsMppFetch(
  url: string,
  init: RequestInit,
  opts: { wallet: string; network: NhsNetwork },
) {
  const provider = (window as Window & { ethereum?: BrowserEthereumProvider }).ethereum
  if (!provider) throw new Error('Wallet provider not found for MPP payment mode.')
  if (!opts.wallet) throw new Error('Connect wallet to use MPP mode.')
  await ensureWalletOnNetwork(provider, opts.network)
  const chain = opts.network === 'mainnet' ? tempoMainnetChain : tempoTestnetChain
  const walletClient = createWalletClient({
    chain,
    transport: tempoBrowserWalletTransport(provider, chain.rpcUrls.default.http[0]),
    account: opts.wallet as `0x${string}`,
  }).extend(tempoActions())

  const makeMppx = (mode: 'push' | 'pull') =>
    MppxClient.create({
      methods: [
        tempoClient({
          account: opts.wallet as `0x${string}`,
          mode,
          maxDeposit: TEMPO_MPP_SESSION_MAX_DEPOSIT,
          getClient: async () => walletClient,
        }),
      ],
      polyfill: false,
    })

  try {
    return await makeMppx('push').fetch(url, init)
  } catch (error) {
    const isMetaMask = Boolean((window as Window & { ethereum?: { isMetaMask?: boolean } }).ethereum?.isMetaMask)
    if (isMetaMask) throw error
    return await makeMppx('pull').fetch(url, init)
  }
}

