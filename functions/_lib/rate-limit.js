// functions/_lib/rate-limit.js

// Tages-Key in lokaler Zeit (Europe/Vienna) statt UTC — sonst resettet das
// Limit für österreichische Kunden mitten am Abend bzw. erst um 1/2 Uhr früh.
// 'en-CA' liefert direkt YYYY-MM-DD.
export function viennaDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(date)
}

export async function checkRateLimit({ kv, customerId, type, max, isMaster }) {
  if (isMaster) return { allowed: true, remaining: Infinity }
  const key = `limit-${customerId}-${viennaDateKey()}-${type}`
  const current = parseInt(await kv.get(key) ?? '0')
  if (current >= max) return { allowed: false, remaining: 0 }
  await kv.put(key, String(current + 1), { expirationTtl: 90000 })
  return { allowed: true, remaining: max - current - 1 }
}
