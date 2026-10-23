import { useState } from 'react'
import { PLANS, PLAN_PRICING } from '@/lib/constants'
import ComingSoonBadge from '@/components/ComingSoonBadge'
import WaitlistForm from './WaitlistForm'
import { ctaSecondary } from './styles'

// Plan details from the PRD (section 4.5)
const DETAILS = {
  pro: { verified: '3', refresh: '12 hours', competitors: '150', api: false, guests: false },
  visionary: { verified: '5', refresh: '6 hours', competitors: '250', api: false, guests: false },
  titan: { verified: '20', refresh: '1 hour', competitors: 'Custom', api: true, guests: true },
}

export default function PricingSection() {
  const [yearly, setYearly] = useState(true)
  const [notify, setNotify] = useState(null)

  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <h2 className="text-center text-3xl font-bold tracking-tight">Pricing preview</h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-gray-600">
        Billing is not available yet. Everyone has full access with 100 credits a month. Join the waitlist to hear when paid plans open.
      </p>

      <div role="group" aria-label="Billing period" className="mt-6 flex justify-center gap-1">
        {[['Yearly', true], ['Monthly', false]].map(([label, value]) => (
          <button
            key={label}
            aria-pressed={yearly === value}
            onClick={() => setYearly(value)}
            className={`rounded-lg border px-4 py-1.5 text-sm ${
              yearly === value ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Object.entries(PLAN_PRICING).map(([id, p]) => {
          const d = DETAILS[id]
          return (
            <div key={id} className="rounded-xl border border-gray-200 p-6">
              <ComingSoonBadge />
              <h3 className="mt-3 text-xl font-bold">{p.name}</h3>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                ${yearly ? p.yearly : p.monthly}
                <span className="ml-1 text-sm font-medium text-gray-500">/mo, billed {yearly ? 'yearly' : 'monthly'}</span>
              </p>
              <ul className="my-4 space-y-1 text-sm text-gray-700">
                <li>{PLANS[id].credits.toLocaleString()} credits a month</li>
                <li>Up to {d.verified} verified channels</li>
                <li>Refreshed every {d.refresh}</li>
                <li>Up to {PLANS[id].workspaces} workspaces</li>
                <li>{d.competitors === 'Custom' ? 'Custom' : `Up to ${d.competitors}`} competitors per workspace</li>
                <li>Claude connector</li>
                <li>Free Collections</li>
                {d.api && <li>API access</li>}
                {d.guests && <li>Guest access</li>}
              </ul>
              <button className={`${ctaSecondary} w-full`} onClick={() => setNotify(id)}>Notify me</button>
            </div>
          )
        })}
      </div>

      {notify && (
        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-gray-200 p-5">
          <p className="mb-3 font-semibold">Get notified when {PLAN_PRICING[notify].name} opens</p>
          <WaitlistForm key={notify} planId={notify} onCancel={() => setNotify(null)} />
        </div>
      )}
    </section>
  )
}