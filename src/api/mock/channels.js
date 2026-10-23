import { PLANS } from '@/lib/constants'
import { billing } from '@/billing'

const RAW = [
  ['@liftwithmia', 'Mia Lifts', 'TikTok', 'Fitness', 210000, 18400000, 'strength gym lifting women beginners workouts'],
  ['@coachdan', 'Coach Dan', 'Reels', 'Fitness', 98000, 6200000, 'coaching abs core training tips'],
  ['@homeworkoutjo', 'Jo Home Workouts', 'Shorts', 'Fitness', 340000, 29000000, 'home workouts no equipment beginners'],
  ['@runwithsara', 'Sara Runs', 'TikTok', 'Fitness', 76000, 4100000, 'running marathon cardio training'],
  ['@gymrookie', 'Gym Rookie', 'Reels', 'Fitness', 54000, 3300000, 'beginners gym basics form'],
  ['@moneywithjay', 'Money With Jay', 'Shorts', 'Finance', 520000, 41000000, 'investing index funds saving beginners'],
  ['@pennyplans', 'Penny Plans', 'Shorts', 'Finance', 180000, 12500000, 'budgeting saving money rules'],
  ['@investinginsights', 'Investing Insights', 'Reels', 'Finance', 410000, 33000000, 'stocks investing etf markets'],
  ['@debtfreeamy', 'Debt Free Amy', 'TikTok', 'Finance', 95000, 7000000, 'debt budgeting payoff savings'],
  ['@taxtalks', 'Tax Talks', 'Shorts', 'Finance', 133000, 8800000, 'taxes freelancers small business'],
  ['@editfast', 'Edit Fast', 'Reels', 'Tech', 260000, 22000000, 'video editing tools ai productivity'],
  ['@techwithsam', 'Tech With Sam', 'TikTok', 'Tech', 330000, 27000000, 'ai tools productivity apps'],
  ['@aidaily', 'AI Daily', 'Shorts', 'Tech', 780000, 64000000, 'ai news tools chatgpt'],
  ['@gadgetgreg', 'Gadget Greg', 'Reels', 'Tech', 150000, 9800000, 'gadgets reviews phones laptops'],
  ['@codeinminutes', 'Code In Minutes', 'TikTok', 'Tech', 390000, 31000000, 'coding programming beginners python'],
  ['@nomadbites', 'Nomad Bites', 'TikTok', 'Food', 290000, 24000000, 'travel street food budget japan'],
  ['@chefnoor', 'Chef Noor', 'Reels', 'Food', 125000, 8700000, 'cooking pasta restaurant techniques'],
  ['@budgetbites', 'Budget Bites', 'TikTok', 'Food', 640000, 52000000, 'cheap meals budget recipes students'],
  ['@mealprepmo', 'Meal Prep Mo', 'Shorts', 'Food', 205000, 15500000, 'meal prep healthy weekly planning'],
  ['@streetfoodsam', 'Street Food Sam', 'Reels', 'Food', 270000, 21000000, 'street food travel cooking markets'],
]

const CHANNELS = RAW.map(([username, name, platform, niche, followers, views, tags]) => ({
  id: username, username, name, platform, niche, followers, views, tags,
}))

const lists = {} // workspaceId -> list of channel ids
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
const limit = () => PLANS[billing.getPlanId()].channels
const idsFor = (ws) => (lists[ws] ??= [])
const byId = (id) => CHANNELS.find((c) => c.id === id)

// The limit is enforced here (the "server"), not only in the UI
function insert(workspaceId, channelId) {
  const ids = idsFor(workspaceId)
  const channel = byId(channelId)
  if (!channel) throw new Error('Channel not found.')
  if (ids.includes(channelId)) throw new Error('This channel is already on your watchlist.')
  if (ids.length >= limit()) {
    const err = new Error(`Your plan allows up to ${limit()} channels per workspace.`)
    err.code = 'PLAN_LIMIT'
    throw err
  }
  ids.push(channelId)
  return channel
}

export async function getWatchlist(workspaceId) {
  await delay(100)
  return idsFor(workspaceId).map(byId)
}

export async function getSuggestedChannels(workspaceId) {
  await delay(200)
  const ids = idsFor(workspaceId)
  return CHANNELS.filter((c) => !ids.includes(c.id)).sort((a, b) => b.followers - a.followers).slice(0, 8)
}

const STOP = new Set(['the', 'for', 'and', 'who', 'that', 'with', 'creators', 'creator', 'channels', 'channel', 'about', 'make', 'post', 'posts', 'videos', 'video', 'want', 'find', 'some', 'good', 'best'])
const words = (s) =>
  s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map((w) => (w.length > 3 ? w.replace(/s$/, '') : w))

// Plain-language search: matches your words against niche, topics and names
export async function describeChannels(query) {
  await delay(500)
  const tokens = words(query).filter((w) => w.length > 1 && !STOP.has(w))
  return CHANNELS
    .map((c) => {
      const niche = words(c.niche)
      const tags = words(c.tags)
      const name = words(`${c.name} ${c.username}`)
      const score = tokens.reduce(
        (s, t) => s + (niche.includes(t) ? 3 : 0) + (tags.includes(t) ? 2 : 0) + (name.includes(t) ? 1 : 0),
        0
      )
      return { c, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.c.followers - a.c.followers)
    .slice(0, 8)
    .map((x) => x.c)
}

export async function searchChannels(q) {
  await delay(200)
  const s = q.trim().toLowerCase().replace(/^@/, '')
  if (!s) return []
  return CHANNELS.filter((c) => c.username.toLowerCase().includes(s) || c.name.toLowerCase().includes(s))
}

export async function addChannel(workspaceId, channelId) {
  await delay(200)
  return insert(workspaceId, channelId)
}

const HOSTS = { 'tiktok.com': 'TikTok', 'instagram.com': 'Instagram', 'youtube.com': 'YouTube', 'youtu.be': 'YouTube' }

export async function addChannelByUrl(workspaceId, input) {
  await delay(400)
  const text = input.trim()
  let url
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
  } catch {
    throw new Error('That does not look like a valid link.')
  }
  const host = url.hostname.replace(/^(www|m)\./, '')
  if (!HOSTS[host]) throw new Error('Only TikTok, Instagram and YouTube links are supported.')
  const first = url.pathname.split('/').filter(Boolean)[0]
  if (!first) throw new Error('Paste a link to a channel, not the home page.')
  const username = '@' + first.replace(/^@/, '').toLowerCase()
  const channel = CHANNELS.find((c) => c.username === username)
  if (!channel) throw new Error(`We could not find that channel on ${HOSTS[host]}.`)
  return insert(workspaceId, channel.id)
}

export async function removeChannel(workspaceId, channelId) {
  await delay(100)
  lists[workspaceId] = idsFor(workspaceId).filter((id) => id !== channelId)
  return true
}