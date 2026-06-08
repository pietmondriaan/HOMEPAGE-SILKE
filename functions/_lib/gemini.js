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
