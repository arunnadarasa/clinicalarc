import { useState } from 'react'
import NhsShell from './NhsShell'
import { apiPost } from './nhsApi'
import { getStoredPatientId, setStoredPatientId } from './nhsSession'

type BootstrapResponse = {
  ok: boolean
  actor: { walletAddress: string; role: string }
  patient?: { patientId: string }
}

export default function NhsHubApp() {
  const [fullName, setFullName] = useState('Alex Carter')
  const [dob, setDob] = useState('1990-01-01')
  const [nhsNumber, setNhsNumber] = useState('999-999-9999')
  const [status, setStatus] = useState('Ready')
  const [patientId, setPatientId] = useState(getStoredPatientId())

  return (
    <NhsShell
      title="Neighbourhood Health Service Hub"
      subtitle="Digital front door aligned to NHS neighbourhood care, personalised care plans, social prescribing, and prevention-first monitoring."
    >
      {(session) => (
        <section className="grid">
          <article className="card">
            <h2>Hackathon quick start (under 2 minutes)</h2>
            <p>Use this path to get funded, bootstrap identity, and start testing flows quickly.</p>
            <ol className="log">
              <li>Connect wallet from the top bar.</li>
              <li>Keep network on <strong>tempo testnet</strong> and click <strong>Get testnet funds</strong>.</li>
              <li>Choose role, complete bootstrap fields, and click <strong>Bootstrap identity</strong>.</li>
            </ol>
            <p className="note">Tip: faucet is testnet-only and may take a short time to appear in wallet balance.</p>
          </article>
          <article className="card">
            <h2>Identity bootstrap</h2>
            <p>Initialize role + wallet identity and ensure patient record exists for patient role.</p>
            <div className="actions">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
              <input value={dob} onChange={(e) => setDob(e.target.value)} placeholder="DOB (YYYY-MM-DD)" />
              <input value={nhsNumber} onChange={(e) => setNhsNumber(e.target.value)} placeholder="NHS number" />
              <button
                disabled={!session.wallet}
                onClick={async () => {
                  const res = await apiPost<BootstrapResponse>(
                    '/api/nhs/identity/bootstrap',
                    session.role,
                    session.wallet,
                    {
                      role: session.role,
                      fullName,
                      dob,
                      nhsNumber,
                    },
                    { network: session.network, paymentMode: session.paymentMode },
                  )
                  if (!res.ok) {
                    setStatus(`Bootstrap failed: ${res.error}`)
                    return
                  }
                  const nextPatientId = res.data.patient?.patientId || ''
                  if (nextPatientId) {
                    setStoredPatientId(nextPatientId)
                    setPatientId(nextPatientId)
                  }
                  setStatus(`Identity ready (${res.data.actor.role})`)
                }}
              >
                Bootstrap identity
              </button>
            </div>
            <p className="intent">Status: <strong>{status}</strong></p>
            <p className="intent">Patient ID: <strong>{patientId || 'not set'}</strong></p>
          </article>
          <article className="card">
            <h2>NHS-aligned workflows</h2>
            <ul className="log">
              <li>Same-day GP access request flow</li>
              <li>Care plan authoring and updates</li>
              <li>Social prescribing referral + link worker support plan</li>
              <li>Neighbourhood MDT coordination events</li>
              <li>Remote monitoring with proactive alerting</li>
            </ul>
          </article>
        </section>
      )}
    </NhsShell>
  )
}

