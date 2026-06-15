// src/components/Rich.jsx
// Rendert einen CMS-Textwert als gegebenes HTML-Tag und wandelt begrenzte
// Markdown-Betonung in **fett** / *kursiv* um. SICHERHEIT: zuerst HTML escapen
// (&,<,>), dann nur die zwei erlaubten Muster zu <strong>/<em> ersetzen — so
// kann über CMS-Texte kein echtes HTML eingeschleust werden.
export function toHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // absolutes font-weight:700 statt des CSS-'bolder' — Tailwind-Preflight setzt
    // strong{font-weight:bolder}, was in font-light-Kontexten (300) nur 400 ergibt
    // und damit NICHT sichtbar fett ist. 700 wirkt in jedem Kontext.
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em style="font-style:italic">$1</em>')
}

export default function Rich({ as: Tag = 'span', text = '', ...props }) {
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: toHtml(text) }} />
}
