import { SCRIPT_BLOCKS } from '@/lib/constants'

let scripts = []
let nextId = 1
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getScripts() {
  await delay(150)
  return [...scripts]
}

export async function createScript(video, analysis) {
  await delay(1200)
  const script = {
    id: nextId++,
    version: 1,
    videoId: video.id,
    title: `Script: ${video.title}`,
    blocks: {
      Hook: `"${video.title}." Say the result in the very first line.`,
      Introduction: 'Quick context: who you are and why this matters right now.',
      'Main content': `Three short steps that prove the claim. ${analysis.idea}`,
      'Story flow': analysis.format,
      CTA: 'Ask viewers to follow for part two.',
      Ending: 'Loop back to the opening line.',
    },
  }
  scripts = [script, ...scripts]
  return script
}

export async function updateScript(id, blocks) {
  await delay(100)
  scripts = scripts.map((s) => (s.id === id ? { ...s, blocks } : s))
  return scripts.find((s) => s.id === id)
}

// Expanding a script is free in v1 (no extra credit)
export async function expandScript(id) {
  await delay(900)
  scripts = scripts.map((s) =>
    s.id === id
      ? {
          ...s,
          version: s.version + 1,
          blocks: {
            ...s.blocks,
            'Main content': s.blocks['Main content'] + '\n\nExtra example: show a before and after to make the result believable.\nExtra tip: name the most common mistake and how to avoid it.',
          },
        }
      : s
  )
  return scripts.find((s) => s.id === id)
}

export { SCRIPT_BLOCKS }