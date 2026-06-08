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
  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)
  const randomPart = Math.random().toString(36).slice(2, 10)
  const key = `uploads/${id}/${Date.now()}-${randomPart}-${baseName}.${ext}`

  if (fileType === 'image') {
    const bytes = await file.arrayBuffer()
    await env.UPLOADS_R2.put(key, bytes, { httpMetadata: { contentType: file.type } })
    const r2PublicBase = env.R2_PUBLIC_BASE ?? `https://pub.vis-a-vision.com`
    const url = `${r2PublicBase}/${key}`

    // Ask Gemini which image field to update
    const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT
    let diff = {}
    try {
      diff = await callGemini({
        apiKey: env.GEMINI_API_KEY,
        systemPrompt: buildSystemPrompt(draft),
        userMessage: `Der Nutzer hat ein Bild hochgeladen: ${file.name}. Die Bild-URL ist: ${url}. Entscheide welches Bildfeld am besten passt (portrait_image im hero-Bereich ist das Profilfoto) und gib ein JSON-Diff zurück das dieses Feld auf die URL setzt.`,
      })
    } catch { diff = {} }

    const updated = applyJsonDiff(draft, diff)
    await env.CONTENT_KV.put(`draft-${id}`, JSON.stringify(updated))

    return Response.json({ ok: true, url, message: `Bild gespeichert und eingebaut.`, previewsLeft: limit.remaining })
  }

  // Text files: extract text content and send to Gemini
  const text = await file.text()
  const truncated = text.slice(0, 10000)

  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT
  let diff = {}
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
