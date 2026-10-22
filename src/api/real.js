const notReady = () => {
  throw new Error('Real API not connected yet')
}
export const getVideos = notReady
export const getVideoById = notReady
export const getAnalysis = notReady
export const analyzeVideo = notReady
export const getScripts = notReady
export const createScript = notReady
export const updateScript = notReady
export const expandScript = notReady
export const searchHooks = notReady
export const generateHooks = notReady
export const getSavedHooks = notReady
export const saveHook = notReady
export const removeHook = notReady