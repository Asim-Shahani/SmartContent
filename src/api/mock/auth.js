// MOCK ONLY. A real backend must hash passwords and use secure sessions.
const USERS_KEY = 'sc_users'
const SESSION_KEY = 'sc_session'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const users = () => read(USERS_KEY, [])
const saveUsers = (list) => write(USERS_KEY, list)
const strip = ({ password, ...user }) => user // never send the password back
const clean = (email) => email.trim().toLowerCase()

function checkCredentials(email, password) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.')
  if (password.length < 8) throw new Error('Your password must be at least 8 characters.')
}

function currentUser() {
  const email = read(SESSION_KEY, null)
  return users().find((u) => u.email === email) ?? null
}

function update(email, changes) {
  saveUsers(users().map((u) => (u.email === email ? { ...u, ...changes } : u)))
  return users().find((u) => u.email === email)
}

export async function getSession() {
  await delay(100)
  const u = currentUser()
  return u ? strip(u) : null
}

export async function signUp(email, password) {
  await delay(500)
  const e = clean(email)
  checkCredentials(e, password)
  if (users().some((u) => u.email === e)) {
    throw new Error('An account with this email already exists. Try logging in.')
  }
  const user = { email: e, password, onboarded: false, hasPasskey: false, workspaceName: 'My first workspace' }
  saveUsers([...users(), user])
  write(SESSION_KEY, e)
  return strip(user)
}

export async function logIn(email, password) {
  await delay(500)
  const e = clean(email)
  const user = users().find((u) => u.email === e)
  if (!user || !user.password || user.password !== password) {
    throw new Error('Email or password is incorrect.')
  }
  write(SESSION_KEY, e)
  return strip(user)
}

export async function logOut() {
  localStorage.removeItem(SESSION_KEY)
  return true
}

// One-click Google / Apple (mocked)
export async function socialSignIn(provider) {
  await delay(600)
  const e = provider === 'Apple' ? 'you@icloud.com' : 'you@gmail.com'
  let user = users().find((u) => u.email === e)
  const isNew = !user
  if (!user) {
    user = { email: e, password: null, onboarded: false, hasPasskey: false, workspaceName: 'My first workspace' }
    saveUsers([...users(), user])
  }
  write(SESSION_KEY, e)
  return { user: strip(user), isNew }
}

export async function passkeySignIn() {
  await delay(600)
  const user = users().find((u) => u.hasPasskey)
  if (!user) {
    throw new Error('No passkey found on this device. Log in with your password first, then add one.')
  }
  write(SESSION_KEY, user.email)
  return strip(user)
}

export async function enrollPasskey() {
  await delay(700)
  const u = currentUser()
  if (!u) throw new Error('Please log in first.')
  return strip(update(u.email, { hasPasskey: true }))
}

// Same answer whether or not the account exists, so emails cannot be guessed
export async function requestPasswordReset() {
  await delay(500)
  return { ok: true }
}

export async function resetPassword(email, password) {
  await delay(500)
  const e = clean(email)
  checkCredentials(e, password)
  if (!users().some((u) => u.email === e)) throw new Error('This reset link is not valid.')
  update(e, { password })
  return { ok: true }
}

export async function completeOnboarding({ workspaceName }) {
  await delay(300)
  const u = currentUser()
  if (!u) throw new Error('Please log in first.')
  return strip(update(u.email, { onboarded: true, workspaceName }))
}