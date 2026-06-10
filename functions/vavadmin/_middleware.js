// functions/vavadmin/_middleware.js
// Protects all /vavadmin/* routes except /vavadmin/login and GET /vavadmin (login page)
import { getSessionFromRequest } from '../_lib/session.js'

export async function onRequest({ request, env, next, data }) {
  const url = new URL(request.url)

  // CSRF-Basisschutz (zusätzlich zu SameSite=Strict): Bei POST mit vorhandenem
  // Origin-Header muss die Origin der eigenen entsprechen.
  if (request.method === 'POST') {
    const origin = request.headers.get('Origin')
    if (origin && origin !== url.origin) {
      return Response.json({ message: 'Ungültige Origin' }, { status: 403 })
    }
  }

  // Public routes — no session required
  const publicPaths = [
    '/vavadmin/login',
    '/vavadmin/reset-request',
    '/vavadmin/reset-confirm',
  ]
  const isAdminGet = url.pathname === '/vavadmin' && request.method === 'GET'
  if (isAdminGet || publicPaths.includes(url.pathname)) return next()

  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) {
    return Response.redirect(new URL('/vavadmin', request.url).toString(), 302)
  }

  data.session = session
  return next()
}
