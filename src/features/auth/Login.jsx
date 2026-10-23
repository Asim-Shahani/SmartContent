import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import Button from '@/components/Button'
import AuthLayout from './AuthLayout'
import Field from './Field'
import SocialButtons from './SocialButtons'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const done = (user) => {
    queryClient.setQueryData(['session'], user)
    navigate(user.onboarded ? location.state?.from || '/dashboard' : '/onboarding', { replace: true })
  }

  const logIn = useMutation({ mutationFn: () => api.logIn(email, password), onSuccess: done })
  const passkey = useMutation({ mutationFn: () => api.passkeySignIn(), onSuccess: done })

  const submit = (e) => {
    e.preventDefault()
    logIn.mutate()
  }

  const error = logIn.isError ? logIn.error.message : passkey.isError ? passkey.error.message : ''

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep researching."
      footer={<>New here? <Link to="/signup" className="text-indigo-700">Create an account</Link></>}
    >
      <SocialButtons />
      <p className="my-4 text-center text-xs text-gray-500">or use your email</p>
      <form onSubmit={submit}>
        <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="mb-3 text-right text-xs">
          <Link to="/forgot-password" className="text-indigo-700">Forgot password?</Link>
        </p>
        {error && <p role="alert" className="mb-3 text-sm font-medium text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={logIn.isPending}>
          {logIn.isPending ? 'Logging in' : 'Log in'}
        </Button>
      </form>
      <Button type="button" variant="secondary" className="mt-2 w-full" onClick={() => passkey.mutate()} disabled={passkey.isPending}>
        {passkey.isPending ? 'Checking passkey' : 'Use a passkey'}
      </Button>
    </AuthLayout>
  )
}