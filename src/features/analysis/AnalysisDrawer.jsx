import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { useCredits } from '@/hooks/useCredits'
import { CREDIT_COST } from '@/lib/constants'
import { buildLlmText } from '@/lib/exportForLlm'
import { useToast } from '@/components/Toast'
import Drawer from '@/components/Drawer'
import Button from '@/components/Button'
import Card from '@/components/Card'
import AddToProject from '@/features/projects/AddToProject'

const TABS = ['Summary', 'Transcript', 'Caption', 'Idea', 'Hook', 'Format', 'Visual']

export default function AnalysisDrawer({ video, onClose }) {
  const [tab, setTab] = useState('Summary')
  const { credits, spend } = useCredits()
  const toast = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: analysis } = useQuery({
    queryKey: ['analysis', video?.id],
    queryFn: () => api.getAnalysis(video.id),
    enabled: !!video,
  })

  const run = useMutation({
    mutationFn: () => api.analyzeVideo(video.id),
    onSuccess: ({ analysis, charged }) => {
      if (charged) spend(CREDIT_COST.analyze) // charge only after success
      queryClient.setQueryData(['analysis', video.id], analysis)
      toast('Analysis complete')
    },
    onError: (err) => toast(err.message),
  })

  const makeScript = useMutation({
    mutationFn: () => api.createScript(video, analysis),
    onSuccess: () => {
      spend(CREDIT_COST.script) // charge only after success
      queryClient.invalidateQueries({ queryKey: ['scripts'] })
      toast('Script ready')
      onClose()
      navigate('/scripts')
    },
    onError: () => toast('Script failed. You were not charged. Please try again.'),
  })

  if (!video) return null

  const copyForLlm = async () => {
    try {
      await navigator.clipboard.writeText(buildLlmText(video, analysis))
      toast('Copied. Paste it into your AI tool.')
    } catch {
      toast('Could not copy. Please try again.')
    }
  }

  const noCredits = (cost) => credits < cost

  return (
    <Drawer open onClose={onClose} title="Video analysis">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold leading-snug">{video.title}</h2>
          <p className="text-sm text-gray-500">
            {video.creator} · {video.platform} · {video.outlierScore}× outlier
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>

      {analysis ? (
        <>
          <div role="tablist" className="my-4 flex flex-wrap gap-1">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-lg border px-3 py-1 text-sm ${
                  tab === t ? 'border-transparent bg-indigo-100 font-semibold text-indigo-700' : 'border-gray-200 text-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <Card>{analysis[tab.toLowerCase()]}</Card>
                    <div className="mt-3"><AddToProject asset={{ type: 'video', refId: video.id, title: video.title }} /></div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => makeScript.mutate()}
              disabled={makeScript.isPending || noCredits(CREDIT_COST.script)}
            >
              {makeScript.isPending ? 'Writing script' : `Create script (${CREDIT_COST.script} credit)`}
            </Button>
            <Button variant="secondary" onClick={copyForLlm}>Export for LLM</Button>
          </div>
          {noCredits(CREDIT_COST.script) && (
            <p className="mt-2 text-sm font-medium text-amber-700">
              You have no credits left. Billing is coming soon. Credits reset next month.
            </p>
          )}
        </>
      ) : (
        <Card className="mt-5">
          {run.isPending ? (
            <p>Processing. This usually takes a few seconds.</p>
          ) : (
            <p>
              Analyzing this video costs {CREDIT_COST.analyze} credit. You are only charged if it finishes.
            </p>
          )}
          {noCredits(CREDIT_COST.analyze) && (
            <p className="mt-2 text-sm font-medium text-amber-700">
              You have no credits left. Billing is coming soon. Credits reset next month.
            </p>
          )}
          <Button
            className="mt-3"
            onClick={() => run.mutate()}
            disabled={run.isPending || noCredits(CREDIT_COST.analyze)}
          >
            {run.isPending ? 'Processing' : `Analyze video (${CREDIT_COST.analyze} credit)`}
          </Button>
        </Card>
      )}
    </Drawer>
  )
}