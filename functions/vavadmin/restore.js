// functions/vavadmin/restore.js
// POST {ts} → gesicherte Version nach content UND draft zurückspielen.
// Verbraucht KEIN Publish-Limit — Wiederherstellung ist eine Sicherheitsfunktion.
import { appendAudit } from '../_lib/audit.js'
import { saveVersion } from './publish.js'

export async function onRequestPost({ request, env }) {
  const id = env.CUSTOMER_ID

  let body
  try { body = await request.json() } catch {
    return Response.json({ message: 'Ungültige Anfrage' }, { status: 400 })
  }
  const ts = Number(body?.ts)
  if (!Number.isFinite(ts) || ts <= 0) {
    return Response.json({ message: 'Ungültige Anfrage: ts fehlt' }, { status: 400 })
  }

  const version = await env.CONTENT_KV.get(`version-${id}-${ts}`, 'json')
  if (!version) {
    return Response.json({ message: 'Version nicht gefunden' }, { status: 404 })
  }

  // Aktuellen Live-Stand sichern, bevor er überschrieben wird
  const current = await env.CONTENT_KV.get(`content-${id}`, 'json')
  if (current) {
    await saveVersion(env, id, current, 'Vor Wiederherstellung')
  }

  const json = JSON.stringify(version)
  await env.CONTENT_KV.put(`content-${id}`, json)
  await env.CONTENT_KV.put(`draft-${id}`, json)
  await appendAudit(env, id, { type: 'restore', info: `Version ${ts} wiederhergestellt` })

  return Response.json({ ok: true })
}
