import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { CREDIT_COST } from '@/lib/constants'
import { useCredits } from '@/hooks/useCredits'
import { useToast } from '@/components/Toast'
import Button from '@/components/Button'

export default function GenerateReportButton({ video }) {
  const { credits, spend } = useCredits()
  const toast = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const run = useMutation({
    mutationFn: () => api.createReport(video.id),
    onSuccess: ({ report, charged }) => {
      if (charged) spend(CREDIT_COST.report) // charge only after success
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      toast(charged ? 'Report ready' : 'You already have a report for this video')
      navigate(`/reports/${report.id}`)
    },
    onError: (err) => toast(err.message),
  })

  return (
    <Button
      variant="secondary"
      onClick={() => run.mutate()}
      disabled={run.isPending || credits < CREDIT_COST.report}
    >
      {run.isPending ? 'Generating report' : `Generate report (${CREDIT_COST.report} credit)`}
    </Button>
  )
}