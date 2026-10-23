import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'
import ConnectAccount from '@/features/dashboard/ConnectAccount'
import AuthLayout from './AuthLayout'
import Field from './Field'

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('My first workspace')
  const [passkeyDone, setPasskeyDone] = useState(false)

  const { data: connection } = useQuery({
    queryKey: ['connection'],
    queryFn: () => api.getConnection(),
  })

  const passkey = useMutation({
    mutationFn: () => api.enrollPasskey(),
    onSuccess: () => {
      setPasskeyDone(true)
      toast('Passkey added')
    },
  })

  const finish = useMutation({
    mutationFn: () => api.completeOnboarding({ workspaceName: name.trim() || 'My first workspace' }),
    onSuccess: (u) => {
      queryClient.setQueryData(['session'], u)
      navigate('/dashboard', { replace: true })
    },
  })

  if (user?.onboarded) return <Navigate to="/dashboard" replace />

  return (
    <AuthLayout wide title={`Step ${step} of 3`}>
      {step === 1 && (
        <div>
          <p className="mb-3 text-sm text-gray-500">A workspace holds your channels, ideas, scripts and projects. You can add more later.</p>
          <Field label="Workspace name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button className="w-full" onClick={() => setStep(2)} disabled={!name.trim()}>Continue</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-3 text-sm text-gray-500">
            Optional. Connect a social account to see your own numbers. You can skip this and use everything else.
          </p>
          {connection ? (
            <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
              Connected: {connection.handle} on {connection.platform}
            </p>
          ) : (
            <div className="mb-3"><ConnectAccount /></div>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button className="flex-1" onClick={() => setStep(3)}>{connection ? 'Continue' : 'Skip for now'}</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-3 text-sm text-gray-500">
            Optional. A passkey lets you log in with your fingerprint, face or device PIN instead of a password.
          </p>
          {passkeyDone ? (
            <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-800">Passkey added.</p>
          ) : (
            <Button variant="secondary" className="mb-3 w-full" onClick={() => passkey.mutate()} disabled={passkey.isPending}>
              {passkey.isPending ? 'Adding passkey' : 'Add a passkey'}
            </Button>
          )}
          {passkey.isError && <p role="alert" className="mb-3 text-sm font-medium text-red-600">{passkey.error.message}</p>}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button className="flex-1" onClick={() => finish.mutate()} disabled={finish.isPending}>
              {finish.isPending ? 'Setting up' : passkeyDone ? 'Go to dashboard' : 'Skip and go to dashboard'}
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}