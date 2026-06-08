// functions/admin/transcribe.js
// Receives audio blob, forwards to OpenAI Whisper, returns transcript text.
export async function onRequestPost({ request, env }) {
  let formData
  try { formData = await request.formData() } catch {
    return Response.json({ error: 'Kein Audio empfangen.' }, { status: 400 })
  }

  const audio = formData.get('audio')
  if (!audio) return Response.json({ error: 'Kein Audio empfangen.' }, { status: 400 })

  const whisperForm = new FormData()
  whisperForm.append('file', audio, 'audio.webm')
  whisperForm.append('model', 'whisper-1')
  whisperForm.append('language', 'de')
  whisperForm.append('prompt', 'Dies ist eine Anweisung zur Website-Bearbeitung auf Deutsch.')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: whisperForm,
  })

  if (!res.ok) {
    const err = await res.text()
    return Response.json({ error: 'Whisper-Fehler: ' + res.status }, { status: 502 })
  }

  const data = await res.json()
  return Response.json({ text: data.text?.trim() ?? '' })
}
