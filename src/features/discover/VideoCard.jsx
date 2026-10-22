import Card from '@/components/Card'

const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : Math.round(n / 1e3) + 'K')

export default function VideoCard({ video, onOpen }) {
  const v = video
  return (
    <button onClick={() => onOpen?.(v)} className="text-left">
      <Card className="flex h-full flex-col gap-2 hover:border-indigo-500">
        <div className="flex h-28 items-end justify-between rounded-lg bg-gradient-to-br from-indigo-600 to-violet-400 p-2 text-xs text-white">
          <span>{v.platform}</span><span>{v.postedAt}</span>
        </div>
        <b>{v.title}</b>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{v.creator}</span><span>{v.niche}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {v.outlierScore}×<small className="ml-1 text-xs font-medium text-gray-500">vs channel average</small>
        </div>
        <div className="grid gap-1">
          <div className="h-2 rounded bg-gray-200"><div className="h-full w-full rounded bg-amber-400" /></div>
          <div className="h-2 rounded bg-gray-200">
            <div className="h-full rounded bg-gray-500" style={{ width: `${100 / v.outlierScore}%` }} />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{fmt(v.views)} views (avg {fmt(v.channelAvg)})</span>
          <span>{v.engagement}% engagement</span>
        </div>
      </Card>
    </button>
  )
}