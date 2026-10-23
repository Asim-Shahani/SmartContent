import { Link } from 'react-router-dom'
import { cta } from './styles'

const CATEGORIES = [
  ['Formats', 22, 'Split-screen comparison, Day in the life, Talking-head explainer'],
  ['Editing styles', 30, 'Jump-cut montage, Text-on-screen story, Speed ramp transitions'],
  ['Visual hooks', 47, '3P crash zoom, Object reveal, Freeze-frame question'],
  ['Signature series', 6, '$5 around the world, Things I wish I knew, Rate my setup'],
]

export default function CollectionsLanding() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">100+ video patterns, free for everyone</h1>
      <p className="mt-3 text-lg text-gray-600">
        Each collection groups real examples that share one pattern, with a transcript and a full breakdown. New videos are added every week.
      </p>
      <p className="mt-3 rounded-lg bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800">
        Collections are free on every plan and never use credits.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map(([name, count, examples]) => (
          <div key={name} className="rounded-xl border border-gray-200 p-5">
            <p className="text-3xl font-bold tracking-tight">{count}</p>
            <h2 className="font-bold">{name}</h2>
            <p className="mt-1 text-sm text-gray-600">For example: {examples}</p>
          </div>
        ))}
      </div>

      <ul className="mt-8 list-disc space-y-1 pl-5 text-gray-700">
        <li>Read the transcript and breakdown for every pattern</li>
        <li>Export a reference sheet for your editor</li>
        <li>Use a pattern as the starting point for your next script</li>
      </ul>

      <Link to="/signup" className={`${cta} mt-8`}>Browse collections free</Link>
    </main>
  )
}