let ideas = []
let nextId = 1
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// Called by the analysis step. Ideas are free: no extra credit.
export function addIdea(video, analysis) {
  if (ideas.some((i) => i.videoId === video.id)) return
  ideas = [
    {
      id: nextId++,
      videoId: video.id,
      title: `Idea: ${video.title}`,
      sourceTitle: video.title,
      creator: video.creator,
      views: video.views,
      engagement: video.engagement,
      positioning: `A ${video.niche.toLowerCase()} creator who proves a bold claim with a simple, repeatable method.`,
      format: analysis.format,
      contrast: 'What most people expect, versus the surprising result you show in the first 3 seconds.',
      personalization: [
        'Swap the topic for the biggest myth in your own niche.',
        'Use your own numbers, or a before and after from your life.',
        'Keep the opening line, change the proof.',
      ],
      shortlisted: false,
    },
    ...ideas,
  ]
}

export async function getIdeas() {
  await delay(150)
  return [...ideas]
}

export async function toggleShortlist(id) {
  await delay(100)
  ideas = ideas.map((i) => (i.id === id ? { ...i, shortlisted: !i.shortlisted } : i))
  return ideas.find((i) => i.id === id)
}