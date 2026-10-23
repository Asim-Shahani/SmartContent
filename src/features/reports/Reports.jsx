import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

export default function Reports() {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.getReports(),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <p className="mb-5 text-gray-500">Saved reports on why videos worked. Each new report costs 1 credit.</p>

      {isLoading ? (
        <p className="text-gray-500">Loading reports…</p>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No reports yet."
          hint="Open a video in Discover, analyze it, then choose Generate report."
        />
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => (
            <Link key={r.id} to={`/reports/${r.id}`}>
              <Card className="hover:border-indigo-500">
                <p className="font-bold">{r.title}</p>
                <p className="text-sm text-gray-500">
                  {r.creator} · {r.platform} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}