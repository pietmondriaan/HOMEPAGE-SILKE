// functions/vavadmin/oauth-callback.js
import { createSession } from '../_lib/session.js'

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const base = `${url.protocol}//${url.hostname}`

  if (error || !code || !state) return Response.redirect(`${base}/vavadmin?oauth_error=cancelled`, 302)

  const stored = await env.CONTENT_KV.get(`oauth-state-${state}`)
  if (!stored) return Response.redirect(`${base}/vavadmin?oauth_error=state`, 302)
  await env.CONTENT_KV.delete(`oauth-state-${state}`)

  const { provider } = JSON.parse(stored)
  const siteUrl = env.SITE_URL || base
  const callbackUrl = `${siteUrl}/vavadmin/oauth-callback`

  let email
  try {
    if (provider === 'google') {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
          redirect_uri: callbackUrl, grant_type: 'authorization_code',
        }),
      })
      if (!tokenRes.ok) throw new Error('token_exchange')
      const { id_token } = await tokenRes.json()
      // Decode JWT payload (no signature verification needed — Google signed it)
      const payload = JSON.parse(atob(id_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      email = payload.email
    } else {
      const tokenRes = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token?` +
        `client_id=${encodeURIComponent(env.FACEBOOK_APP_ID)}` +
        `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
        `&client_secret=${encodeURIComponent(env.FACEBOOK_APP_SECRET)}` +
        `&code=${encodeURIComponent(code)}`
      )
      if (!tokenRes.ok) throw new Error('token_exchange')
      const { access_token } = await tokenRes.json()
      const userRes = await fetch(`https://graph.facebook.com/me?fields=email&access_token=${access_token}`)
      const userData = await userRes.json()
      email = userData.email
    }
  } catch {
    return Response.redirect(`${base}/vavadmin?oauth_error=provider`, 302)
  }

  if (!email) return Response.redirect(`${base}/vavadmin?oauth_error=no_email`, 302)

  const isMaster = env.MASTER_EMAIL && email.toLowerCase() === env.MASTER_EMAIL.toLowerCase()
  const isCustomer = env.CUSTOMER_EMAIL && email.toLowerCase() === env.CUSTOMER_EMAIL.toLowerCase()

  if (!isMaster && !isCustomer) return Response.redirect(`${base}/vavadmin?oauth_error=access`, 302)

  const token = await createSession(
    { customerId: env.CUSTOMER_ID, isMaster: !!isMaster, oauthEmail: email },
    env.SESSION_SECRET
  )

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${base}/vavadmin`,
      'Set-Cookie': `vas_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${4 * 3600}`,
    },
  })
}
