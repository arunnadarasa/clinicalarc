import { tempo as tempoMainnet, tempoModerato } from 'viem/chains'

/** Tempo Moderato testnet — chain id 42431 */
export const tempoTestnetChain = tempoModerato.extend({
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  feeToken: '0x20c0000000000000000000000000000000000001',
  blockTime: 30_000,
})

/** Tempo mainnet */
export const tempoMainnetChain = tempoMainnet.extend({
  nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
  feeToken: '0x20c000000000000000000000b9537d11c60e8b50',
  blockTime: 30_000,
})
