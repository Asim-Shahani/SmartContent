import { useState } from 'react'
import { buildExport } from '@/lib/exporters'
import { downloadText } from '@/lib/downloadText'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'

const item = 'w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent'

export default function ExportMenu({ type, data }) {
  const [open, setOpen] = useState(false)
  const toast = useToast()

  const run = async (format) => {
    const out = buildExport(type, data, format)
    setOpen(false)
    if (format === 'llm') {
      try {
        await navigator.clipboard.writeText(out.text)
        toast('Copied. Paste it into your AI tool.')
      } catch {
        toast('Could not copy. Please try again.')
      }
      return
    }
    downloadText(out.filename, out.text, out.mime)
    toast(`Downloaded ${out.filename}`)
  }

  return (
    <div className="relative inline-block" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <Button variant="secondary" aria-expanded={open} onClick={() => setOpen(!open)}>
        Export ▾
      </Button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-56 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          <button className={item} onClick={() => run('md')}>Markdown (.md)</button>
          <button className={item} onClick={() => run('json')}>JSON (.json)</button>
          <button className={item} onClick={() => run('llm')}>Copy for LLM</button>
          <button className={item} disabled>PDF (coming soon)</button>
          <button className={item} disabled>Notion (coming soon)</button>
        </div>
      )}
    </div>
  )
}