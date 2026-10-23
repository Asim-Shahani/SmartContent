import { getVideoById } from './videos'
import { addIdea } from './ideas'

const store = new Map() // analyzed videos, kept in memory
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const FAIL_RATE = 0 // set to 0.5 to test the "failed analysis" state

export async function getAnalysis(videoId) {
  await delay(100)
  return store.get(videoId) ?? null
}

export async function analyzeVideo(videoId) {
  // Already analyzed: return it again and do NOT charge (idempotent)
  if (store.has(videoId)) return { analysis: store.get(videoId), charged: false }

  await delay(1500)
  if (Math.random() < FAIL_RATE) {
    throw new Error('Analysis failed. You were not charged. Please try again.')
  }

  const v = getVideoById(videoId)
  const analysis = {
    videoId,
    summary: `A ${v.niche.toLowerCase()} video that pairs a bold promise with a simple, repeatable demo. It works because viewers get a clear payoff in the first few seconds.`,
    transcript: `"${v.title}." Here is what I did, and here is why it worked. (Sample transcript.)`,
    caption: `${v.title} #${v.niche.toLowerCase()} #fyp`,
    idea: 'Show one surprising result, then explain the simple method behind it.',
    hook: 'The first 3 seconds state the result before the method, which creates a curiosity gap.',
    format: 'Breakdown: result first, then three quick steps, then a call to action.',
    visual: 'Close-up shots, text overlay on the first frame, fast cuts every 2 seconds.',
  }
  store.set(videoId, analysis)
  addIdea(v, analysis) // idea is created automatically, at no extra cost
  return { analysis, charged: true }
}