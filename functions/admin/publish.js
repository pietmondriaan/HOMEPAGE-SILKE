// functions/admin/publish.js
import { checkRateLimit } from '../_lib/rate-limit.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function handlePublish({ env, data }) {
  const session = data.session
  const today = new Date().toISOString().split('T')[0]
  const id = env.CUSTOMER_ID

  const limit = await checkRateLimit({
    kv: env.CONTENT_KV,
    customerId: id,
    date: today,
    type: 'publish',
    max: parseInt(env.PUBLISH_LIMIT_PER_DAY),
    isMaster: session.isMaster,
  })

  if (!limit.allowed) {
    return Response.json({
      message: `Tageslimit für Veröffentlichungen erreicht (${env.PUBLISH_LIMIT_PER_DAY}/Tag). Deine Entwürfe bleiben gespeichert.`,
    }, { status: 429 })
  }

  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT
  await env.CONTENT_KV.put(`content-${id}`, JSON.stringify(draft))

  return Response.json({ ok: true, publishesLeft: limit.remaining })
}

export async function onRequestPost(context) {
  return handlePublish(context)
}
