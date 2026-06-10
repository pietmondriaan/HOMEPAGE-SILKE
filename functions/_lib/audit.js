// functions/_lib/audit.js
// Monats-Audit-Log pro Kunde im KV: audit-{customerId}-{YYYY-MM} (Europe/Vienna).
// Einträge: { ts, type, info, tokensIn, tokensOut } — max. 500 pro Monat.

const MAX_ENTRIES_PER_MONTH = 500

function viennaMonthKey(date = new Date()) {
  // 'en-CA' → YYYY-MM-DD, davon YYYY-MM
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(date).slice(0, 7)
}

// Audit darf den eigentlichen Request nie zum Scheitern bringen — Fehler
// werden geschluckt (KV-Hiccups, JSON-Müll im bestehenden Key etc.).
export async function appendAudit(env, customerId, entry) {
  try {
    const key = `audit-${customerId}-${viennaMonthKey()}`
    let log = await env.CONTENT_KV.get(key, 'json')
    if (!Array.isArray(log)) log = []
    log.push({
      ts: Date.now(),
      type: entry.type ?? 'unknown',
      info: String(entry.info ?? '').slice(0, 500),
      tokensIn: entry.tokensIn ?? 0,
      tokensOut: entry.tokensOut ?? 0,
    })
    if (log.length > MAX_ENTRIES_PER_MONTH) {
      log = log.slice(log.length - MAX_ENTRIES_PER_MONTH) // älteste kappen
    }
    await env.CONTENT_KV.put(key, JSON.stringify(log))
  } catch {
    // bewusst still — Audit ist Best-Effort
  }
}
