import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './polyfills'
import './index.css'
import NhsHubApp from './NhsHubApp.tsx'
import NhsGpAccessApp from './NhsGpAccessApp.tsx'
import NhsCarePlansApp from './NhsCarePlansApp.tsx'
import NhsSocialPrescribingApp from './NhsSocialPrescribingApp.tsx'
import NhsNeighbourhoodTeamsApp from './NhsNeighbourhoodTeamsApp.tsx'
import NhsMonitoringApp from './NhsMonitoringApp.tsx'
import NhsTransactionsApp from './NhsTransactionsApp.tsx'

const isNhsHubRoute = window.location.pathname === '/nhs' || window.location.pathname === '/'
const isNhsGpAccessRoute = window.location.pathname === '/nhs/gp-access'
const isNhsCarePlansRoute = window.location.pathname === '/nhs/care-plans'
const isNhsSocialPrescribingRoute = window.location.pathname === '/nhs/social-prescribing'
const isNhsNeighbourhoodTeamsRoute = window.location.pathname === '/nhs/neighbourhood-teams'
const isNhsMonitoringRoute = window.location.pathname === '/nhs/monitoring'
const isNhsTransactionsRoute = window.location.pathname === '/nhs/transactions'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isNhsHubRoute ? (
      <NhsHubApp />
    ) : isNhsGpAccessRoute ? (
      <NhsGpAccessApp />
    ) : isNhsCarePlansRoute ? (
      <NhsCarePlansApp />
    ) : isNhsSocialPrescribingRoute ? (
      <NhsSocialPrescribingApp />
    ) : isNhsNeighbourhoodTeamsRoute ? (
      <NhsNeighbourhoodTeamsApp />
    ) : isNhsMonitoringRoute ? (
      <NhsMonitoringApp />
    ) : isNhsTransactionsRoute ? (
      <NhsTransactionsApp />
    ) : (
      <NhsHubApp />
    )}
  </StrictMode>,
)
