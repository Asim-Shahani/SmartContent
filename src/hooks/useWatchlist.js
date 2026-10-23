import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { useWorkspace } from '@/hooks/useWorkspace'
import { usePlan } from '@/hooks/usePlan'
import { useToast } from '@/components/Toast'

export function useWatchlist() {
  const { workspace } = useWorkspace()
  const { limits } = usePlan()
  const queryClient = useQueryClient()
  const toast = useToast()
  const wsId = workspace.id

  const { data: watchlist = [] } = useQuery({
    queryKey: ['watchlist', wsId],
    queryFn: () => api.getWatchlist(wsId),
  })

  // Watchlist changes must show up in Discover right away
  const done = (message) => {
    queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    queryClient.invalidateQueries({ queryKey: ['videos'] })
    toast(message)
  }

  const add = useMutation({
    mutationFn: (channelId) => api.addChannel(wsId, channelId),
    onSuccess: (c) => done(`Added ${c.username}`),
    onError: (err) => toast(err.message),
  })

  const addByUrl = useMutation({
    mutationFn: (url) => api.addChannelByUrl(wsId, url),
    onSuccess: (c) => done(`Added ${c.username}`),
  })

  const remove = useMutation({
    mutationFn: (channelId) => api.removeChannel(wsId, channelId),
    onSuccess: () => done('Channel removed'),
  })

  return { wsId, watchlist, limit: limits.channels, add, addByUrl, remove }
}