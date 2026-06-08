// functions/api/content.js
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function handleContentRequest({ env }) {
  const content = await env.CONTENT_KV.get(
    `content-${env.CUSTOMER_ID}`,
    'json'
  )
  return Response.json(content ?? DEFAULT_CONTENT, {
    headers: {
      'Cache-Control': 'public, max-age=10',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function onRequest(context) {
  return handleContentRequest(context)
}
