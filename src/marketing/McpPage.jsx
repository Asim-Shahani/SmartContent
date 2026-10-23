import { Link } from 'react-router-dom'
import { cta } from './styles'

const SKILLS = [
  '/analyze', '/channels-add', '/channels-recap', '/channels-search', '/channels-suggest',
  '/topic', '/formats-watchlist', '/hooks-watchlist', '/video-suggest', '/videos-watchlist',
]
const USE_CASES = [
  ['AI content strategist', 'Finds hidden patterns across the channels you track.'],
  ['Outlier detection system', 'Alerts you when something in your niche goes viral.'],
  ['Script comparison', 'Compare your own script against what your competitors are doing.'],
]
const SETUP = [
  'Download the plugin from Settings, then Connectors.',
  'Install it in Claude Desktop.',
  'Authorize once.',
  'Set what Claude is allowed to do for each tool.',
  'Use it in a normal chat.',
]

export default function McpPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Use Smart Content inside Claude</h1>
      <p className="mt-3 text-lg text-gray-600">
        Ask Claude about your research in plain language, or run a command. Your watchlists, videos and hooks are available right in the chat.
      </p>
      <p className="mt-3 rounded-lg bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800">
        The Claude connector is available to accounts enabled by our team. Self-serve activation is not open yet.
      </p>

      <h2 className="mt-10 text-2xl font-bold">What you can do</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {USE_CASES.map(([t, d]) => (
          <div key={t} className="rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold">{t}</h3>
            <p className="mt-1 text-sm text-gray-600">{d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-bold">10 commands</h2>
      <p className="mt-1 text-sm text-gray-600">You can also just type what you want, and Claude picks the right one.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {SKILLS.map((s) => (
          <code key={s} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">{s}</code>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-bold">Set up in about 3 minutes</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-700">
        {SETUP.map((s) => <li key={s}>{s}</li>)}
      </ol>
      <p className="mt-4 text-sm text-gray-600">
        You control access for each tool: always allow, needs approval, blocked, or custom.
      </p>

      <Link to="/signup" className={`${cta} mt-8`}>Create a free account</Link>
    </main>
  )
}