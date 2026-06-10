// functions/vavadmin/chat.js
import { checkRateLimit } from '../_lib/rate-limit.js'
import { callGemini, applyJsonDiff, buildSystemPrompt } from '../_lib/gemini.js'
import { validateDiff } from '../_lib/validate.js'
import { appendAudit } from '../_lib/audit.js'
import { mergeContent } from '../../src/content-schema.js'

export async function onRequestPost({ request, env, data }) {
  const session = data.session
  const id = env.CUSTOMER_ID

  let body
  try { body = await request.json() } catch { return new Response('Bad Request', { status: 400 }) }

  // messages: full conversation history [{role:'user'|'model', text:string}]
  const messages = body.messages ?? [{ role: 'user', text: body.message ?? '' }]

  // Draft = mergeContent(draft ?? content) — fehlt der Draft, vom Live-Content
  // starten; mergeContent füllt Felder auf, die alten KV-Ständen fehlen.
  const stored = await env.CONTENT_KV.get(`draft-${id}`, 'json')
    ?? await env.CONTENT_KV.get(`content-${id}`, 'json')
  const draft = mergeContent(stored)
  const systemPrompt = buildSystemPrompt(draft)

  let tokensIn = 0
  let tokensOut = 0

  let response
  try {
    const first = await callGemini({ apiKey: env.GEMINI_API_KEY, systemPrompt, messages })
    response = first.response
    tokensIn += first.usage.tokensIn
    tokensOut += first.usage.tokensOut
  } catch (err) {
    return Response.json({ message: 'KI-Fehler: ' + err.message }, { status: 502 })
  }

  // Rückfrage — kein Limit verbrauchen, kein Draft-Write
  if (response.action === 'ask') {
    const question = response.question ?? 'Kannst du das genauer beschreiben?'
    await appendAudit(env, id, { type: 'chat', info: 'Rückfrage: ' + question, tokensIn, tokensOut })
    return Response.json({ ok: true, action: 'ask', question })
  }

  if (response.action !== 'update' || response.diff === null || typeof response.diff !== 'object') {
    return Response.json({ message: 'Die KI hat keine verwertbare Änderung geliefert. Bitte formuliere deinen Wunsch anders.' }, { status: 502 })
  }

  let diff = response.diff
  let summary = typeof response.summary === 'string' && response.summary ? response.summary : 'Änderung per Chat'

  // Firewall: Diff validieren. Ungültig → genau EIN Korrektur-Versuch.
  let check = validateDiff(diff)
  if (!check.ok) {
    try {
      const retryMessages = [
        ...messages,
        { role: 'model', text: JSON.stringify(response) },
        { role: 'user', text: `Dein letzter Diff war ungültig: ${check.errors.join('; ')}. Korrigiere den Diff und antworte erneut AUSSCHLIESSLICH mit validem JSON im vorgegebenen Format (update oder ask).` },
      ]
      const retry = await callGemini({ apiKey: env.GEMINI_API_KEY, systemPrompt, messages: retryMessages })
      tokensIn += retry.usage.tokensIn
      tokensOut += retry.usage.tokensOut
      if (retry.response.action === 'ask') {
        const question = retry.response.question ?? 'Kannst du das genauer beschreiben?'
        await appendAudit(env, id, { type: 'chat', info: 'Rückfrage: ' + question, tokensIn, tokensOut })
        return Response.json({ ok: true, action: 'ask', question })
      }
      if (retry.response.action === 'update' && retry.response.diff && typeof retry.response.diff === 'object') {
        diff = retry.response.diff
        if (typeof retry.response.summary === 'string' && retry.response.summary) summary = retry.response.summary
        check = validateDiff(diff)
      }
    } catch {
      // Retry fehlgeschlagen → unten in den Fehlerpfad
    }
  }

  // Immer noch ungültig → freundlich ablehnen: kein Draft-Write, kein Limitverbrauch
  if (!check.ok) {
    await appendAudit(env, id, { type: 'chat', info: 'Abgelehnt: ' + check.errors.join('; '), tokensIn, tokensOut })
    return Response.json({
      ok: false,
      message: 'Das hat leider nicht geklappt — die vorgeschlagene Änderung war ungültig (' + check.errors[0] + '). Bitte formuliere deinen Wunsch anders oder in kleineren Schritten.',
    }, { status: 422 })
  }

  // Diff ist gültig — erst JETZT zählt der Versuch gegen das Tageslimit
  const limit = await checkRateLimit({
    kv: env.CONTENT_KV,
    customerId: id,
    type: 'preview',
    max: parseInt(env.PREVIEW_LIMIT_PER_DAY),
    isMaster: session.isMaster,
  })
  if (!limit.allowed) {
    return Response.json({
      message: `Du hast heute ${env.PREVIEW_LIMIT_PER_DAY} Vorschauen genutzt. Morgen früh hast du wieder ${env.PREVIEW_LIMIT_PER_DAY} zur Verfügung.`,
    }, { status: 429 })
  }

  const updated = applyJsonDiff(draft, diff)
  await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(updated))
  await appendAudit(env, id, { type: 'chat', info: summary, tokensIn, tokensOut })

  return Response.json({ ok: true, action: 'update', summary, previewsLeft: limit.remaining })
}
