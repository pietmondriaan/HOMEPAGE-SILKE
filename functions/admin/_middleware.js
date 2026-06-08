// functions/admin/_middleware.js
// Protects all /admin/* routes except /admin/login and GET /admin (login page)
import { getSessionFromRequest } from '../_lib/session.js'

export async function onRequest({ request, env, next, data }) {
  const url = new URL(request.url)

  // Allow login POST and GET /admin (login page)
  const isLoginPost = url.pathname === '/admin/login' && request.method === 'POST'
  const isAdminGet = url.pathname === '/admin' && request.method === 'GET'
  if (isLoginPost || isAdminGet) return next()

  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) {
    return Response.redirect(new URL('/admin', request.url).toString(), 302)
  }

  data.session = session
  return next()
}
