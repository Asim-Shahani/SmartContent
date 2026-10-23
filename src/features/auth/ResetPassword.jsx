    import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'
import AuthLayout from './AuthLayout'
import Field from './Field'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const email = params.get('email') || ''
  const navigate = useNavigate()
  const toast = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [mismatch, setMismatch] = useState('')

  const reset = useMutation({
    mutationFn: () => api.resetPassword(email, password),
    onSuccess: () => {
      toast('Password updated. Please log in.')
      navigate('/login', { replace: true })
    },
  })

  const submit = (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setMismatch('The two passwords do not match.')
      return
    }
    setMismatch('')
    reset.mutate()
  }

  if (!email) {
    return (
      <AuthLayout title="This link is not valid" footer={<Link to="/forgot-password" className="text-indigo-700">Request a new link</Link>}>
        <p className="text-sm text-gray-500">The reset link is missing or has expired.</p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Choose a new password" subtitle={`For ${email}`}>
      <form onSubmit={submit}>
        <Field label="New password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <Field label="Confirm password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} error={mismatch} />
        {reset.isError && <p role="alert" className="mb-3 text-sm font-medium text-red-600">{reset.error.message}</p>}
        <Button type="submit" className="w-full" disabled={reset.isPending}>
          {reset.isPending ? 'Saving' : 'Save new password'}
        </Button>
      </form>
    </AuthLayout>
  )
}