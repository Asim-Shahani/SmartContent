import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'
import EmptyState from '@/components/EmptyState'
import VideoCard from './VideoCard'

const select = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'

export default function Discover() {
  const [filters, setFilters] = useState({ niche: '', platform: '', minOutlier: 0, sort: 'outlier' })
  const set = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: key === 'minOutlier' ? Number(e.target.value) : e.target.value }))

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos', filters],
    queryFn: () => api.getVideos(filters),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
      <p className="mb-5 text-gray-500">Videos that beat their channel’s own average.</p>

      <div className="mb-4 flex flex-wrap gap-2">
        <select className={select} value={filters.niche} onChange={set('niche')}>
          <option value="">All niches</option>
          {['Fitness', 'Finance', 'Tech', 'Food'].map((n) => <option key={n}>{n}</option>)}
        </select>
        <select className={select} value={filters.platform} onChange={set('platform')}>
          <option value="">All platforms</option>
          {['TikTok', 'Reels', 'Shorts'].map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className={select} value={filters.minOutlier} onChange={set('minOutlier')}>
          <option value={0}>Any outlier score</option>
          {[5, 10, 15].map((n) => <option key={n} value={n}>{n}× or more</option>)}
        </select>
        <select className={select} value={filters.sort} onChange={set('sort')}>
          <option value="outlier">Sort by outlier score</option>
          <option value="views">Sort by views</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading videos…</p>
      ) : videos.length === 0 ? (
        <EmptyState title="No videos match these filters." hint="Try a lower outlier score or another niche." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  )
}