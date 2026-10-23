import { Link, useParams } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

const ROUTE = { video: '/discover', idea: '/ideas', script: '/scripts' }
const LABEL = { video: 'Videos', idea: 'Ideas', script: 'Scripts' }

export default function ProjectDetail() {
  const { id } = useParams()
  const { projects, isLoading, removeAsset, move } = useProjects()
  const project = projects.find((p) => String(p.id) === id)

  if (isLoading) return <p className="text-gray-500">Loading…</p>
  if (!project) return <EmptyState title="Project not found." hint="Go back to Projects and pick another one." />

  const others = projects.filter((p) => p.id !== project.id)

  return (
    <div>
      <Link to="/projects" className="text-sm text-indigo-700">← Back to Projects</Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{project.name}</h1>
      <p className="mb-5 text-gray-500">{project.assets.length} assets in this project</p>

      {project.assets.length === 0 ? (
        <EmptyState
          title="This project is empty."
          hint="Open an idea, script or analyzed video and choose Add to project."
        />
      ) : (
        Object.keys(LABEL).map((type) => {
          const items = project.assets.filter((a) => a.type === type)
          if (items.length === 0) return null
          return (
            <div key={type} className="mb-6">
              <h2 className="mb-2 font-bold">{LABEL[type]}</h2>
              <div className="grid gap-3">
                {items.map((a) => (
                  <Card key={a.key} className="flex flex-wrap items-center gap-3">
                    <Link to={ROUTE[type]} className="min-w-0 flex-1 font-semibold hover:text-indigo-700">
                      {a.title}
                    </Link>
                    {others.length > 0 && (
                      <select
                        aria-label={`Move ${a.title} to another project`}
                        value=""
                        onChange={(e) => e.target.value && move.mutate({ fromId: project.id, toId: Number(e.target.value), key: a.key })}
                        className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm"
                      >
                        <option value="">Move to…</option>
                        {others.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    )}
                    <Button variant="secondary" onClick={() => removeAsset.mutate({ projectId: project.id, key: a.key })}>
                      Remove
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}