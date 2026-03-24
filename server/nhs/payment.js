/**
 * Wraps route handlers with optional Tempo MPP charge gate.
 * Expects dependencies from server/index.js to avoid duplicating transport internals.
 */
export function withTempoGate({ liveMppByNetwork, toFetchRequest, sendFetchResponse }, config, handler) {
  const {
    enabled = false,
    amount = '0.01',
    description = 'NHS service request',
    externalIdPrefix = 'nhs_service',
  } = config || {}

  return async (req, res) => {
    if (!enabled) {
      return handler(req, res, { paymentReceiptRef: null, network: req.body?.network || 'testnet' })
    }

    const network = req.body?.network === 'mainnet' ? 'mainnet' : 'testnet'
    const mppx = liveMppByNetwork[network]
    if (!mppx) {
      return res.status(400).json({ error: 'Unsupported payment network.' })
    }

    try {
      const charge = mppx.tempo.charge({
        amount,
        description,
        externalId: `${externalIdPrefix}_${Date.now()}`,
      })
      const mppResponse = await charge(toFetchRequest(req))
      if (mppResponse.status === 402) {
        return sendFetchResponse(res, mppResponse.challenge)
      }
      const receiptRef =
        mppResponse?.receipt?.reference ||
        mppResponse?.receipt?.externalId ||
        req.get('payment-receipt') ||
        null
      return handler(req, res, { paymentReceiptRef: receiptRef, network })
    } catch (error) {
      return res.status(400).json({
        error: 'Tempo MPP payment gate failed.',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}

