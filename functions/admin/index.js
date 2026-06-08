// functions/admin/index.js
import { getSessionFromRequest } from '../_lib/session.js'

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Vis-à-Vision</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f172a; min-height: 100vh;
      display: flex; align-items: center; justify-content: center; }
    .card { background: #1e293b; border-radius: 12px; padding: 40px; width: 340px; }
    h1 { color: #f1f5f9; font-size: 20px; margin-bottom: 8px; }
    p { color: #94a3b8; font-size: 13px; margin-bottom: 24px; }
    input { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 8px;
      padding: 12px; color: #f1f5f9; font-size: 14px; margin-bottom: 12px; }
    button { width: 100%; background: #2563eb; color: #fff; border: none; border-radius: 8px;
      padding: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
    button:hover { background: #1d4ed8; }
    .error { color: #f87171; font-size: 12px; margin-top: 8px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Vis-à-Vision</h1>
    <p>Website-Verwaltung</p>
    <input type="password" id="pw" placeholder="Passwort" autofocus />
    <button onclick="login()">Anmelden</button>
    <div class="error" id="err">Falsches Passwort.</div>
  </div>
  <script>
    document.getElementById('pw').addEventListener('keydown', e => {
      if (e.key === 'Enter') login()
    })
    async function login() {
      const pw = document.getElementById('pw').value
      const res = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      })
      if (res.ok) {
        window.location.reload()
      } else {
        document.getElementById('err').style.display = 'block'
      }
    }
  </script>
</body>
</html>`

function adminPanel(previewsLeft, publishesLeft) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Website bearbeiten</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f172a; height: 100vh;
      display: flex; flex-direction: column; overflow: hidden; }
    header { background: #1e293b; padding: 10px 16px; display: flex; align-items: center;
      gap: 12px; border-bottom: 1px solid #334155; flex-shrink: 0; }
    header h1 { color: #f1f5f9; font-size: 14px; font-weight: 600; flex: 1; }
    .badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
    .badge-preview { background: #fef9c3; color: #854d0e; }
    .badge-publish { background: #dcfce7; color: #166534; }
    .main { display: flex; flex: 1; overflow: hidden; }
    .preview-panel { flex: 1.2; display: flex; flex-direction: column; border-right: 2px solid #334155; }
    .preview-header { background: #1e293b; padding: 6px 12px; font-size: 11px;
      color: #f59e0b; border-bottom: 1px solid #334155; }
    iframe { flex: 1; border: none; background: #fff; }
    .preview-footer { background: #1e293b; padding: 10px 12px; display: flex; gap: 8px;
      border-top: 2px solid #334155; }
    .btn-publish { flex: 1; background: #16a34a; color: #fff; border: none; padding: 10px;
      border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
    .btn-publish:disabled { background: #374151; color: #6b7280; cursor: not-allowed; }
    .btn-discard { background: #fee2e2; color: #dc2626; border: none; padding: 10px 14px;
      border-radius: 6px; font-size: 12px; cursor: pointer; }
    .chat-panel { width: 380px; display: flex; flex-direction: column; background: #0f172a; }
    .chat-header { background: #1e293b; padding: 10px 14px; font-size: 12px;
      color: #94a3b8; border-bottom: 1px solid #334155; }
    .chat-messages { flex: 1; padding: 12px; overflow-y: auto; display: flex;
      flex-direction: column; gap: 8px; }
    .msg { border-radius: 8px; padding: 10px 12px; font-size: 12px; line-height: 1.5; max-width: 90%; }
    .msg-bot { background: #1e293b; color: #e2e8f0; align-self: flex-start; }
    .msg-user { background: #2563eb; color: #fff; align-self: flex-end; }
    .msg-ok { background: #14532d; color: #4ade80; align-self: flex-start; }
    .msg-err { background: #450a0a; color: #f87171; align-self: flex-start; }
    .chat-input-area { padding: 10px; background: #1e293b; border-top: 1px solid #334155; }
    .drop-zone { border: 1px dashed #334155; border-radius: 6px; padding: 8px;
      text-align: center; font-size: 11px; color: #64748b; margin-bottom: 8px;
      transition: border-color 0.2s; cursor: pointer; }
    .drop-zone.drag-over { border-color: #2563eb; color: #93c5fd; }
    .chat-row { display: flex; gap: 6px; }
    textarea { flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 6px;
      padding: 8px; color: #e2e8f0; font-size: 12px; resize: none; min-height: 40px;
      max-height: 100px; font-family: inherit; }
    textarea:focus { outline: none; border-color: #2563eb; }
    .btn-send { background: #2563eb; color: #fff; border: none; padding: 8px 14px;
      border-radius: 6px; font-weight: 600; cursor: pointer; align-self: flex-end; }
    .formats { font-size: 10px; color: #475569; text-align: center; margin-top: 6px; }
  </style>
</head>
<body>
  <header>
    <h1>✏️ Website bearbeiten</h1>
    <span class="badge badge-preview" id="badge-preview">👁 Vorschau: ${previewsLeft} übrig</span>
    <span class="badge badge-publish" id="badge-publish">✓ Veröffentlichen: ${publishesLeft} übrig</span>
    <button onclick="logout()" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:12px">Abmelden</button>
  </header>
  <div class="main">
    <div class="preview-panel">
      <div class="preview-header">⚠️ ENTWURF — nur du siehst das gerade</div>
      <iframe id="preview" src="/preview" title="Vorschau"></iframe>
      <div class="preview-footer">
        <button class="btn-publish" id="btn-publish" onclick="publish()"
          ${publishesLeft <= 0 ? 'disabled' : ''}>
          ✓ Jetzt veröffentlichen (${publishesLeft} übrig)
        </button>
        <button class="btn-discard" onclick="discard()">✗ Verwerfen</button>
      </div>
    </div>
    <div class="chat-panel">
      <div class="chat-header">💬 Was soll geändert werden?</div>
      <div class="chat-messages" id="messages">
        <div class="msg msg-bot">Hallo! Was möchtest du heute ändern? Du kannst Texte, Farben, Bilder oder Dateien hochladen. Links siehst du die Vorschau.</div>
      </div>
      <div class="chat-input-area">
        <div class="drop-zone" id="dropzone" onclick="document.getElementById('fileInput').click()">
          📎 Datei ablegen oder klicken (JPG, PNG, PDF, DOCX, TXT)
        </div>
        <input type="file" id="fileInput" accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.txt" style="display:none" onchange="uploadFile(this.files[0])">
        <div class="chat-row">
          <textarea id="input" placeholder="Nachricht eingeben..." rows="1"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}"></textarea>
          <button class="btn-send" onclick="sendMessage()">→</button>
        </div>
        <div class="formats">Texte · Bilder · Farben · PDF · DOCX · TXT</div>
      </div>
    </div>
  </div>
  <script>
    let previewsLeft = ${previewsLeft}
    let publishesLeft = ${publishesLeft}

    function addMessage(text, type) {
      const el = document.createElement('div')
      el.className = 'msg msg-' + type
      el.textContent = text
      const msgs = document.getElementById('messages')
      msgs.appendChild(el)
      msgs.scrollTop = msgs.scrollHeight
    }

    function reloadPreview() {
      document.getElementById('preview').src = '/preview?' + Date.now()
    }

    function updateBadges() {
      document.getElementById('badge-preview').textContent = '👁 Vorschau: ' + previewsLeft + ' übrig'
      document.getElementById('badge-publish').textContent = '✓ Veröffentlichen: ' + publishesLeft + ' übrig'
      const btn = document.getElementById('btn-publish')
      btn.textContent = '✓ Jetzt veröffentlichen (' + publishesLeft + ' übrig)'
      btn.disabled = publishesLeft <= 0
    }

    async function sendMessage() {
      const input = document.getElementById('input')
      const text = input.value.trim()
      if (!text || previewsLeft <= 0) return
      input.value = ''
      addMessage(text, 'user')

      const res = await fetch('/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      const data = await res.json()
      if (res.ok) {
        previewsLeft = data.previewsLeft
        updateBadges()
        addMessage('✓ Vorschau aktualisiert. Links siehst du die Änderung.', 'ok')
        reloadPreview()
      } else if (res.status === 429) {
        addMessage(data.message, 'err')
      } else {
        addMessage('Fehler: ' + (data.message || 'Unbekannt'), 'err')
      }
    }

    async function publish() {
      if (publishesLeft <= 0) return
      const res = await fetch('/admin/publish', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        publishesLeft = data.publishesLeft
        updateBadges()
        addMessage('✓ Veröffentlicht! Deine Seite ist jetzt live.', 'ok')
        reloadPreview()
      } else {
        addMessage(data.message || 'Fehler beim Veröffentlichen', 'err')
      }
    }

    async function discard() {
      await fetch('/admin/discard', { method: 'POST' })
      addMessage('Änderungen verworfen.', 'bot')
      reloadPreview()
    }

    async function logout() {
      await fetch('/admin/logout', { method: 'POST' })
      window.location.reload()
    }

    async function uploadFile(file) {
      if (!file) return
      addMessage('📎 ' + file.name + ' wird hochgeladen...', 'user')
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        previewsLeft = data.previewsLeft
        updateBadges()
        addMessage('✓ ' + data.message, 'ok')
        reloadPreview()
      } else {
        addMessage('Fehler: ' + (data.message || 'Upload fehlgeschlagen'), 'err')
      }
    }

    // Drag & drop
    const dz = document.getElementById('dropzone')
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over') })
    dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'))
    dz.addEventListener('drop', e => {
      e.preventDefault(); dz.classList.remove('drag-over')
      if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0])
    })

    // Textarea auto-resize
    document.getElementById('input').addEventListener('input', function() {
      this.style.height = 'auto'
      this.style.height = Math.min(this.scrollHeight, 100) + 'px'
    })
  </script>
</body>
</html>`
}

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 })

  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) return new Response(LOGIN_PAGE, { headers: { 'Content-Type': 'text/html' } })

  const today = new Date().toISOString().split('T')[0]
  const id = env.CUSTOMER_ID
  const previewCount = parseInt(await env.CONTENT_KV.get(`limit-${id}-${today}-preview`) ?? '0')
  const publishCount = parseInt(await env.CONTENT_KV.get(`limit-${id}-${today}-publish`) ?? '0')
  const previewsLeft = Math.max(0, parseInt(env.PREVIEW_LIMIT_PER_DAY) - previewCount)
  const publishesLeft = Math.max(0, parseInt(env.PUBLISH_LIMIT_PER_DAY) - publishCount)

  return new Response(adminPanel(previewsLeft, publishesLeft), {
    headers: { 'Content-Type': 'text/html' },
  })
}
