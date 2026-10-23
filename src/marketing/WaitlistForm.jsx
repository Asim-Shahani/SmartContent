import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import { cta, ctaSecondary } from './styles'

export default function WaitlistForm({ planId, label = 'Notify me', onCancel }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const join = useMutation({ mutationFn: () => api.joinWaitlist(email, planId) })

  if (join.isSuccess) {
    return (
      <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        You are on the waitlist. We will email {email} when it opens.
      </p>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    join.mutate()
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-wrap gap-2">
        <input
          type="email"
          aria-label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-52 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button type="submit" className={cta} disabled={join.isPending}>
          {join.isPending ? 'Saving' : label}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className={ctaSecondary}>Cancel</button>}
      </div>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </form>
  )
}   