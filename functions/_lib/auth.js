// functions/_lib/auth.js
// Constant-time string comparison (prevents timing attacks)
function safeEquals(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)
  let result = 0
  for (let i = 0; i < aBytes.length; i++) result |= aBytes[i] ^ bBytes[i]
  return result === 0
}

export function checkPassword(input, env) {
  if (safeEquals(input, env.MASTER_PASSWORD)) return { valid: true, isMaster: true }
  if (safeEquals(input, env.CUSTOMER_PASSWORD)) return { valid: true, isMaster: false }
  return { valid: false, isMaster: false }
}
