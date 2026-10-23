import { HELP_CENTER_URL } from './content'
import { cta } from './styles'

const ARTICLES = [
  ['Getting started', 'Create an account, name your workspace and find your first outlier video.'],
  ['How credits work', 'What costs a credit, what is free, and when credits reset.'],
  ['Understanding the outlier score', 'How a video is compared with its own channel’s average.'],
  ['Connecting a social account', 'Verify your account with a code in your bio.'],
  ['Setting up the Claude connector', 'Install the plugin and choose tool permissions.'],
  ['Signing in with a passkey', 'Use your fingerprint, face or device PIN instead of a password.'],
]

export default function HelpCenter() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Help center</h1>
      <p className="mt-3 text-lg text-gray-600">How-to articles for getting the most out of Smart Content.</p>

      {HELP_CENTER_URL && (
        <a href={HELP_CENTER_URL} target="_blank" rel="noreferrer" className={`${cta} mt-5`}>Open the full help center</a>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {ARTICLES.map(([title, text]) => (
          <div key={title} className="rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </main>
  )
}