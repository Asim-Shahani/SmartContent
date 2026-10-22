import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { useToast } from '@/components/Toast'

export function useSavedHooks() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['savedHooks'] })

  const { data: saved = [] } = useQuery({
    queryKey: ['savedHooks'],
    queryFn: () => api.getSavedHooks(),
  })

  const save = useMutation({
    mutationFn: (text) => api.saveHook(text),
    onSuccess: () => {
      refresh()
      toast('Hook saved')
    },
  })

  const remove = useMutation({
    mutationFn: (text) => api.removeHook(text),
    onSuccess: () => {
      refresh()
      toast('Hook removed')
    },
  })

  return { saved, save, remove }
}