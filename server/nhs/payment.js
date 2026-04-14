/**
 * Wraps route handlers with optional Circle Gateway x402 gate (Arc Testnet).
 */
export function withArcGatewayGate({ gateway }, config, handler) {
  const {
    enabled = false,
    amount = '0.01',
  } = config || {}

  const price = typeof amount === 'string' && amount.startsWith('$') ? amount : `$${amount}`

  if (!enabled) {
    return [
      (req, res) => {
        return handler(req, res, { paymentReceiptRef: null, network: 'testnet' })
      },
    ]
  }

  return [
    gateway.require(price),
    (req, res) => {
      const pay = req.payment
      const ref = pay?.transaction ?? pay?.payer ?? null
      return handler(req, res, { paymentReceiptRef: ref, network: 'testnet' })
    },
  ]
}
