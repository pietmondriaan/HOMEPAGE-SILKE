// functions/vavadmin/versions.js
// GET → { versions: [{ts, summary}] } — neueste zuerst.

export async function onRequestGet({ env }) {
  const id = env.CUSTOMER_ID
  let index = await env.CONTENT_KV.get(`versions-${id}`, 'json')
  if (!Array.isArray(index)) index = []
  const versions = [...index].sort((a, b) => b.ts - a.ts)
  return Response.json({ versions })
}
