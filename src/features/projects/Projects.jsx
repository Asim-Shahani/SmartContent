import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

function summary(assets) {
  if (assets.length === 0) return 'No assets yet'
  const counts = {}
  assets.forEach((a) => { counts[a.type] = (counts[a.type] || 0) + 1 })
  return Object.entries(counts).map(([t, n]) => `${n} ${t}${n > 1 ? 's' : ''}`).join(' · ')
}

export default function Projects() {
  const { projects, isLoading, create } = useProjects()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    setError('')
    create.mutate(name, {
      onSuccess: () => setName(''),
      onError: (err) => setError(err.message),
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
      <p className="mb-5 text-gray-500">Keep your ideas, scripts and videos for one campaign in one place.</p>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            aria-label="New project name"
            placeholder="New project name, for example Summer launch"
            className="min-w-52 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />
          <Button onClick={submit} disabled={create.isPending}>
            {create.isPending ? 'Creating' : 'Create project'}
          </Button>
        </div>
        {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      </Card>

      {isLoading ? (
        <p className="text-gray-500">Loading projects…</p>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects yet." hint="Create one above, or use Add to project on an idea or script." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`}>
              <Card className="h-full hover:border-indigo-500">
                <p className="font-bold">{p.name}</p>
                <p className="mt-1 text-sm text-gray-500">{summary(p.assets)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}