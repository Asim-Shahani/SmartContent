let entries = []
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function joinWaitlist(email, planId) {
  await delay(400)
  if (!entries.some((e) => e.email === email && e.planId === planId)) {
    entries.push({ email, planId })
  }
  return { ok: true }
}