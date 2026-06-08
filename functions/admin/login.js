// functions/admin/login.js
import { createSession } from '../_lib/session.js'
import { checkPassword } from '../_lib/auth.js'

export async function handleLogin({ request, env }) {
  let body
  try { body = await request.json() } catch { return new Response('Bad Request', { status: 400 }) }

  const { valid, isMaster } = checkPassword(body.password ?? '', env)
  if (!valid) return new Response('Unauthorized', { status: 401 })

  const token = await createSession(
    { customerId: env.CUSTOMER_ID, isMaster },
    env.SESSION_SECRET
  )

  return Response.json({ ok: true, isMaster }, {
    headers: {
      'Set-Cookie': `vas_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=${8 * 3600}`,
    },
  })
}

export async function onRequestPost(context) {
  return handleLogin(context)
}
