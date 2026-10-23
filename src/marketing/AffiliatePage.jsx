import ComingSoonBadge from '@/components/ComingSoonBadge'
import WaitlistForm from './WaitlistForm'

export default function AffiliatePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <ComingSoonBadge />
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Affiliate program</h1>
      <p className="mt-3 text-lg text-gray-600">
        Share Smart Content with your audience and get rewarded. The program is not open yet, and the commission details will be shared when it launches.
      </p>
      <div className="mt-8 rounded-xl border border-gray-200 p-5">
        <p className="mb-3 font-semibold">Join the affiliate waitlist</p>
        <WaitlistForm planId="affiliate" label="Join waitlist" />
      </div>
    </main>
  )
}