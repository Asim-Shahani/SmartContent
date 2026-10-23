import { SCRIPT_BLOCKS } from '@/lib/constants'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60)

// Every exportable item is turned into a title plus sections
function toSections(type, data) {
  if (type === 'report') return { title: data.title, sections: data.sections }

  if (type === 'idea') {
    return {
      title: data.title,
      sections: [
        { heading: 'Source', body: `${data.creator}, ${data.views} views, ${data.engagement}% engagement` },
        { heading: 'Content positioning', body: data.positioning },
        { heading: 'Storytelling format', body: data.format },
        { heading: 'Contrast mechanism', body: data.contrast },
        { heading: 'Personalization suggestions', body: data.personalization.map((p) => `- ${p}`).join('\n') },
      ],
    }
  }

  return {
    title: data.title,
    sections: SCRIPT_BLOCKS.map((k) => ({ heading: k, body: data.blocks[k] })),
  }
}

// format: 'md' | 'json' | 'llm'
export function buildExport(type, data, format) {
  const { title, sections } = toSections(type, data)
  const name = slug(title)

  if (format === 'json') {
    return { filename: `${name}.json`, mime: 'application/json', text: JSON.stringify({ type, title, sections }, null, 2) }
  }
  if (format === 'md') {
    const body = sections.map((s) => `## ${s.heading}\n${s.body}`).join('\n\n')
    return { filename: `${name}.md`, mime: 'text/markdown', text: `# ${title}\n\n${body}` }
  }
  // 'llm': compact plain text, no decoration, to save tokens
  const lines = sections.map((s) => `${s.heading}: ${s.body.replace(/\s*\n\s*/g, ' ')}`)
  return { filename: `${name}.txt`, mime: 'text/plain', text: `${title}\n${lines.join('\n')}` }
}