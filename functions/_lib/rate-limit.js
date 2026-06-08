// functions/_lib/rate-limit.js
export async function checkRateLimit({ kv, customerId, date, type, max, isMaster }) {
  if (isMaster) return { allowed: true, remaining: Infinity }
  const key = `limit-${customerId}-${date}-${type}`
  const current = parseInt(await kv.get(key) ?? '0')
  if (current >= max) return { allowed: false, remaining: 0 }
  await kv.put(key, String(current + 1), { expirationTtl: 90000 })
  return { allowed: true, remaining: max - current - 1 }
}
