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
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

export default function Rich({ as: Tag = 'span', text = '', ...props }) {
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: toHtml(text) }} />
}
