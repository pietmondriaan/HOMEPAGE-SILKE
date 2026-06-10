// functions/vavadmin/publish.js
import { checkRateLimit } from '../_lib/rate-limit.js'
import { appendAudit } from '../_lib/audit.js'
import { mergeContent } from '../../src/content-schema.js'

const MAX_VERSIONS = 20

// Sichert `content` als Version (KV: version-{id}-{ts}) und pflegt den Index
// versions-{id} ([{ts, summary}], max 20 — älteste Version-Keys werden gelöscht).
// Wird auch von restore.js genutzt.
export async function saveVersion(env, id, content, summary) {
  const ts = Date.now()
  await env.CONTENT_KV.put(`version-${id}-${ts}`, JSON.stringify(content))

  let index = await env.CONTENT_KV.get(`versions-${id}`, 'json')
  if (!Array.isArray(index)) index = []
  index.push({ ts, summary })
  while (index.length > MAX_VERSIONS) {
    const oldest = index.shift()
    if (oldest?.ts) await env.CONTENT_KV.delete(`version-${id}-${oldest.ts}`)
  }
  await env.CONTENT_KV.put(`versions-${id}`, JSON.stringify(index))
  return ts
}

export async function handlePublish({ request, env, data }) {
  const session = data.session
  const id = env.CUSTOMER_ID

  const limit = await checkRateLimit({
    kv: env.CONTENT_KV,
    customerId: id,
    type: 'publish',
    max: parseInt(env.PUBLISH_LIMIT_PER_DAY),
    isMaster: session.isMaster,
  })

  if (!limit.allowed) {
    return Response.json({
      message: `Tageslimit für Veröffentlichungen erreicht (${env.PUBLISH_LIMIT_PER_DAY}/Tag). Deine Entwürfe bleiben gespeichert.`,
    }, { status: 429 })
  }

  let summary = 'Veröffentlichung'
  try {
    const body = await request.json()
    if (typeof body?.summary === 'string' && body.summary.trim()) {
      summary = body.summary.trim().slice(0, 200)
    }
  } catch { /* kein/leerer Body ist ok */ }

  // Aktuellen Live-Stand als Version sichern, BEVOR er überschrieben wird
  const current = await env.CONTENT_KV.get(`content-${id}`, 'json')
  if (current) {
    await saveVersion(env, id, current, summary)
  }

  const draft = mergeContent(await env.CONTENT_KV.get(`draft-${id}`, 'json'))
  await env.CONTENT_KV.put(`content-${id}`, JSON.stringify(draft))
  await appendAudit(env, id, { type: 'publish', info: summary })

  return Response.json({ ok: true, publishesLeft: limit.remaining })
}

export async function onRequestPost(context) {
  return handlePublish(context)
}
