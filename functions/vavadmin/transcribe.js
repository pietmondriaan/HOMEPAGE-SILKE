// functions/vavadmin/transcribe.js
// Receives audio blob, forwards to Groq Whisper (OpenAI-compatible API), returns transcript text.
export async function onRequestPost({ request, env }) {
  let formData
  try { formData = await request.formData() } catch {
    return Response.json({ error: 'Kein Audio empfangen.' }, { status: 400 })
  }

  const audio = formData.get('audio')
  if (!audio) return Response.json({ error: 'Kein Audio empfangen.' }, { status: 400 })

  const whisperForm = new FormData()
  whisperForm.append('file', audio, 'audio.webm')
  whisperForm.append('model', 'whisper-large-v3-turbo')
  whisperForm.append('language', 'de')
  whisperForm.append('prompt', 'Dies ist eine Anweisung zur Website-Bearbeitung auf Deutsch.')

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.GROQ_API_KEY}` },
    body: whisperForm,
  })

  if (!res.ok) {
    const err = await res.text()
    return Response.json({ error: 'Whisper-Fehler: ' + res.status }, { status: 502 })
  }

  const data = await res.json()
  return Response.json({ text: data.text?.trim() ?? '' })
}
