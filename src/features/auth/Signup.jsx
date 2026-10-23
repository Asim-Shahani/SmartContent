import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import Button from '@/components/Button'
import AuthLayout from './AuthLayout'
import Field from './Field'
import SocialButtons from './SocialButtons'

export default function Signup() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const signUp = useMutation({
    mutationFn: () => api.signUp(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(['session'], user)
      navigate('/onboarding', { replace: true })
    },
  })

  const submit = (e) => {
    e.preventDefault()
    signUp.mutate()
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="No credit card needed. You start with 100 credits a month."
      footer={<>Already have an account? <Link to="/login" className="text-indigo-700">Log in</Link></>}
    >
      <SocialButtons />
      <p className="my-4 text-center text-xs text-gray-500">or use your email</p>
      <form onSubmit={submit}>
        <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          label="Password"
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="mb-3 flex items-center gap-2 text-xs text-gray-600">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show password (at least 8 characters)
        </label>
        {signUp.isError && <p role="alert" className="mb-3 text-sm font-medium text-red-600">{signUp.error.message}</p>}
        <Button type="submit" className="w-full" disabled={signUp.isPending}>
          {signUp.isPending ? 'Creating account' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}