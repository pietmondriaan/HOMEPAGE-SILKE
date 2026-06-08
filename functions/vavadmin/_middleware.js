// functions/vavadmin/_middleware.js
// Protects all /vavadmin/* routes except /vavadmin/login and GET /vavadmin (login page)
import { getSessionFromRequest } from '../_lib/session.js'

export async function onRequest({ request, env, next, data }) {
  const url = new URL(request.url)

  // Allow login POST and GET /vavadmin (login page)
  const isLoginPost = url.pathname === '/vavadmin/login' && request.method === 'POST'
  const isAdminGet = url.pathname === '/vavadmin' && request.method === 'GET'
  if (isLoginPost || isAdminGet) return next()

  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) {
    return Response.redirect(new URL('/vavadmin', request.url).toString(), 302)
  }

  data.session = session
  return next()
}
