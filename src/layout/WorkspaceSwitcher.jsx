import { useWorkspace } from '@/hooks/useWorkspace'

export default function WorkspaceSwitcher() {
  const { workspaces, workspace, setWorkspace } = useWorkspace()
  return (
    <select
      aria-label="Workspace"
      value={workspace.id}
      onChange={(e) => setWorkspace(workspaces.find((w) => w.id === e.target.value))}
      className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm"
    >
      {workspaces.map((w) => (
        <option key={w.id} value={w.id}>{w.name}</option>
      ))}
    </select>
  )
}