import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import { NICHES, HOOK_CATEGORIES } from '@/lib/constants'
import { useSavedHooks } from '@/hooks/useSavedHooks'
import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

const field = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'
const TABS = ['Library', 'Generator', 'Saved']

function HookRow({ text, tag, isSaved, onSave, onRemove }) {
  return (
    <Card className="flex items-center justify-between gap-3">
      <div>
        <p>{text}</p>
        {tag && <p className="mt-1 text-xs text-gray-500">{tag}</p>}
      </div>
      {onRemove ? (
        <Button variant="secondary" onClick={onRemove}>Remove</Button>
      ) : (
        <Button variant="secondary" onClick={onSave} disabled={isSaved}>
          {isSaved ? 'Saved' : 'Save'}
        </Button>
      )}
    </Card>
  )
}

function Library({ saved, save }) {
  const [filters, setFilters] = useState({ q: '', niche: '', category: '' })
  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))
  const { data: hooks = [], isLoading } = useQuery({
    queryKey: ['hookLibrary', filters],
    queryFn: () => api.searchHooks(filters),
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search hooks"
          value={filters.q}
          onChange={set('q')}
          className={`${field} min-w-52 flex-1`}
        />
        <select className={field} value={filters.niche} onChange={set('niche')}>
          <option value="">All niches</option>
          {NICHES.map((n) => <option key={n}>{n}</option>)}
        </select>
        <select className={field} value={filters.category} onChange={set('category')}>
          <option value="">All categories</option>
          {HOOK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading hooks…</p>
      ) : hooks.length === 0 ? (
        <EmptyState title="No hooks match your search." hint="Try a different word or clear the filters." />
      ) : (
        <div className="grid gap-3">
          {hooks.map((h) => (
            <HookRow
              key={h.id}
              text={h.text}
              tag={`${h.niche} · ${h.category}`}
              isSaved={saved.includes(h.text)}
              onSave={() => save.mutate(h.text)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Generator({ saved, save }) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  const generate = useMutation({
    mutationFn: () => api.generateHooks(topic, category),
    onSuccess: setResults,
  })

  const run = () => {
    if (!topic.trim()) {
      setError('Enter a topic first, for example "meal prep".')
      return
    }
    setError('')
    generate.mutate()
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="Your topic, for example meal prep"
          className={`${field} min-w-52 flex-1`}
        />
        <select className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {HOOK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Button onClick={run} disabled={generate.isPending}>
          {generate.isPending ? 'Generating' : 'Generate hooks'}
        </Button>
      </div>
      {error && <p className="mb-2 text-sm font-medium text-red-600">{error}</p>}
      {results.length === 0 ? (
        <EmptyState title="No hooks yet." hint="Enter a topic and choose a category to get 10 variations." />
      ) : (
        <div className="mt-3 grid gap-3">
          {results.map((text) => (
            <HookRow key={text} text={text} isSaved={saved.includes(text)} onSave={() => save.mutate(text)} />
          ))}
        </div>
      )}
    </div>
  )
}

function Saved({ saved, remove }) {
  if (saved.length === 0) {
    return <EmptyState title="No saved hooks yet." hint="Save hooks from the Library or Generator and they will show up here." />
  }
  return (
    <div className="grid gap-3">
      {saved.map((text) => (
        <HookRow key={text} text={text} onRemove={() => remove.mutate(text)} />
      ))}
    </div>
  )
}

export default function Hooks() {
  const [tab, setTab] = useState('Library')
  const { saved, save, remove } = useSavedHooks()

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Hooks</h1>
      <p className="mb-4 text-gray-500">Proven openers for your first 3 seconds. Free to use.</p>
      <div role="tablist" className="mb-5 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              tab === t ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
            }`}
          >
            {t === 'Saved' ? `Saved (${saved.length})` : t}
          </button>
        ))}
      </div>
      {tab === 'Library' && <Library saved={saved} save={save} />}
      {tab === 'Generator' && <Generator saved={saved} save={save} />}
      {tab === 'Saved' && <Saved saved={saved} remove={remove} />}
    </div>
  )
}