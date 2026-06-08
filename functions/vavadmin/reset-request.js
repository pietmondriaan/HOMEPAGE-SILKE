// functions/vavadmin/reset-request.js
import { sendEmail } from '../_lib/email.js'

function resetPage(sent = false) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen</title>
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
    .back{display:block;text-align:center;color:#475569;font-size:12px;text-decoration:none;margin-top:14px}
    .back:hover{color:#94a3b8}
    .ok{background:#064e3b;color:#6ee7b7;border-radius:10px;padding:14px;font-size:13px;line-height:1.5;margin-bottom:12px}
  </style>
</head>
<body>
  <div class="card">
    <h2>Passwort zurücksetzen</h2>
    ${sent
      ? `<div class="ok">Falls diese E-Mail-Adresse registriert ist, erhältst du in Kürze einen Link zum Zurücksetzen.</div>`
      : `<p>Gib deine E-Mail-Adresse ein. Du erhältst einen Link zum Zurücksetzen.</p>
         <input type="email" id="email" placeholder="deine@email.at" autofocus />
         <button class="btn" onclick="submit()">Link senden</button>
         <div id="err" style="color:#f87171;font-size:12px;margin-top:8px;display:none"></div>`
    }
    <a class="back" href="/vavadmin">← Zurück zur Anmeldung</a>
  </div>
  ${sent ? '' : `<script>
    document.getElementById('email').addEventListener('keydown', e => { if(e.key==='Enter') submit() })
    async function submit() {
      const email = document.getElementById('email').value.trim()
      if (!email) return
      const res = await fetch('/vavadmin/reset-request', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email })
      })
      if (res.ok) window.location.href = '/vavadmin/reset-request?sent=1'
      else document.getElementById('err').style.display='block', document.getElementById('err').textContent='Fehler. Bitte nochmal versuchen.'
    }
  </script>`}
</body></html>`
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url)

  if (request.method === 'GET') {
    return new Response(resetPage(url.searchParams.has('sent')), { headers: { 'Content-Type': 'text/html' } })
  }

  if (request.method === 'POST') {
    let body
    try { body = await request.json() } catch { return Response.json({ error: 'Bad request' }, { status: 400 }) }

    const email = (body.email ?? '').toLowerCase().trim()
    const customerEmail = (env.CUSTOMER_EMAIL ?? '').toLowerCase()
    const masterEmail = (env.MASTER_EMAIL ?? '').toLowerCase()

    // Always return ok — prevents email enumeration
    if (!email || (email !== customerEmail && email !== masterEmail)) {
      return Response.json({ ok: true })
    }

    try {
      const token = crypto.randomUUID().replace(/-/g, '')
      await env.CONTENT_KV.put(`reset-${token}`, JSON.stringify({ email }), { expirationTtl: 900 })

      const siteUrl = env.SITE_URL || `${url.protocol}//${url.hostname}`
      const resetUrl = `${siteUrl}/vavadmin/reset-confirm?token=${token}`
      const siteName = env.CUSTOMER_ID ? `Website (${env.CUSTOMER_ID})` : 'Website'

      await sendEmail({
        to: email,
        subject: `Passwort zurücksetzen — ${siteName}`,
        html: `<p>Hallo,</p>
               <p>du hast ein Zurücksetzen deines Passworts angefragt.</p>
               <p><a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">Passwort zurücksetzen</a></p>
               <p style="color:#666;font-size:13px">Dieser Link ist 15 Minuten gültig.<br>Wenn du das nicht angefragt hast, ignoriere diese E-Mail.</p>
               <p style="color:#999;font-size:12px">Vis-à-Vision</p>`,
      }, env.RESEND_API_KEY)
    } catch (e) {
      console.error('Reset email error:', e.message)
      // Still return ok to prevent enumeration
    }

    return Response.json({ ok: true })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
