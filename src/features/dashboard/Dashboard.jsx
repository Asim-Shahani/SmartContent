import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import Button from '@/components/Button'
import Card from '@/components/Card'
import ConnectAccount from './ConnectAccount'
import MetricChart from './MetricChart'

const RANGES = [['7d', 7, '7 days'], ['30d', 30, '30 days'], ['90d', 90, '90 days'], ['custom', null, 'Custom']]
const daysBetween = (from, to) => Math.round((new Date(to) - new Date(from)) / 86400000) + 1
const BADGE = {
  'Above average': 'bg-green-100 text-green-800',
  'On average': 'bg-gray-100 text-gray-700',
  'Below average': 'bg-amber-100 text-amber-800',
}

function Stat({ label, value }) {
  return (
    <Card>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </Card>
  )
}

export default function Dashboard() {
  const queryClient = useQueryClient()
  const [range, setRange] = useState('30d')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const { data: connection, isLoading: loadingConnection } = useQuery({
    queryKey: ['connection'],
    queryFn: () => api.getConnection(),
  })

  let days = RANGES.find((r) => r[0] === range)[1]
  let customError = ''
  if (range === 'custom') {
    if (!from || !to) customError = 'Choose a start and end date.'
    else {
      const n = daysBetween(from, to)
      if (n < 1) customError = 'The end date must be after the start date.'
      else if (n > 365) customError = 'Choose a range of 365 days or less.'
      else days = n
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', days],
    queryFn: () => api.getDashboard({ days }),
    enabled: !!connection && !!days && !customError,
  })

  const disconnect = useMutation({
    mutationFn: () => api.disconnectAccount(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['connection'] }),
  })

  if (loadingConnection) return <p className="text-gray-500">Loading…</p>

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">
            {connection ? `${connection.handle} on ${connection.platform}` : 'Performance of your connected accounts.'}
          </p>
        </div>
        {connection && (
          <Button variant="secondary" onClick={() => disconnect.mutate()}>Disconnect (demo)</Button>
        )}
      </div>

      {!connection ? (
        <Card>
          <h2 className="text-lg font-bold">Connect your account to see your numbers</h2>
          <p className="mb-4 mt-1 text-sm text-gray-500">
            This is optional. You can still use{' '}
            <Link to="/discover" className="text-indigo-700">Discover</Link>,{' '}
            <Link to="/collections" className="text-indigo-700">Collections</Link>,{' '}
            <Link to="/hooks" className="text-indigo-700">Hooks</Link> and{' '}
            <Link to="/scripts" className="text-indigo-700">Scripts</Link> without connecting.
          </p>
          <ConnectAccount />
        </Card>
      ) : (
        <>
          <div role="group" aria-label="Time period" className="mb-2 flex flex-wrap items-center gap-1">
            {RANGES.map(([id, , label]) => (
              <button
                key={id}
                aria-pressed={range === id}
                onClick={() => setRange(id)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  range === id ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
                }`}
              >
                {label}
              </button>
            ))}
            {range === 'custom' && (
              <>
                <input type="date" aria-label="Start date" value={from} onChange={(e) => setFrom(e.target.value)}
                  className="ml-2 rounded-lg border border-gray-300 px-2 py-1 text-sm" />
                <span className="text-sm text-gray-500">to</span>
                <input type="date" aria-label="End date" value={to} onChange={(e) => setTo(e.target.value)}
                  className="rounded-lg border border-gray-300 px-2 py-1 text-sm" />
              </>
            )}
          </div>
          {customError && <p className="mb-3 text-sm font-medium text-amber-700">{customError}</p>}

          {isLoading || !data ? (
            !customError && <p className="mt-4 text-gray-500">Loading your numbers…</p>
          ) : (
            <>
              <div className="mb-4 mt-3 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
                <Stat label="Total followers" value={data.totals.followers.toLocaleString()} />
                <Stat label="Followers gained" value={`+${data.totals.gained.toLocaleString()}`} />
                <Stat label="Total views" value={data.totals.views.toLocaleString()} />
                <Stat label="Posts" value={data.totals.posts} />
              </div>

              <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
                <MetricChart title="Views by day" data={data.daily} dataKey="views" />
                <MetricChart title="Cumulative views" data={data.daily} dataKey="cumViews" type="line" />
                <MetricChart title="Followers gained by day" data={data.daily} dataKey="gained" />
                <MetricChart title="Cumulative followers" data={data.daily} dataKey="cumFollowers" type="line" />
              </div>

              <h2 className="mb-3 text-lg font-bold">Recent videos</h2>
              <div className="grid gap-3">
                {data.recent.map((v) => (
                  <Card key={v.id} className="flex items-center gap-3">
                    <div className="h-14 w-10 shrink-0 rounded bg-gradient-to-br from-indigo-600 to-violet-400" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{v.title}</p>
                      <p className="text-xs text-gray-500">{v.platform} · {v.postedAt} · {v.views.toLocaleString()} views</p>
                    </div>
                    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE[v.performance]}`}>
                      {v.performance}
                    </span>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}