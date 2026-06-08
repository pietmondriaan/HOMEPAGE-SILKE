// functions/admin/chat.js
import { checkRateLimit } from '../_lib/rate-limit.js'
import { callGemini, applyJsonDiff, buildSystemPrompt } from '../_lib/gemini.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function onRequestPost({ request, env, data }) {
  const session = data.session
  const today = new Date().toISOString().split('T')[0]
  const id = env.CUSTOMER_ID

  const limit = await checkRateLimit({
    kv: env.CONTENT_KV,
    customerId: id,
    date: today,
    type: 'preview',
    max: parseInt(env.PREVIEW_LIMIT_PER_DAY),
    isMaster: session.isMaster,
  })

  if (!limit.allowed) {
    return Response.json({
      message: `Du hast heute ${env.PREVIEW_LIMIT_PER_DAY} Vorschauen genutzt. Morgen früh hast du wieder ${env.PREVIEW_LIMIT_PER_DAY} zur Verfügung.`,
    }, { status: 429 })
  }

  let body
  try { body = await request.json() } catch { return new Response('Bad Request', { status: 400 }) }

  const currentDraft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT

  let diff
  try {
    diff = await callGemini({
      apiKey: env.GEMINI_API_KEY,
      systemPrompt: buildSystemPrompt(currentDraft),
      userMessage: body.message,
    })
  } catch (err) {
    return Response.json({ message: 'KI-Fehler: ' + err.message }, { status: 502 })
  }

  const updated = applyJsonDiff(currentDraft, diff)
  await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(updated))

  return Response.json({ ok: true, previewsLeft: limit.remaining })
}
