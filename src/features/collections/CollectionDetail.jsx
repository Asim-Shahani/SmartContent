import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'
import { downloadText } from '@/lib/downloadText'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

export default function CollectionDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { data: c, isLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => api.getCollection(id),
  })

  if (isLoading) return <p className="text-gray-500">Loading…</p>
  if (!c) return <EmptyState title="Collection not found." hint="Go back and pick another one." />

  const exportSheet = () => {
    const text = [
      `# ${c.name}`,
      `Category: ${c.category} | ${c.examples} example videos`,
      `## Breakdown\n${c.breakdown.map((b) => `- ${b}`).join('\n')}`,
      `## Transcript\n${c.transcript}`,
      `## Examples\n${c.videos.map((v) => `- ${v}`).join('\n')}`,
    ].join('\n\n')
    downloadText(`${c.id}-reference-sheet.md`, text)
    toast('Reference sheet downloaded')
  }

  return (
    <div>
      <Link to="/collections" className="text-sm text-indigo-700">← Back to Collections</Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{c.name}</h1>
      <p className="mb-5 text-gray-500">{c.category} · {c.summary}</p>

      <div className="grid gap-4">
        <Card>
          <h2 className="mb-2 font-bold">Breakdown</h2>
          <ul className="list-disc pl-5 text-sm">
            {c.breakdown.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">Transcript</h2>
          <p className="text-sm">{c.transcript}</p>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">Examples</h2>
          <ul className="list-disc pl-5 text-sm">
            {c.videos.map((v) => <li key={v}>{v}</li>)}
          </ul>
        </Card>
        <div><Button onClick={exportSheet}>Export reference sheet</Button></div>
      </div>
    </div>
  )
}