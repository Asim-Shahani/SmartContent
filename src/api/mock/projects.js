const store = {} // workspaceId -> list of projects
let nextId = 1
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const listFor = (ws) => (store[ws] ??= [])

function find(ws, id) {
  const project = listFor(ws).find((p) => p.id === id)
  if (!project) throw new Error('Project not found.')
  return project
}

export async function getProjects(workspaceId) {
  await delay(100)
  return listFor(workspaceId).map((p) => ({ ...p, assets: [...p.assets] }))
}

export async function createProject(workspaceId, name) {
  await delay(150)
  const clean = name.trim()
  if (!clean) throw new Error('Give your project a name.')
  if (listFor(workspaceId).some((p) => p.name.toLowerCase() === clean.toLowerCase())) {
    throw new Error('You already have a project with that name.')
  }
  const project = { id: nextId++, name: clean, assets: [] }
  listFor(workspaceId).push(project)
  return project
}

export async function addAssetToProject(workspaceId, projectId, asset) {
  await delay(100)
  const project = find(workspaceId, projectId)
  const key = `${asset.type}:${asset.refId}`
  if (!project.assets.some((a) => a.key === key)) {
    project.assets.push({ key, type: asset.type, refId: asset.refId, title: asset.title })
  }
  return project
}

export async function removeAssetFromProject(workspaceId, projectId, key) {
  await delay(100)
  const project = find(workspaceId, projectId)
  project.assets = project.assets.filter((a) => a.key !== key)
  return project
}

export async function moveAsset(workspaceId, fromId, toId, key) {
  await delay(150)
  const from = find(workspaceId, fromId)
  const to = find(workspaceId, toId)
  const asset = from.assets.find((a) => a.key === key)
  if (!asset) throw new Error('Asset not found.')
  from.assets = from.assets.filter((a) => a.key !== key)
  if (!to.assets.some((a) => a.key === key)) to.assets.push(asset)
  return to
}