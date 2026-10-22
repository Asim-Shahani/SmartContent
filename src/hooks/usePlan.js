import { useApp } from '@/context/WorkspaceContext'

export function usePlan() {
  const { plan, limits } = useApp()
  return { plan, limits }
}