import { getVideoById } from './videos'
import { getAnalysis } from './analysis'

let reports = []
let nextId = 1
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// A video that already has a report is returned as-is and not charged again
export async function createReport(videoId) {
  const existing = reports.find((r) => r.videoId === videoId)
  if (existing) return { report: existing, charged: false }

  await delay(1500)
  const analysis = await getAnalysis(videoId)
  if (!analysis) throw new Error('Analyze this video first.')
  const v = getVideoById(videoId)

  const report = {
    id: nextId++,
    videoId,
    title: `Report: ${v.title}`,
    creator: v.creator,
    platform: v.platform,
    createdAt: new Date().toISOString(),
    sections: [
      { heading: 'Video summary', body: analysis.summary },
      {
        heading: 'Performance explanation',
        body: `This video reached ${v.views.toLocaleString()} views, which is ${v.outlierScore}× the channel's average of ${v.channelAvg.toLocaleString()}. Engagement was ${v.engagement}%, so viewers watched and reacted, not just scrolled past.`,
      },
      {
        heading: 'Audience appeal',
        body: `People who follow ${v.niche.toLowerCase()} content get a clear, believable result they can try themselves.`,
      },
      { heading: 'Hook breakdown', body: analysis.hook },
      {
        heading: 'Story structure',
        body: 'Result first, then three short steps, then proof, then a call to action. Each step fits in about 5 seconds.',
      },
      { heading: 'Format identification', body: analysis.format },
      {
        heading: 'Recommendations for recreating the concept',
        body: `- Keep the opening result and the three-step structure.\n- Change the topic, the proof and the visuals so the video is yours.\n- Match the visual style: ${analysis.visual}`,
      },
    ],
  }
  reports = [report, ...reports]
  return { report, charged: true }
}

export async function getReports() {
  await delay(150)
  return [...reports]
}

export async function getReport(id) {
  await delay(100)
  return reports.find((r) => r.id === id) ?? null
}