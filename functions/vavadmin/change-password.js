// functions/vavadmin/change-password.js
import { checkPassword, hashPassword } from '../_lib/auth.js'

export async function onRequestPost({ request, env }) {
  let body
  try { body = await request.json() } catch { return new Response('Bad Request', { status: 400 }) }

  const { currentPassword, newPassword } = body
  if (!newPassword || newPassword.length < 6) {
    return Response.json({ ok: false, message: 'Passwort zu kurz (min. 6 Zeichen).' }, { status: 400 })
  }

  // First login: no KV hash stored yet → allow change without current password
  const storedHash = await env.CONTENT_KV.get(`password-${env.CUSTOMER_ID}`)
  if (!storedHash) {
    await env.CONTENT_KV.put(`password-${env.CUSTOMER_ID}`, await hashPassword(newPassword))
    return Response.json({ ok: true, message: 'Passwort gespeichert.' })
  }

  // Normal change: current password required
  if (!currentPassword) {
    return Response.json({ ok: false, message: 'Aktuelles Passwort fehlt.' }, { status: 400 })
  }
  const { valid, isMaster } = await checkPassword(currentPassword, env)
  if (!valid || isMaster) {
    return Response.json({ ok: false, message: 'Aktuelles Passwort falsch.' }, { status: 401 })
  }

  await env.CONTENT_KV.put(`password-${env.CUSTOMER_ID}`, await hashPassword(newPassword))
  return Response.json({ ok: true, message: 'Passwort gespeichert.' })
}
