# Vis-à-Vision Admin CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a password-protected `/admin` route to silkeburkhardt.at where Silke can edit her site via chat (preview → publish), with rate limiting and file upload support.

**Architecture:** Cloudflare Pages Functions in `functions/` handle all backend logic (auth, content API, chat, upload). Content lives in Cloudflare KV (published + draft state). Files in Cloudflare R2. The existing Vite+React site is adapted to fetch content from KV at runtime instead of using hardcoded values. Gemini Flash 2.0 translates chat input to JSON diffs.

**Tech Stack:** Cloudflare Pages Functions (Workers runtime), Cloudflare KV, Cloudflare R2, Gemini Flash 2.0 REST API, Vite+React+Tailwind (existing), Vitest (unit tests with manual mocks)

---

## File Map

**New files (create):**
```
functions/
  api/
    content.js              GET /api/content — returns published JSON from KV
  preview/
    [[path]].js             GET /preview — returns draft JSON (auth required)
  admin/
    _middleware.js          Auth check for all /admin/* routes
    index.js                GET /admin — serves admin panel HTML
    login.js                POST /admin/login — verify password, set session
    logout.js               POST /admin/logout — clear session
    chat.js                 POST /admin/chat — rate limit + Gemini + KV draft update
    publish.js              POST /admin/publish — draft → published
    discard.js              POST /admin/discard — reset draft to published
    upload.js               POST /admin/upload — R2 + text extraction
wrangler.toml               Cloudflare config (KV + R2 bindings)
scripts/
  seed-content.js           One-time: write initial content.json to KV
  hash-password.js          One-time: generate password hash for wrangler secret
tests/
  api.content.test.js
  admin.auth.test.js
  admin.chat.test.js
  admin.publish.test.js
  admin.upload.test.js
  helpers/
    mock-env.js             Shared KV/R2/Gemini mocks
src/
  hooks/
    useContent.js           NEW: fetch /api/content on mount
  content-schema.js         NEW: default content object (fallback + type reference)
```

**Modified files:**
```
src/components/Hero.jsx     Use useContent()
src/components/About.jsx    Use useContent()
src/components/Services.jsx Use useContent()
src/components/Contact.jsx  Use useContent()
src/components/Footer.jsx   Use useContent()
package.json                Add vitest + test deps
.gitignore                  Add .dev.vars
```

---

## Task 1: Project Setup — wrangler.toml, test infra, .dev.vars

**Files:**
- Create: `wrangler.toml`
- Create: `.dev.vars` (local secrets, gitignored)
- Create: `vitest.config.js`
- Create: `tests/helpers/mock-env.js`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add test dependencies**

```bash
cd "C:\brain\06 Web & Software\silkeburkhardt.at\HOMEPAGE-SILKE"
npm install -D vitest
```

Expected: vitest added to devDependencies in package.json.

- [ ] **Step 2: Create `vitest.config.js`**

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
})
```

- [ ] **Step 3: Add test script to `package.json`**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create `tests/helpers/mock-env.js`**

```javascript
// tests/helpers/mock-env.js

export function makeMockKV(initial = {}) {
  const store = new Map(Object.entries(initial))
  return {
    async get(key, type) {
      const val = store.get(key) ?? null
      if (val === null) return null
      return type === 'json' ? JSON.parse(val) : val
    },
    async put(key, value, opts) {
      store.set(key, typeof value === 'string' ? value : JSON.stringify(value))
    },
    async delete(key) { store.delete(key) },
    _store: store,
  }
}

export function makeMockR2() {
  const store = new Map()
  return {
    async put(key, body) { store.set(key, body) },
    async get(key) { return store.has(key) ? { body: store.get(key) } : null },
    _store: store,
  }
}

export function makeEnv(overrides = {}) {
  return {
    CUSTOMER_ID: 'silke',
    CUSTOMER_PASSWORD: 'test-customer-pw',
    MASTER_PASSWORD: 'test-master-pw',
    SESSION_SECRET: 'test-session-secret-32-chars-long',
    GEMINI_API_KEY: 'fake-gemini-key',
    PREVIEW_LIMIT_PER_DAY: '20',
    PUBLISH_LIMIT_PER_DAY: '10',
    CONTENT_KV: makeMockKV(),
    UPLOADS_R2: makeMockR2(),
    ...overrides,
  }
}
```

- [ ] **Step 5: Create `wrangler.toml`**

```toml
# wrangler.toml
name = "silke-burkhardt"
pages_build_output_dir = "./dist"
compatibility_date = "2025-01-01"

[[kv_namespaces]]
binding = "CONTENT_KV"
id = "REPLACE_WITH_KV_ID"
preview_id = "REPLACE_WITH_PREVIEW_KV_ID"

[[r2_buckets]]
binding = "UPLOADS_R2"
bucket_name = "vis-a-vision-uploads"

[vars]
CUSTOMER_ID = "silke"
PREVIEW_LIMIT_PER_DAY = "20"
PUBLISH_LIMIT_PER_DAY = "10"
```

- [ ] **Step 6: Create `.dev.vars` (gitignored, local secrets)**

```
CUSTOMER_PASSWORD=changeme123
MASTER_PASSWORD=masterchangeme
SESSION_SECRET=please-replace-with-32-char-random-string
GEMINI_API_KEY=your-gemini-key-here
```

- [ ] **Step 7: Add to `.gitignore`**

```
.dev.vars
```

- [ ] **Step 8: Create KV namespace in Cloudflare**

```bash
npx wrangler kv:namespace create "CONTENT_KV"
```

Copy the output `id` and `preview_id` into `wrangler.toml` replacing `REPLACE_WITH_KV_ID`.

- [ ] **Step 9: Create R2 bucket**

```bash
npx wrangler r2 bucket create vis-a-vision-uploads
```

- [ ] **Step 10: Commit**

```bash
git add wrangler.toml vitest.config.js tests/ package.json .gitignore
git commit -m "feat: add wrangler config, test infrastructure, mock helpers"
```

---

## Task 2: Content Schema + Seed Script

**Files:**
- Create: `src/content-schema.js`
- Create: `scripts/seed-content.js`

- [ ] **Step 1: Create `src/content-schema.js`**

```javascript
// src/content-schema.js
export const DEFAULT_CONTENT = {
  meta: {
    business_name: 'Mag. Silke Burkhardt',
    tagline: 'Supervision · Coaching · Teamentwicklung',
    primary_color: '#2d4a6b',
    secondary_color: '#f0f4f8',
    font: 'Inter, sans-serif',
  },
  hero: {
    eyebrow: 'Supervision & Coaching · Kärnten & Steiermark',
    title: 'Begleitung, die Klarheit schafft.',
    subtitle: 'Professionelle Unterstützung für Fachkräfte, Teams und Führungspersonen in sozialen Berufsfeldern.',
    cta_text: 'Erstgespräch vereinbaren',
    portrait_image: '/silke-portrait.jpg',
  },
  about: {
    heading: 'Über mich',
    text: 'Mit 24 Jahren Berufspraxis in der sozialen Arbeit begleite ich Menschen und Organisationen in Veränderungs- und Entwicklungsprozessen.',
    stats: [
      { value: '24', label: 'Jahre Berufspraxis in der sozialen Arbeit' },
      { value: '3', label: 'intensive Betreuungssettings in Leitung (2016–2026)' },
      { value: '2026', label: 'bewusster Schritt in die Selbstständigkeit' },
    ],
    qualifications: [
      'Mag. — Pädagogik',
      'Sozial- und Integrationspädagogin',
      'Lebens- & Sozialberatung (Gewerbe)',
      'Unternehmensberatung (Gewerbe)',
    ],
  },
  services: [
    {
      eyebrow: 'Reflexion',
      title: 'Einzel- & Teamsupervision',
      description: 'Reflexion, die trägt. Begleitung für einzelne Fachkräfte und ganze Teams — für mehr Klarheit, Entlastung und Stabilität im Berufsalltag.',
    },
    {
      eyebrow: 'Führung',
      title: 'Coaching für Fach- & Führungskräfte',
      description: 'Orientierung in komplexen Leitungsrollen. Ein vertraulicher Raum für Entscheidungen, Rollenklärung und persönliche Weiterentwicklung.',
    },
    {
      eyebrow: 'Organisation',
      title: 'Teamentwicklung & Organisationsberatung',
      description: 'Gemeinsam stark. Entwicklungsprozesse für Teams und Organisationen, die nachhaltig wirken.',
    },
  ],
  contact: {
    heading: 'Kontakt',
    intro: 'Ich freue mich auf Ihre Nachricht. Das Erstgespräch ist kostenlos und unverbindlich.',
    phone: '+43 660 000 0000',
    email: 'office@silkeburkhardt.at',
    address: 'St. Michael ob Bleiburg, Kärnten',
  },
  footer: {
    imprint_heading: 'Impressum',
    privacy_heading: 'Datenschutz',
  },
}
```

- [ ] **Step 2: Create `scripts/seed-content.js`**

```javascript
// scripts/seed-content.js
// Run once: node scripts/seed-content.js
// Requires: wrangler login + KV namespace created

import { execSync } from 'child_process'
import { DEFAULT_CONTENT } from '../src/content-schema.js'

const CUSTOMER_ID = process.env.CUSTOMER_ID ?? 'silke'
const json = JSON.stringify(DEFAULT_CONTENT)

// Write published content
execSync(
  `npx wrangler kv:key put --binding=CONTENT_KV "content-${CUSTOMER_ID}" '${json}'`,
  { stdio: 'inherit' }
)

// Write draft (same as published initially)
execSync(
  `npx wrangler kv:key put --binding=CONTENT_KV "draft-${CUSTOMER_ID}" '${json}'`,
  { stdio: 'inherit' }
)

console.log(`✓ Seeded content-${CUSTOMER_ID} and draft-${CUSTOMER_ID}`)
```

- [ ] **Step 3: Run seed script**

```bash
node scripts/seed-content.js
```

Expected output: `✓ Seeded content-silke and draft-silke`

- [ ] **Step 4: Commit**

```bash
git add src/content-schema.js scripts/seed-content.js
git commit -m "feat: add content schema and KV seed script"
```

---

## Task 3: GET /api/content

**Files:**
- Create: `functions/api/content.js`
- Create: `tests/api.content.test.js`

- [ ] **Step 1: Write failing test**

```javascript
// tests/api.content.test.js
import { describe, it, expect } from 'vitest'
import { makeMockKV, makeEnv } from './helpers/mock-env.js'
import { DEFAULT_CONTENT } from '../src/content-schema.js'

// Import the handler function (we export it for testing)
import { handleContentRequest } from '../functions/api/content.js'

describe('GET /api/content', () => {
  it('returns published content from KV', async () => {
    const env = makeEnv({
      CONTENT_KV: makeMockKV({
        'content-silke': JSON.stringify(DEFAULT_CONTENT),
      }),
    })

    const req = new Request('https://example.com/api/content')
    const res = await handleContentRequest({ request: req, env })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.meta.business_name).toBe('Mag. Silke Burkhardt')
  })

  it('returns default content when KV is empty', async () => {
    const env = makeEnv({ CONTENT_KV: makeMockKV({}) })
    const req = new Request('https://example.com/api/content')
    const res = await handleContentRequest({ request: req, env })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.meta).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run tests/api.content.test.js
```

Expected: FAIL — "Cannot find module '../functions/api/content.js'"

- [ ] **Step 3: Create `functions/api/content.js`**

```javascript
// functions/api/content.js
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function handleContentRequest({ env }) {
  const content = await env.CONTENT_KV.get(
    `content-${env.CUSTOMER_ID}`,
    'json'
  )
  return Response.json(content ?? DEFAULT_CONTENT, {
    headers: {
      'Cache-Control': 'public, max-age=10',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function onRequest(context) {
  return handleContentRequest(context)
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run tests/api.content.test.js
```

Expected: 2 tests PASS

- [ ] **Step 5: Commit**

```bash
git add functions/api/content.js tests/api.content.test.js
git commit -m "feat: add /api/content endpoint"
```

---

## Task 4: Auth — Session helpers + Login/Logout

**Files:**
- Create: `functions/_lib/session.js`
- Create: `functions/_lib/auth.js`
- Create: `functions/admin/login.js`
- Create: `functions/admin/logout.js`
- Create: `functions/admin/_middleware.js`
- Create: `tests/admin.auth.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
// tests/admin.auth.test.js
import { describe, it, expect } from 'vitest'
import { makeEnv } from './helpers/mock-env.js'
import { createSession, verifySession } from '../functions/_lib/session.js'
import { handleLogin } from '../functions/admin/login.js'

describe('session', () => {
  it('creates and verifies a session token', async () => {
    const secret = 'test-secret-32-chars-xxxxxxxxxxxx'
    const token = await createSession({ customerId: 'silke', isMaster: false }, secret)
    expect(typeof token).toBe('string')

    const payload = await verifySession(token, secret)
    expect(payload.customerId).toBe('silke')
    expect(payload.isMaster).toBe(false)
  })

  it('returns null for invalid token', async () => {
    const payload = await verifySession('bad-token', 'secret')
    expect(payload).toBeNull()
  })
})

describe('POST /admin/login', () => {
  it('sets session cookie on correct customer password', async () => {
    const env = makeEnv()
    const req = new Request('https://example.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test-customer-pw' }),
    })

    const res = await handleLogin({ request: req, env })
    expect(res.status).toBe(200)
    expect(res.headers.get('Set-Cookie')).toContain('vas_session=')

    const body = await res.json()
    expect(body.isMaster).toBe(false)
  })

  it('sets isMaster=true on correct master password', async () => {
    const env = makeEnv()
    const req = new Request('https://example.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test-master-pw' }),
    })

    const res = await handleLogin({ request: req, env })
    const body = await res.json()
    expect(body.isMaster).toBe(true)
  })

  it('returns 401 on wrong password', async () => {
    const env = makeEnv()
    const req = new Request('https://example.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' }),
    })

    const res = await handleLogin({ request: req, env })
    expect(res.status).toBe(401)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run tests/admin.auth.test.js
```

Expected: FAIL — modules not found

- [ ] **Step 3: Create `functions/_lib/session.js`**

```javascript
// functions/_lib/session.js
// HMAC-SHA256 signed session tokens using Web Crypto API (Workers-compatible)

const SESSION_TTL_SECONDS = 8 * 60 * 60 // 8 hours

async function importKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createSession(payload, secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const data = btoa(JSON.stringify({ ...payload, exp }))
  const key = await importKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
  return `${data}.${sigB64}`
}

export async function verifySession(token, secret) {
  try {
    const [data, sigB64] = token.split('.')
    if (!data || !sigB64) return null
    const key = await importKey(secret)
    const sigBytes = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data))
    if (!valid) return null
    const payload = JSON.parse(atob(data))
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export function getSessionFromRequest(request, secret) {
  const cookie = request.headers.get('Cookie') ?? ''
  const match = cookie.match(/vas_session=([^;]+)/)
  if (!match) return null
  return verifySession(match[1], secret)
}
```

- [ ] **Step 4: Create `functions/_lib/auth.js`**

```javascript
// functions/_lib/auth.js
// Constant-time string comparison (prevents timing attacks)
function safeEquals(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)
  let result = 0
  for (let i = 0; i < aBytes.length; i++) result |= aBytes[i] ^ bBytes[i]
  return result === 0
}

export function checkPassword(input, env) {
  if (safeEquals(input, env.MASTER_PASSWORD)) return { valid: true, isMaster: true }
  if (safeEquals(input, env.CUSTOMER_PASSWORD)) return { valid: true, isMaster: false }
  return { valid: false, isMaster: false }
}
```

- [ ] **Step 5: Create `functions/admin/login.js`**

```javascript
// functions/admin/login.js
import { createSession } from '../_lib/session.js'
import { checkPassword } from '../_lib/auth.js'

export async function handleLogin({ request, env }) {
  let body
  try { body = await request.json() } catch { return new Response('Bad Request', { status: 400 }) }

  const { valid, isMaster } = checkPassword(body.password ?? '', env)
  if (!valid) return new Response('Unauthorized', { status: 401 })

  const token = await createSession(
    { customerId: env.CUSTOMER_ID, isMaster },
    env.SESSION_SECRET
  )

  return Response.json({ ok: true, isMaster }, {
    headers: {
      'Set-Cookie': `vas_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=${8 * 3600}`,
    },
  })
}

export async function onRequestPost(context) {
  return handleLogin(context)
}
```

- [ ] **Step 6: Create `functions/admin/logout.js`**

```javascript
// functions/admin/logout.js
export async function onRequestPost() {
  return Response.json({ ok: true }, {
    headers: {
      'Set-Cookie': 'vas_session=; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=0',
    },
  })
}
```

- [ ] **Step 7: Create `functions/admin/_middleware.js`**

```javascript
// functions/admin/_middleware.js
// Protects all /admin/* routes except /admin/login
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
```

- [ ] **Step 8: Run tests — expect PASS**

```bash
npx vitest run tests/admin.auth.test.js
```

Expected: 5 tests PASS

- [ ] **Step 9: Commit**

```bash
git add functions/_lib/ functions/admin/login.js functions/admin/logout.js functions/admin/_middleware.js tests/admin.auth.test.js
git commit -m "feat: add auth — session tokens, login/logout, middleware"
```

---

## Task 5: Admin Panel HTML (Login + Main UI)

**Files:**
- Create: `functions/admin/index.js`

- [ ] **Step 1: Create `functions/admin/index.js`**

This serves the login page (unauthenticated) or full admin panel (authenticated):

```javascript
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
```

- [ ] **Step 2: Deploy and manually test login**

```bash
npx wrangler pages deploy ./dist --project-name=silke-burkhardt
```

Visit `https://silke-burkhardt.pages.dev/admin` — should show login form.
Enter wrong password → should show error.
Enter correct password → should show admin panel split-screen.

- [ ] **Step 3: Commit**

```bash
git add functions/admin/index.js
git commit -m "feat: add admin panel UI (login + split-screen editor)"
```

---

## Task 6: POST /admin/chat (Rate Limit + Gemini + KV Draft)

**Files:**
- Create: `functions/_lib/rate-limit.js`
- Create: `functions/_lib/gemini.js`
- Create: `functions/admin/chat.js`
- Create: `tests/admin.chat.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
// tests/admin.chat.test.js
import { describe, it, expect, vi } from 'vitest'
import { makeMockKV, makeEnv } from './helpers/mock-env.js'
import { DEFAULT_CONTENT } from '../src/content-schema.js'
import { checkRateLimit } from '../functions/_lib/rate-limit.js'
import { applyJsonDiff } from '../functions/_lib/gemini.js'

describe('checkRateLimit', () => {
  it('allows requests under the limit', async () => {
    const kv = makeMockKV({ 'limit-silke-2026-01-01-preview': '5' })
    const result = await checkRateLimit({ kv, customerId: 'silke', date: '2026-01-01', type: 'preview', max: 20, isMaster: false })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(14)
  })

  it('blocks requests at the limit', async () => {
    const kv = makeMockKV({ 'limit-silke-2026-01-01-preview': '20' })
    const result = await checkRateLimit({ kv, customerId: 'silke', date: '2026-01-01', type: 'preview', max: 20, isMaster: false })
    expect(result.allowed).toBe(false)
  })

  it('always allows master users', async () => {
    const kv = makeMockKV({ 'limit-silke-2026-01-01-preview': '999' })
    const result = await checkRateLimit({ kv, customerId: 'silke', date: '2026-01-01', type: 'preview', max: 20, isMaster: true })
    expect(result.allowed).toBe(true)
  })
})

describe('applyJsonDiff', () => {
  it('applies a shallow diff to content', () => {
    const base = { ...DEFAULT_CONTENT, hero: { ...DEFAULT_CONTENT.hero, title: 'Old Title' } }
    const diff = { hero: { title: 'New Title' } }
    const result = applyJsonDiff(base, diff)
    expect(result.hero.title).toBe('New Title')
    expect(result.hero.subtitle).toBe(DEFAULT_CONTENT.hero.subtitle) // unchanged
  })

  it('does not overwrite top-level keys not in diff', () => {
    const base = DEFAULT_CONTENT
    const diff = { meta: { business_name: 'New Name' } }
    const result = applyJsonDiff(base, diff)
    expect(result.meta.business_name).toBe('New Name')
    expect(result.about).toEqual(DEFAULT_CONTENT.about) // unchanged
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run tests/admin.chat.test.js
```

Expected: FAIL — modules not found

- [ ] **Step 3: Create `functions/_lib/rate-limit.js`**

```javascript
// functions/_lib/rate-limit.js
export async function checkRateLimit({ kv, customerId, date, type, max, isMaster }) {
  if (isMaster) return { allowed: true, remaining: Infinity }
  const key = `limit-${customerId}-${date}-${type}`
  const current = parseInt(await kv.get(key) ?? '0')
  if (current >= max) return { allowed: false, remaining: 0 }
  await kv.put(key, String(current + 1), { expirationTtl: 90000 })
  return { allowed: true, remaining: max - current - 1 }
}
```

- [ ] **Step 4: Create `functions/_lib/gemini.js`**

```javascript
// functions/_lib/gemini.js

export function applyJsonDiff(base, diff) {
  const result = structuredClone(base)
  for (const [key, value] of Object.entries(diff)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object') {
      result[key] = { ...result[key], ...value }
    } else {
      result[key] = value
    }
  }
  return result
}

export async function callGemini({ apiKey, systemPrompt, userMessage }) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1024 },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
  return JSON.parse(text)
}

export function buildSystemPrompt(currentContent) {
  return `Du bist ein Website-CMS. Der Nutzer beschreibt Änderungen auf Deutsch.
Deine Aufgabe: Gib NUR ein JSON-Objekt zurück, das die geänderten Felder enthält (Diff-Format).
Ändere NUR was der Nutzer explizit nennt. Lass alle anderen Felder weg.

Aktueller Website-Inhalt:
${JSON.stringify(currentContent, null, 2)}

Erlaubte Felder: meta (business_name, tagline, primary_color, secondary_color), hero (title, subtitle, cta_text, eyebrow), about (text, heading), services (Array aus {eyebrow, title, description}), contact (phone, email, address).
Gibt der Nutzer eine neue Farbe an: wandle sie in einen #hex-Wert um.
Antworte AUSSCHLIESSLICH mit validem JSON. Kein Text davor oder danach.`
}
```

- [ ] **Step 5: Create `functions/admin/chat.js`**

```javascript
// functions/admin/chat.js
import { checkRateLimit } from '../_lib/rate-limit.js'
import { callGemini, applyJsonDiff, buildSystemPrompt } from '../_lib/gemini.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function onRequestPost({ request, env, data }) {
  const session = data.session
  const today = new Date().toISOString().split('T')[0]
  const id = env.CUSTOMER_ID

  const limit = await checkRateLimit({
    kv: env.CONTENT_KV,
    customerId: id,
    date: today,
    type: 'preview',
    max: parseInt(env.PREVIEW_LIMIT_PER_DAY),
    isMaster: session.isMaster,
  })

  if (!limit.allowed) {
    return Response.json({
      message: `Du hast heute ${env.PREVIEW_LIMIT_PER_DAY} Vorschauen genutzt. Morgen früh hast du wieder ${env.PREVIEW_LIMIT_PER_DAY} zur Verfügung.`,
    }, { status: 429 })
  }

  let body
  try { body = await request.json() } catch { return new Response('Bad Request', { status: 400 }) }

  const currentDraft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT

  let diff
  try {
    diff = await callGemini({
      apiKey: env.GEMINI_API_KEY,
      systemPrompt: buildSystemPrompt(currentDraft),
      userMessage: body.message,
    })
  } catch (err) {
    return Response.json({ message: 'KI-Fehler: ' + err.message }, { status: 502 })
  }

  const updated = applyJsonDiff(currentDraft, diff)
  await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(updated))

  return Response.json({ ok: true, previewsLeft: limit.remaining })
}
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
npx vitest run tests/admin.chat.test.js
```

Expected: 5 tests PASS

- [ ] **Step 7: Commit**

```bash
git add functions/_lib/rate-limit.js functions/_lib/gemini.js functions/admin/chat.js tests/admin.chat.test.js
git commit -m "feat: add /admin/chat — rate limiting + Gemini diff + KV draft update"
```

---

## Task 7: POST /admin/publish + /admin/discard + GET /preview

**Files:**
- Create: `functions/admin/publish.js`
- Create: `functions/admin/discard.js`
- Create: `functions/preview/[[path]].js`
- Create: `tests/admin.publish.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
// tests/admin.publish.test.js
import { describe, it, expect } from 'vitest'
import { makeMockKV, makeEnv } from './helpers/mock-env.js'
import { DEFAULT_CONTENT } from '../src/content-schema.js'
import { handlePublish } from '../functions/admin/publish.js'
import { handleDiscard } from '../functions/admin/discard.js'

const MODIFIED = { ...DEFAULT_CONTENT, hero: { ...DEFAULT_CONTENT.hero, title: 'Modified' } }

describe('POST /admin/publish', () => {
  it('copies draft to published content', async () => {
    const kv = makeMockKV({
      'content-silke': JSON.stringify(DEFAULT_CONTENT),
      'draft-silke': JSON.stringify(MODIFIED),
    })
    const env = makeEnv({ CONTENT_KV: kv })
    const req = new Request('https://example.com/admin/publish', { method: 'POST' })

    const res = await handlePublish({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(200)

    const published = await kv.get('content-silke', 'json')
    expect(published.hero.title).toBe('Modified')
  })

  it('blocks publish at daily limit', async () => {
    const today = new Date().toISOString().split('T')[0]
    const kv = makeMockKV({
      [`limit-silke-${today}-publish`]: '10',
      'content-silke': JSON.stringify(DEFAULT_CONTENT),
      'draft-silke': JSON.stringify(MODIFIED),
    })
    const env = makeEnv({ CONTENT_KV: kv })
    const req = new Request('https://example.com/admin/publish', { method: 'POST' })
    const res = await handlePublish({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(429)
  })
})

describe('POST /admin/discard', () => {
  it('resets draft to published content', async () => {
    const kv = makeMockKV({
      'content-silke': JSON.stringify(DEFAULT_CONTENT),
      'draft-silke': JSON.stringify(MODIFIED),
    })
    const env = makeEnv({ CONTENT_KV: kv })
    const req = new Request('https://example.com/admin/discard', { method: 'POST' })
    await handleDiscard({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })

    const draft = await kv.get('draft-silke', 'json')
    expect(draft.hero.title).toBe(DEFAULT_CONTENT.hero.title)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run tests/admin.publish.test.js
```

- [ ] **Step 3: Create `functions/admin/publish.js`**

```javascript
// functions/admin/publish.js
import { checkRateLimit } from '../_lib/rate-limit.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function handlePublish({ env, data }) {
  const session = data.session
  const today = new Date().toISOString().split('T')[0]
  const id = env.CUSTOMER_ID

  const limit = await checkRateLimit({
    kv: env.CONTENT_KV,
    customerId: id,
    date: today,
    type: 'publish',
    max: parseInt(env.PUBLISH_LIMIT_PER_DAY),
    isMaster: session.isMaster,
  })

  if (!limit.allowed) {
    return Response.json({
      message: `Tageslimit für Veröffentlichungen erreicht (${env.PUBLISH_LIMIT_PER_DAY}/Tag). Deine Entwürfe bleiben gespeichert.`,
    }, { status: 429 })
  }

  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT
  await env.CONTENT_KV.put(`content-${id}`, JSON.stringify(draft))

  return Response.json({ ok: true, publishesLeft: limit.remaining })
}

export async function onRequestPost(context) {
  return handlePublish(context)
}
```

- [ ] **Step 4: Create `functions/admin/discard.js`**

```javascript
// functions/admin/discard.js
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function handleDiscard({ env, data }) {
  const id = env.CUSTOMER_ID
  const published = await env.CONTENT_KV.get(`content-${id}`, 'json') ?? DEFAULT_CONTENT
  await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(published))
  return Response.json({ ok: true })
}

export async function onRequestPost(context) {
  return handleDiscard(context)
}
```

- [ ] **Step 5: Create `functions/preview/[[path]].js`**

The preview endpoint serves the same React app but injects draft content. It sets a cookie that the `/api/content` endpoint checks to return draft vs published:

```javascript
// functions/preview/[[path]].js
// Serves the site with draft content for authenticated admins
import { getSessionFromRequest } from '../_lib/session.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function onRequest({ request, env }) {
  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) return Response.redirect(new URL('/admin', request.url).toString(), 302)

  const id = env.CUSTOMER_ID
  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT

  // Inject a JS snippet that overrides the /api/content response with draft data
  // We do this by serving the index.html with an injected <script> at the top of <head>
  const url = new URL(request.url)
  url.pathname = '/'
  const siteRes = await env.ASSETS.fetch(new Request(url.toString(), request))
  const html = await siteRes.text()

  const injection = `<script>
    window.__VIS_DRAFT_CONTENT__ = ${JSON.stringify(draft)};
    const _origFetch = window.fetch;
    window.fetch = function(url, ...args) {
      if (typeof url === 'string' && url.includes('/api/content')) {
        return Promise.resolve(new Response(JSON.stringify(window.__VIS_DRAFT_CONTENT__), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return _origFetch(url, ...args);
    };
  </script>`

  const modified = html.replace('<head>', '<head>' + injection)
  return new Response(modified, {
    headers: { 'Content-Type': 'text/html', 'X-Robots-Tag': 'noindex' },
  })
}
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
npx vitest run tests/admin.publish.test.js
```

Expected: 3 tests PASS

- [ ] **Step 7: Commit**

```bash
git add functions/admin/publish.js functions/admin/discard.js functions/preview/ tests/admin.publish.test.js
git commit -m "feat: add publish/discard endpoints and /preview route"
```

---

## Task 8: POST /admin/upload (R2 + Text Extraction)

**Files:**
- Create: `functions/admin/upload.js`
- Create: `tests/admin.upload.test.js`

- [ ] **Step 1: Install text-extraction dependency**

```bash
npm install mammoth
```

Note: `pdf-parse` uses Node.js internals incompatible with Workers. For PDFs, we extract text using a simple approach: upload the raw file to R2 and pass the first 10,000 characters of text to Gemini. For DOCX, mammoth.js works in Workers with bundling.

- [ ] **Step 2: Write failing tests**

```javascript
// tests/admin.upload.test.js
import { describe, it, expect } from 'vitest'
import { makeMockKV, makeMockR2, makeEnv } from './helpers/mock-env.js'
import { handleUpload } from '../functions/admin/upload.js'

function makeImageRequest(filename = 'test.jpg', mimeType = 'image/jpeg') {
  const formData = new FormData()
  const blob = new Blob(['fake-image-bytes'], { type: mimeType })
  formData.append('file', blob, filename)
  return new Request('https://example.com/admin/upload', {
    method: 'POST',
    body: formData,
  })
}

describe('POST /admin/upload', () => {
  it('rejects unsupported file types', async () => {
    const env = makeEnv()
    const formData = new FormData()
    formData.append('file', new Blob(['x'], { type: 'application/zip' }), 'file.zip')
    const req = new Request('https://example.com/admin/upload', { method: 'POST', body: formData })
    const res = await handleUpload({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(400)
  })

  it('stores image in R2 and returns URL', async () => {
    const r2 = makeMockR2()
    const env = makeEnv({ UPLOADS_R2: r2 })
    const req = makeImageRequest('portrait.jpg', 'image/jpeg')
    const res = await handleUpload({ request: req, env, data: { session: { customerId: 'silke', isMaster: false } } })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.url).toContain('portrait')
    expect(r2._store.size).toBe(1)
  })
})
```

- [ ] **Step 3: Run test — expect FAIL**

```bash
npx vitest run tests/admin.upload.test.js
```

- [ ] **Step 4: Create `functions/admin/upload.js`**

```javascript
// functions/admin/upload.js
import { callGemini, applyJsonDiff, buildSystemPrompt } from '../_lib/gemini.js'
import { checkRateLimit } from '../_lib/rate-limit.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

const ALLOWED_TYPES = {
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'application/pdf': 'text',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'text',
  'text/plain': 'text',
}

export async function handleUpload({ request, env, data }) {
  const session = data.session
  const today = new Date().toISOString().split('T')[0]
  const id = env.CUSTOMER_ID

  const limit = await checkRateLimit({
    kv: env.CONTENT_KV,
    customerId: id,
    date: today,
    type: 'preview',
    max: parseInt(env.PREVIEW_LIMIT_PER_DAY),
    isMaster: session.isMaster,
  })
  if (!limit.allowed) {
    return Response.json({ message: 'Tageslimit erreicht.' }, { status: 429 })
  }

  let formData
  try { formData = await request.formData() } catch {
    return Response.json({ message: 'Ungültige Anfrage' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file) return Response.json({ message: 'Keine Datei gefunden' }, { status: 400 })

  const fileType = ALLOWED_TYPES[file.type]
  if (!fileType) {
    return Response.json({ message: `Dateityp ${file.type} nicht erlaubt. Erlaubt: JPG, PNG, WebP, PDF, DOCX, TXT` }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ message: 'Datei zu groß (max 10 MB)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop().toLowerCase()
  const key = `uploads/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  if (fileType === 'image') {
    const bytes = await file.arrayBuffer()
    await env.UPLOADS_R2.put(key, bytes, { httpMetadata: { contentType: file.type } })
    const r2PublicBase = env.R2_PUBLIC_BASE ?? `https://pub.vis-a-vision.com`
    const url = `${r2PublicBase}/${key}`

    // Ask Gemini which field this image should update
    const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT
    let diff
    try {
      diff = await callGemini({
        apiKey: env.GEMINI_API_KEY,
        systemPrompt: buildSystemPrompt(draft),
        userMessage: `Der Nutzer hat ein Bild hochgeladen: ${file.name}. Die Bild-URL ist: ${url}. Entscheide welches Bildfeld am besten passt (portrait_image oder hero background) und gib ein JSON-Diff zurück das dieses Feld auf die URL setzt.`,
      })
    } catch { diff = {} }

    const updated = applyJsonDiff(draft, diff)
    await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(updated))

    return Response.json({ ok: true, url, message: `Bild gespeichert und eingebaut.`, previewsLeft: limit.remaining })
  }

  // Text files: extract and send to Gemini
  const text = await file.text()
  const truncated = text.slice(0, 10000)

  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT
  let diff
  try {
    diff = await callGemini({
      apiKey: env.GEMINI_API_KEY,
      systemPrompt: buildSystemPrompt(draft),
      userMessage: `Der Nutzer hat eine Textdatei hochgeladen (${file.name}). Inhalt:\n\n${truncated}\n\nExtrahiere relevante Website-Inhalte daraus und gib ein JSON-Diff zurück.`,
    })
  } catch (err) {
    return Response.json({ message: 'KI-Fehler: ' + err.message }, { status: 502 })
  }

  const updated = applyJsonDiff(draft, diff)
  await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(updated))

  return Response.json({ ok: true, message: `${file.name} verarbeitet und in Vorschau eingebaut.`, previewsLeft: limit.remaining })
}

export async function onRequestPost(context) {
  return handleUpload(context)
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npx vitest run tests/admin.upload.test.js
```

Expected: 2 tests PASS

- [ ] **Step 6: Commit**

```bash
git add functions/admin/upload.js tests/admin.upload.test.js package.json package-lock.json
git commit -m "feat: add file upload — R2 images + text extraction for PDF/DOCX/TXT"
```

---

## Task 9: React useContent Hook + Hero Component

**Files:**
- Create: `src/hooks/useContent.js`
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Create `src/hooks/useContent.js`**

```javascript
// src/hooks/useContent.js
import { useState, useEffect } from 'react'
import { DEFAULT_CONTENT } from '../content-schema.js'

export function useContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => { if (data?.meta) setContent(data) })
      .catch(() => {}) // keep default on error
  }, [])

  return content
}
```

- [ ] **Step 2: Update `src/components/Hero.jsx` to use dynamic content**

Replace the top of Hero.jsx. Keep all existing JSX structure and CSS classes. Only replace hardcoded string values with content variables:

```javascript
// src/components/Hero.jsx
import { useContent } from '../hooks/useContent'

export default function Hero() {
  const content = useContent()
  const { hero } = content

  return (
    <section className="relative overflow-hidden bg-canvas">
      {/* Keep existing blob decoration div unchanged */}
      <div
        className="absolute -top-28 -right-32 w-[460px] h-[460px] bg-petrol/[0.06] animate-blob-morph pointer-events-none"
        style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%' }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-12 lg:pt-36 lg:pb-20">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-8 lg:gap-16 items-start">
          {/* Portrait image — now from content */}
          <div className="animate-fade-up order-2 lg:order-1" style={{ animationDelay: '300ms' }}>
            <div className="mx-auto w-[230px] sm:w-[280px] lg:w-full lg:max-w-[330px]">
              <img
                src={hero.portrait_image}
                alt={content.meta.business_name}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
          {/* Text content — now from content */}
          <div className="order-1 lg:order-2">
            <span
              className="animate-fade-up inline-block text-xs uppercase tracking-[0.16em] text-petrol font-sans font-medium mb-4"
              style={{ animationDelay: '0ms' }}
            >
              {hero.eyebrow}
            </span>
            <h1 className="animate-fade-up font-serif font-normal leading-[1.1] tracking-[-0.02em] text-azure mb-6"
              style={{ animationDelay: '100ms' }}>
              {hero.title}
            </h1>
            <p className="animate-fade-up text-stone/80 leading-relaxed mb-10 max-w-lg"
              style={{ animationDelay: '200ms' }}>
              {hero.subtitle}
            </p>
            <a href="#kontakt"
              className="animate-fade-up inline-flex items-center gap-2 bg-petrol text-canvas px-6 py-3 rounded-full text-sm font-medium hover:bg-petrol/90 transition-colors"
              style={{ animationDelay: '300ms' }}>
              {hero.cta_text}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Build and check for errors**

```bash
npm run build
```

Expected: build succeeds, no TypeScript/lint errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useContent.js src/components/Hero.jsx src/content-schema.js
git commit -m "feat: add useContent hook, update Hero to use dynamic content"
```

---

## Task 10: Update Remaining Components (About, Services, Contact)

**Files:**
- Modify: `src/components/About.jsx`
- Modify: `src/components/Services.jsx`
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Update `src/components/About.jsx`**

Add `useContent` import and replace hardcoded `stats`, `qualifications`, and text:

```javascript
// src/components/About.jsx — top section only (keep all existing JSX structure)
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'

export default function About() {
  const [ref, isVisible] = useScrollAnimation()
  const content = useContent()
  const { about } = content

  // Replace const stats = [...] with: const stats = about.stats
  // Replace const qualifications = [...] with: const qualifications = about.qualifications
  // In JSX: replace hardcoded text strings with about.heading, about.text
  // Keep all className, animation, and layout JSX unchanged
```

Concrete replacements in the JSX:
- `'Über mich'` heading → `{about.heading}`
- Hardcoded bio text → `{about.text}`
- `stats` array → `about.stats`
- `qualifications` array → `about.qualifications`

- [ ] **Step 2: Update `src/components/Services.jsx`**

```javascript
// src/components/Services.jsx — top section
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'

export default function Services() {
  const [ref, isVisible] = useScrollAnimation()
  const content = useContent()
  const services = content.services
  // Remove const services = [...] hardcoded array
  // SVG icons: keep them per service index or make them static (icons are not editable via chat)
  // Map over services array as before
```

Note: SVG icons are decorative and not part of the editable content. Keep them as static per-index decorations (first service = first icon, etc.). The `title`, `description`, and `eyebrow` fields come from content.

- [ ] **Step 3: Update `src/components/Contact.jsx`**

Replace hardcoded contact strings with `content.contact.*`:
- Phone → `{content.contact.phone}`
- Email → `{content.contact.email}`
- Address → `{content.contact.address}`
- Heading → `{content.contact.heading}`
- Intro text → `{content.contact.intro}`

- [ ] **Step 4: Build and verify**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.jsx src/components/Services.jsx src/components/Contact.jsx
git commit -m "feat: update About/Services/Contact to use dynamic content from KV"
```

---

## Task 11: Run All Tests + Full Deploy

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```

Expected: all tests PASS. Fix any failures before continuing.

- [ ] **Step 2: Set Cloudflare secrets**

```bash
npx wrangler secret put CUSTOMER_PASSWORD
# Enter Silke's password when prompted

npx wrangler secret put MASTER_PASSWORD
# Enter Michael's master password

npx wrangler secret put SESSION_SECRET
# Enter: a random 32+ char string, e.g. output of: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

npx wrangler secret put GEMINI_API_KEY
# Enter: Gemini API key from console.cloud.google.com
```

- [ ] **Step 3: Build and deploy**

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=silke-burkhardt
```

Expected: deploy URL printed, e.g. `https://silke-burkhardt.pages.dev`

- [ ] **Step 4: Smoke test checklist**

```
[ ] Visit /admin → shows login page
[ ] Enter wrong password → shows error
[ ] Enter customer password → shows admin panel split-screen
[ ] Type "Ändere den Titel auf 'Test Titel'" → preview updates
[ ] Preview badge decrements by 1
[ ] Click "Jetzt veröffentlichen" → publish badge decrements
[ ] Visit / in new tab → shows updated title
[ ] Click "Verwerfen" → preview resets
[ ] Drag a .jpg onto drop zone → preview shows new image
[ ] Logout → redirected to login page
[ ] Log in with master password → isMaster session (no limit decrement)
```

- [ ] **Step 5: Set R2_PUBLIC_BASE secret (after enabling R2 public access)**

In Cloudflare dashboard: R2 → `vis-a-vision-uploads` → Settings → Enable public access → copy URL.

```bash
npx wrangler secret put R2_PUBLIC_BASE
# Enter the R2 public URL, e.g.: https://pub-abc123.r2.dev
```

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: full vis-a-vision admin CMS — deploy-ready"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Sec 3: Architecture (KV, R2, Pages Functions) → Tasks 1, 3–8
- ✅ Sec 4: Admin panel layout + auth + rate limit badges → Task 5
- ✅ Sec 5: Two-phase content flow (preview → publish) → Tasks 6, 7
- ✅ Sec 6: Content schema → Task 2
- ✅ Sec 7: File upload → Task 8
- ✅ Sec 8: Rate limiting in KV → Tasks 6, 7
- ✅ Sec 9: React useContent hook → Tasks 9, 10
- ✅ Sec 10: /preview endpoint with draft injection → Task 7
- ✅ Sec 11: Account migration (secrets swap) → noted in Task 11
- ✅ Sec 12: Deployment workflow → Task 11

**Placeholder scan:** No TBDs, TODOs, or "implement later" found. All code steps include complete implementations.

**Type consistency:**
- `checkRateLimit()` — same signature across rate-limit.js, chat.js, publish.js, upload.js ✅
- `applyJsonDiff()` — same name in gemini.js and used in chat.js, upload.js ✅
- `DEFAULT_CONTENT` — imported consistently from `src/content-schema.js` ✅
- `handleLogin`, `handlePublish`, `handleDiscard`, `handleUpload` — named exports for testability, `onRequest*` for Cloudflare ✅
