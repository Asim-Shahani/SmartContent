import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import { PLANS, PLAN_PRICING } from '@/lib/constants'
import { useCredits } from '@/hooks/useCredits'
import { usePlan } from '@/hooks/usePlan'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'
import Card from '@/components/Card'
import ComingSoonBadge from '@/components/ComingSoonBadge'

export default function Subscription() {
  const { credits, total } = useCredits()
  const { plan } = usePlan()
  const toast = useToast()
  const [yearly, setYearly] = useState(true)
  const [detail, setDetail] = useState(null)
  const [notifyPlan, setNotifyPlan] = useState(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const join = useMutation({
    mutationFn: () => api.joinWaitlist(email, notifyPlan),
    onSuccess: () => {
      toast(`You are on the waitlist for ${PLAN_PRICING[notifyPlan].name}`)
      setNotifyPlan(null)
      setEmail('')
    },
  })

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    join.mutate()
  }

  return (
    <div>
      <div className="mb-4 rounded-lg bg-indigo-100 px-4 py-3 font-medium text-indigo-700">
        Billing coming soon. Everyone has full access with {total} credits a month.
      </div>

      <Card className="mb-4">
        <p className="text-2xl font-bold">{credits} / {total}</p>
        <p className="text-sm text-gray-500">
          Credits left this month · Current plan: {PLAN_PRICING[plan].name} (default)
        </p>
      </Card>

      <div className="mb-3 flex gap-1" role="group" aria-label="Billing period">
        {[['Yearly', true], ['Monthly', false]].map(([label, value]) => (
          <button
            key={label}
            aria-pressed={yearly === value}
            onClick={() => setYearly(value)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              yearly === value ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {Object.entries(PLAN_PRICING).map(([id, p]) => (
          <Card key={id}>
            <ComingSoonBadge />
            <h2 className="mt-2 text-lg font-bold">{p.name}</h2>
            <p className="text-2xl font-bold tracking-tight">
              ${yearly ? p.yearly : p.monthly}
              <span className="ml-1 text-xs font-medium text-gray-500">/mo, billed {yearly ? 'yearly' : 'monthly'}</span>
            </p>
            <p className="my-2 text-sm text-gray-500">{PLANS[id].credits} credits a month</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setDetail(id)}>View details</Button>
              <Button variant="secondary" onClick={() => setNotifyPlan(id)}>Notify me</Button>
            </div>
          </Card>
        ))}
      </div>

      {detail && (
        <Card className="mt-4">
          <h2 className="font-bold">{PLAN_PRICING[detail].name}: what is included</h2>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>{PLANS[detail].credits} credits per month</li>
            <li>Up to {PLANS[detail].workspaces} workspaces</li>
            <li>Track up to {PLANS[detail].channels} competitor channels per workspace</li>
            <li>Collections are free on every plan</li>
          </ul>
          <p className="mt-2 text-sm text-gray-500">This is a preview only. Plans cannot be purchased yet.</p>
        </Card>
      )}

      {notifyPlan && (
        <Card className="mt-4">
          <h2 className="font-bold">Get notified when {PLAN_PRICING[notifyPlan].name} is available</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              type="email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="you@example.com"
              className="min-w-52 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
            <Button onClick={submit} disabled={join.isPending}>
              {join.isPending ? 'Saving' : 'Join waitlist'}
            </Button>
            <Button variant="secondary" onClick={() => setNotifyPlan(null)}>Cancel</Button>
          </div>
          {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        </Card>
      )}
    </div>
  )
}