import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'
import ExportMenu from '@/features/exports/ExportMenu'

export default function ReportDetail() {
  const { id } = useParams()
  const { data: report, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: () => api.getReport(Number(id)),
  })

  if (isLoading) return <p className="text-gray-500">Loading…</p>
  if (!report) return <EmptyState title="Report not found." hint="Go back to Reports and pick another one." />

  return (
    <div>
      <Link to="/reports" className="text-sm text-indigo-700">← Back to Reports</Link>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">{report.title}</h1>
      <p className="mb-4 text-gray-500">
        {report.creator} · {report.platform} · {new Date(report.createdAt).toLocaleDateString()}
      </p>
      <div className="mb-5"><ExportMenu type="report" data={report} /></div>

      <div className="grid gap-4">
        {report.sections.map((s) => (
          <Card key={s.heading}>
            <h2 className="mb-1 font-bold">{s.heading}</h2>
            <p className="whitespace-pre-line text-sm">{s.body}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}