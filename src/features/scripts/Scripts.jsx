import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { SCRIPT_BLOCKS } from '@/lib/constants'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

function ScriptCard({ script }) {
  const [blocks, setBlocks] = useState(script.blocks)
  const toast = useToast()
  const queryClient = useQueryClient()

  const save = useMutation({
    mutationFn: () => api.updateScript(script.id, blocks),
    onSuccess: () => toast('Saved'),
  })

  const expand = useMutation({
    mutationFn: () => api.expandScript(script.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      toast('Script expanded')
    },
  })

  const copy = async () => {
    const text = SCRIPT_BLOCKS.map((k) => `${k}\n${blocks[k]}`).join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      toast('Script copied')
    } catch {
      toast('Could not copy. Select the text and copy it manually.')
    }
  }

  return (
    <Card className="mb-4">
      <h2 className="mb-3 text-lg font-bold">{script.title}</h2>
      {SCRIPT_BLOCKS.map((k) => (
        <div key={k} className="mb-3">
          <label htmlFor={`${script.id}-${k}`} className="mb-1 block text-sm font-semibold text-gray-600">
            {k}
          </label>
          <textarea
            id={`${script.id}-${k}`}
            value={blocks[k]}
            onChange={(e) => setBlocks({ ...blocks, [k]: e.target.value })}
            onBlur={() => save.mutate()}
            className="min-h-20 w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm"
          />
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button onClick={copy}>Copy script</Button>
        <Button variant="secondary" onClick={() => expand.mutate()} disabled={expand.isPending}>
          {expand.isPending ? 'Expanding' : 'Expand script (free)'}
        </Button>
      </div>
    </Card>
  )
}

export default function Scripts() {
  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ['scripts'],
    queryFn: () => api.getScripts(),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Scripts</h1>
      <p className="mb-5 text-gray-500">Each script costs 1 credit. You can edit it after it is written.</p>
      {isLoading ? (
        <p className="text-gray-500">Loading scripts…</p>
      ) : scripts.length === 0 ? (
        <EmptyState
          title="No scripts yet."
          hint="Open a video in Discover, analyze it, then choose Create script."
        />
      ) : (
        scripts.map((s) => <ScriptCard key={`${s.id}-${s.version}`} script={s} />)
      )}
    </div>
  )
}