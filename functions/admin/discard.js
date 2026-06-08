// functions/admin/discard.js
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function handleDiscard({ env }) {
  const id = env.CUSTOMER_ID
  const published = await env.CONTENT_KV.get(`content-${id}`, 'json') ?? DEFAULT_CONTENT
  await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(published))
  return Response.json({ ok: true })
}

export async function onRequestPost(context) {
  return handleDiscard(context)
}
