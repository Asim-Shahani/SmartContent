import { getWatchlist } from './channels'

const VIDEOS = [
  { id: 1, title: 'I replaced my gym plan with 10 minutes a day', creator: '@liftwithmia', platform: 'TikTok', niche: 'Fitness', postedAt: '2 days ago', views: 910000, channelAvg: 12000, engagement: 9.4 },
  { id: 2, title: 'Nobody tells you this about index funds', creator: '@moneywithjay', platform: 'Shorts', niche: 'Finance', postedAt: '5 days ago', views: 640000, channelAvg: 41000, engagement: 6.1 },
  { id: 3, title: '3 AI tools I use to edit in half the time', creator: '@editfast', platform: 'Reels', niche: 'Tech', postedAt: '1 week ago', views: 1200000, channelAvg: 88000, engagement: 7.8 },
  { id: 4, title: 'What a $5 lunch looks like in Tokyo', creator: '@nomadbites', platform: 'TikTok', niche: 'Food', postedAt: '3 days ago', views: 380000, channelAvg: 9000, engagement: 11.2 },
  { id: 5, title: 'Stop doing sit-ups, do this instead', creator: '@coachdan', platform: 'Reels', niche: 'Fitness', postedAt: '4 days ago', views: 270000, channelAvg: 52000, engagement: 4.3 },
  { id: 6, title: 'The budgeting rule that saved me $9k', creator: '@pennyplans', platform: 'Shorts', niche: 'Finance', postedAt: '6 days ago', views: 530000, channelAvg: 30000, engagement: 5.7 },
  { id: 7, title: 'I let AI plan my whole week', creator: '@techwithsam', platform: 'TikTok', niche: 'Tech', postedAt: '1 day ago', views: 760000, channelAvg: 60000, engagement: 8.9 },
  { id: 8, title: "Why your pasta never tastes like a restaurant's", creator: '@chefnoor', platform: 'Reels', niche: 'Food', postedAt: '2 weeks ago', views: 450000, channelAvg: 22000, engagement: 6.8 },
].map((v) => ({ ...v, outlierScore: +(v.views / v.channelAvg).toFixed(1) }))

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getVideos({
  niche = '', platform = '', minOutlier = 0, sort = 'outlier', watchlistOnly = false, workspaceId = '',
} = {}) {
  await delay(300)
  const handles = watchlistOnly ? (await getWatchlist(workspaceId)).map((c) => c.username) : null
  return VIDEOS
    .filter(
      (v) =>
        (!niche || v.niche === niche) &&
        (!platform || v.platform === platform) &&
        v.outlierScore >= minOutlier &&
        (!handles || handles.includes(v.creator))
    )
    .sort((a, b) => (sort === 'views' ? b.views - a.views : b.outlierScore - a.outlierScore))
}

export const getVideoById = (id) => VIDEOS.find((v) => v.id === id)