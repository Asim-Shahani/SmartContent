import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'
import { useWorkspace } from '@/hooks/useWorkspace'
import EmptyState from '@/components/EmptyState'
import VideoCard from './VideoCard'
import AnalysisDrawer from '@/features/analysis/AnalysisDrawer'

const select = 'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm'

export default function Discover() {
  const { workspace } = useWorkspace()
  const [filters, setFilters] = useState({
    niche: '', platform: '', minOutlier: 0, sort: 'outlier', watchlistOnly: false,
  })
  const [selected, setSelected] = useState(null)
  const set = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: key === 'minOutlier' ? Number(e.target.value) : e.target.value }))

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos', filters, workspace.id],
    queryFn: () => api.getVideos({ ...filters, workspaceId: workspace.id }),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
      <p className="mb-5 text-gray-500">Videos that beat their channel’s own average.</p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
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
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.watchlistOnly}
            onChange={(e) => setFilters((f) => ({ ...f, watchlistOnly: e.target.checked }))}
          />
          My watchlist only
        </label>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading videos…</p>
      ) : videos.length === 0 ? (
        <EmptyState
          title="No videos match these filters."
          hint={
            filters.watchlistOnly
              ? 'Add channels on the Channels page, or turn off "My watchlist only".'
              : 'Try a lower outlier score or another niche.'
          }
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
          {videos.map((v) => <VideoCard key={v.id} video={v} onOpen={setSelected} />)}
        </div>
      )}

      <AnalysisDrawer video={selected} onClose={() => setSelected(null)} />
    </div>
  )
}