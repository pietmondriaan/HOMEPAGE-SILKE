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

// messages: Array of { role: 'user'|'model', text: string }
export async function callGemini({ apiKey, systemPrompt, messages }) {
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.text }],
  }))
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1024 },
      }),
    }
  )
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
  try { return JSON.parse(text) } catch { return {} }
}

export function buildSystemPrompt(currentContent) {
  return `Du bist ein Website-CMS-Assistent. Der Nutzer möchte seine Website auf Deutsch bearbeiten.

DEINE AUFGABE:
Entscheide zuerst, ob die Anfrage konkret genug ist:

WENN die Anfrage konkret ist (klare Farbe, klarer Text, klare Änderung):
→ Gib zurück: { "action": "update", "diff": { ...nur geänderte Felder... } }

WENN die Anfrage zu vage ist (z.B. nur "Farbe ändern", "anpassen", "verbessern" ohne Details):
→ Gib zurück: { "action": "ask", "question": "Deine kurze Rückfrage auf Deutsch" }

Bei Rückfragen: konkret und freundlich fragen. Maximal 1 Frage. Beispiele:
- "Welche Farbe soll der Button haben? (z.B. dunkelgrün, türkis, oder Hex-Code wie #2563eb)"
- "Welchen Text soll der Haupttitel haben?"
- "Möchtest du alle Services bearbeiten oder nur einen bestimmten?"

Bei Änderungen (action: update):
- Ändere NUR was explizit genannt wird
- Farben immer als #hex-Wert (z.B. #16a34a für grün)
- Erlaubte Felder: meta (business_name, tagline, primary_color, secondary_color), hero (title, subtitle, cta_text, eyebrow), about (text, heading), services (Array aus {eyebrow, title, description}), contact (phone, email, address)

Aktueller Website-Inhalt:
${JSON.stringify(currentContent, null, 2)}

Antworte AUSSCHLIESSLICH mit validem JSON. Kein Text davor oder danach.`
}
