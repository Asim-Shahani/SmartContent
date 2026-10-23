import { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import Button from '@/components/Button'

export default function AddToProject({ asset }) {
  const { projects, create, addAsset } = useProjects()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const key = `${asset.type}:${asset.refId}`

  const pick = (projectId) => {
    addAsset.mutate({ projectId, asset })
    setOpen(false)
  }

  const createAndAdd = async () => {
    try {
      const project = await create.mutateAsync(name)
      addAsset.mutate({ projectId: project.id, asset })
      setName('')
      setError('')
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="relative inline-block" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <Button variant="secondary" aria-expanded={open} onClick={() => setOpen(!open)}>
        Add to project ▾
      </Button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          {projects.length > 0 && (
            <ul className="mb-2 max-h-40 overflow-auto">
              {projects.map((p) => {
                const has = p.assets.some((a) => a.key === key)
                return (
                  <li key={p.id}>
                    <button
                      disabled={has}
                      onClick={() => pick(p.id)}
                      className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 disabled:text-gray-400"
                    >
                      {p.name}{has ? ' ✓' : ''}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <div className="flex gap-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createAndAdd()}
              aria-label="New project name"
              placeholder="New project name"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm"
            />
            <Button onClick={createAndAdd} disabled={create.isPending}>Create</Button>
          </div>
          {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        </div>
      )}
    </div>
  )
}