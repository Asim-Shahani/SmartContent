import { useApp } from '@/context/WorkspaceContext'

export function useCredits() {
  const { credits, spend, limits } = useApp()
  return { credits, spend, total: limits.credits }
}