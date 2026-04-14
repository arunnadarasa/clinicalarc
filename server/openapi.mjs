/**
 * OpenAPI 3.1 document for MPPScan / AgentCash discovery.
 * @see https://www.mppscan.com/discovery
 */

export const DANCE_EXTRA_LIVE_AMOUNTS = {
  'judge-score': '0.01',
  'cypher-micropot': '0.02',
  'clip-sale': '0.05',
  reputation: '0.01',
  'ai-usage': '0.02',
  'bot-action': '0.03',
  'fan-pass': '0.04',
}

function amountRange() {
  const nums = Object.values(DANCE_EXTRA_LIVE_AMOUNTS).map(Number)
  return {
    minPrice: Math.min(...nums).toFixed(6),
    maxPrice: Math.max(...nums).toFixed(6),
  }
}

export function buildOpenApiDocument(req) {
  const { minPrice, maxPrice } = amountRange()
  const host = req?.get?.('host')
  const proto = req?.protocol || 'http'
  const baseUrl = host && typeof host === 'string' ? `${proto}://${host}` : '/'

  return {
    openapi: '3.1.0',
    info: {
      title: 'Clinical Tempo NHS API',
      version: '1.0.0',
      description:
        'NHS neighbourhood health + social prescribing reference backend with wallet identity, RBAC, and Arc Testnet Circle Gateway x402 payment gates.',
    },
    servers: [{ url: baseUrl, description: 'This API (same origin as /openapi.json)' }],
    'x-discovery': { ownershipProofs: [] },
    paths: {
      '/api/health': {
        get: { operationId: 'health', summary: 'Health check', tags: ['Meta'], responses: { 200: { description: 'OK' } } },
      },
      '/api/dance-extras/live': {
        get: {
          operationId: 'danceExtrasLiveMeta',
          summary: 'List legacy dance flow keys',
          tags: ['Legacy'],
          responses: { 200: { description: 'Metadata JSON' } },
        },
      },
      '/api/dance-extras/live/{flowKey}/{network}': {
        post: {
          operationId: 'danceExtrasLivePaid',
          summary: 'Execute legacy dance flow with Arc x402 (Circle Gateway)',
          tags: ['Legacy'],
          parameters: [
            { name: 'flowKey', in: 'path', required: true, schema: { type: 'string', enum: Object.keys(DANCE_EXTRA_LIVE_AMOUNTS) } },
            { name: 'network', in: 'path', required: true, schema: { type: 'string', enum: ['testnet', 'mainnet'] } },
          ],
          'x-payment-info': { pricingMode: 'range', minPrice, maxPrice, protocols: ['mpp', 'x402'] },
          responses: { 200: { description: 'OK' }, 402: { description: 'Payment Required' } },
        },
      },
      '/api/nhs/identity/bootstrap': {
        post: { operationId: 'nhsIdentityBootstrap', summary: 'Bootstrap wallet identity', tags: ['NHS'], responses: { 201: { description: 'Created' } } },
      },
      '/api/nhs/gp-access/requests': {
        post: {
          operationId: 'nhsGpAccessRequestCreate',
          summary: 'Create same-day GP/front-door access request',
          tags: ['NHS GP access'],
          'x-payment-info': { pricingMode: 'fixed', minPrice: '0.020000', maxPrice: '0.020000', protocols: ['mpp', 'x402'] },
          responses: { 201: { description: 'Created' }, 402: { description: 'Payment Required when gate active' } },
        },
      },
      '/api/nhs/gp-access/requests/{id}': {
        get: {
          operationId: 'nhsGpAccessRequestGet',
          summary: 'Get GP access request by ID',
          tags: ['NHS GP access'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Request details' }, 404: { description: 'Not found' } },
        },
      },
      '/api/nhs/care-plans': {
        post: { operationId: 'nhsCarePlanCreate', summary: 'Create a care plan', tags: ['NHS Care plans'], responses: { 201: { description: 'Created' } } },
      },
      '/api/nhs/care-plans/{patientId}': {
        get: {
          operationId: 'nhsCarePlanListByPatient',
          summary: 'List care plans by patient',
          tags: ['NHS Care plans'],
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'List' } },
        },
      },
      '/api/nhs/care-plans/{planId}/updates': {
        post: {
          operationId: 'nhsCarePlanUpdate',
          summary: 'Add care plan update',
          tags: ['NHS Care plans'],
          parameters: [{ name: 'planId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/nhs/social-prescribing/referrals': {
        post: { operationId: 'nhsSocialReferralCreate', summary: 'Create social prescribing referral', tags: ['NHS Social prescribing'], responses: { 201: { description: 'Created' } } },
      },
      '/api/nhs/social-prescribing/referrals/{id}': {
        get: {
          operationId: 'nhsSocialReferralGet',
          summary: 'Get social prescribing referral',
          tags: ['NHS Social prescribing'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Referral' } },
        },
      },
      '/api/nhs/social-prescribing/link-worker-plan': {
        post: { operationId: 'nhsSocialLinkPlanUpsert', summary: 'Create/update link worker support plan', tags: ['NHS Social prescribing'], responses: { 201: { description: 'Created/updated' } } },
      },
      '/api/nhs/neighbourhood-teams/coordinate': {
        post: { operationId: 'nhsNeighbourhoodCoordinate', summary: 'Write neighbourhood coordination event', tags: ['NHS Neighbourhood teams'], responses: { 201: { description: 'Created' } } },
      },
      '/api/nhs/monitoring/sessions': {
        post: { operationId: 'nhsMonitoringSessionCreate', summary: 'Create monitoring session', tags: ['NHS Monitoring'], responses: { 201: { description: 'Created' } } },
      },
      '/api/nhs/monitoring/readings': {
        post: { operationId: 'nhsMonitoringReadingCreate', summary: 'Record reading and trigger alerts', tags: ['NHS Monitoring'], responses: { 201: { description: 'Created' } } },
      },
      '/api/nhs/monitoring/alerts/{alertId}/resolve': {
        post: {
          operationId: 'nhsMonitoringAlertResolve',
          summary: 'Resolve proactive alert',
          tags: ['NHS Monitoring'],
          parameters: [{ name: 'alertId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Resolved' } },
        },
      },
      '/api/nhs/patients/{patientId}/timeline': {
        get: {
          operationId: 'nhsPatientTimeline',
          summary: 'Patient timeline',
          tags: ['NHS'],
          parameters: [{ name: 'patientId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Timeline' } },
        },
      },
      '/api/nhs/audit': {
        get: { operationId: 'nhsAuditList', summary: 'Audit list', tags: ['NHS Audit'], responses: { 200: { description: 'Audit list' } } },
      },
    },
  }
}
