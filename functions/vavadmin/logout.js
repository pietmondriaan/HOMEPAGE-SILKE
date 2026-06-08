// functions/admin/logout.js
export async function onRequestPost() {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  // Clear both possible cookie paths (old deployments used Path=/admin)
  headers.append('Set-Cookie', 'vas_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0')
  headers.append('Set-Cookie', 'vas_session=; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=0')
  return new Response(JSON.stringify({ ok: true }), { headers })
}
