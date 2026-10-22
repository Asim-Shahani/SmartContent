import { useState } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import ComingSoonBadge from '@/components/ComingSoonBadge'
import Subscription from './Subscription'

const TABS = ['Subscription', 'Profile', 'Connectors']

export default function Settings() {
  const [tab, setTab] = useState('Subscription')

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight">Settings</h1>
      <div role="tablist" className="mb-5 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              tab === t ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Subscription' && <Subscription />}

      {tab === 'Profile' && (
        <Card>
          <p className="font-semibold">Account email</p>
          <p className="text-sm text-gray-500">you@example.com (sample)</p>
          <p className="mt-2 text-sm text-gray-500">Changing your email is not supported yet.</p>
        </Card>
      )}

      {tab === 'Connectors' && (
        <div className="grid gap-4">
          <Card>
            <p className="font-semibold">Claude connector (MCP)</p>
            <p className="my-2 text-sm text-gray-500">
              Available to accounts enabled by our team. Download the plugin, install it in Claude Desktop, then authorize once.
            </p>
            <Button disabled>Download plugin</Button>
          </Card>
          <Card>
            <p className="font-semibold">API access <ComingSoonBadge /></p>
            <p className="mt-2 text-sm text-gray-500">API access is not available yet.</p>
          </Card>
        </div>
      )}
    </div>
  )
}