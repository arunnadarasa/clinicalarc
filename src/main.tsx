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
import NhsArcCliApp from './NhsArcCliApp.tsx'
import NhsOwsApp from './NhsOwsApp.tsx'
import NhsAgentMailApp from './NhsAgentMailApp.tsx'
import NhsTip20App from './NhsTip20App.tsx'

const isNhsHubRoute = window.location.pathname === '/nhs' || window.location.pathname === '/'
const isNhsGpAccessRoute = window.location.pathname === '/nhs/gp-access'
const isNhsCarePlansRoute = window.location.pathname === '/nhs/care-plans'
const isNhsSocialPrescribingRoute = window.location.pathname === '/nhs/social-prescribing'
const isNhsNeighbourhoodTeamsRoute = window.location.pathname === '/nhs/neighbourhood-teams'
const isNhsMonitoringRoute = window.location.pathname === '/nhs/monitoring'
const isNhsTransactionsRoute = window.location.pathname === '/nhs/transactions'
const isNhsArcCliRoute =
  window.location.pathname === '/nhs/http-pay' || window.location.pathname === '/nhs/purl'
const isNhsOwsRoute = window.location.pathname === '/nhs/ows'
const isNhsAgentMailRoute = window.location.pathname === '/nhs/agentmail'
const isNhsTip20Route = window.location.pathname === '/nhs/tip20'

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
    ) : isNhsArcCliRoute ? (
      <NhsArcCliApp />
    ) : isNhsOwsRoute ? (
      <NhsOwsApp />
    ) : isNhsAgentMailRoute ? (
      <NhsAgentMailApp />
    ) : isNhsTip20Route ? (
      <NhsTip20App />
    ) : (
      <NhsHubApp />
    )}
  </StrictMode>,
)
