import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'

const field = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'

export default function ConnectAccount() {
  const [platform, setPlatform] = useState('TikTok')
  const [handle, setHandle] = useState('')
  const [code, setCode] = useState(null)
  const [error, setError] = useState('')
  const toast = useToast()
  const queryClient = useQueryClient()

  const start = useMutation({
    mutationFn: () => api.startVerification(platform, handle),
    onSuccess: (r) => setCode(r.code),
  })

  const verify = useMutation({
    mutationFn: () => api.verifyAccount(platform, handle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connection'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast('Account verified')
    },
    onError: (err) => setError(err.message),
  })

  const getCode = () => {
    if (!handle.trim()) {
      setError('Enter your handle first, for example @mycreator.')
      return
    }
    setError('')
    start.mutate()
  }

  if (code) {
    return (
      <div>
        <p className="text-sm">
          Put this code anywhere in your {platform} bio, then click Verify:
        </p>
        <p className="my-3 inline-block rounded-lg bg-gray-100 px-4 py-2 font-mono text-lg font-bold">{code}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => verify.mutate()} disabled={verify.isPending}>
            {verify.isPending ? 'Checking your bio' : 'Verify'}
          </Button>
          <Button variant="secondary" onClick={() => setCode(null)} disabled={verify.isPending}>
            Back
          </Button>
        </div>
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select className={field} value={platform} onChange={(e) => setPlatform(e.target.value)} aria-label="Platform">
          {['TikTok', 'Instagram', 'YouTube'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <input
          className={`${field} min-w-48 flex-1`}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getCode()}
          placeholder="@yourhandle"
          aria-label="Handle"
        />
        <Button onClick={getCode} disabled={start.isPending}>
          {start.isPending ? 'Getting code' : 'Get verification code'}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}