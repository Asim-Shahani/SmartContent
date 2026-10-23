import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { useWorkspace } from '@/hooks/useWorkspace'
import { useToast } from '@/components/Toast'

export function useProjects() {
  const { workspace } = useWorkspace()
  const queryClient = useQueryClient()
  const toast = useToast()
  const wsId = workspace.id

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', wsId],
    queryFn: () => api.getProjects(wsId),
  })

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['projects'] })

  const create = useMutation({
    mutationFn: (name) => api.createProject(wsId, name),
    onSuccess: (p) => {
      refresh()
      toast(`Created ${p.name}`)
    },
  })

  const addAsset = useMutation({
    mutationFn: ({ projectId, asset }) => api.addAssetToProject(wsId, projectId, asset),
    onSuccess: (p) => {
      refresh()
      toast(`Added to ${p.name}`)
    },
    onError: (err) => toast(err.message),
  })

  const removeAsset = useMutation({
    mutationFn: ({ projectId, key }) => api.removeAssetFromProject(wsId, projectId, key),
    onSuccess: () => {
      refresh()
      toast('Removed from project')
    },
  })

  const move = useMutation({
    mutationFn: ({ fromId, toId, key }) => api.moveAsset(wsId, fromId, toId, key),
    onSuccess: (p) => {
      refresh()
      toast(`Moved to ${p.name}`)
    },
    onError: (err) => toast(err.message),
  })

  return { wsId, projects, isLoading, create, addAsset, removeAsset, move }
}