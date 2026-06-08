// functions/vavadmin/index.js
import { getSessionFromRequest } from '../_lib/session.js'

function loginPage({ hasGoogle = false, hasFacebook = false, oauthError = null, resetOk = false }) {
  const oauthErrorMsg = {
    cancelled: 'Anmeldung abgebrochen.',
    state: 'Sicherheitsfehler. Bitte erneut versuchen.',
    provider: 'Fehler beim Anmelde-Anbieter. Bitte erneut versuchen.',
    no_email: 'Keine E-Mail-Adresse erhalten. Bitte anderen Weg nutzen.',
    access: 'Diese E-Mail-Adresse ist nicht berechtigt.',
  }[oauthError] ?? (oauthError ? 'Anmeldung fehlgeschlagen.' : null)

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Vis-à-Vision</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes bg-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    body {
      font-family: system-ui, sans-serif; min-height: 100vh; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(-45deg,#0f172a,#1e1b4b,#042f2e,#1e293b);
      background-size: 400% 400%; animation: bg-shift 12s ease infinite;
    }
    .card {
      background: rgba(15,23,42,0.85); backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;
      padding: 44px 40px; width: 360px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
    }
    .logo-block { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .logo-svg { display: block; }
    .logo-name { font-size: 22px; font-weight: 300; letter-spacing: 0.08em; color: #f1f5f9; }
    .logo-tagline { font-size: 11px; color: #64748b; margin-top: 4px; }
    .subtitle { font-size: 12px; color: #475569; text-align: center; margin-top: 24px; margin-bottom: 20px; }
    .btn-oauth {
      width: 100%; border: none; border-radius: 10px; padding: 11px 16px; font-size: 13px;
      font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center;
      gap: 10px; margin-bottom: 10px; transition: opacity .2s;
    }
    .btn-oauth:hover { opacity: 0.9; }
    .btn-google { background: #fff; color: #3c4043; }
    .btn-facebook { background: #1877F2; color: #fff; }
    .divider {
      display: flex; align-items: center; gap: 10px; margin: 16px 0 16px;
      color: #334155; font-size: 11px;
    }
    .divider::before, .divider::after { content: ''; flex: 1; border-top: 1px solid #1e293b; }
    input[type="password"] {
      width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 10px;
      padding: 13px 16px; color: #f1f5f9; font-size: 14px; margin-bottom: 12px;
      transition: border-color .2s; font-family: inherit;
    }
    input[type="password"]:focus { outline: none; border-color: #3b82f6; }
    button.btn-login {
      width: 100%; background: linear-gradient(135deg,#2563eb,#7c3aed); border: none;
      border-radius: 10px; padding: 13px; color: #fff; font-size: 14px;
      font-weight: 600; cursor: pointer; transition: opacity .2s;
    }
    button.btn-login:hover { opacity: 0.9; }
    .link-reset { display: block; text-align: center; color: #475569; font-size: 12px; text-decoration: none; margin-top: 10px; }
    .link-reset:hover { color: #94a3b8; }
    .msg-err { color: #f87171; font-size: 12px; margin-top: 8px; }
    .msg-ok { color: #4ade80; font-size: 12px; margin-top: 8px; text-align: center; }
    .page-footer { position: fixed; bottom: 12px; left: 0; right: 0; text-align: center; font-size: 10px; color: #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo-block">
      <svg class="logo-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dgrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#7c3aed"/>
          </linearGradient>
        </defs>
        <polygon points="14,2 26,14 14,26 2,14" fill="url(#dgrad)"/>
        <polygon points="14,7 21,14 14,21 7,14" fill="rgba(15,23,42,0.45)"/>
      </svg>
      <span class="logo-name">vis·à·vision</span>
      <span class="logo-tagline">Websites mit Vision.</span>
    </div>
    <p class="subtitle">Website-Verwaltung</p>

    ${oauthErrorMsg ? `<div class="msg-err" style="text-align:center;margin-bottom:12px">${oauthErrorMsg}</div>` : ''}
    ${resetOk ? `<div class="msg-ok" style="margin-bottom:12px">✓ Passwort geändert. Bitte anmelden.</div>` : ''}

    ${hasGoogle ? `
    <button class="btn-oauth btn-google" onclick="oauthLogin('google')">
      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
      Mit Google anmelden
    </button>` : ''}

    ${hasFacebook ? `
    <button class="btn-oauth btn-facebook" onclick="oauthLogin('facebook')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
      Mit Facebook anmelden
    </button>` : ''}

    ${hasGoogle || hasFacebook ? `<div class="divider">oder</div>` : ''}

    <input type="password" id="pw" placeholder="Passwort" autofocus />
    <button class="btn-login" onclick="login()">Anmelden</button>
    <div class="msg-err" id="err" style="display:none">Falsches Passwort.</div>
    <a class="link-reset" href="/vavadmin/reset-request">Passwort vergessen?</a>
  </div>
  <div class="page-footer">© 2026 Vis-à-Vision</div>
  <script>
    document.getElementById('pw').addEventListener('keydown', e => { if (e.key === 'Enter') login() })
    async function login() {
      const pw = document.getElementById('pw').value
      const res = await fetch('/vavadmin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      })
      if (res.ok) { window.location.reload() }
      else { document.getElementById('err').style.display = 'block' }
    }
    function oauthLogin(provider) {
      window.location.href = '/vavadmin/oauth-start?provider=' + provider
    }
  </script>
</body>
</html>`
}

function adminPanel(previewsLeft, publishesLeft, mustChangePassword) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Website-Assistent</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f172a; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    header { background: #111827; padding: 8px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #1f2937; flex-shrink: 0; }
    .header-logo { font-size: 13px; font-weight: 300; letter-spacing: 0.06em; color: #f1f5f9; white-space: nowrap; }
    header h1 { color: #f1f5f9; font-size: 14px; font-weight: 600; flex: 1; }
    .badge { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
    .badge-preview { background: #fef9c3; color: #854d0e; }
    .badge-publish { background: #dcfce7; color: #166534; }
    .main { display: flex; flex: 1; overflow: hidden; }
    .preview-panel { flex: 1.2; display: flex; flex-direction: column; border-right: 2px solid #1f2937; }
    .preview-header { background: #111827; padding: 6px 12px; font-size: 11px; color: #f59e0b; border-bottom: 1px solid #1f2937; display: flex; align-items: center; gap: 8px; }
    iframe { flex: 1; border: none; background: #fff; }
    .preview-footer { background: #111827; padding: 10px 12px; display: flex; gap: 8px; border-top: 2px solid #1f2937; }
    .btn-publish { flex: 1; background: #16a34a; color: #fff; border: none; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; }
    .btn-publish:disabled { background: #374151; color: #6b7280; cursor: not-allowed; }
    .btn-discard { background: #fee2e2; color: #dc2626; border: none; padding: 10px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; }
    .chat-panel { width: 400px; display: flex; flex-direction: column; background: #111827; }
    .chat-header { background: #111827; padding: 10px 14px; font-size: 11px; color: #6b7280; border-bottom: 1px solid #1f2937; flex-shrink: 0; }
    .chat-messages { flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
    .msg { max-width: 88%; font-size: 13px; line-height: 1.55; padding: 10px 14px; }
    .msg-user { background: #2563eb; color: #fff; align-self: flex-end; border-radius: 18px 18px 4px 18px; }
    .msg-bot { background: #1e293b; color: #e2e8f0; align-self: flex-start; border-radius: 18px 18px 18px 4px; }
    .msg-ok { background: #064e3b; color: #6ee7b7; align-self: flex-start; border-radius: 12px; }
    .msg-err { background: #450a0a; color: #f87171; align-self: flex-start; border-radius: 12px; }
    .msg-loading { background: #1e293b; color: #94a3b8; align-self: flex-start; border-radius: 18px 18px 18px 4px; }
    .msg-loading span { display: inline-block; animation: blink 1.2s infinite; }
    .msg-loading span:nth-child(2) { animation-delay: .2s; }
    .msg-loading span:nth-child(3) { animation-delay: .4s; }
    @keyframes blink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
    .chat-input-area { background: #111827; border-top: 1px solid #1f2937; padding: 12px; flex-shrink: 0; }
    .input-box { display: flex; flex-direction: column; gap: 6px; border: 1px solid #374151; border-radius: 12px; background: #1f2937; padding: 10px 12px; }
    .selection-chip { display: none; align-items: center; gap: 6px; background: #1e3a5f; border: 1px solid rgba(37,99,235,0.25); border-radius: 6px; padding: 5px 10px; font-size: 11px; color: #93c5fd; }
    .selection-chip button { background: none; border: none; color: #64748b; cursor: pointer; font-size: 15px; padding: 0; line-height: 1; margin-left: auto; }
    .selection-chip button:hover { color: #f87171; }
    textarea { background: none; border: none; color: #e2e8f0; font-size: 13px; resize: none; min-height: 36px; max-height: 120px; width: 100%; font-family: inherit; outline: none; }
    textarea::placeholder { color: #4b5563; }
    .input-actions { display: flex; align-items: center; gap: 6px; }
    .btn-action { background: none; border: none; color: #6b7280; cursor: pointer; font-size: 17px; padding: 4px 6px; border-radius: 6px; transition: color .15s; }
    .btn-action:hover { color: #94a3b8; }
    .btn-mic.recording { color: #ef4444; animation: mic-pulse 1s infinite; }
    .btn-mic.processing { color: #f59e0b; }
    @keyframes mic-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0)} }
    .btn-send-round { background: #2563eb; border: none; border-radius: 50%; width: 32px; height: 32px; color: #fff; font-size: 15px; cursor: pointer; margin-left: auto; display: flex; align-items: center; justify-content: center; transition: background .15s; flex-shrink: 0; }
    .btn-send-round:hover { background: #1d4ed8; }
    .btn-send-round:disabled { background: #374151; cursor: not-allowed; }
    .btn-select { background: #334155; color: #94a3b8; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: background .15s; }
    .btn-select:hover { background: #475569; }
    .btn-select.active { background: #1e3a5f; color: #60a5fa; border: 1px solid #2563eb; }
    .legal-footer { font-size: 10px; color: #334155; text-align: center; padding: 6px 12px; border-top: 1px solid #1f2937; flex-shrink: 0; }
    .legal-footer a { color: #475569; text-decoration: none; }
    .legal-footer a:hover { color: #94a3b8; }
    /* Modals */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 100; display: none; align-items: center; justify-content: center; }
    .modal-box { background: #1e293b; border-radius: 12px; padding: 28px; width: 320px; border: 1px solid #334155; }
    .modal-box h2 { color: #f1f5f9; font-size: 15px; margin-bottom: 16px; }
    .modal-input { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px; color: #f1f5f9; font-size: 13px; margin-bottom: 10px; font-family: inherit; }
    .modal-input:focus { outline: none; border-color: #3b82f6; }
    .modal-msg { font-size: 12px; margin-bottom: 10px; display: none; }
    .modal-actions { display: flex; gap: 8px; }
    .btn-modal-save { flex: 1; background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-modal-cancel { background: #334155; color: #94a3b8; border: none; border-radius: 6px; padding: 10px 14px; font-size: 13px; cursor: pointer; }
    /* Force-change overlay — higher z-index, no cancel */
    #force-change-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.92); z-index: 200; display: none; align-items: center; justify-content: center; }
    #force-change-overlay .modal-box { border-color: #2563eb; }
    #force-change-overlay .modal-box p { color: #94a3b8; font-size: 13px; margin-bottom: 18px; line-height: 1.5; }
  </style>
</head>
<body>
  <!-- Force-change password overlay (first login) -->
  <div id="force-change-overlay">
    <div class="modal-box">
      <h2>Bitte Passwort ändern</h2>
      <p>Du verwendest noch das Standard-Passwort. Bitte setze jetzt ein persönliches Passwort, bevor du weiterarbeitest.</p>
      <input type="password" id="fc-new" class="modal-input" placeholder="Neues Passwort (min. 6 Zeichen)" autofocus />
      <input type="password" id="fc-confirm" class="modal-input" placeholder="Passwort wiederholen" />
      <div id="fc-msg" class="modal-msg"></div>
      <div class="modal-actions">
        <button class="btn-modal-save" onclick="doForceChange()">Passwort speichern</button>
      </div>
    </div>
  </div>

  <!-- Change-password modal -->
  <div id="changepw-modal" class="modal-overlay">
    <div class="modal-box">
      <h2>Passwort ändern</h2>
      <input type="password" id="cpw-current" class="modal-input" placeholder="Aktuelles Passwort">
      <input type="password" id="cpw-new" class="modal-input" placeholder="Neues Passwort (min. 6 Zeichen)">
      <input type="password" id="cpw-confirm" class="modal-input" placeholder="Neues Passwort wiederholen">
      <div id="cpw-msg" class="modal-msg"></div>
      <div class="modal-actions">
        <button class="btn-modal-save" onclick="doChangePw()">Speichern</button>
        <button class="btn-modal-cancel" onclick="hideChangePw()">Abbrechen</button>
      </div>
    </div>
  </div>

  <header>
    <span class="header-logo">vis·à·vision</span>
    <h1>Website-Assistent</h1>
    <span class="badge badge-preview" id="badge-preview">👁 Vorschau: ${previewsLeft} übrig</span>
    <span class="badge badge-publish" id="badge-publish">✓ Veröffentlichen: ${publishesLeft} übrig</span>
    <button onclick="showChangePw()" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:12px;margin-right:4px">🔑 Passwort</button>
    <button onclick="logout()" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:12px">Abmelden</button>
  </header>
  <div class="main">
    <div class="preview-panel">
      <div class="preview-header">⚠️ ENTWURF — nur du siehst das gerade &nbsp;<button class="btn-select" id="btn-select" onclick="toggleSelection()" title="Bereich auf der Seite anklicken">📍 Bereich wählen</button></div>
      <iframe id="preview" src="/preview" title="Vorschau"></iframe>
      <div class="preview-footer">
        <button class="btn-publish" id="btn-publish" onclick="publish()" ${publishesLeft <= 0 ? 'disabled' : ''}>
          ✓ Jetzt veröffentlichen (${publishesLeft} übrig)
        </button>
        <button class="btn-discard" onclick="discard()">✗ Verwerfen</button>
      </div>
    </div>
    <div class="chat-panel">
      <div class="chat-header">Powered by Gemini 2.5 Flash · AI kann Fehler machen</div>
      <div class="chat-messages" id="messages">
        <div class="msg msg-bot">Hallo! Was möchtest du heute ändern? Du kannst Texte, Farben, Bilder oder Dateien hochladen. Links siehst du die Vorschau.</div>
      </div>
      <div class="chat-input-area">
        <input type="file" id="fileInput" accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.txt" style="display:none" onchange="uploadFile(this.files[0])">
        <div class="input-box" id="input-box">
          <div class="selection-chip" id="selection-chip">
            <span>📌</span><span id="selection-chip-label"></span>
            <button onclick="clearSelection()" title="Auswahl aufheben">×</button>
          </div>
          <textarea id="input" placeholder="Nachricht eingeben oder 🎤 sprechen…" rows="1"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}"></textarea>
          <div class="input-actions">
            <button class="btn-action" id="btn-attach" onclick="document.getElementById('fileInput').click()" title="Datei anhängen">📎</button>
            <button class="btn-mic btn-action" id="btn-mic" onclick="toggleMic()" title="Spracheingabe">🎤</button>
            <button class="btn-send-round" onclick="sendMessage()" title="Senden">↑</button>
          </div>
        </div>
      </div>
      <div class="legal-footer" title="AI-generierte Inhalte müssen vor Veröffentlichung geprüft werden. Vis-à-Vision haftet nicht für KI-generierte Texte.">
        © 2026 Vis-à-Vision &nbsp;·&nbsp; <a href="#">Datenschutz</a> &nbsp;·&nbsp; <a href="#">AGB</a>
      </div>
    </div>
  </div>
  <script>
    let previewsLeft = ${previewsLeft}
    let publishesLeft = ${publishesLeft}
    let mustChangePassword = ${mustChangePassword}
    let conversationHistory = []
    let isSending = false
    let selectedElement = null
    let selectionActive = false

    if (mustChangePassword) {
      document.getElementById('force-change-overlay').style.display = 'flex'
      document.getElementById('fc-new').focus()
    }

    async function doForceChange() {
      const pw1 = document.getElementById('fc-new').value
      const pw2 = document.getElementById('fc-confirm').value
      const msg = document.getElementById('fc-msg')
      if (pw1.length < 6) { showFcMsg('Mindestens 6 Zeichen.', false); return }
      if (pw1 !== pw2) { showFcMsg('Passwörter stimmen nicht überein.', false); return }
      const res = await fetch('/vavadmin/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: pw1 })
      })
      const data = await res.json()
      if (res.ok) {
        showFcMsg('✓ Gespeichert!', true)
        setTimeout(() => {
          document.getElementById('force-change-overlay').style.display = 'none'
          mustChangePassword = false
        }, 1000)
      } else {
        showFcMsg(data.message || 'Fehler', false)
      }
    }
    function showFcMsg(text, ok) {
      const el = document.getElementById('fc-msg')
      el.style.display = 'block'
      el.style.color = ok ? '#4ade80' : '#f87171'
      el.textContent = text
    }
    document.getElementById('fc-confirm').addEventListener('keydown', e => { if (e.key === 'Enter') doForceChange() })

    function toggleSelection() {
      selectionActive = !selectionActive
      const btn = document.getElementById('btn-select')
      btn.className = 'btn-select' + (selectionActive ? ' active' : '')
      btn.textContent = selectionActive ? '✕ Abbrechen' : '📍 Bereich wählen'
      document.getElementById('preview').contentWindow.postMessage({ type: 'VAS_SELECTION_MODE', enabled: selectionActive }, '*')
    }
    function clearSelection() {
      selectedElement = null
      document.getElementById('selection-chip').style.display = 'none'
    }
    window.addEventListener('message', function(e) {
      if (!e.data || e.data.type !== 'VAS_SELECTED') return
      selectedElement = { field: e.data.field, label: e.data.label, text: e.data.text }
      selectionActive = false
      const btn = document.getElementById('btn-select')
      btn.className = 'btn-select'
      btn.textContent = '📍 Bereich wählen'
      const chip = document.getElementById('selection-chip')
      const labelEl = document.getElementById('selection-chip-label')
      const preview = e.data.text ? ' — "' + e.data.text.substring(0, 40) + (e.data.text.length > 40 ? '…' : '') + '"' : ''
      labelEl.textContent = e.data.label + preview
      chip.style.display = 'flex'
      document.getElementById('input').focus()
    })
    function addMessage(text, type) {
      const el = document.createElement('div')
      el.className = 'msg msg-' + type
      el.textContent = text
      const msgs = document.getElementById('messages')
      msgs.appendChild(el)
      msgs.scrollTop = msgs.scrollHeight
      return el
    }
    function setInputLocked(locked) {
      isSending = locked
      document.getElementById('input').disabled = locked
      document.querySelector('.btn-send-round').disabled = locked
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
      if (!text || isSending) return
      input.value = ''
      input.style.height = 'auto'
      let backendText = text
      if (selectedElement) {
        backendText = '[Ausgewähltes Element: ' + selectedElement.label + ' (Feld: ' + selectedElement.field + ')] ' + text
        clearSelection()
      }
      addMessage(text, 'user')
      conversationHistory.push({ role: 'user', text: backendText })
      const loadingEl = document.createElement('div')
      loadingEl.className = 'msg msg-loading'
      loadingEl.innerHTML = '<span>●</span><span>●</span><span>●</span>'
      document.getElementById('messages').appendChild(loadingEl)
      document.getElementById('messages').scrollTop = 9999
      setInputLocked(true)
      try {
        const res = await fetch('/vavadmin/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory })
        })
        loadingEl.remove()
        const data = await res.json()
        if (res.ok && data.action === 'ask') {
          addMessage(data.question, 'bot')
          conversationHistory.push({ role: 'model', text: data.question })
        } else if (res.ok && data.action === 'update') {
          previewsLeft = data.previewsLeft
          updateBadges()
          const confirmMsg = '✓ Vorschau aktualisiert. Links siehst du die Änderung.'
          addMessage(confirmMsg, 'ok')
          conversationHistory.push({ role: 'model', text: confirmMsg })
          reloadPreview()
          conversationHistory = []
        } else if (res.status === 429) {
          addMessage(data.message, 'err')
        } else {
          addMessage('Fehler: ' + (data.message || 'Unbekannt'), 'err')
        }
      } catch {
        loadingEl.remove()
        addMessage('Verbindungsfehler. Bitte nochmal versuchen.', 'err')
      } finally {
        setInputLocked(false)
        document.getElementById('input').focus()
      }
    }
    async function publish() {
      if (publishesLeft <= 0) return
      const res = await fetch('/vavadmin/publish', { method: 'POST' })
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
      await fetch('/vavadmin/discard', { method: 'POST' })
      addMessage('Änderungen verworfen.', 'bot')
      reloadPreview()
    }
    async function logout() {
      await fetch('/vavadmin/logout', { method: 'POST' })
      window.location.reload()
    }
    async function uploadFile(file) {
      if (!file) return
      addMessage('📎 ' + file.name + ' wird hochgeladen...', 'user')
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/vavadmin/upload', { method: 'POST', body: formData })
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
    const inputBox = document.getElementById('input-box')
    inputBox.addEventListener('dragover', e => { e.preventDefault(); inputBox.style.borderColor = '#2563eb' })
    inputBox.addEventListener('dragleave', () => { inputBox.style.borderColor = '#374151' })
    inputBox.addEventListener('drop', e => {
      e.preventDefault(); inputBox.style.borderColor = '#374151'
      if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0])
    })
    document.getElementById('input').addEventListener('input', function() {
      this.style.height = 'auto'
      this.style.height = Math.min(this.scrollHeight, 120) + 'px'
    })

    // Voice input
    let mediaRecorder = null
    let audioChunks = []
    async function toggleMic() {
      const btn = document.getElementById('btn-mic')
      if (mediaRecorder && mediaRecorder.state === 'recording') { mediaRecorder.stop(); return }
      let stream
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }) }
      catch { addMessage('Mikrofon-Zugriff verweigert.', 'err'); return }
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
      audioChunks = []
      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data) }
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        btn.className = 'btn-mic btn-action processing'; btn.textContent = '⏳'
        const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' })
        const form = new FormData()
        form.append('audio', blob, 'audio.webm')
        try {
          const res = await fetch('/vavadmin/transcribe', { method: 'POST', body: form })
          const data = await res.json()
          if (res.ok && data.text) {
            const input = document.getElementById('input')
            input.value = data.text
            input.style.height = 'auto'
            input.style.height = Math.min(input.scrollHeight, 120) + 'px'
            input.focus()
          } else { addMessage('Transkription fehlgeschlagen: ' + (data.error || 'Unbekannt'), 'err') }
        } catch { addMessage('Verbindungsfehler bei der Spracherkennung.', 'err') }
        finally { btn.className = 'btn-mic btn-action'; btn.textContent = '🎤' }
      }
      mediaRecorder.start()
      btn.className = 'btn-mic btn-action recording'; btn.textContent = '⏹'
    }

    // Change-password modal
    function showChangePw() {
      document.getElementById('changepw-modal').style.display = 'flex'
      document.getElementById('cpw-current').value = ''
      document.getElementById('cpw-new').value = ''
      document.getElementById('cpw-confirm').value = ''
      document.getElementById('cpw-msg').style.display = 'none'
      document.getElementById('cpw-current').focus()
    }
    function hideChangePw() { document.getElementById('changepw-modal').style.display = 'none' }
    async function doChangePw() {
      const cur = document.getElementById('cpw-current').value
      const nw = document.getElementById('cpw-new').value
      const conf = document.getElementById('cpw-confirm').value
      const msg = document.getElementById('cpw-msg')
      if (nw !== conf) { msg.style.display='block'; msg.style.color='#f87171'; msg.textContent='Passwörter stimmen nicht überein.'; return }
      const res = await fetch('/vavadmin/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: cur, newPassword: nw })
      })
      const data = await res.json()
      msg.style.display = 'block'
      if (res.ok) { msg.style.color='#4ade80'; msg.textContent='✓ ' + data.message; setTimeout(hideChangePw, 1500) }
      else { msg.style.color='#f87171'; msg.textContent = data.message }
    }
  </script>
</body>
</html>`
}

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405 })

  const url = new URL(request.url)
  const session = await getSessionFromRequest(request, env.SESSION_SECRET)

  if (!session) {
    return new Response(loginPage({
      hasGoogle: !!env.GOOGLE_CLIENT_ID,
      hasFacebook: !!env.FACEBOOK_APP_ID,
      oauthError: url.searchParams.get('oauth_error'),
      resetOk: url.searchParams.has('reset_ok'),
    }), { headers: { 'Content-Type': 'text/html' } })
  }

  const today = new Date().toISOString().split('T')[0]
  const id = env.CUSTOMER_ID
  const [previewCount, publishCount, storedHash] = await Promise.all([
    env.CONTENT_KV.get(`limit-${id}-${today}-preview`),
    env.CONTENT_KV.get(`limit-${id}-${today}-publish`),
    env.CONTENT_KV.get(`password-${id}`),
  ])

  const previewsLeft = Math.max(0, parseInt(env.PREVIEW_LIMIT_PER_DAY) - parseInt(previewCount ?? '0'))
  const publishesLeft = Math.max(0, parseInt(env.PUBLISH_LIMIT_PER_DAY) - parseInt(publishCount ?? '0'))
  const mustChangePassword = !session.isMaster && !storedHash

  return new Response(adminPanel(previewsLeft, publishesLeft, mustChangePassword), {
    headers: { 'Content-Type': 'text/html' },
  })
}
