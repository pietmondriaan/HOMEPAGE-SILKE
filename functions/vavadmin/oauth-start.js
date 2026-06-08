// functions/vavadmin/oauth-start.js
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const provider = url.searchParams.get('provider')
  if (!['google', 'facebook'].includes(provider)) {
    return new Response('Bad Request', { status: 400 })
  }

  const state = crypto.randomUUID().replace(/-/g, '')
  await env.CONTENT_KV.put(`oauth-state-${state}`, JSON.stringify({ provider }), { expirationTtl: 600 })

  const siteUrl = env.SITE_URL || `${url.protocol}//${url.hostname}`
  const callbackUrl = `${siteUrl}/vavadmin/oauth-callback`

  let authUrl
  if (provider === 'google') {
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(env.GOOGLE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
      `&response_type=code&scope=openid+email&state=${state}&prompt=select_account`
  } else {
    authUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
      `client_id=${encodeURIComponent(env.FACEBOOK_APP_ID)}` +
      `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
      `&scope=email&state=${state}`
  }

  return Response.redirect(authUrl, 302)
}
