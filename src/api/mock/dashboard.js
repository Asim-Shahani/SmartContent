let connection = null
let pendingCode = null
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getConnection() {
  await delay(100)
  return connection
}

export async function startVerification() {
  await delay(400)
  pendingCode = 'SC-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  return { code: pendingCode }
}

export async function verifyAccount(platform, handle) {
  await delay(1500)
  if (!pendingCode) throw new Error('Generate a code first.')
  connection = { platform, handle }
  pendingCode = null
  return connection
}

// Demo helper so you can test the empty state again
export async function disconnectAccount() {
  await delay(100)
  connection = null
  return null
}

const RECENT = [
  { id: 1, title: 'I replaced my gym plan with 10 minutes a day', platform: 'TikTok', postedAt: '2 days ago', views: 48200, performance: 'Above average' },
  { id: 2, title: 'What I eat in a day on a budget', platform: 'Reels', postedAt: '4 days ago', views: 12900, performance: 'On average' },
  { id: 3, title: '3 mistakes that kill your progress', platform: 'Shorts', postedAt: '6 days ago', views: 6100, performance: 'Below average' },
  { id: 4, title: 'My honest review after 30 days', platform: 'TikTok', postedAt: '9 days ago', views: 31400, performance: 'Above average' },
  { id: 5, title: 'Stop making this warm-up mistake', platform: 'Reels', postedAt: '12 days ago', views: 14800, performance: 'On average' },
]

export async function getDashboard({ days = 30 } = {}) {
  await delay(300)
  const today = new Date()
  let cumViews = 0
  let cumFollowers = 46000

  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (days - 1 - i))
    const views = Math.round(8000 + 6000 * Math.abs(Math.sin(i * 0.9)) + i * 40)
    const gained = Math.round(20 + 40 * Math.abs(Math.cos(i * 0.7)))
    cumViews += views
    cumFollowers += gained
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views,
      cumViews,
      gained,
      cumFollowers,
    }
  })

  return {
    totals: {
      followers: cumFollowers,
      gained: daily.reduce((sum, d) => sum + d.gained, 0),
      views: cumViews,
      posts: Math.max(1, Math.round(days * 0.8)),
    },
    daily,
    recent: RECENT,
  }
}