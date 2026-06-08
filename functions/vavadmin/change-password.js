// functions/admin/change-password.js
import { checkPassword, hashPassword } from '../_lib/auth.js'

export async function onRequestPost({ request, env, data }) {
  let body
  try { body = await request.json() } catch { return new Response('Bad Request', { status: 400 }) }

  const { currentPassword, newPassword } = body
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return Response.json({ ok: false, message: 'Ungültige Eingabe (min. 6 Zeichen).' }, { status: 400 })
  }

  const { valid, isMaster } = await checkPassword(currentPassword, env)
  if (!valid || isMaster) {
    return Response.json({ ok: false, message: 'Aktuelles Passwort falsch.' }, { status: 401 })
  }

  const hash = await hashPassword(newPassword)
  await env.CONTENT_KV.put(`password-${env.CUSTOMER_ID}`, hash)

  return Response.json({ ok: true, message: 'Passwort gespeichert.' })
}
