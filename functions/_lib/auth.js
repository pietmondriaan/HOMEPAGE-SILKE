// functions/_lib/auth.js

async function sha256hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function safeEquals(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)
  let result = 0
  for (let i = 0; i < aBytes.length; i++) result |= aBytes[i] ^ bBytes[i]
  return result === 0
}

// SHA-256("Admin") — default password for every new customer site
const DEFAULT_HASH = 'c1c224b03cd9bc7b6a86d77f5dace40191766c485cd55dc48caf9ac873335d6f'

export async function checkPassword(input, env) {
  // Master: env var with .trim() to neutralise any \r\n encoding artefacts
  const masterPw = (env.MASTER_PASSWORD ?? '').trim()
  if (masterPw && safeEquals(input, masterPw)) return { valid: true, isMaster: true }

  // Customer: KV hash (auto-seeded with Admin default on first call)
  let storedHash = await env.CONTENT_KV.get(`password-${env.CUSTOMER_ID}`)
  if (!storedHash) {
    storedHash = DEFAULT_HASH
    await env.CONTENT_KV.put(`password-${env.CUSTOMER_ID}`, DEFAULT_HASH)
    await env.CONTENT_KV.put(`password-needs-change-${env.CUSTOMER_ID}`, '1')
  }
  if (safeEquals(await sha256hex(input), storedHash)) return { valid: true, isMaster: false }

  return { valid: false, isMaster: false }
}

export async function hashPassword(password) {
  return sha256hex(password)
}
