import { useState } from 'react'
import { FAQ } from './content'

export default function FaqSection() {
  const [tab, setTab] = useState('General')
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-16">
      <h2 className="text-center text-3xl font-bold tracking-tight">Questions</h2>
      <div role="tablist" className="mt-6 flex justify-center gap-1">
        {Object.keys(FAQ).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => { setTab(t); setOpen(0) }}
            className={`rounded-lg border px-4 py-1.5 text-sm ${
              tab === t ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200">
        {FAQ[tab].map((item, i) => (
          <div key={item.q}>
            <button
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold"
            >
              {item.q}
              <span aria-hidden="true" className="text-gray-400">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-gray-600">{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}