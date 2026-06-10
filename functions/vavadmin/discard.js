// functions/vavadmin/discard.js
import { mergeContent } from '../../src/content-schema.js'

export async function handleDiscard({ env }) {
  const id = env.CUSTOMER_ID
  const published = mergeContent(await env.CONTENT_KV.get(`content-${id}`, 'json'))
  await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(published))
  return Response.json({ ok: true })
}

export async function onRequestPost(context) {
  return handleDiscard(context)
}
