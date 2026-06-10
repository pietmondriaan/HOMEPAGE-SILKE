// functions/vavadmin/index.js
import { getSessionFromRequest } from '../_lib/session.js'
import { viennaDateKey } from '../_lib/rate-limit.js'
import { SECTION_META } from '../../src/content-schema.js'

function loginPage({ resetOk = false }) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anmelden — Vis-à-Vision</title>
  <link rel="stylesheet" href="/fonts/inter.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes bg-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    body {
      font-family: 'Inter', system-ui, sans-serif; height: 100vh; overflow: hidden;
      display: flex; background: #060c18; -webkit-font-smoothing: antialiased;
    }
    .spline-panel { flex: 1; position: relative; overflow: hidden; }
    spline-viewer { width: 100%; height: 100%; display: block; }
    .login-panel {
      width: 440px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 32px 24px;
      background: linear-gradient(-45deg,#060c18,#1e1b4b,#042f2e,#0f172a);
      background-size: 400% 400%; animation: bg-shift 14s ease infinite;
      border-left: 1px solid rgba(255,255,255,.06);
    }
    .card {
      background: rgba(8,15,32,.72); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255,255,255,.08); border-radius: 20px;
      padding: 36px 32px 28px; width: 100%; box-shadow: 0 32px 64px rgba(0,0,0,.55);
    }
    @media (max-width: 768px) { .spline-panel { display: none; } .login-panel { width: 100%; border-left: none; } }
    .logo-ring {
      width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(255,255,255,.10);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
      background: rgba(255,255,255,.03);
    }
    .login-header { text-align: center; margin-bottom: 24px; }
    .login-brand {
      font-size: 14px; font-weight: 300; letter-spacing: .1em; margin-bottom: 10px; display: block;
      background: linear-gradient(135deg,#4f8ef7,#8b5cf6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .login-title { color: #f1f5f9; font-size: 18px; font-weight: 600; margin-bottom: 4px; }
    .login-desc { color: #64748b; font-size: 13px; }
    .field { margin-bottom: 14px; }
    .field-label { display: block; color: #94a3b8; font-size: 13px; font-weight: 500; margin-bottom: 6px; }
    .pw-wrap { position: relative; }
    .pw-wrap input {
      width: 100%; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.10);
      border-radius: 10px; padding: 11px 42px 11px 14px; color: #f1f5f9; font-size: 14px;
      transition: border-color .2s, box-shadow .2s; font-family: inherit;
    }
    .pw-wrap input:focus { outline: none; border-color: rgba(79,142,247,.45); box-shadow: 0 0 0 3px rgba(79,142,247,.1); }
    .pw-toggle {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: #475569; cursor: pointer; padding: 0;
      display: flex; align-items: center; transition: color .15s;
    }
    .pw-toggle:hover { color: #94a3b8; }
    .form-row { display: flex; justify-content: flex-end; margin-bottom: 18px; margin-top: -4px; }
    .link-reset { color: #64748b; font-size: 12px; text-decoration: none; transition: color .15s; }
    .link-reset:hover { color: #94a3b8; }
    .btn-login {
      width: 100%; background: linear-gradient(135deg,#2563eb,#7c3aed); border: none;
      border-radius: 10px; padding: 12px; color: #fff; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: opacity .2s, transform .1s;
      font-family: inherit; box-shadow: 0 4px 16px rgba(37,99,235,.3); letter-spacing: .01em;
    }
    .btn-login:hover { opacity: .9; transform: translateY(-1px); }
    .btn-login:active { transform: translateY(0); }
    .msg-err { color: #f87171; font-size: 12px; margin-top: 7px; }
    .msg-ok { color: #4ade80; font-size: 12px; margin-top: 7px; text-align: center; }
    .page-footer { position: fixed; bottom: 12px; right: 0; width: 440px; text-align: center; font-size: 10px; color: rgba(51,65,85,.6); }
    @media (max-width: 768px) { .page-footer { width: 100%; right: auto; left: 0; } }
  </style>
  <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
</head>
<body>
  <div class="spline-panel">
    <spline-viewer url="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" loading-anim-type="spinner-big-dark"></spline-viewer>
  </div>
  <div class="login-panel">
  <div class="card">
    <div class="logo-ring" aria-hidden="true">
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#4f8ef7"/><stop offset="100%" stop-color="#8b5cf6"/>
        </linearGradient></defs>
        <polygon points="14,2 26,14 14,26 2,14" fill="url(#lg)"/>
        <polygon points="14,7 21,14 14,21 7,14" fill="rgba(8,15,32,.4)"/>
      </svg>
    </div>
    <div class="login-header">
      <span class="login-brand">vis·à·vision</span>
      <h1 class="login-title">Willkommen zurück</h1>
      <p class="login-desc">Website-Verwaltung</p>
    </div>

    ${resetOk ? `<div class="msg-ok" style="margin-bottom:12px">✓ Passwort geändert. Bitte anmelden.</div>` : ''}

    <form id="login-form" autocomplete="on">
      <div class="field">
        <label for="pw" class="field-label">Passwort</label>
        <div class="pw-wrap">
          <input type="password" id="pw" name="password" autocomplete="current-password" autocorrect="off" autocapitalize="none" spellcheck="false" autofocus />
          <button class="pw-toggle" type="button" id="pw-toggle" onclick="togglePw()" title="Passwort anzeigen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg></button>
        </div>
        <div class="msg-err" id="err" style="display:none">Falsches Passwort.</div>
      </div>
      <div class="form-row">
        <a class="link-reset" href="/vavadmin/reset-request">Passwort vergessen?</a>
      </div>
      <button class="btn-login" type="submit">Anmelden</button>
    </form>
  </div>
  <div class="page-footer">© 2026 Vis-à-Vision</div>
  </div>
  <script>
    const EYE_OPEN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>'
    const EYE_OFF = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>'
    document.getElementById('login-form').addEventListener('submit', e => { e.preventDefault(); login() })
    function togglePw() {
      const input = document.getElementById('pw')
      const btn = document.getElementById('pw-toggle')
      if (input.type === 'password') { input.type = 'text'; btn.innerHTML = EYE_OFF }
      else { input.type = 'password'; btn.innerHTML = EYE_OPEN }
    }
    async function login() {
      const pw = document.getElementById('pw').value
      const res = await fetch('/vavadmin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      })
      if (res.ok) { window.location.reload() }
      else { document.getElementById('err').style.display = 'block' }
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Admin — Website-Assistent</title>
  <link rel="stylesheet" href="/fonts/inter.css">
  <style>
    :root {
      --bg: #060c18; --s1: rgba(255,255,255,.03); --s2: rgba(255,255,255,.055);
      --b1: rgba(255,255,255,.06); --b2: rgba(255,255,255,.10);
      --t1: #e2e8f0; --t2: #64748b; --t3: #475569;
      --accent: #4f8ef7; --accent2: #8b5cf6;
      --green: #10b981; --red: #f87171; --yellow: #f59e0b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.2); }
    body {
      font-family: 'Inter', system-ui, sans-serif; background: var(--bg);
      height: 100vh; display: flex; flex-direction: column; overflow: hidden;
      font-size: 13px; -webkit-font-smoothing: antialiased;
    }
    header {
      background: rgba(6,12,24,.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      padding: 0 16px; height: 52px; display: flex; align-items: center; gap: 10px;
      border-bottom: 1px solid var(--b1); flex-shrink: 0; position: relative; z-index: 10;
    }
    .header-logo {
      font-size: 14px; font-weight: 300; letter-spacing: .08em; white-space: nowrap;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    header h1 { color: var(--t1); font-size: 13px; font-weight: 500; flex: 1; letter-spacing: .01em; min-width: 0; }
    .badge {
      font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px;
      letter-spacing: .02em; white-space: nowrap; transition: background .3s, color .3s, border-color .3s;
    }
    .badge-preview { background: rgba(245,158,11,.1); color: var(--yellow); border: 1px solid rgba(245,158,11,.2); }
    .badge-publish { background: rgba(16,185,129,.1); color: var(--green); border: 1px solid rgba(16,185,129,.2); }
    .badge.warn { background: rgba(239,68,68,.12) !important; color: var(--red) !important; border-color: rgba(239,68,68,.28) !important; animation: pulse-warn 1.8s ease-in-out infinite; }
    @keyframes pulse-warn { 0%,100%{opacity:1} 50%{opacity:.7} }
    .btn-header {
      font-family: inherit; background: var(--s2); border: 1px solid var(--b1);
      color: var(--t2); cursor: pointer; font-size: 11px; padding: 5px 10px;
      border-radius: 6px; transition: background .15s, color .15s; letter-spacing: .02em; white-space: nowrap;
    }
    .btn-header:hover { background: rgba(255,255,255,.09); color: var(--t1); }
    .btn-chat-toggle {
      font-family: inherit; background: var(--s2); border: 1px solid var(--b1);
      color: var(--t2); cursor: pointer; font-size: 11px; padding: 5px 9px;
      border-radius: 6px; transition: background .15s, color .15s; display: flex; align-items: center; gap: 5px; white-space: nowrap;
    }
    .btn-chat-toggle:hover { background: rgba(255,255,255,.09); color: var(--t1); }
    .main { display: flex; flex: 1; overflow: hidden; }
    .preview-panel { flex: 1; min-width: 0; display: flex; flex-direction: column; border-right: 1px solid var(--b1); }
    .preview-header {
      background: rgba(245,158,11,.03); padding: 6px 12px; font-size: 11px;
      color: var(--yellow); border-bottom: 1px solid rgba(245,158,11,.1);
      display: flex; align-items: center; gap: 7px; letter-spacing: .02em; flex-shrink: 0; flex-wrap: wrap;
    }
    .preview-header-label { flex: 1; white-space: nowrap; }
    iframe { flex: 1; border: none; background: #fff; min-height: 0; }
    .preview-footer {
      background: rgba(6,12,24,.9); backdrop-filter: blur(10px);
      padding: 10px 12px; display: flex; gap: 8px; border-top: 1px solid var(--b1); flex-shrink: 0;
    }
    .btn-publish {
      flex: 1; background: linear-gradient(135deg, #059669, var(--green)); color: #fff;
      border: none; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: opacity .2s, transform .1s; font-family: inherit;
      letter-spacing: .01em; box-shadow: 0 2px 12px rgba(16,185,129,.25);
    }
    .btn-publish:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
    .btn-publish:active:not(:disabled) { transform: translateY(0); }
    .btn-publish:disabled { background: var(--s2); color: var(--t2); cursor: not-allowed; box-shadow: none; }
    .btn-discard {
      background: rgba(239,68,68,.07); color: var(--red); border: 1px solid rgba(239,68,68,.15);
      padding: 10px 14px; border-radius: 8px; font-size: 12px; cursor: pointer;
      transition: background .2s; font-family: inherit;
    }
    .btn-discard:hover { background: rgba(239,68,68,.13); }
    /* Chat panel with slide toggle */
    .chat-panel {
      width: 400px; flex-shrink: 0; display: flex; flex-direction: column;
      background: var(--bg); border-left: 1px solid var(--b1); overflow: hidden;
      transition: width .32s cubic-bezier(.4,0,.2,1), opacity .28s ease, border-width .32s ease;
    }
    .chat-panel.collapsed { width: 0; opacity: 0; border-left-width: 0; }
    .chat-inner { width: 400px; display: flex; flex-direction: column; height: 100%; }
    .chat-header {
      padding: 9px 16px; font-size: 10px; color: var(--t3); border-bottom: 1px solid var(--b1);
      flex-shrink: 0; letter-spacing: .04em; text-transform: uppercase; background: var(--s1); white-space: nowrap;
    }
    .chat-messages { flex: 1; padding: 16px 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
    .chat-messages::-webkit-scrollbar-thumb { background: var(--b2); }
    @keyframes msg-in { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
    .msg { max-width: 88%; font-size: 13px; line-height: 1.6; padding: 10px 14px; animation: msg-in .2s ease; word-break: break-word; }
    .msg-user {
      background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff;
      align-self: flex-end; border-radius: 16px 16px 4px 16px;
      box-shadow: 0 4px 14px rgba(37,99,235,.22);
    }
    .msg-bot { background: #f8fafc; color: #1e293b; align-self: flex-start; border-radius: 16px 16px 16px 4px; border: 1px solid #e2e8f0; }
    .msg-ok { background: #f0fdf4; color: #166534; align-self: flex-start; border-radius: 10px; border: 1px solid #bbf7d0; }
    .msg-err { background: #fef2f2; color: #991b1b; align-self: flex-start; border-radius: 10px; border: 1px solid #fecaca; }
    .msg-loading { background: #f8fafc; color: #94a3b8; align-self: flex-start; border-radius: 16px 16px 16px 4px; border: 1px solid #e2e8f0; padding: 14px 16px; }
    .msg-loading span { display: inline-block; width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; margin: 0 2px; animation: blink 1.4s infinite; }
    .msg-loading span:nth-child(2) { animation-delay: .2s; }
    .msg-loading span:nth-child(3) { animation-delay: .4s; }
    @keyframes blink { 0%,80%,100%{opacity:.2;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }
    @keyframes spin { to { transform: rotate(360deg); } }
    .chat-input-area { background: var(--s1); border-top: 1px solid var(--b1); padding: 12px; flex-shrink: 0; }
    .input-box {
      display: flex; flex-direction: column; gap: 6px; border: 1px solid #e2e8f0;
      border-radius: 14px; background: #fff; padding: 10px 12px;
      transition: border-color .2s, box-shadow .2s;
    }
    .input-box:focus-within { border-color: rgba(79,142,247,.5); box-shadow: 0 0 0 3px rgba(79,142,247,.1); }
    .chips-container { display: flex; flex-direction: column; gap: 4px; }
    .selection-chip {
      display: flex; align-items: center; gap: 6px; background: rgba(79,142,247,.07);
      border: 1px solid rgba(79,142,247,.18); border-radius: 6px; padding: 5px 10px;
      font-size: 11px; color: #2563eb; animation: msg-in .15s ease;
    }
    .selection-chip span.chip-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .selection-chip button { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 15px; padding: 0; line-height: 1; flex-shrink: 0; }
    .selection-chip button:hover { color: #ef4444; }
    textarea { background: none; border: none; color: #1e293b; font-size: 13px; resize: none; min-height: 36px; max-height: 120px; width: 100%; font-family: inherit; outline: none; line-height: 1.55; }
    textarea::placeholder { color: #94a3b8; }
    .input-actions { display: flex; align-items: center; gap: 4px; }
    .btn-action { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px; padding: 5px 7px; border-radius: 8px; transition: color .15s, background .15s; }
    .btn-action:hover { color: #64748b; background: rgba(0,0,0,.04); }
    .btn-mic.recording { color: #ef4444; background: rgba(239,68,68,.08); }
    .btn-mic.processing { color: #f59e0b; background: rgba(245,158,11,.08); }
    .btn-send-round {
      background: linear-gradient(135deg, #2563eb, #7c3aed); border: none; border-radius: 50%;
      width: 32px; height: 32px; color: #fff; font-size: 15px; cursor: pointer;
      margin-left: auto; display: flex; align-items: center; justify-content: center;
      transition: opacity .15s, transform .1s; flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(37,99,235,.3);
    }
    .btn-send-round:hover:not(:disabled) { opacity: .9; transform: scale(1.06); }
    .btn-send-round:disabled { background: #e2e8f0; box-shadow: none; cursor: not-allowed; }
    .btn-select {
      background: rgba(255,255,255,.08); color: var(--t2); border: 1px solid var(--b1);
      padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;
      transition: all .15s; font-family: inherit; white-space: nowrap;
    }
    .btn-select:hover { background: rgba(255,255,255,.13); color: var(--t1); }
    .btn-select.active { background: rgba(79,142,247,.18); color: #93c5fd; border-color: rgba(79,142,247,.35); }
    .section-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
    .section-chip {
      background: var(--s2); border: 1px solid var(--b1); color: var(--t2);
      padding: 4px 10px; border-radius: 999px; font-size: 11px; cursor: pointer;
      transition: all .15s; font-family: inherit; white-space: nowrap;
    }
    .section-chip:hover { background: rgba(79,142,247,.15); color: #93c5fd; border-color: rgba(79,142,247,.3); }
    .version-list { max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .version-item {
      display: flex; align-items: center; gap: 8px; padding: 9px 11px;
      background: var(--s1); border: 1px solid var(--b1); border-radius: 8px;
    }
    .version-item .v-info { flex: 1; min-width: 0; }
    .version-item .v-date { color: var(--t1); font-size: 12px; font-weight: 500; }
    .version-item .v-summary { color: var(--t2); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .version-item button {
      background: rgba(79,142,247,.12); border: 1px solid rgba(79,142,247,.25); color: #93c5fd;
      padding: 5px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; font-family: inherit;
      white-space: nowrap;
    }
    .version-item button:hover { background: rgba(79,142,247,.22); }
    .legal-footer {
      font-size: 10px; color: var(--t3); text-align: center;
      padding: 8px 12px; border-top: 1px solid var(--b1); flex-shrink: 0; background: var(--s1);
    }
    .legal-footer a { color: #cbd5e1; text-decoration: none; }
    .legal-footer a:hover { color: #94a3b8; }
    /* Modals */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.7); backdrop-filter: blur(4px);
      z-index: 100; display: none; align-items: center; justify-content: center;
    }
    .modal-box {
      background: rgba(8,15,32,.96); backdrop-filter: blur(24px); border-radius: 16px;
      padding: 28px; width: 320px; border: 1px solid var(--b2);
      box-shadow: 0 24px 48px rgba(0,0,0,.6); position: relative;
    }
    .modal-close {
      position: absolute; top: 10px; right: 12px; background: none; border: none;
      color: var(--t3); cursor: pointer; font-size: 22px; line-height: 1;
      padding: 2px 5px; border-radius: 4px; transition: color .15s;
    }
    .modal-close:hover { color: var(--t1); }
    .modal-box h2 { color: var(--t1); font-size: 15px; font-weight: 600; margin-bottom: 16px; }
    .modal-input {
      width: 100%; background: rgba(255,255,255,.04); border: 1px solid var(--b2);
      border-radius: 8px; padding: 10px 12px; color: var(--t1); font-size: 13px;
      margin-bottom: 10px; font-family: inherit; transition: border-color .2s;
    }
    .modal-input:focus { outline: none; border-color: rgba(79,142,247,.4); box-shadow: 0 0 0 3px rgba(79,142,247,.08); }
    .modal-msg { font-size: 12px; margin-bottom: 10px; display: none; }
    .modal-actions { display: flex; gap: 8px; }
    .btn-modal-save {
      flex: 1; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff;
      border: none; border-radius: 8px; padding: 10px; font-size: 13px;
      font-weight: 600; cursor: pointer; transition: opacity .2s; font-family: inherit;
    }
    .btn-modal-save:hover { opacity: .9; }
    .btn-modal-cancel {
      background: var(--s2); color: var(--t2); border: 1px solid var(--b1);
      border-radius: 8px; padding: 10px 14px; font-size: 13px; cursor: pointer;
      font-family: inherit; transition: background .2s;
    }
    .btn-modal-cancel:hover { background: rgba(255,255,255,.08); }
    #force-change-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.92); backdrop-filter: blur(8px);
      z-index: 200; display: none; align-items: center; justify-content: center;
    }
    #force-change-overlay .modal-box { border-color: rgba(79,142,247,.3); }
    #force-change-overlay .modal-box p { color: var(--t2); font-size: 13px; margin-bottom: 18px; line-height: 1.6; }
    /* Limit overlay */
    .limit-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.82); backdrop-filter: blur(8px);
      z-index: 150; display: none; align-items: center; justify-content: center;
    }
    .limit-card {
      background: rgba(8,15,32,.97); border: 1px solid rgba(239,68,68,.25);
      border-radius: 16px; padding: 32px 28px; width: 360px; text-align: center;
      box-shadow: 0 24px 48px rgba(0,0,0,.6);
    }
    .limit-card h2 { color: var(--red); font-size: 17px; font-weight: 700; margin-bottom: 10px; }
    .limit-card p { color: var(--t2); font-size: 13px; line-height: 1.65; margin-bottom: 22px; }
    .btn-upgrade {
      background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; border: none;
      border-radius: 8px; padding: 11px 28px; font-size: 13px; font-weight: 600;
      cursor: pointer; font-family: inherit; box-shadow: 0 4px 16px rgba(37,99,235,.28);
    }
    .btn-upgrade:hover { opacity: .9; }
    .btn-limit-close {
      display: block; margin: 12px auto 0; background: none; border: none;
      color: var(--t3); font-size: 12px; cursor: pointer; font-family: inherit;
    }
    .btn-limit-close:hover { color: var(--t2); }
    /* ── Mobile: nur Chat, kein Preview ── */
    @media (max-width: 768px) {
      header { padding: 0 14px; height: 46px; gap: 8px; }
      .badge { display: none !important; }
      #chat-toggle-btn { display: none !important; }
      .preview-panel { display: none !important; }
      .chat-panel {
        width: 100% !important; opacity: 1 !important; border-left: none !important;
        transition: none !important; overflow: visible !important;
      }
      .chat-panel.collapsed { width: 100% !important; opacity: 1 !important; }
      .chat-inner { width: 100% !important; }
      .chat-messages { padding: 14px 12px; }
      .msg { max-width: 94%; }
      .chat-header { font-size: 9px; padding: 7px 14px; }
      .chat-input-area { padding: 10px 12px max(28px, env(safe-area-inset-bottom, 28px)); }
      .input-box { border-radius: 18px; }
      .btn-action { padding: 6px 8px; }
      .legal-footer { font-size: 9px; padding: 6px 12px; }
      .modal-box { width: calc(100vw - 32px); }
      .limit-card { width: calc(100vw - 32px); }
    }
  </style>
</head>
<body>
  <!-- Force-change password overlay (first login) -->
  <div id="force-change-overlay">
    <div class="modal-box">
      <h2>Bitte Passwort ändern</h2>
      <p>Du verwendest noch das Standard-Passwort. Bitte setze jetzt ein persönliches Passwort, bevor du weiterarbeitest.</p>
      <input type="password" id="fc-new" class="modal-input" placeholder="Neues Passwort (min. 6 Zeichen)" />
      <input type="password" id="fc-confirm" class="modal-input" placeholder="Passwort wiederholen" />
      <div id="fc-msg" class="modal-msg"></div>
      <div class="modal-actions">
        <button class="btn-modal-save" onclick="doForceChange()">Passwort speichern</button>
      </div>
    </div>
  </div>

  <!-- Change-password modal -->
  <div id="changepw-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cpw-title">
    <div class="modal-box">
      <button class="modal-close" onclick="hideChangePw()" aria-label="Schließen">×</button>
      <h2 id="cpw-title">Passwort ändern</h2>
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

  <!-- Versions / Verlauf modal -->
  <div id="versions-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="v-title">
    <div class="modal-box" style="width:400px">
      <button class="modal-close" onclick="hideVersions()" aria-label="Schließen">×</button>
      <h2 id="v-title">Letzte Veröffentlichungen</h2>
      <div class="version-list" id="version-list"><div style="color:var(--t2);font-size:12px">Lade…</div></div>
      <div style="color:var(--t3);font-size:11px;line-height:1.5">Mit „Wiederherstellen" wird dieser Stand sofort wieder live geschaltet. Der aktuelle Stand bleibt im Verlauf erhalten.</div>
    </div>
  </div>

  <!-- Publish-limit overlay -->
  <div id="limit-overlay" class="limit-overlay" role="dialog" aria-modal="true">
    <div class="limit-card">
      <h2>Tageslimit erreicht</h2>
      <p>Du hast heute alle Veröffentlichungen aufgebraucht. Das Kontingent wird morgen früh zurückgesetzt — oder schreib uns für ein Upgrade.</p>
      <button class="btn-upgrade" onclick="window.location.href='mailto:hallo@vis-a-vision.com?subject=Upgrade-Anfrage'">Upgrade anfragen</button>
      <button class="btn-limit-close" onclick="document.getElementById('limit-overlay').style.display='none'">Schließen</button>
    </div>
  </div>

  <header>
    <span class="header-logo">vis·à·vision</span>
    <h1>Website-Assistent</h1>
    <span class="badge badge-preview" id="badge-preview">Vorschau: ${previewsLeft} übrig</span>
    <span class="badge badge-publish" id="badge-publish">Veröff.: ${publishesLeft} übrig</span>
    <button class="btn-header" onclick="showVersions()">Verlauf</button>
    <button class="btn-header" onclick="showChangePw()">Passwort</button>
    <button class="btn-header" onclick="logout()">Abmelden</button>
    <button class="btn-chat-toggle" id="chat-toggle-btn" onclick="toggleChat()" title="Chat ein-/ausblenden">
      <svg id="chat-toggle-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg>
      Chat
    </button>
  </header>
  <div class="main">
    <div class="preview-panel">
      <div class="preview-header">
        <span class="preview-header-label">ENTWURF — nur du siehst das</span>
        <button class="btn-select" id="btn-rect" onclick="toggleRect()" title="Rahmen um einen Bereich ziehen">⬚ Markieren</button>
        <button class="btn-select" id="btn-multiselect" onclick="toggleMultiSelect()" title="Mehrere Bereiche gleichzeitig auswählen">Mehrfach-Auswahl</button>
        <button class="btn-select" id="btn-select" onclick="toggleSelection()" title="Bereich auf der Seite anklicken">Bereich wählen</button>
      </div>
      <iframe id="preview" src="/preview" title="Vorschau"></iframe>
      <div class="preview-footer">
        <button class="btn-publish" id="btn-publish" onclick="publish()" ${publishesLeft <= 0 ? 'disabled' : ''}>
          Jetzt veröffentlichen (${publishesLeft} übrig)
        </button>
        <button class="btn-discard" onclick="discard()">Verwerfen</button>
      </div>
    </div>
    <div class="chat-panel" id="chat-panel">
      <div class="chat-inner">
        <div class="chat-header">Powered by Gemini 2.5 Flash · AI kann Fehler machen</div>
        <div class="chat-messages" id="messages">
          <div class="msg msg-bot">Hallo! Was möchtest du heute ändern? Texte, Farben, Bilder — einfach schreiben oder sprechen. Tipp: Mit "Bereich wählen" kannst du einen konkreten Abschnitt markieren.</div>
        </div>
        <div class="chat-input-area">
          <div class="section-chips" id="section-chips"></div>
          <input type="file" id="fileInput" accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,.txt" style="display:none" onchange="uploadFile(this.files[0])">
          <div class="input-box" id="input-box">
            <div class="chips-container" id="chips-container"></div>
            <textarea id="input" placeholder="Nachricht eingeben oder sprechen…" rows="1"
              onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}"></textarea>
            <div class="input-actions">
              <button class="btn-action" id="btn-attach" onclick="document.getElementById('fileInput').click()" title="Datei anhängen"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
              <button class="btn-mic btn-action" id="btn-mic" onclick="toggleMic()" title="Spracheingabe"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg></button>
              <button class="btn-send-round" onclick="sendMessage()" title="Senden">&#8593;</button>
            </div>
          </div>
        </div>
        <div class="legal-footer">
          © 2026 Vis-à-Vision &nbsp;·&nbsp; <a href="#">Datenschutz</a> &nbsp;·&nbsp; <a href="#">AGB</a>
        </div>
      </div>
    </div>
  </div>
  <script>
    let previewsLeft = ${previewsLeft}
    let publishesLeft = ${publishesLeft}
    let mustChangePassword = ${mustChangePassword}
    let conversationHistory = []
    let isSending = false
    let selectedElements = []
    let selectionActive = false
    let multiSelectMode = false
    let rectActive = false
    let chatCollapsed = false
    let lastSummary = ''
    const ORIGIN = window.location.origin
    const SECTIONS = ${JSON.stringify(Object.entries(SECTION_META).filter(([, m]) => m.editable !== false).map(([key, m]) => ({ key, label: m.label })))}

    if (mustChangePassword) {
      document.getElementById('force-change-overlay').style.display = 'flex'
      setTimeout(function() { document.getElementById('fc-new').focus() }, 50)
    }

    // ---- Focus trap ----
    function trapFocus(box) {
      const sel = 'button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])'
      const nodes = Array.from(box.querySelectorAll(sel))
      const first = nodes[0], last = nodes[nodes.length - 1]
      function handler(e) {
        if (e.key !== 'Tab') return
        if (e.shiftKey) { if (document.activeElement === first) { last.focus(); e.preventDefault() } }
        else { if (document.activeElement === last) { first.focus(); e.preventDefault() } }
      }
      box._trap = handler
      box.addEventListener('keydown', handler)
    }
    function releaseTrap(box) { if (box._trap) { box.removeEventListener('keydown', box._trap); delete box._trap } }

    // ---- Global keyboard shortcuts ----
    document.addEventListener('keydown', function(e) {
      if (e.key !== 'Escape') return
      var cpw = document.getElementById('changepw-modal')
      var lim = document.getElementById('limit-overlay')
      var ver = document.getElementById('versions-modal')
      if (cpw.style.display === 'flex') { hideChangePw(); return }
      if (ver.style.display === 'flex') { hideVersions(); return }
      if (lim.style.display === 'flex') { lim.style.display = 'none'; return }
      if (rectActive) { endRect(); return }
      if (selectionActive) { endSelection(); return }
    })

    // ---- Chat panel toggle ----
    function toggleChat() {
      chatCollapsed = !chatCollapsed
      document.getElementById('chat-panel').classList.toggle('collapsed', chatCollapsed)
      var icon = document.getElementById('chat-toggle-icon')
      icon.setAttribute('points', chatCollapsed ? '15,18 9,12 15,6' : '9,18 15,12 9,6')
      document.getElementById('chat-toggle-btn').title = chatCollapsed ? 'Chat einblenden' : 'Chat ausblenden'
    }

    // ---- Rechteck-Markierung ----
    function toggleRect() { rectActive ? endRect() : startRect() }
    function startRect() {
      if (selectionActive) endSelection()
      rectActive = true
      var btn = document.getElementById('btn-rect')
      btn.classList.add('active'); btn.textContent = 'Abbrechen'
      document.getElementById('preview').contentWindow.postMessage({ type: 'VAS_RECT_MODE', enabled: true }, ORIGIN)
    }
    function endRect() {
      rectActive = false
      var btn = document.getElementById('btn-rect')
      btn.classList.remove('active'); btn.textContent = '⬚ Markieren'
      document.getElementById('preview').contentWindow.postMessage({ type: 'VAS_RECT_MODE', enabled: false }, ORIGIN)
    }
    function handleRectResult(data) {
      endRect()
      var cands = (data.candidates || [])
      var editable = cands.filter(function(c) { return c.editable !== false })
      var locked = cands.filter(function(c) { return c.editable === false })
      if (data.resolution === 'none' || cands.length === 0) {
        addMessage('In diesem Bereich habe ich nichts Bearbeitbares erkannt. Versuch es mit einem etwas größeren Rahmen — oder beschreib mir einfach, was du ändern möchtest.', 'bot')
        return
      }
      if (locked.length && !editable.length) {
        addMessage('Der Bereich „' + locked[0].label + '" wird von Vis-à-Vision für dich gepflegt (rechtliche Inhalte). Schreib mir deinen Änderungswunsch — ich gebe ihn weiter.', 'bot')
        return
      }
      editable.forEach(function(c) {
        selectedElements.push({ field: c.kind === 'section' ? 'section:' + c.path : c.path, label: c.label, text: c.text || '' })
      })
      renderChips()
      if (data.resolution === 'too_large') {
        addMessage('Deine Auswahl war sehr groß — ich habe den Bereich „' + editable[0].label + '" übernommen. Passt das? Sonst entferne den Chip (×) und markiere kleiner.', 'bot')
      } else if (data.resolution === 'ambiguous' || editable.length > 1) {
        addMessage('Ich habe ' + editable.length + ' Bereiche erkannt (siehe Chips über dem Eingabefeld). Entferne mit × was nicht gemeint ist, und schreib mir dann, was geändert werden soll.', 'bot')
      }
      document.getElementById('input').focus()
    }

    // ---- Multi-select mode ----
    function toggleMultiSelect() {
      multiSelectMode = !multiSelectMode
      var btn = document.getElementById('btn-multiselect')
      btn.classList.toggle('active', multiSelectMode)
      btn.textContent = multiSelectMode ? 'Mehrfach: Ein' : 'Mehrfach-Auswahl'
      if (multiSelectMode && !selectionActive) startSelection()
    }

    // ---- Selection ----
    function startSelection() {
      if (rectActive) endRect()
      selectionActive = true
      var btn = document.getElementById('btn-select')
      btn.classList.add('active')
      btn.textContent = 'Abbrechen'
      document.getElementById('preview').contentWindow.postMessage({ type: 'VAS_SELECTION_MODE', enabled: true }, ORIGIN)
    }
    function endSelection() {
      selectionActive = false
      var btn = document.getElementById('btn-select')
      btn.classList.remove('active')
      btn.textContent = 'Bereich wählen'
      document.getElementById('preview').contentWindow.postMessage({ type: 'VAS_SELECTION_MODE', enabled: false }, ORIGIN)
    }
    function toggleSelection() { selectionActive ? endSelection() : startSelection() }

    function renderChips() {
      var container = document.getElementById('chips-container')
      container.innerHTML = ''
      selectedElements.forEach(function(el, i) {
        var chip = document.createElement('div')
        chip.className = 'selection-chip'
        var preview = el.text ? ' — “' + el.text.substring(0, 35) + (el.text.length > 35 ? '…' : '') + '”' : ''
        var label = document.createElement('span')
        label.className = 'chip-label'
        label.textContent = '📌 ' + el.label + preview
        var removeBtn = document.createElement('button')
        removeBtn.textContent = '×'
        removeBtn.title = 'Entfernen'
        ;(function(idx) { removeBtn.onclick = function() { selectedElements.splice(idx, 1); renderChips() } })(i)
        chip.appendChild(label)
        chip.appendChild(removeBtn)
        container.appendChild(chip)
      })
    }
    function clearAllSelections() { selectedElements = []; renderChips() }

    window.addEventListener('message', function(e) {
      if (e.origin !== ORIGIN || !e.data) return
      if (e.data.type === 'VAS_SELECTED') {
        var el = { field: e.data.field, label: e.data.label, text: e.data.text }
        if (multiSelectMode) {
          selectedElements.push(el)
        } else {
          selectedElements = [el]
          endSelection()
        }
        renderChips()
        document.getElementById('input').focus()
      }
      if (e.data.type === 'VAS_RECT_SELECTED') handleRectResult(e.data)
      if (e.data.type === 'VAS_RECT_MODE_ENDED' && rectActive) endRect()
    })

    // ---- Bereichs-Chips (Schnellauswahl benannter Bereiche) ----
    var chipsRow = document.getElementById('section-chips')
    SECTIONS.forEach(function(s) {
      var b = document.createElement('button')
      b.className = 'section-chip'
      b.textContent = s.label
      b.title = 'Bereich „' + s.label + '" als Kontext wählen'
      b.onclick = function() {
        var exists = selectedElements.some(function(el) { return el.field === 'section:' + s.key })
        if (!exists) { selectedElements.push({ field: 'section:' + s.key, label: s.label, text: '' }); renderChips() }
        document.getElementById('preview').contentWindow.postMessage({ type: 'VAS_HIGHLIGHT_SECTION', section: s.key }, ORIGIN)
        document.getElementById('input').focus()
      }
      chipsRow.appendChild(b)
    })

    // ---- Messages ----
    function addMessage(text, type) {
      var el = document.createElement('div')
      el.className = 'msg msg-' + type
      el.textContent = text
      var msgs = document.getElementById('messages')
      msgs.appendChild(el)
      msgs.scrollTop = msgs.scrollHeight
      return el
    }
    function setInputLocked(locked) {
      isSending = locked
      document.getElementById('input').disabled = locked
      document.querySelector('.btn-send-round').disabled = locked
    }
    function reloadPreview() { document.getElementById('preview').src = '/preview?' + Date.now() }

    function updateBadges() {
      var prevBadge = document.getElementById('badge-preview')
      var pubBadge = document.getElementById('badge-publish')
      prevBadge.textContent = 'Vorschau: ' + previewsLeft + ' übrig'
      pubBadge.textContent = 'Veröff.: ' + publishesLeft + ' übrig'
      prevBadge.classList.toggle('warn', previewsLeft <= 2)
      pubBadge.classList.toggle('warn', publishesLeft <= 0)
      var pubBtn = document.getElementById('btn-publish')
      pubBtn.textContent = 'Jetzt veröffentlichen (' + publishesLeft + ' übrig)'
      pubBtn.disabled = publishesLeft <= 0
      if (publishesLeft <= 0) document.getElementById('limit-overlay').style.display = 'flex'
    }

    // ---- Send ----
    async function sendMessage() {
      var input = document.getElementById('input')
      var text = input.value.trim()
      if (!text || isSending) return
      input.value = ''; input.style.height = 'auto'
      var backendText = text
      if (selectedElements.length > 0) {
        var ctx = selectedElements.map(function(el) {
          if (el.field.indexOf('section:') === 0) {
            return '[Markierter Bereich: ' + el.label + ' (Sektion: ' + el.field.slice(8) + ')]'
          }
          return '[Element: ' + el.label + ' (Feld: ' + el.field + ')' + (el.text ? ' Inhalt: "' + el.text + '"' : '') + ']'
        }).join(' ')
        backendText = ctx + ' ' + text
        clearAllSelections()
        if (multiSelectMode) { multiSelectMode = false; document.getElementById('btn-multiselect').classList.remove('active'); document.getElementById('btn-multiselect').textContent = 'Mehrfach-Auswahl' }
      }
      addMessage(text, 'user')
      conversationHistory.push({ role: 'user', text: backendText })
      var loadingEl = document.createElement('div')
      loadingEl.className = 'msg msg-loading'
      loadingEl.innerHTML = '<span>●</span><span>●</span><span>●</span>'
      document.getElementById('messages').appendChild(loadingEl)
      document.getElementById('messages').scrollTop = 9999
      setInputLocked(true)
      try {
        var res = await fetch('/vavadmin/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory })
        })
        loadingEl.remove()
        var data = await res.json()
        if (res.ok && data.action === 'ask') {
          addMessage(data.question, 'bot')
          conversationHistory.push({ role: 'model', text: data.question })
        } else if (res.ok && data.action === 'update') {
          previewsLeft = data.previewsLeft; updateBadges()
          lastSummary = data.summary || ''
          var confirmMsg = '✓ ' + (data.summary ? data.summary + ' — schau links in die Vorschau.' : 'Vorschau aktualisiert. Links siehst du die Änderung.')
          addMessage(confirmMsg, 'ok')
          conversationHistory.push({ role: 'model', text: confirmMsg })
          reloadPreview(); conversationHistory = []
        } else if (res.status === 422) {
          addMessage(data.message || 'Das habe ich nicht sicher verstanden. Formulier es bitte noch einmal anders.', 'bot')
        } else if (res.status === 429) {
          addMessage(data.message, 'err')
        } else {
          addMessage('Fehler: ' + (data.message || 'Unbekannt'), 'err')
        }
      } catch(err) {
        loadingEl.remove()
        addMessage('Verbindungsfehler. Bitte nochmal versuchen.', 'err')
      } finally {
        setInputLocked(false); document.getElementById('input').focus()
      }
    }

    // ---- Publish / Discard ----
    async function publish() {
      if (publishesLeft <= 0) { document.getElementById('limit-overlay').style.display = 'flex'; return }
      if (!window.confirm('Jetzt live schalten? Besucher sehen die Änderung sofort.')) return
      var res = await fetch('/vavadmin/publish', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: lastSummary || 'Veröffentlichung' })
      })
      var data = await res.json()
      if (res.ok) {
        publishesLeft = data.publishesLeft; updateBadges()
        lastSummary = ''
        addMessage('✓ Veröffentlicht! Deine Seite ist jetzt live. Falls etwas nicht passt: Über „Verlauf" kannst du jeden früheren Stand zurückholen.', 'ok')
        reloadPreview()
      } else { addMessage(data.message || 'Fehler beim Veröffentlichen', 'err') }
    }

    // ---- Verlauf / Versionen ----
    function showVersions() {
      var modal = document.getElementById('versions-modal')
      modal.style.display = 'flex'
      trapFocus(modal.querySelector('.modal-box'))
      loadVersions()
    }
    function hideVersions() {
      var modal = document.getElementById('versions-modal')
      releaseTrap(modal.querySelector('.modal-box'))
      modal.style.display = 'none'
    }
    async function loadVersions() {
      var list = document.getElementById('version-list')
      list.innerHTML = '<div style="color:var(--t2);font-size:12px">Lade…</div>'
      try {
        var res = await fetch('/vavadmin/versions')
        var data = await res.json()
        var versions = data.versions || []
        if (!versions.length) {
          list.innerHTML = '<div style="color:var(--t2);font-size:12px">Noch keine Veröffentlichungen — der Verlauf füllt sich mit jeder Liveschaltung.</div>'
          return
        }
        list.innerHTML = ''
        versions.forEach(function(v) {
          var item = document.createElement('div')
          item.className = 'version-item'
          var d = new Date(v.ts)
          var dateStr = d.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
            ', ' + d.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })
          var info = document.createElement('div')
          info.className = 'v-info'
          info.innerHTML = '<div class="v-date"></div><div class="v-summary"></div>'
          info.querySelector('.v-date').textContent = dateStr
          info.querySelector('.v-summary').textContent = v.summary || 'Veröffentlichung'
          var btn = document.createElement('button')
          btn.textContent = 'Wiederherstellen'
          btn.onclick = async function() {
            if (!window.confirm('Diesen Stand vom ' + dateStr + ' wiederherstellen? Er ist danach sofort live.')) return
            btn.disabled = true; btn.textContent = '…'
            var r = await fetch('/vavadmin/restore', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ts: v.ts })
            })
            if (r.ok) {
              hideVersions()
              addMessage('✓ Stand vom ' + dateStr + ' wiederhergestellt — er ist jetzt live.', 'ok')
              reloadPreview()
            } else {
              btn.disabled = false; btn.textContent = 'Wiederherstellen'
              addMessage('Wiederherstellen fehlgeschlagen. Bitte nochmal versuchen.', 'err')
            }
          }
          item.appendChild(info); item.appendChild(btn)
          list.appendChild(item)
        })
      } catch (e) {
        list.innerHTML = '<div style="color:var(--red);font-size:12px">Verlauf konnte nicht geladen werden.</div>'
      }
    }
    async function discard() {
      await fetch('/vavadmin/discard', { method: 'POST' })
      addMessage('Änderungen verworfen.', 'bot'); reloadPreview()
    }
    async function logout() {
      await fetch('/vavadmin/logout', { method: 'POST' }); window.location.reload()
    }

    // ---- File upload ----
    async function uploadFile(file) {
      if (!file) return
      addMessage('📎 ' + file.name + ' wird hochgeladen...', 'user')
      var formData = new FormData(); formData.append('file', file)
      var res = await fetch('/vavadmin/upload', { method: 'POST', body: formData })
      var data = await res.json()
      if (res.ok) {
        previewsLeft = data.previewsLeft; updateBadges()
        addMessage('✓ ' + data.message, 'ok'); reloadPreview()
      } else { addMessage('Fehler: ' + (data.message || 'Upload fehlgeschlagen'), 'err') }
    }
    var inputBox = document.getElementById('input-box')
    inputBox.addEventListener('dragover', function(e) { e.preventDefault(); inputBox.style.borderColor = '#2563eb' })
    inputBox.addEventListener('dragleave', function() { inputBox.style.borderColor = '#e2e8f0' })
    inputBox.addEventListener('drop', function(e) {
      e.preventDefault(); inputBox.style.borderColor = '#e2e8f0'
      if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0])
    })
    document.getElementById('input').addEventListener('input', function() {
      this.style.height = 'auto'
      this.style.height = Math.min(this.scrollHeight, 120) + 'px'
    })

    // ---- Voice input ----
    var mediaRecorder = null, audioChunks = []
    async function toggleMic() {
      var btn = document.getElementById('btn-mic')
      if (mediaRecorder && mediaRecorder.state === 'recording') { mediaRecorder.stop(); return }
      var stream
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }) }
      catch(e) { addMessage('Mikrofon-Zugriff verweigert.', 'err'); return }
      var mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType: mimeType } : {})
      audioChunks = []
      mediaRecorder.ondataavailable = function(e) { if (e.data.size > 0) audioChunks.push(e.data) }
      mediaRecorder.onstop = async function() {
        stream.getTracks().forEach(function(t) { t.stop() })
        btn.className = 'btn-mic btn-action processing'
        btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>'
        var blob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' })
        var form = new FormData(); form.append('audio', blob, 'audio.webm')
        try {
          var res = await fetch('/vavadmin/transcribe', { method: 'POST', body: form })
          var data = await res.json()
          if (res.ok && data.text) {
            var inp = document.getElementById('input')
            inp.value = data.text; inp.style.height = 'auto'
            inp.style.height = Math.min(inp.scrollHeight, 120) + 'px'; inp.focus()
          } else { addMessage('Transkription fehlgeschlagen: ' + (data.error || 'Unbekannt'), 'err') }
        } catch(e) { addMessage('Verbindungsfehler bei der Spracherkennung.', 'err') }
        finally {
          btn.className = 'btn-mic btn-action'
          btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>'
        }
      }
      mediaRecorder.start()
      btn.className = 'btn-mic btn-action recording'
      btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>'
    }

    // ---- Force-change ----
    async function doForceChange() {
      var pw1 = document.getElementById('fc-new').value
      var pw2 = document.getElementById('fc-confirm').value
      if (pw1.length < 6) { showFcMsg('Mindestens 6 Zeichen.', false); return }
      if (pw1 !== pw2) { showFcMsg('Passwörter stimmen nicht überein.', false); return }
      var res = await fetch('/vavadmin/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: pw1 })
      })
      var data = await res.json()
      if (res.ok) {
        showFcMsg('✓ Gespeichert!', true)
        setTimeout(function() { document.getElementById('force-change-overlay').style.display = 'none'; mustChangePassword = false }, 1000)
      } else { showFcMsg(data.message || 'Fehler', false) }
    }
    function showFcMsg(text, ok) {
      var el = document.getElementById('fc-msg')
      el.style.display = 'block'; el.style.color = ok ? '#4ade80' : '#f87171'; el.textContent = text
    }
    document.getElementById('fc-confirm').addEventListener('keydown', function(e) { if (e.key === 'Enter') doForceChange() })

    // ---- Change-password modal ----
    function showChangePw() {
      var modal = document.getElementById('changepw-modal')
      modal.style.display = 'flex'
      document.getElementById('cpw-current').value = ''
      document.getElementById('cpw-new').value = ''
      document.getElementById('cpw-confirm').value = ''
      document.getElementById('cpw-msg').style.display = 'none'
      setTimeout(function() { document.getElementById('cpw-current').focus() }, 50)
      trapFocus(modal.querySelector('.modal-box'))
    }
    function hideChangePw() {
      var modal = document.getElementById('changepw-modal')
      releaseTrap(modal.querySelector('.modal-box'))
      modal.style.display = 'none'
    }
    async function doChangePw() {
      var cur = document.getElementById('cpw-current').value
      var nw = document.getElementById('cpw-new').value
      var conf = document.getElementById('cpw-confirm').value
      var msg = document.getElementById('cpw-msg')
      if (nw !== conf) { msg.style.display='block'; msg.style.color='#f87171'; msg.textContent='Passwörter stimmen nicht überein.'; return }
      var res = await fetch('/vavadmin/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: cur, newPassword: nw })
      })
      var data = await res.json()
      msg.style.display = 'block'
      if (res.ok) { msg.style.color='#4ade80'; msg.textContent='✓ ' + data.message; setTimeout(hideChangePw, 1500) }
      else { msg.style.color='#f87171'; msg.textContent = data.message }
    }
    document.getElementById('cpw-confirm').addEventListener('keydown', function(e) { if (e.key === 'Enter') doChangePw() })
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
      resetOk: url.searchParams.has('reset_ok'),
    }), { headers: { 'Content-Type': 'text/html' } })
  }

  const today = viennaDateKey()
  const id = env.CUSTOMER_ID
  const [previewCount, publishCount, needsChange] = await Promise.all([
    env.CONTENT_KV.get(`limit-${id}-${today}-preview`),
    env.CONTENT_KV.get(`limit-${id}-${today}-publish`),
    env.CONTENT_KV.get(`password-needs-change-${id}`),
  ])

  const previewsLeft = Math.max(0, parseInt(env.PREVIEW_LIMIT_PER_DAY) - parseInt(previewCount ?? '0'))
  const publishesLeft = Math.max(0, parseInt(env.PUBLISH_LIMIT_PER_DAY) - parseInt(publishCount ?? '0'))
  const mustChangePassword = !session.isMaster && !!needsChange

  return new Response(adminPanel(previewsLeft, publishesLeft, mustChangePassword), {
    headers: { 'Content-Type': 'text/html' },
  })
}
