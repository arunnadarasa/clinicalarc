/** Grouped links for the main hub — every dedicated app route in one place. */

export type HubRoute = { href: string; title: string; hint: string }

export type HubRouteGroup = { label: string; routes: HubRoute[]; footnote?: string }

export const HUB_ROUTE_GROUPS: HubRouteGroup[] = [
  {
    label: 'NHS front door',
    routes: [
      { href: '/nhs', title: 'NHS Hub', hint: 'Wallet identity + patient bootstrap' },
      { href: '/nhs/gp-access', title: 'GP Access', hint: 'Same-day access request workflow' },
    ],
  },
  {
    label: 'Neighbourhood care',
    routes: [
      { href: '/nhs/care-plans', title: 'Care plans', hint: 'Personalised care plan lifecycle' },
      { href: '/nhs/social-prescribing', title: 'Social prescribing', hint: 'Referral + link worker plan' },
      { href: '/nhs/neighbourhood-teams', title: 'Neighbourhood teams', hint: 'MDT coordination events' },
      { href: '/nhs/monitoring', title: 'Monitoring', hint: 'Remote readings + proactive alerts' },
    ],
    footnote: 'Wallet identity is used for role-based actions and x402 payment-gated service requests.',
  },
  {
    label: 'Wallet & CLI',
    routes: [
      { href: '/nhs/http-pay', title: 'HTTP pay', hint: 'curl + Arc Testnet x402 notes' },
      { href: '/nhs/ows', title: 'OWS', hint: 'Open Wallet Standard installer' },
    ],
  },
  {
    label: 'Integrations',
    routes: [
      { href: '/nhs/agentmail', title: 'AgentMail', hint: 'Wallet-paid email send + inbox create' },
      { href: '/nhs/tip20', title: 'TIP-20', hint: 'On-chain TIP-20 factory (testnet + mainnet)' },
    ],
  },
]
