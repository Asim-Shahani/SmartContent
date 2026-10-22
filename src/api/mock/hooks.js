const TEMPLATES = {
  'Curiosity gap': [
    "The real reason {t} isn't working",
    'Nobody talks about this part of {t}',
    'I tested {t} for 30 days. Here is the result',
    'What I found out about {t} surprised me',
    'The {t} secret nobody told you',
    'This is what experts hide about {t}',
    'I did not expect this from {t}',
    'Wait until you see what {t} did',
    'Here is what happens when you do {t} every day',
    'The one detail about {t} that changes everything',
  ],
  'Contrarian statement': [
    'Stop doing {t}. Do this instead',
    'Everything you know about {t} is wrong',
    '{t} is overrated, and here is why',
    'Unpopular opinion: {t} is a waste of time',
    'You do not need {t}. You need this',
    'Most advice about {t} is backwards',
    'Why I quit {t} and got better results',
    '{t} will not fix your problem',
    'The {t} rule everyone follows is a mistake',
    'Forget {t}. Try this first',
  ],
  'Question hook': [
    'What if {t} took half the time?',
    'Why does everyone get {t} backwards?',
    'Are you making this {t} mistake?',
    'Is {t} actually worth it?',
    'What would happen if you stopped {t}?',
    'Do you really understand {t}?',
    'How do the best creators approach {t}?',
    'Why is {t} so hard to get right?',
    'What is the fastest way to learn {t}?',
    'Who told you {t} had to be complicated?',
  ],
  'Unexpected claim': [
    '{t} changed my life in 7 days',
    'This one change made {t} 10x easier',
    'I did {t} for a year. Here is the truth',
    '{t} costs less than you think',
    'You can master {t} in 10 minutes a day',
    '{t} works better when you do less',
    'I got results from {t} in one week',
    'The simplest {t} trick I have ever used',
    '{t} is easier than anyone admits',
    'One mistake ruins most {t}',
  ],
  'Problem statement': [
    'Struggling with {t}? Start here',
    'If {t} is not working, this is why',
    'The biggest mistake in {t}',
    'Tired of failing at {t}?',
    '{t} feels impossible until you do this',
    'Here is why your {t} keeps falling apart',
    'Cannot stick with {t}? Try this',
    'The real problem with {t} is not what you think',
    'Why {t} never works for most people',
    'Fix your {t} in three steps',
  ],
}

const LIBRARY = [
  { niche: 'Fitness', category: 'Unexpected claim', text: 'I replaced my gym plan with 10 minutes a day' },
  { niche: 'Fitness', category: 'Contrarian statement', text: 'Stop doing sit-ups. Do this instead' },
  { niche: 'Fitness', category: 'Question hook', text: 'Why does your weight loss stall after week three?' },
  { niche: 'Fitness', category: 'Problem statement', text: 'Tired of workouts you cannot stick with?' },
  { niche: 'Finance', category: 'Curiosity gap', text: 'Nobody tells you this about index funds' },
  { niche: 'Finance', category: 'Unexpected claim', text: 'Your savings account is losing you money' },
  { niche: 'Finance', category: 'Contrarian statement', text: 'Budgeting apps are a waste of time' },
  { niche: 'Finance', category: 'Question hook', text: 'Where does your salary actually go each month?' },
  { niche: 'Tech', category: 'Curiosity gap', text: 'I let AI plan my whole week' },
  { niche: 'Tech', category: 'Problem statement', text: 'Here is why your phone battery dies by noon' },
  { niche: 'Tech', category: 'Contrarian statement', text: 'You do not need a new laptop. You need this' },
  { niche: 'Tech', category: 'Question hook', text: 'What if you could edit a video in half the time?' },
  { niche: 'Food', category: 'Question hook', text: "Why does your pasta never taste like a restaurant's?" },
  { niche: 'Food', category: 'Unexpected claim', text: 'A $5 lunch in Tokyo beats most meals back home' },
  { niche: 'Food', category: 'Contrarian statement', text: 'Stop rinsing your pasta. Here is why' },
  { niche: 'Food', category: 'Problem statement', text: 'Cooking at home feels impossible until you do this' },
].map((h, i) => ({ ...h, id: i + 1 }))

let saved = []
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function searchHooks({ q = '', niche = '', category = '' } = {}) {
  await delay(150)
  const query = q.trim().toLowerCase()
  return LIBRARY.filter(
    (h) =>
      (!niche || h.niche === niche) &&
      (!category || h.category === category) &&
      (!query || h.text.toLowerCase().includes(query))
  )
}

// Always returns at least 10 variations
export async function generateHooks(topic, category = '') {
  await delay(300)
  const t = topic.trim()
  const list = category
    ? TEMPLATES[category]
    : Object.values(TEMPLATES).flatMap((templates) => templates.slice(0, 2))
  return list.map((tpl) => tpl.replace('{t}', t))
}

export async function getSavedHooks() {
  await delay(100)
  return [...saved]
}

export async function saveHook(text) {
  await delay(100)
  if (!saved.includes(text)) saved = [text, ...saved]
  return saved
}

export async function removeHook(text) {
  await delay(100)
  saved = saved.filter((h) => h !== text)
  return saved
}