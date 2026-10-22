export function buildLlmText(video, a) {
  return [
    `# ${video.title}`,
    `Creator: ${video.creator} | Platform: ${video.platform} | Views: ${video.views} | Outlier score: ${video.outlierScore}x`,
    `## Summary\n${a.summary}`,
    `## Hook\n${a.hook}`,
    `## Format\n${a.format}`,
    `## Idea\n${a.idea}`,
    `## Visual\n${a.visual}`,
    `## Transcript\n${a.transcript}`,
  ].join('\n\n')
}