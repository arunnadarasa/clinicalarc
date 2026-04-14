# Arc Testnet + Circle Gateway x402

- **Chain:** Arc Testnet, id **5042002** (`eip155:5042002` in challenges).
- **Payments:** [Circle Gateway nanopayments](https://developers.circle.com/gateway/nanopayments) with the **x402** HTTP payment protocol.
- **Faucet:** [Circle Faucet](https://faucet.circle.com) for test USDC and gas — the app’s **Get testnet funds** button links to this flow.
- **Explorer:** [testnet.arcscan.app](https://testnet.arcscan.app).

NHS and demo routes that require payment use **`createGatewayMiddleware`** on the server and **`wrapFetchWithPayment`** / batch schemes in the browser (`src/arcX402Fetch.ts`, `src/nhsArcPaidFetch.ts`).

Seller address and related settings follow **`X402_SELLER_ADDRESS`** and `.env.example`.
