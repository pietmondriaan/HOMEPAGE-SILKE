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

export async function checkPassword(input, env) {
  // .trim() on env vars neutralises any \r\n encoding artefacts from secret storage
  const masterPw = (env.MASTER_PASSWORD ?? '').trim()
  if (masterPw && safeEquals(input, masterPw)) return { valid: true, isMaster: true }

  const storedHash = await env.CONTENT_KV.get(`password-${env.CUSTOMER_ID}`)
  if (storedHash) {
    if (safeEquals(await sha256hex(input), storedHash)) return { valid: true, isMaster: false }
  } else {
    const customerPw = (env.CUSTOMER_PASSWORD ?? '').trim()
    if (customerPw && safeEquals(input, customerPw)) return { valid: true, isMaster: false }
  }
  return { valid: false, isMaster: false }
}

export async function hashPassword(password) {
  return sha256hex(password)
}
