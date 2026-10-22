import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import Card from '@/components/Card'

const compact = (n) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n)

export default function MetricChart({ title, data, dataKey, type = 'bar' }) {
  const last = data[data.length - 1]
  const label = `${title}. Latest value ${last[dataKey].toLocaleString()} on ${last.date}.`
  const Chart = type === 'bar' ? BarChart : LineChart

  return (
    <Card>
      <h2 className="mb-2 font-bold">{title}</h2>
      <div role="img" aria-label={label} className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24} />
            <YAxis tick={{ fontSize: 11 }} width={48} tickFormatter={compact} />
            <Tooltip formatter={(v) => v.toLocaleString()} />
            {type === 'bar' ? (
              <Bar dataKey={dataKey} fill="#4f46e5" radius={[3, 3, 0, 0]} />
            ) : (
              <Line type="monotone" dataKey={dataKey} stroke="#4f46e5" strokeWidth={2} dot={false} />
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}