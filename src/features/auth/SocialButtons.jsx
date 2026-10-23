import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import Button from '@/components/Button'

export default function SocialButtons() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const social = useMutation({
    mutationFn: (provider) => api.socialSignIn(provider),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(['session'], user)
      navigate(user.onboarded ? '/dashboard' : '/onboarding', { replace: true })
    },
  })

  return (
    <div className="grid gap-2">
      {['Google', 'Apple'].map((p) => (
        <Button key={p} type="button" variant="secondary" onClick={() => social.mutate(p)} disabled={social.isPending}>
          Continue with {p}
        </Button>
      ))}
      {social.isError && <p role="alert" className="text-xs font-medium text-red-600">{social.error.message}</p>}
    </div>
  )
}