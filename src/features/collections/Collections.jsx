import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'
import { COLLECTION_CATEGORIES } from '@/lib/constants'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'

export default function Collections() {
  const [category, setCategory] = useState('')
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['collections', category],
    queryFn: () => api.getCollections({ category }),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
      <p className="mb-4 text-gray-500">
        Curated patterns from our team. Free on every plan, and they never use credits.
      </p>

      <div role="tablist" className="mb-5 flex flex-wrap gap-1">
        {['', ...COLLECTION_CATEGORIES].map((c) => (
          <button
            key={c || 'all'}
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              category === c ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
            }`}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading collections…</p>
      ) : collections.length === 0 ? (
        <EmptyState title="No collections here yet." hint="Try another category." />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {collections.map((c) => (
            <Link key={c.id} to={`/collections/${c.id}`}>
              <Card className="h-full hover:border-indigo-500">
                <p className="text-xs text-gray-500">{c.category}</p>
                <p className="mt-1 font-bold">{c.name}</p>
                <p className="mt-1 text-sm text-gray-500">{c.examples} example videos</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}