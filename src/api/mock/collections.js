const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const RAW = [
  ['Formats', 'Split-screen comparison', 14],
  ['Formats', 'Day in the life', 22],
  ['Formats', 'Talking-head explainer', 19],
  ['Editing styles', 'Jump-cut montage', 18],
  ['Editing styles', 'Text-on-screen story', 11],
  ['Editing styles', 'Speed ramp transitions', 9],
  ['Visual hooks', '3P crash zoom', 9],
  ['Visual hooks', 'Object reveal', 16],
  ['Visual hooks', 'Freeze-frame question', 12],
  ['Signature series', '$5 around the world', 6],
  ['Signature series', 'Things I wish I knew', 8],
  ['Signature series', 'Rate my setup', 7],
]

const COLLECTIONS = RAW.map(([category, name, examples]) => ({
  id: slug(name),
  category,
  name,
  examples,
  summary: `A group of ${examples} videos that all use the "${name}" pattern.`,
  breakdown: [
    `The pattern: ${name} is repeated the same way in every example.`,
    'Why it works: the viewer understands the payoff within the first 3 seconds.',
    'How to use it: keep the structure, change the topic and the visuals.',
  ],
  transcript: `Sample transcript for "${name}". The creator states the result first, shows the method, then ends with a short call to action.`,
  videos: Array.from({ length: Math.min(examples, 4) }, (_, i) => `Example ${i + 1}: ${name}`),
}))

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getCollections({ category = '' } = {}) {
  await delay(200)
  return COLLECTIONS.filter((c) => !category || c.category === category)
}

export async function getCollection(id) {
  await delay(150)
  return COLLECTIONS.find((c) => c.id === id) ?? null
}