// functions/_lib/session.js
const SESSION_TTL_SECONDS = 8 * 60 * 60 // 8 hours

async function importKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createSession(payload, secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const data = btoa(JSON.stringify({ ...payload, exp }))
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
  return `${data}.${sigB64}`
}

export async function verifySession(token, secret) {
  try {
    const [data, sigB64] = token.split('.')
    if (!data || !sigB64) return null
    const key = await importKey(secret)
    const sigBytes = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
    if (!valid) return null
    const payload = JSON.parse(atob(data))
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export async function getSessionFromRequest(request, secret) {
  const cookie = request.headers.get('Cookie') ?? ''
  const match = cookie.match(/vas_session=([^;]+)/)
  if (!match) return null
  return verifySession(match[1], secret)
}
