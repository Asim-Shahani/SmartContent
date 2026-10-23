import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { CREDIT_COST } from '@/lib/constants'
import { useCredits } from '@/hooks/useCredits'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

const fmt = (n) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n)

function Section({ title, children }) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      {children}
    </div>
  )
}

function IdeaCard({ idea }) {
  const { credits, spend } = useCredits()
  const toast = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const noCredits = credits < CREDIT_COST.script

  const shortlist = useMutation({
    mutationFn: () => api.toggleShortlist(idea.id),
    onSuccess: (i) => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      toast(i.shortlisted ? 'Added to shortlist' : 'Removed from shortlist')
    },
  })

  const toScript = useMutation({
    mutationFn: () => api.createScriptFromIdea(idea),
    onSuccess: () => {
      spend(CREDIT_COST.script) // charge only after success
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      toast('Script ready')
      navigate('/scripts')
    },
    onError: () => toast('Script failed. You were not charged. Please try again.'),
  })

  return (
    <Card>
      <h2 className="text-lg font-bold leading-snug">{idea.title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        From a video by {idea.creator} · {fmt(idea.views)} views · {idea.engagement}% engagement
      </p>

      <Section title="Content positioning"><p className="text-sm">{idea.positioning}</p></Section>
      <Section title="Storytelling format"><p className="text-sm">{idea.format}</p></Section>
      <Section title="Contrast mechanism"><p className="text-sm">{idea.contrast}</p></Section>
      <Section title="Personalization suggestions">
        <ul className="list-disc pl-5 text-sm">
          {idea.personalization.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </Section>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          aria-pressed={idea.shortlisted}
          onClick={() => shortlist.mutate()}
          disabled={shortlist.isPending}
        >
          {idea.shortlisted ? '★ Shortlisted' : '☆ Shortlist'}
        </Button>
        <Button onClick={() => toScript.mutate()} disabled={toScript.isPending || noCredits}>
          {toScript.isPending ? 'Writing script' : `Create script (${CREDIT_COST.script} credit)`}
        </Button>
      </div>
      {noCredits && (
        <p className="mt-2 text-sm font-medium text-amber-700">
          You have no credits left. Billing is coming soon. Credits reset next month.
        </p>
      )}
    </Card>
  )
}

export default function Ideas() {
  const [tab, setTab] = useState('All')
  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ['ideas'],
    queryFn: () => api.getIdeas(),
  })

  const shortlisted = ideas.filter((i) => i.shortlisted)
  const shown = tab === 'All' ? ideas : shortlisted

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Ideas</h1>
      <p className="mb-4 text-gray-500">
        Every analyzed video creates an idea for free. Shortlist the ones you like, then turn them into scripts.
      </p>

      <div role="tablist" className="mb-5 flex gap-1">
        {[['All', ideas.length], ['Shortlisted', shortlisted.length]].map(([t, n]) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              tab === t ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
            }`}
          >
            {t} ({n})
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading ideas…</p>
      ) : shown.length === 0 ? (
        tab === 'All' ? (
          <EmptyState title="No ideas yet." hint="Open a video in Discover and analyze it. An idea appears here automatically." />
        ) : (
          <EmptyState title="Nothing shortlisted yet." hint="Use the Shortlist button on an idea to save it here." />
        )
      ) : (
        <div className="grid gap-4">
          {shown.map((i) => <IdeaCard key={i.id} idea={i} />)}
        </div>
      )}
    </div>
  )
}