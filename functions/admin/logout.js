// functions/admin/logout.js
export async function onRequestPost() {
  return Response.json({ ok: true }, {
    headers: {
      'Set-Cookie': 'vas_session=; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=0',
    },
  })
}
