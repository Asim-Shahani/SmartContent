import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import Button from '@/components/Button'
import AuthLayout from './AuthLayout'
import Field from './Field'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const request = useMutation({ mutationFn: () => api.requestPasswordReset(email) })

  const submit = (e) => {
    e.preventDefault()
    request.mutate()
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we will send you a reset link."
      footer={<Link to="/login" className="text-indigo-700">Back to log in</Link>}
    >
      {request.isSuccess ? (
        <div>
          <p className="text-sm">
            If an account exists for <b>{email}</b>, we have sent a reset link. Check your inbox.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Demo only (there is no real email yet):{' '}
            <Link to={`/reset-password?email=${encodeURIComponent(email)}`} className="text-indigo-700">
              open the reset page
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full" disabled={request.isPending}>
            {request.isPending ? 'Sending' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}