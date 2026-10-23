import { Link } from 'react-router-dom'
import { TrendingUp, FileSearch, Zap, PenLine, Layers, Lightbulb, Plug, Play } from 'lucide-react'
import { cta, ctaSecondary } from './styles'
import { DEMO_VIDEO_ID, TESTIMONIALS } from './content'

const COLORS = ['bg-indigo-500', 'bg-violet-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500']
const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2)

function Avatar({ name, i, ring = true }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${ring ? 'ring-2 ring-white' : ''} ${COLORS[i % COLORS.length]}`}
    >
      {initials(name)}
    </span>
  )
}

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 text-center">
      <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
        Stop guessing what to post. Find what works, then write the script.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
        Smart Content finds videos that beat their channel’s average, explains why they worked, and turns the pattern into your own script.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/signup" className={cta}>Try it free</Link>
        <Link to="/#how-it-works" className={ctaSecondary}>See how it works</Link>
      </div>
      <p className="mt-3 text-sm text-gray-500">No credit card needed. 100 free credits a month.</p>

      <div className="mx-auto mt-10 max-w-4xl">
        {DEMO_VIDEO_ID ? (
          <iframe
            title="Smart Content demo"
            src={`https://player.vimeo.com/video/${DEMO_VIDEO_ID}`}
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-xl border border-gray-200"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-600 to-violet-400 text-white">
            <Play aria-hidden="true" size={40} />
            <p className="text-sm font-semibold">Demo video coming soon</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function SocialProof() {
  return (
    <section aria-label="Social proof" className="border-y border-gray-200 bg-gray-50 py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4">
        <div className="flex -space-x-2">
          {TESTIMONIALS.slice(0, 6).map((t, i) => <Avatar key={t.name} name={t.name} i={i} />)}
        </div>
        <p className="font-semibold">Trusted by 100k+ users</p>
      </div>
    </section>
  )
}

const FEATURES = [
  [TrendingUp, 'Outlier videos', 'See videos that beat their own channel’s average.'],
  [FileSearch, 'Deep analysis', 'Know why a video worked: hook, format, structure and visuals.'],
  [Zap, 'Hooks library', 'Proven openers by niche, plus dozens of variations in seconds.'],
  [PenLine, 'Script writer', 'Turn any analyzed video into a script in one click.'],
  [Layers, 'Free collections', '100+ curated patterns, free on every plan.'],
  [Lightbulb, 'Ideas', 'Every analysis creates an idea you can shortlist and reuse.'],
  [Plug, 'Claude connector', 'Use your research data right inside Claude.'],
]

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16">
      <h2 className="text-center text-3xl font-bold tracking-tight">Everything from research to script</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(([Icon, title, text]) => (
          <div key={title} className="rounded-xl border border-gray-200 p-5">
            <Icon aria-hidden="true" className="text-indigo-600" size={24} />
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const STEPS = [
  ['Track top channels', 'Build a watchlist of the creators in your niche.'],
  ['Find outlier videos', 'Filter by outlier score to see what really broke out.'],
  ['Understand why it worked', 'Read the hook, format and structure breakdown.'],
  ['Write your script', 'Turn the pattern into a script you can record today.'],
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight">From zero research to a script in 10 minutes</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="rounded-xl border border-gray-200 bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{i + 1}</span>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-center text-3xl font-bold tracking-tight">What creators say</h2>
      <div className="mt-8 gap-4 sm:columns-2 lg:columns-3">
        {TESTIMONIALS.map((t, i) => (
          <figure key={t.name} className="mb-4 break-inside-avoid rounded-xl border border-gray-200 p-4">
            <blockquote className="text-sm">“{t.quote}”</blockquote>
            <figcaption className="mt-3 flex items-center gap-2">
              <Avatar name={t.name} i={i} ring={false} />
              <span className="text-xs text-gray-600"><b className="text-gray-900">{t.name}</b> · {t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="bg-indigo-600 py-14 text-center text-white">
      <h2 className="text-3xl font-bold tracking-tight">Write your next script with proof behind it</h2>
      <p className="mt-2 text-indigo-100">Free to start. No credit card needed.</p>
      <Link to="/signup" className="mt-5 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700">
        Try it free
      </Link>
    </section>
  )
}