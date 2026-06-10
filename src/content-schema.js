// src/content-schema.js
// KANONISCHE QUELLE für Content-Struktur, Feld-Metadaten und Merge-Logik.
// Wird von src (React) UND functions (Workers) importiert — nie duplizieren.

export const DEFAULT_CONTENT = {
  meta: {
    business_name: 'Mag. Silke Burkhardt',
    tagline: 'Supervision · Coaching · Teamentwicklung',
    primary_color: '#2d4a6b',
    secondary_color: '#f0f4f8',
    font: 'Inter, sans-serif',
  },
  navigation: {
    items: [
      { label: 'Angebot', target: '#angebot' },
      { label: 'Über mich', target: '#ueber-mich' },
      { label: 'Arbeitsweise', target: '#arbeitsweise' },
      { label: 'FAQ', target: '#faq' },
      { label: 'Kontakt', target: '#kontakt' },
    ],
    cta_label: 'Erstgespräch',
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
  aktuelles: {
    enabled: true,
    eyebrow: 'Aktueller Impuls',
    heading: 'Abschließen, Ordnen, Neu ausrichten',
    text: 'Zum Ende eines intensiven sozialen Arbeitsjahres lohnt es sich, bewusst innezuhalten: Was hat getragen? Was wurde noch nicht ausreichend gewürdigt? In einem begleiteten Format schließen Sie das Arbeitsjahr bewusst ab und starten aufgeräumt: mit Klarheit und einem Kompass für die kommenden Aufgaben.',
    image: '',
    cta_text: 'Impuls anfragen',
    expires: '',
  },
  contact: {
    heading: 'Kontakt',
    intro: 'Ich freue mich auf Ihre Nachricht. Das Erstgespräch ist kostenlos und unverbindlich.',
    phone: '+43 680 2193 868',
    email: 'office@silkeburkhardt.at',
    address: 'St. Michael ob Bleiburg, Kärnten',
  },
  footer: {
    imprint_heading: 'Impressum',
    privacy_heading: 'Datenschutz',
    copyright: '© 2026 Mag. Silke Burkhardt',
    extra_line: '',
  },
}

// ---------------------------------------------------------------------------
// Feld-Metadaten: EINZIGE Quelle für LLM-Whitelist, Validierung, Markierungs-
// Labels und Admin-UI. Numerische Pfadsegmente werden als '*' normalisiert
// (services.0.title → services.*.title).
// type: string | text | image | bool | date | color | email | tel | anchor
export const FIELD_META = {
  'meta.business_name':      { label: 'Firmenname', type: 'string', max: 60 },
  'meta.tagline':            { label: 'Untertitel', type: 'string', max: 120 },
  'meta.primary_color':      { label: 'Hauptfarbe', type: 'color' },
  'meta.secondary_color':    { label: 'Zweitfarbe', type: 'color' },

  'navigation.items.*.label':  { label: 'Menüpunkt', type: 'string', max: 24 },
  'navigation.items.*.target': { label: 'Menüpunkt-Ziel', type: 'anchor' },
  'navigation.cta_label':      { label: 'Menü-Button', type: 'string', max: 30 },

  'hero.eyebrow':         { label: 'Startbereich — kleine Zeile oben', type: 'string', max: 80 },
  'hero.title':           { label: 'Startbereich — Hauptüberschrift', type: 'string', max: 80 },
  'hero.subtitle':        { label: 'Startbereich — Beschreibung', type: 'text', max: 220 },
  'hero.cta_text':        { label: 'Startbereich — Button', type: 'string', max: 30 },
  'hero.portrait_image':  { label: 'Startbereich — Foto', type: 'image' },

  'about.heading':            { label: 'Über mich — Überschrift', type: 'string', max: 80 },
  'about.text':               { label: 'Über mich — Text', type: 'text', max: 1500 },
  'about.stats.*.value':      { label: 'Über mich — Kennzahl', type: 'string', max: 12 },
  'about.stats.*.label':      { label: 'Über mich — Kennzahl-Beschreibung', type: 'string', max: 90 },
  'about.qualifications.*':   { label: 'Über mich — Qualifikation', type: 'string', max: 80 },

  'services.*.eyebrow':     { label: 'Angebot — Kategorie', type: 'string', max: 40 },
  'services.*.title':       { label: 'Angebot — Titel', type: 'string', max: 70 },
  'services.*.description': { label: 'Angebot — Beschreibung', type: 'text', max: 400 },

  'aktuelles.enabled':   { label: 'Aktuelles — sichtbar', type: 'bool' },
  'aktuelles.eyebrow':   { label: 'Aktuelles — kleine Zeile', type: 'string', max: 40 },
  'aktuelles.heading':   { label: 'Aktuelles — Überschrift', type: 'string', max: 90 },
  'aktuelles.text':      { label: 'Aktuelles — Text', type: 'text', max: 800 },
  'aktuelles.image':     { label: 'Aktuelles — Bild', type: 'image' },
  'aktuelles.cta_text':  { label: 'Aktuelles — Button', type: 'string', max: 30 },
  'aktuelles.expires':   { label: 'Aktuelles — läuft ab am', type: 'date' },

  'contact.heading': { label: 'Kontakt — Überschrift', type: 'string', max: 80 },
  'contact.intro':   { label: 'Kontakt — Einleitung', type: 'text', max: 300 },
  'contact.phone':   { label: 'Telefonnummer', type: 'tel', max: 40 },
  'contact.email':   { label: 'E-Mail-Adresse', type: 'email', max: 80 },
  'contact.address': { label: 'Adresse/Einzugsgebiet', type: 'string', max: 160 },

  'footer.copyright':  { label: 'Fußzeile — Copyright', type: 'string', max: 120 },
  'footer.extra_line': { label: 'Fußzeile — Zusatzzeile', type: 'string', max: 160 },
}

// Sektionen für Markierung/Bereichs-Chips. editable:false = Markierung erkennt
// den Bereich, erklärt aber, dass er von Vis-à-Vision gepflegt wird.
export const SECTION_META = {
  navigation:  { label: 'Menüleiste', editable: true },
  hero:        { label: 'Startbereich', editable: true },
  angebot:     { label: 'Angebote', editable: true },
  'ueber-mich': { label: 'Über mich', editable: true },
  arbeitsweise: { label: 'Arbeitsweise', editable: false },
  aktuelles:   { label: 'Aktuelles', editable: true },
  faq:         { label: 'Häufige Fragen', editable: false },
  kontakt:     { label: 'Kontaktbereich', editable: true },
  impressum:   { label: 'Impressum', editable: false },
  datenschutz: { label: 'Datenschutzerklärung', editable: false },
  footer:      { label: 'Fußzeile', editable: true },
}

// Gültige Anker-Ziele für navigation.items.*.target
export const VALID_ANCHORS = [
  '#angebot', '#ueber-mich', '#arbeitsweise', '#aktuelles', '#faq',
  '#kontakt', '#impressum', '#datenschutz', '#top',
]

// services.3.title → services.*.title
export function normalizePath(path) {
  return String(path).split('.').map((s) => (/^\d+$/.test(s) ? '*' : s)).join('.')
}

export function getFieldMeta(path) {
  return FIELD_META[normalizePath(path)] ?? null
}

// Tiefer Merge: gespeicherter Content (KV) über DEFAULT_CONTENT — neue Felder
// aus Schema-Updates fehlen alten KV-Ständen und dürfen nie undefined sein.
export function mergeContent(stored) {
  if (!stored || typeof stored !== 'object') return DEFAULT_CONTENT
  const merge = (def, val) => {
    if (Array.isArray(def)) return Array.isArray(val) ? val : def
    if (def && typeof def === 'object') {
      const out = { ...def }
      if (val && typeof val === 'object') {
        for (const k of Object.keys(val)) {
          out[k] = k in def ? merge(def[k], val[k]) : val[k]
        }
      }
      return out
    }
    return val === undefined || val === null ? def : val
  }
  return merge(DEFAULT_CONTENT, stored)
}
