import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/api'
import { useWatchlist } from '@/hooks/useWatchlist'
import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

const field = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'
const TABS = ['Suggested', 'Describe', 'Search', 'Paste link']
const fmt = (n) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n)

function ChannelRow({ channel, children }) {
  return (
    <Card className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700"
      >
        {channel.name[0]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{channel.name}</p>
        <p className="text-xs text-gray-500">{channel.username} · {channel.platform} · {channel.niche}</p>
        <p className="text-xs text-gray-500">{fmt(channel.followers)} followers · {fmt(channel.views)} views</p>
      </div>
      {children}
    </Card>
  )
}

function Results({ channels, w, atLimit }) {
  const added = new Set(w.watchlist.map((c) => c.id))
  return (
    <div className="grid gap-3">
      {channels.map((c) => (
        <ChannelRow key={c.id} channel={c}>
          <Button
            variant="secondary"
            onClick={() => w.add.mutate(c.id)}
            disabled={added.has(c.id) || atLimit || w.add.isPending}
          >
            {added.has(c.id) ? 'Added' : 'Add'}
          </Button>
        </ChannelRow>
      ))}
    </div>
  )
}

function Suggested({ w, atLimit }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['suggested', w.wsId, w.watchlist.length],
    queryFn: () => api.getSuggestedChannels(w.wsId),
  })
  if (isLoading) return <p className="text-gray-500">Loading suggestions…</p>
  if (data.length === 0) return <EmptyState title="No more suggestions." hint="You have added all the channels we suggest." />
  return <Results channels={data} w={w} atLimit={atLimit} />
}

function Describe({ w, atLimit }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const find = useMutation({ mutationFn: () => api.describeChannels(text), onSuccess: setResults })

  const run = () => {
    if (text.trim().length < 3) {
      setError('Describe the creators you want, for example "fitness creators for beginners".')
      return
    }
    setError('')
    find.mutate()
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Describe the channels you want"
        placeholder='For example: "fitness creators for beginners" or "AI tools for productivity"'
        className={`${field} mb-2 min-h-20 w-full`}
      />
      <Button onClick={run} disabled={find.isPending}>
        {find.isPending ? 'Finding channels' : 'Find channels'}
      </Button>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      <div className="mt-4">
        {results === null ? null : results.length === 0 ? (
          <EmptyState title="No matches yet." hint="Try a niche such as fitness, finance, tech or food." />
        ) : (
          <Results channels={results} w={w} atLimit={atLimit} />
        )}
      </div>
    </div>
  )
}

function Search({ w, atLimit }) {
  const [q, setQ] = useState('')
  const enabled = q.trim().length >= 2
  const { data = [], isFetching } = useQuery({
    queryKey: ['channelSearch', q],
    queryFn: () => api.searchChannels(q),
    enabled,
  })
  return (
    <div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search creators"
        placeholder="Search by name or username"
        className={`${field} mb-4 w-full`}
      />
      {!enabled ? (
        <p className="text-sm text-gray-500">Type at least 2 letters.</p>
      ) : isFetching ? (
        <p className="text-gray-500">Searching…</p>
      ) : data.length === 0 ? (
        <EmptyState title="No creators found." hint="Check the spelling or try part of the name." />
      ) : (
        <Results channels={data} w={w} atLimit={atLimit} />
      )}
    </div>
  )
}

function PasteLink({ w, atLimit }) {
  const [url, setUrl] = useState('')
  const submit = () => {
    if (!url.trim()) return
    w.addByUrl.mutate(url, { onSuccess: () => setUrl('') })
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            w.addByUrl.reset()
          }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          aria-label="Channel link"
          placeholder="https://www.tiktok.com/@username"
          className={`${field} min-w-52 flex-1`}
        />
        <Button onClick={submit} disabled={w.addByUrl.isPending || atLimit}>
          {w.addByUrl.isPending ? 'Checking link' : 'Add channel'}
        </Button>
      </div>
      {w.addByUrl.isError && (
        <p className="mt-2 text-sm font-medium text-red-600">{w.addByUrl.error.message}</p>
      )}
      <p className="mt-2 text-sm text-gray-500">Supported: TikTok, Instagram and YouTube links.</p>
    </div>
  )
}

export default function Channels() {
  const w = useWatchlist()
  const [tab, setTab] = useState('Suggested')
  const atLimit = w.watchlist.length >= w.limit

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Channels</h1>
      <p className="mb-5 text-gray-500">Build a watchlist of creators to learn from.</p>

      <Card className="mb-8">
        <h2 className="mb-3 font-bold">Add channels</h2>
        <div role="tablist" className="mb-4 flex flex-wrap gap-1">
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
              {t}
            </button>
          ))}
        </div>
        {atLimit && (
          <p className="mb-3 text-sm font-medium text-amber-700">
            You have reached your plan limit of {w.limit} channels for this workspace. Remove one to add another.
          </p>
        )}
        {tab === 'Suggested' && <Suggested w={w} atLimit={atLimit} />}
        {tab === 'Describe' && <Describe w={w} atLimit={atLimit} />}
        {tab === 'Search' && <Search w={w} atLimit={atLimit} />}
        {tab === 'Paste link' && <PasteLink w={w} atLimit={atLimit} />}
      </Card>

      <h2 className="mb-3 text-lg font-bold">
        Your watchlist <span className="text-sm font-medium text-gray-500">({w.watchlist.length} / {w.limit})</span>
      </h2>
      {w.watchlist.length === 0 ? (
        <EmptyState title="Your watchlist is empty." hint="Add a few channels above to start tracking them." />
      ) : (
        <div className="grid gap-3">
          {w.watchlist.map((c) => (
            <ChannelRow key={c.id} channel={c}>
              <Button variant="secondary" onClick={() => w.remove.mutate(c.id)}>Remove</Button>
            </ChannelRow>
          ))}
        </div>
      )}
    </div>
  )
}