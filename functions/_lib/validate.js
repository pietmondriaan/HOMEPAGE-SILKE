// functions/_lib/validate.js
// Firewall vor dem KV: Jeder Gemini-Diff muss hier durch, bevor er auf den
// Draft angewendet wird. Whitelist + Typprüfung kommen ausschließlich aus
// src/content-schema.js (FIELD_META / VALID_ANCHORS) — nie duplizieren.
import { FIELD_META, VALID_ANCHORS, normalizePath } from '../../src/content-schema.js'

const MAX_FIELDS_PER_DIFF = 8

// Array-Pfade, die als Ganzes ersetzt werden dürfen (Elemente werden einzeln
// gegen die zugehörigen '*'-Pfade in FIELD_META validiert).
const ARRAY_REPLACE_PATHS = new Set([
  'navigation.items',
  'services',
  'about.stats',
  'about.qualifications',
])

// Kontrollzeichen außer \n (U+000A) entfernen
const CONTROL_CHARS = /[\u0000-\u0009\u000B-\u001F\u007F]/g

const COLOR_RE = /^#[0-9a-fA-F]{6}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TEL_RE = /^[+0-9 ()/-]{5,40}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

// Prüft einen Blattwert gegen seine FIELD_META. Gibt bei Strings den
// bereinigten Wert zurück (Kontrollzeichen gestrippt) — sonst den Originalwert.
// errors wird bei Verstößen befüllt.
function checkLeaf(path, value, meta, errors) {
  const fail = (msg) => { errors.push(`${path}: ${msg}`); return value }

  let v = value
  if (typeof v === 'string') v = v.replace(CONTROL_CHARS, '')

  switch (meta.type) {
    case 'string':
    case 'text':
      if (typeof v !== 'string') return fail('muss Text sein')
      if (meta.max && v.length > meta.max) return fail(`Text zu lang (max. ${meta.max} Zeichen)`)
      return v
    case 'color':
      if (typeof v !== 'string' || !COLOR_RE.test(v)) return fail('muss eine Hex-Farbe wie #2d4a6b sein')
      return v
    case 'email':
      if (typeof v !== 'string' || !EMAIL_RE.test(v)) return fail('keine gültige E-Mail-Adresse')
      if (meta.max && v.length > meta.max) return fail(`zu lang (max. ${meta.max} Zeichen)`)
      return v
    case 'tel':
      if (typeof v !== 'string' || !TEL_RE.test(v)) return fail('keine gültige Telefonnummer')
      return v
    case 'anchor':
      if (typeof v !== 'string' || !VALID_ANCHORS.includes(v)) return fail(`ungültiges Sprungziel (erlaubt: ${VALID_ANCHORS.join(', ')})`)
      return v
    case 'bool':
      if (typeof v !== 'boolean') return fail('muss true oder false sein')
      return v
    case 'date':
      if (typeof v !== 'string' || (v !== '' && !DATE_RE.test(v))) return fail('muss leer oder ein Datum im Format JJJJ-MM-TT sein')
      return v
    case 'image':
      if (typeof v !== 'string' || !(v.startsWith('/') || v.startsWith('https://pub.vis-a-vision.com/')))
        return fail('Bild-URL nicht erlaubt (nur lokale Pfade oder https://pub.vis-a-vision.com/)')
      return v
    default:
      return fail('unbekannter Feldtyp')
  }
}

// Validiert ein einzelnes Element einer komplett ersetzten Array-Stelle.
// container[index] wird ggf. durch den bereinigten Wert ersetzt.
function checkArrayElement(arrayPath, container, index, errors, countField) {
  const elem = container[index]
  const elemPath = `${arrayPath}.${index}`
  const leafMeta = FIELD_META[normalizePath(elemPath)]

  if (leafMeta) {
    // Array aus Blattwerten (z. B. about.qualifications.*)
    countField()
    container[index] = checkLeaf(elemPath, elem, leafMeta, errors)
    return
  }

  if (!isPlainObject(elem)) {
    errors.push(`${elemPath}: Element muss ein Objekt sein`)
    return
  }

  for (const [key, value] of Object.entries(elem)) {
    const path = `${elemPath}.${key}`
    const meta = FIELD_META[normalizePath(path)]
    if (!meta) {
      errors.push(`Unbekanntes Feld: ${path}`)
      continue
    }
    countField()
    elem[key] = checkLeaf(path, value, meta, errors)
  }
}

/**
 * Prüft einen Diff (verschachteltes Objekt mit nur geänderten Feldern) gegen
 * FIELD_META. Strings werden in-place bereinigt (Kontrollzeichen außer \n).
 * @returns {{ ok: boolean, errors: string[], fieldCount: number }}
 */
export function validateDiff(diff) {
  const errors = []
  let fieldCount = 0
  const countField = () => { fieldCount++ }

  if (!isPlainObject(diff)) {
    return { ok: false, errors: ['Diff muss ein Objekt sein'], fieldCount: 0 }
  }

  const walk = (container, key, value, parts) => {
    const path = parts.join('.')
    const normalized = normalizePath(path)

    if (Array.isArray(value)) {
      if (!ARRAY_REPLACE_PATHS.has(normalized)) {
        errors.push(`Unbekanntes Feld: ${path}`)
        return
      }
      // Komplett-Ersetzung zählt als EINE Änderung gegen das 8-Felder-Limit;
      // jedes Element wird trotzdem einzeln validiert.
      fieldCount++
      const noCount = () => {}
      for (let i = 0; i < value.length; i++) {
        checkArrayElement(path, value, i, errors, noCount)
      }
      return
    }

    if (isPlainObject(value)) {
      // Direkter Objekt-Patch an einer Array-Stelle (z. B. services.0.title)
      // ist erlaubt — numerische Segmente normalisieren auf '*'.
      if (FIELD_META[normalized]) {
        // Pfad ist bereits ein Blatt laut Schema, aber Wert ist ein Objekt
        errors.push(`${path}: ungültiger Wert`)
        return
      }
      const entries = Object.entries(value)
      if (entries.length === 0) {
        errors.push(`${path}: leeres Objekt`)
        return
      }
      for (const [k, v] of entries) {
        walk(value, k, v, [...parts, k])
      }
      return
    }

    // Blattwert
    const meta = FIELD_META[normalized]
    if (!meta) {
      errors.push(`Unbekanntes Feld: ${path}`)
      return
    }
    countField()
    container[key] = checkLeaf(path, value, meta, errors)
  }

  for (const [key, value] of Object.entries(diff)) {
    walk(diff, key, value, [key])
  }

  if (fieldCount > MAX_FIELDS_PER_DIFF) {
    errors.push(`Zu viele Änderungen auf einmal (${fieldCount}, max. ${MAX_FIELDS_PER_DIFF}) — bitte in kleineren Schritten`)
  }

  return { ok: errors.length === 0, errors, fieldCount }
}
