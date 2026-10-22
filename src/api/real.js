const notReady = () => {
  throw new Error('Real API not connected yet')
}
export const getVideos = notReady
export const getVideoById = notReady
export const getAnalysis = notReady
export const analyzeVideo = notReady