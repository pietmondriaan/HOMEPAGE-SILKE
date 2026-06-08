// functions/vavadmin/reset-confirm.js
import { hashPassword } from '../_lib/auth.js'

function confirmPage(token, error = null) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neues Passwort</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:linear-gradient(-45deg,#0f172a,#1e1b4b,#042f2e,#1e293b);background-size:400% 400%;
      animation:bg-shift 12s ease infinite}
    @keyframes bg-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    .card{background:rgba(15,23,42,.85);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);
      border-radius:16px;padding:40px;width:360px;box-shadow:0 25px 50px rgba(0,0,0,.5)}
    h2{color:#f1f5f9;font-size:18px;font-weight:600;margin-bottom:8px}
    p{color:#64748b;font-size:13px;margin-bottom:20px;line-height:1.5}
    input{width:100%;background:#0f172a;border:1px solid #1e293b;border-radius:10px;
      padding:13px 16px;color:#f1f5f9;font-size:14px;margin-bottom:12px;transition:border-color .2s;font-family:inherit}
    input:focus{outline:none;border-color:#3b82f6}
    .btn{width:100%;background:linear-gradient(135deg,#2563eb,#7c3aed);border:none;border-radius:10px;
      padding:13px;color:#fff;font-size:14px;font-weight:600;cursor:pointer}
    .err{color:#f87171;font-size:12px;margin-top:8px}
    .back{display:block;text-align:center;color:#475569;font-size:12px;text-decoration:none;margin-top:14px}
    .back:hover{color:#94a3b8}
    .bad{background:#450a0a;color:#f87171;border-radius:10px;padding:14px;font-size:13px;margin-bottom:12px}
  </style>
</head>
<body>
  <div class="card">
    ${error
      ? `<h2>Link ungültig</h2>
         <div class="bad">${error}</div>
         <a class="back" href="/vavadmin/reset-request">Neuen Link anfordern</a>`
      : `<h2>Neues Passwort</h2>
         <p>Wähle ein sicheres Passwort (mindestens 6 Zeichen).</p>
         <input type="password" id="pw1" placeholder="Neues Passwort" autofocus />
         <input type="password" id="pw2" placeholder="Passwort wiederholen" />
         <button class="btn" onclick="save()">Passwort speichern</button>
         <div class="err" id="err" style="display:none"></div>`
    }
  </div>
  ${token && !error ? `<script>
    document.getElementById('pw2').addEventListener('keydown', e => { if(e.key==='Enter') save() })
    async function save() {
      const pw1 = document.getElementById('pw1').value
      const pw2 = document.getElementById('pw2').value
      const err = document.getElementById('err')
      if (pw1.length < 6) { err.style.display='block'; err.textContent='Mindestens 6 Zeichen.'; return }
      if (pw1 !== pw2) { err.style.display='block'; err.textContent='Passwörter stimmen nicht überein.'; return }
      const res = await fetch('/vavadmin/reset-confirm', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ token: '${token}', password: pw1 })
      })
      const data = await res.json()
      if (res.ok) {
        window.location.href = '/vavadmin?reset_ok=1'
      } else {
        err.style.display='block'; err.textContent = data.error || 'Fehler'
      }
    }
  </script>` : ''}
</body></html>`
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url)

  if (request.method === 'GET') {
    const token = url.searchParams.get('token')
    if (!token) return Response.redirect(`${url.origin}/vavadmin`, 302)

    const stored = await env.CONTENT_KV.get(`reset-${token}`)
    if (!stored) {
      return new Response(confirmPage(null, 'Dieser Link ist abgelaufen oder ungültig.'), {
        headers: { 'Content-Type': 'text/html' },
      })
    }
    return new Response(confirmPage(token), { headers: { 'Content-Type': 'text/html' } })
  }

  if (request.method === 'POST') {
    let body
    try { body = await request.json() } catch { return Response.json({ error: 'Bad request' }, { status: 400 }) }

    const { token, password } = body
    if (!token || !password || password.length < 6) {
      return Response.json({ error: 'Passwort zu kurz (min. 6 Zeichen).' }, { status: 400 })
    }

    const stored = await env.CONTENT_KV.get(`reset-${token}`)
    if (!stored) return Response.json({ error: 'Link abgelaufen oder ungültig.' }, { status: 400 })

    await env.CONTENT_KV.delete(`reset-${token}`)
    await env.CONTENT_KV.put(`password-${env.CUSTOMER_ID}`, await hashPassword(password))

    return Response.json({ ok: true })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
