// functions/_lib/validate.test.mjs
// Tests für die Diff-Firewall — kein Workers-Runtime nötig.
// Direkt ausführbar:  node functions/_lib/validate.test.mjs
// Läuft zusätzlich unter Vitest (npm test) mit.
import assert from 'node:assert/strict'
import { validateDiff } from './validate.js'

const cases = []
const test = (name, fn) => cases.push({ name, fn })

// 1) Gültiger hero.title-Diff
test('gültiger hero.title-Diff wird akzeptiert', () => {
  const r = validateDiff({ hero: { title: 'Neue Überschrift' } })
  assert.equal(r.ok, true, r.errors.join('; '))
  assert.equal(r.fieldCount, 1)
})

// 2) navigation.items komplett ersetzen — gültig
test('navigation.items-Array-Replace ist gültig', () => {
  const r = validateDiff({
    navigation: {
      items: [
        { label: 'Angebot', target: '#angebot' },
        { label: 'Kontakt', target: '#kontakt' },
      ],
    },
  })
  assert.equal(r.ok, true, r.errors.join('; '))
})

// 3) Unbekanntes Feld
test('unbekanntes Feld wird abgelehnt', () => {
  const r = validateDiff({ hero: { evil_field: 'x' } })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some(e => e.includes('Unbekanntes Feld: hero.evil_field')), r.errors.join('; '))
})

// 4) Zu langer String (hero.title max 80)
test('zu langer String wird abgelehnt', () => {
  const r = validateDiff({ hero: { title: 'x'.repeat(81) } })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some(e => e.includes('zu lang')), r.errors.join('; '))
})

// 5) Falscher Typ (bool-Feld bekommt String)
test('falscher Typ wird abgelehnt (aktuelles.enabled = "ja")', () => {
  const r = validateDiff({ aktuelles: { enabled: 'ja' } })
  assert.equal(r.ok, false)
})

// 6) Mehr als 8 Felder
test('mehr als 8 Felder werden abgelehnt', () => {
  const r = validateDiff({
    hero: { title: 'a', subtitle: 'b', eyebrow: 'c', cta_text: 'd' },
    meta: { business_name: 'e', tagline: 'f' },
    contact: { heading: 'g', intro: 'h', address: 'i' },
  })
  assert.equal(r.ok, false)
  assert.equal(r.fieldCount, 9)
  assert.ok(r.errors.some(e => e.includes('Zu viele Änderungen')), r.errors.join('; '))
})

// 7) Böse image-URL
test('fremde image-URL wird abgelehnt', () => {
  const r = validateDiff({ hero: { portrait_image: 'https://evil.example.com/x.jpg' } })
  assert.equal(r.ok, false)
})

// 8) Anchor außerhalb VALID_ANCHORS
test('ungültiger anchor wird abgelehnt', () => {
  const r = validateDiff({ navigation: { items: [{ label: 'Phishing', target: 'https://evil.example.com' }] } })
  assert.equal(r.ok, false)
})

// 9) Erlaubte image-Pfade gehen durch
test('lokale und pub.vis-a-vision.com-Bilder sind erlaubt', () => {
  assert.equal(validateDiff({ hero: { portrait_image: '/foto.jpg' } }).ok, true)
  assert.equal(validateDiff({ aktuelles: { image: 'https://pub.vis-a-vision.com/uploads/silke/x.png' } }).ok, true)
})

// 10) Kontrollzeichen werden gestrippt (\n bleibt erhalten)
test('Kontrollzeichen werden gestrippt, \\n bleibt', () => {
  const diff = { about: { text: 'Zeile 1\nZeile 2\u0000\u0007\u001b[31m' } }
  const r = validateDiff(diff)
  assert.equal(r.ok, true, r.errors.join('; '))
  assert.equal(diff.about.text, 'Zeile 1\nZeile 2[31m')
})

// 11) about.qualifications: String-Array komplett ersetzen
test('about.qualifications-Array-Replace ist gültig', () => {
  const r = validateDiff({ about: { qualifications: ['Mag. — Pädagogik', 'Supervisorin'] } })
  assert.equal(r.ok, true, r.errors.join('; '))
})

// 12) Punktueller Array-Patch über numerischen Index (services.0.title)
test('Objekt-Patch mit numerischem Index ist gültig', () => {
  const r = validateDiff({ services: { 0: { title: 'Neuer Titel' } } })
  assert.equal(r.ok, true, r.errors.join('; '))
})

// 13) Array an nicht erlaubter Stelle
test('Array-Replace an fremder Stelle wird abgelehnt', () => {
  const r = validateDiff({ hero: { title: ['a', 'b'] } })
  assert.equal(r.ok, false)
})

// 14) Ungültige Farbe / E-Mail / Datum
test('ungültige Farbe, E-Mail und Datum werden abgelehnt', () => {
  assert.equal(validateDiff({ meta: { primary_color: 'grün' } }).ok, false)
  assert.equal(validateDiff({ contact: { email: 'keine-mail' } }).ok, false)
  assert.equal(validateDiff({ aktuelles: { expires: '31.12.2026' } }).ok, false)
  assert.equal(validateDiff({ aktuelles: { expires: '' } }).ok, true)
  assert.equal(validateDiff({ aktuelles: { expires: '2026-12-31' } }).ok, true)
})

// 15) Kein Objekt als Diff
test('Nicht-Objekt-Diff wird abgelehnt', () => {
  assert.equal(validateDiff(null).ok, false)
  assert.equal(validateDiff('x').ok, false)
  assert.equal(validateDiff([1, 2]).ok, false)
})

if (process.env.VITEST) {
  // Unter Vitest: Fälle als reguläre Tests registrieren
  const vitest = await import('vitest')
  for (const c of cases) vitest.test(c.name, c.fn)
} else {
  // Direkt unter Node: selbst ausführen
  let passed = 0
  let failed = 0
  for (const c of cases) {
    try {
      c.fn()
      passed++
      console.log(`  ok    ${c.name}`)
    } catch (err) {
      failed++
      console.error(`  FAIL  ${c.name}\n        ${err.message}`)
    }
  }
  console.log(`\n${passed} bestanden, ${failed} fehlgeschlagen`)
  if (failed > 0) process.exit(1)
}
