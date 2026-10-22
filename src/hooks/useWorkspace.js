import { useApp } from '@/context/WorkspaceContext'

export function useWorkspace() {
  const { workspaces, workspace, setWorkspace } = useApp()
  return { workspaces, workspace, setWorkspace }
}