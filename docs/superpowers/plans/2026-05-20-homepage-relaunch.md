# Homepage-Relaunch Silke Burkhardt — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Den bestehenden One-Pager silkeburkhardt.at auf die neue B2B-Positionierung (Supervision · Coaching · Teamentwicklung) umbauen — neue Marke, neue Inhalte, FAQ + SEO/KI-Layer.

**Architecture:** Bestehendes Vite-/React-/Tailwind-Projekt bleibt. Design-Tokens werden zentral in `src/index.css` (`@theme`) neu gesetzt, jede Sektion als eigene Komponente überarbeitet, zwei neue Sektionen (Aktueller Impuls, FAQ) und zwei Rechtssektionen (Impressum, Datenschutz) ergänzt. Es ist eine **rein präsentationale Seite ohne Logik** — Verifikation je Task = `npm run build` fehlerfrei + Sichtprüfung im Dev-Server, kein Unit-Test-Runner.

**Tech Stack:** Vite 8 · React 19 · Tailwind CSS 4 (CSS-`@theme`, kein `tailwind.config.js`) · Google Fonts (Cardo, League Spartan).

**Referenz:** Vollständige Spec unter `docs/superpowers/specs/2026-05-20-silke-homepage-relaunch-design.md` — bei inhaltlichen Fragen dort nachsehen.

**Branch:** `feat/homepage-relaunch` (bereits angelegt, Spec liegt darauf).

**Dev-Server-Hinweis:** Michael arbeitet remote vom ThinkPad. Dev-Server immer mit `npm run dev -- --host` starten; Vorschau-URL = `http://100.109.175.125:5173`.

**Build-Hinweis (wichtig):** `npm run build`/`npm run dev` scheitern in dieser Umgebung, weil der Projektpfad ein `&` enthält (`06 Web & Software`) — das bricht die `.cmd`-Wrapper in `node_modules\.bin\`. Stattdessen Vite direkt über Node aufrufen: `node node_modules/vite/bin/vite.js build` · `node node_modules/vite/bin/vite.js dev --host` · `node node_modules/vite/bin/vite.js preview --host`. Funktional identisch. (Verifiziert in Task 1.)

---

## Datei-Struktur

| Datei | Verantwortung | Aktion |
|---|---|---|
| `src/index.css` | Design-Tokens (`@theme`), Basis-Styles, Keyframes | überarbeiten |
| `index.html` | Sprache, SEO-Meta, OG-Tags, Fonts, JSON-LD | überarbeiten |
| `src/components/Navigation.jsx` | Sticky-Navigation, Logo, Menü | überarbeiten |
| `src/components/Hero.jsx` | Hero-Sektion | überarbeiten |
| `src/components/Services.jsx` | Angebot — 5 Leistungskarten | überarbeiten |
| `src/components/About.jsx` | Über mich | überarbeiten |
| `src/components/Approach.jsx` | Arbeitsweise | überarbeiten |
| `src/components/Impuls.jsx` | Aktueller saisonaler Impuls | **neu** |
| `src/components/Faq.jsx` | FAQ-Sektion | **neu** |
| `src/components/Contact.jsx` | Kontakt (ohne Formular) | überarbeiten |
| `src/components/Impressum.jsx` | Impressum-Sektion | **neu** |
| `src/components/Datenschutz.jsx` | Datenschutz-Sektion | **neu** |
| `src/components/Footer.jsx` | Footer mit Rechtslinks | überarbeiten |
| `src/App.jsx` | Sektions-Reihenfolge | überarbeiten |
| `public/llms.txt` | KI-Crawler-Steuerung | **neu** |
| `public/robots.txt` | Such-Crawler + Sitemap-Verweis | **neu** |
| `public/sitemap.xml` | Sitemap | **neu** |
| `public/logo.svg` / Logo-Asset | neues Petrol-Logo | prüfen/ersetzen |

---

## Task 1: Design-Tokens in index.css

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: `@theme`-Block und Basis-Styles ersetzen**

Den `@theme { ... }`-Block (Zeilen 3–35) sowie die `body`/`::selection`-Regeln durch die neuen Tokens ersetzen. Keyframes (`fade-up`, `fade-in`, `blob-morph`) und Animations-Utilities (`.animate-*`, `.delay-*`, `.blob-mask`) **unverändert lassen**.

```css
@import "tailwindcss";

@theme {
  /* Flächen */
  --color-canvas: #F1F7F7;       /* Seitenhintergrund, blasses Azurblau */
  --color-surface: #FFFFFF;      /* Karten, Panels */
  --color-petrol-pale: #E6F1F2;  /* dezente Petrol-Fläche */

  /* Marke */
  --color-petrol: #318F9A;       /* Logo-/Markenfarbe */
  --color-petrol-dark: #2A7A84;  /* Hover */

  /* Text */
  --color-azure: #1C4654;        /* Überschriften, dunkles Azurblau */
  --color-ink: #43403C;          /* Fließtext, dunkles Grau */
  --color-ink-soft: #5F6B6D;     /* Sekundärtext */

  /* Linien */
  --color-line: #E2EAEB;
  --color-line-soft: #EAF1F1;

  /* Schriften */
  --font-sans: 'League Spartan', system-ui, sans-serif;
  --font-serif: 'Cardo', Georgia, 'Times New Roman', serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-serif);
  color: var(--color-ink);
  background-color: var(--color-canvas);
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background-color: var(--color-petrol);
  color: white;
}
```

Hinweis: Fließtext ist Serif (Cardo). League Spartan wird pro Element über die Utility-Klasse `font-sans` gesetzt (Labels, Navigation, Buttons).

- [ ] **Step 2: Build prüfen**

Run: `npm run build`
Expected: Build ohne Fehler. (Komponenten nutzen noch alte Klassen wie `bg-cream` — diese erzeugen in Tailwind 4 einfach keine Regel, kein Build-Fehler. Sichtbar korrekt wird es Task für Task.)

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat(design): neue Marken-Tokens (Petrol/Azur) in index.css"
```

---

## Task 2: index.html — Fonts, SEO-Meta, Structured Data

**Files:**
- Modify: `index.html`

- [ ] **Step 1: `index.html` komplett ersetzen**

```html
<!doctype html>
<html lang="de-AT">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Silke Burkhardt — Supervision, Coaching & Teamentwicklung | Kärnten & Steiermark</title>
    <meta name="description" content="Mag. Silke Burkhardt — Supervision, Coaching und Teamentwicklung für Fach- und Führungskräfte in der Kinder- und Jugendhilfe. Kärnten & Steiermark. Verfügbar ab Juni 2026." />
    <link rel="canonical" href="https://www.silkeburkhardt.at/" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Silke Burkhardt — Supervision, Coaching & Teamentwicklung" />
    <meta property="og:description" content="Supervision, Coaching und Teamentwicklung für Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern. Kärnten & Steiermark." />
    <meta property="og:url" content="https://www.silkeburkhardt.at/" />
    <meta property="og:locale" content="de_AT" />
    <meta name="twitter:card" content="summary" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=League+Spartan:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Mag. Silke Burkhardt — Supervision, Coaching & Teamentwicklung",
      "description": "Supervision, Coaching und Teamentwicklung für Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern.",
      "url": "https://www.silkeburkhardt.at/",
      "telephone": "+436802193868",
      "email": "si.burkhardt@outlook.com",
      "areaServed": [
        { "@type": "State", "name": "Kärnten" },
        { "@type": "State", "name": "Steiermark" }
      ],
      "founder": { "@type": "Person", "name": "Mag. Silke Burkhardt", "jobTitle": "Sozial- und Integrationspädagogin" },
      "knowsAbout": ["Supervision", "Coaching", "Teamentwicklung", "Prozessbegleitung", "Kinder- und Jugendhilfe"]
    }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Build prüfen**

Run: `npm run build`
Expected: Build ohne Fehler.

- [ ] **Step 3: Structured Data validieren**

`dist/index.html` öffnen, den JSON-LD-Block kopieren und in den [Schema Markup Validator](https://validator.schema.org/) einfügen.
Expected: keine Errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(seo): index.html mit SEO-Meta, OG-Tags, Fonts und ProfessionalService-JSON-LD"
```

---

## Task 3: Navigation

**Files:**
- Modify: `src/components/Navigation.jsx`

- [ ] **Step 1: Navigation überarbeiten**

Bestehende Struktur (Sticky-Verhalten, Mobile-Toggle, `useState`/`useEffect`) behalten. Ändern:
- Wortmarke: die zweizeilige „ÜBERBLICK. / Silke Burkhardt"-Marke ersetzen durch **eine Zeile „Silke Burkhardt"** in `font-serif` (Cardo), Farbe `text-azure`.
- `navItems` neu: `Angebot → #angebot`, `Über mich → #ueber-mich`, `Arbeitsweise → #arbeitsweise`, `FAQ → #faq`, `Kontakt → #kontakt`.
- Alle Farbklassen umstellen: `bg-cream`→`bg-canvas`, `text-bark`/`text-bark-light`→`text-ink`/`text-ink-soft`, `text-sage`/`bg-sage`/`bg-sage-dark`→`text-petrol`/`bg-petrol`/`bg-petrol-dark`.
- Menü-Links, Button und Mobile-Links erhalten `font-sans` (League Spartan); Button-Text „Erstgespräch", Link `#kontakt`.

- [ ] **Step 2: Dev-Server-Sichtprüfung**

Run: `npm run dev -- --host` · URL `http://100.109.175.125:5173`
Expected: Navigation zeigt „Silke Burkhardt" in Cardo, 5 Menüpunkte in League Spartan, Petrol-Button. Mobile-Toggle öffnet/schließt.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navigation.jsx
git commit -m "feat(nav): Navigation auf neue Marke, Menüpunkte und Farben"
```

---

## Task 4: Hero

**Files:**
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Hero-Inhalt und -Marke überarbeiten**

Layout/Animationen (Blob-Dekoration, `animate-fade-up`, Eyebrow/Headline/Subtext/CTA/Credentials) behalten. Farbklassen umstellen (siehe Task 3). Blob-Farben `bg-sage/...` → `bg-petrol/...`. Inhalte ersetzen:

- Eyebrow: `Supervision · Coaching · Teamentwicklung`
- Headline (Cardo): `Orientierung und Handlungssicherheit — für Teams und Leitungen in der sozialen Arbeit.`
- Subtext: `Supervision, Coaching und Teamentwicklung für Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern. Haltungs- und ressourcenorientiert, getragen von 24 Jahren Praxis- und Leitungserfahrung.`
- CTA primär: `Erstgespräch vereinbaren` → `#kontakt`; sekundär: `Meine Angebote` → `#angebot`.
- Credentials-Zeile: `Mag. Silke Burkhardt` · `Sozial- und Integrationspädagogin` · `Kärnten & Steiermark` · `Verfügbar ab Juni 2026`.

- [ ] **Step 2: Dev-Server-Sichtprüfung**

Expected: Hero mit neuem Text, Cardo-Headline in `text-azure`, Petrol-Buttons, kein Salbeigrün mehr.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat(hero): neue B2B-Positionierung und Marke"
```

---

## Task 5: Angebot (Services — 5 Leistungen)

**Files:**
- Modify: `src/components/Services.jsx`

- [ ] **Step 1: `services`-Array auf 5 Leistungen ersetzen**

Section-`id` von `leistungen` auf `angebot` ändern. Karten-Grid so anpassen, dass 5 Karten sauber sitzen (`sm:grid-cols-2 lg:grid-cols-3`, die 5. Karte darf eine Reihe allein/zentriert füllen). Header-Text: Eyebrow `Angebot`, Überschrift `Fünf Leistungen für Fach- und Führungskräfte.`, Intro `Mein Angebot richtet sich an Träger, Teams und Leitungskräfte der sozialen Arbeit — abgestimmt auf Ihren konkreten Bedarf.` Farbklassen umstellen. Icons (SVG) je Karte beibehalten/passend wählen.

```js
const services = [
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
    eyebrow: 'Fallarbeit',
    title: 'Fachliche Fallbegleitung',
    description: 'Begleitung in komplexen Fallsituationen — mit dem Ziel, Handlungssicherheit dort (wieder)herzustellen, wo der Berufsalltag an Grenzen stößt.',
  },
  {
    eyebrow: 'Organisation',
    title: 'Konzept- & Prozessbegleitung',
    description: 'Unterstützung bei Qualitätsentwicklung, konzeptioneller Neuausrichtung und Veränderungsprozessen in Organisationen der sozialen Arbeit.',
  },
  {
    eyebrow: 'Wissen',
    title: 'Workshops & Klausurbegleitung',
    description: 'Halb- und Tagesformate zu spezifischen Fachthemen sowie die Begleitung von Team-Klausuren — praxisnah und auf Ihren Bedarf zugeschnitten.',
  },
]
```

- [ ] **Step 2: Dev-Server-Sichtprüfung**

Expected: 5 Karten, neue Titel/Texte, Petrol-Akzente, Section-Anker `#angebot`. Keine „Lebensberatung/Privatpersonen"-Karte mehr.

- [ ] **Step 3: Commit**

```bash
git add src/components/Services.jsx
git commit -m "feat(angebot): 5 Leistungen aus der Ausschreibung, Privatpersonen entfernt"
```

---

## Task 6: Über mich

**Files:**
- Modify: `src/components/About.jsx`

- [ ] **Step 1: Inhalt und Qualifikationen überarbeiten**

Layout (Portrait in Blob-Maske + Textspalte) behalten, Farbklassen umstellen, `src="/silke-portrait.jpg"` beibehalten. Texte ersetzen:

- Eyebrow: `Über mich`
- Überschrift: `24 Jahre Praxis. Ein klarer Blick auf das, was Teams trägt.`
- Absätze:
  1. `Mein Fachwissen ist in 24 Jahren sozialpädagogischer Praxis gewachsen — zuletzt, von 2016 bis 2026, als Leiterin dreier intensiver Betreuungssettings.`
  2. `In dieser Zeit habe ich Mitarbeiter*innenentwicklung, fachliche Qualitätssicherung und konzeptionelle Neuausrichtung verantwortet — mit dem Fokus auf stabile Teams als Grundlage gelingenden Kinderschutzes.`
  3. `2026 habe ich mich bewusst aus der Anstellung gelöst, um Fach- und Führungskräfte an anderer Stelle selbstbestimmt zu begleiten. Ich kenne den Ruf nach Handlungssicherheit und Entlastung aus allen Perspektiven — und ich kenne Wege, ihm zu begegnen.`
- `qualifications`: `['Mag. — Pädagogik', 'Sozial- und Integrationspädagogin', 'Lebens- & Sozialberatung (Gewerbe)', 'Unternehmensberatung (Gewerbe)']`

- [ ] **Step 2: Dev-Server-Sichtprüfung**

Expected: neuer Profiltext, Portrait sichtbar, 4 Qualifikationen, Petrol-Akzente.

- [ ] **Step 3: Commit**

```bash
git add src/components/About.jsx
git commit -m "feat(about): Profil aus Businessplan, Leitungserfahrung als USP"
```

---

## Task 7: Arbeitsweise

**Files:**
- Modify: `src/components/Approach.jsx`

- [ ] **Step 1: Inhalt überarbeiten, Farben umstellen**

Layout + 3-Schritt-Struktur behalten. Hintergrund `bg-sage` → `bg-petrol`; weiße Texte auf Petrol bleiben weiß. Texte ersetzen:

- Eyebrow: `Arbeitsweise`
- Überschrift: `Haltungs- und ressourcenorientiert.`
- Intro: `Im Zentrum meiner Arbeit steht nicht das Problem, sondern die Fähigkeit, tragfähige Lösungen zu entwickeln. Fachlichkeit und Persönlichkeit stehen dabei gleichrangig nebeneinander.`
- Badge-Text: `Haltungsorientiert · Ressourcenorientiert · Praxisnah`
- 3 Schritte:
  1. `Ankommen & Verstehen` — `Wir klären das Anliegen, beleuchten den Kontext und entwickeln ein gemeinsames Verständnis der Situation.`
  2. `Ressourcen sichtbar machen` — `Mit systemischer Perspektive lenken wir den Blick auf das, was bereits trägt — und auf ungenutzte Handlungsspielräume.`
  3. `Handlungssicherheit gewinnen` — `Gemeinsam erarbeiten wir konkrete, umsetzbare Schritte, die im Berufsalltag Orientierung und Sicherheit geben.`

- [ ] **Step 2: Dev-Server-Sichtprüfung**

Expected: Petrol-Sektion, neue 3 Schritte, `id="arbeitsweise"`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Approach.jsx
git commit -m "feat(arbeitsweise): haltungs-/ressourcenorientierter Ansatz, Petrol-Sektion"
```

---

## Task 8: Aktueller Impuls (neue Komponente)

**Files:**
- Create: `src/components/Impuls.jsx`

- [ ] **Step 1: Komponente anlegen**

Hervorgehobene Sektion (`id="impuls"`), Hintergrund `bg-petrol-pale`, Karte in `bg-surface`. Über eine Konstante `const SHOW_IMPULS = true` am Dateianfang abschaltbar — bei `false` rendert die Komponente `null`. `useScrollAnimation`-Hook wie in anderen Sektionen nutzen.

Inhalt:
- Label (`font-sans`, uppercase, `text-petrol`): `Aktueller Impuls`
- Überschrift (Cardo, `text-azure`): `Abschließen, Ordnen, Neu ausrichten`
- Text: `Zum Ende eines intensiven sozialen Arbeitsjahres lohnt es sich, bewusst innezuhalten: Was hat getragen? Was wurde noch nicht ausreichend gewürdigt? Was darf eher als Erfahrung denn als persönlicher Erfolg eingeordnet werden? In einem begleiteten Format — für Einzelpersonen, Fach- und Führungskräfte oder ganze Teams — schließen Sie das Arbeitsjahr bewusst ab und starten aufgeräumt: mit Klarheit und einem Kompass für die kommenden Aufgaben.`
- CTA-Link (`font-sans`): `Impuls anfragen` → `#kontakt`

- [ ] **Step 2: Dev-Server-Sichtprüfung** (erst nach Task 12 sichtbar — hier nur Build)

Run: `npm run build`
Expected: Build ohne Fehler.

- [ ] **Step 3: Commit**

```bash
git add src/components/Impuls.jsx
git commit -m "feat(impuls): saisonale Sektion 'Abschliessen, Ordnen, Neu ausrichten', abschaltbar"
```

---

## Task 9: FAQ (neue Komponente + FAQPage-Schema)

**Files:**
- Create: `src/components/Faq.jsx`

- [ ] **Step 1: FAQ-Komponente anlegen**

Sektion `id="faq"`, Hintergrund `bg-canvas`. Akkordeon (aufklappbare Einträge) per `useState` (Index des offenen Eintrags). Header: Eyebrow `FAQ`, Überschrift `Häufige Fragen.` Daten-Array `faqs` mit Frage/Antwort:

```js
const faqs = [
  { q: 'In welcher Region bieten Sie Supervision und Coaching an?',
    a: 'Mein Einzugsgebiet umfasst Kärnten und die Steiermark. Teamsupervisionen finden in der Regel in den Einrichtungen statt, Einzelsettings nach Vereinbarung.' },
  { q: 'Ab wann sind Sie verfügbar?',
    a: 'Mein Unternehmen startet im Juni 2026. Erste Anfragen und Terminvereinbarungen sind bereits jetzt möglich.' },
  { q: 'Für wen ist Ihr Angebot gedacht?',
    a: 'Für Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern — insbesondere Träger der ambulanten und stationären Kinder- und Jugendhilfe sowie Bildungseinrichtungen.' },
  { q: 'Sind Supervisionen für Träger verpflichtend?',
    a: 'In der ambulanten und stationären Kinder- und Jugendhilfe sind Supervision, Fortbildungen und Klausuren in der Regel konzeptionell festgeschrieben und trägerfinanziert. Die Teilnahme wird von der Abteilung 6 der Kärntner Landesregierung im Rahmen von Fachaufsichten überprüft.' },
  { q: 'Finden Supervisionen vor Ort statt?',
    a: 'Team- und Gruppensettings finden in der Regel in den Räumlichkeiten der Träger statt. Für Einzelsettings ist ein Praxisraum in Klagenfurt geplant.' },
  { q: 'Was unterscheidet Ihr Angebot?',
    a: 'Ich bringe 24 Jahre Praxis und langjährige Leitungserfahrung in intensiven Betreuungssettings mit. Diese Kombination aus fundierter Ausbildung und gelebter Führungspraxis macht mein Angebot anschlussfähig.' },
  { q: 'Wie läuft der Erstkontakt ab?',
    a: 'Über ein kurzes, unverbindliches Erstgespräch — telefonisch oder per E-Mail. Darin klären wir Anliegen, Rahmen und nächste Schritte.' },
]
```

- [ ] **Step 2: FAQPage-JSON-LD ergänzen**

In `index.html` einen **zweiten** `<script type="application/ld+json">`-Block mit `@type: FAQPage` einfügen, dessen `mainEntity` exakt die 7 Fragen/Antworten aus Step 1 enthält (Frage als `Question`, Antwort als `acceptedAnswer`/`Answer`). Texte wortgleich zum `faqs`-Array.

- [ ] **Step 3: Build + Schema-Validierung**

Run: `npm run build` → fehlerfrei. JSON-LD erneut im Schema-Validator prüfen → keine Errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Faq.jsx index.html
git commit -m "feat(faq): FAQ-Sektion mit Akkordeon und FAQPage-Structured-Data"
```

---

## Task 10: Kontakt (Formular entfernen)

**Files:**
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Contact auf reine Kontaktdaten reduzieren**

`useState`, `handleChange`, `handleSubmit`, das gesamte `<form>` und den `submitted`-Zweig **entfernen**. Übrig bleibt die linke Info-Spalte, auf volle Breite / zentriert gelegt. Farbklassen umstellen. Inhalte:
- Eyebrow `Kontakt`, Überschrift `Lassen Sie uns ins Gespräch kommen.`
- Intro: `Der erste Schritt ist oft der wichtigste. Für ein unverbindliches Erstgespräch erreichen Sie mich direkt:`
- Telefon: Anzeige `+43 680 2193 868`, Link `tel:+436802193868`
- E-Mail: Anzeige + Link `si.burkhardt@outlook.com` → `mailto:si.burkhardt@outlook.com`
- Einzugsgebiet: `Kärnten & Steiermark`
- Verfügbarkeit: `Verfügbar ab Juni 2026 · Erstgespräch kostenlos & unverbindlich`

- [ ] **Step 2: Dev-Server-Sichtprüfung**

Expected: Kein Formular mehr; Telefon/E-Mail als klickbare Links; `id="kontakt"`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Contact.jsx
git commit -m "feat(kontakt): Formular entfernt, direkte Kontaktdaten (Tel/Mail)"
```

---

## Task 11: Impressum & Datenschutz (neue Komponenten)

**Files:**
- Create: `src/components/Impressum.jsx`
- Create: `src/components/Datenschutz.jsx`

- [ ] **Step 1: Impressum-Komponente anlegen**

Kompakte Sektion `id="impressum"`, `bg-canvas`, kleine Schrift. Inhalt nach ECG §5 — **Platzhalter klar markiert**, da finale Daten von Silke zu bestätigen sind:

```
Medieninhaberin & für den Inhalt verantwortlich:
Mag. Silke Ursula Burkhardt
St. Michael ob Bleiburg 130/1, 9143 St. Michael ob Bleiburg, Österreich
Telefon: +43 680 2193 868 · E-Mail: si.burkhardt@outlook.com

Unternehmensgegenstand: Lebens- und Sozialberatung; Unternehmensberatung
GISA-Zahl: [[ VON SILKE EINZUTRAGEN ]]
Berufsrecht: Gewerbeordnung 1994 — abrufbar unter ris.bka.gv.at
Mitgliedschaft: Wirtschaftskammer Kärnten
Aufsichtsbehörde: Bezirkshauptmannschaft Völkermarkt
```

Jeder Platzhalter im Format `[[ ... ]]`, damit er vor dem Live-Gang nicht übersehen wird.

- [ ] **Step 2: Datenschutz-Komponente anlegen**

Kompakte Sektion `id="datenschutz"`, `bg-canvas`. Schlanke DSGVO-Erklärung (die Seite hat kein Formular, kein Tracking, keine Cookies):
- Verantwortliche: Mag. Silke Ursula Burkhardt (Adresse wie Impressum).
- Hinweis: Die Website verarbeitet keine personenbezogenen Daten, setzt keine Cookies und kein Tracking ein. Beim Aufruf der Seite werden durch den Hosting-Provider technisch notwendige Server-Logs verarbeitet.
- Schriftarten werden von Google Fonts geladen — Hinweis aufnehmen, dass dabei eine Verbindung zu Google-Servern entsteht. *(Alternative: Fonts self-hosten — siehe Task 13, Optional.)*
- Kontaktaufnahme per E-Mail/Telefon: die übermittelten Daten werden ausschließlich zur Bearbeitung der Anfrage verwendet.
- Betroffenenrechte (Auskunft, Berichtigung, Löschung, Beschwerde bei der Datenschutzbehörde).

- [ ] **Step 3: Build prüfen**

Run: `npm run build` → fehlerfrei.

- [ ] **Step 4: Commit**

```bash
git add src/components/Impressum.jsx src/components/Datenschutz.jsx
git commit -m "feat(recht): Impressum- und Datenschutz-Sektionen (Platzhalter fuer Silkes Daten)"
```

---

## Task 12: App.jsx — Sektionen verdrahten

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: App.jsx mit neuer Reihenfolge**

```jsx
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Approach from './components/Approach'
import Impuls from './components/Impuls'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Impressum from './components/Impressum'
import Datenschutz from './components/Datenschutz'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <About />
        <Approach />
        <Impuls />
        <Faq />
        <Contact />
      </main>
      <Impressum />
      <Datenschutz />
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Footer überarbeiten**

Wortmarke „ÜBERBLICK. / Silke Burkhardt" → einzeilig „Silke Burkhardt" (Cardo, `text-azure`). Farbklassen umstellen. Footer-Navigation neu: `Angebot #angebot`, `Über mich #ueber-mich`, `Arbeitsweise #arbeitsweise`, `FAQ #faq`, `Kontakt #kontakt`, **`Impressum #impressum`**, **`Datenschutz #datenschutz`**. Copyright: `© {year} Mag. Silke Burkhardt`.

- [ ] **Step 3: Dev-Server-Gesamtsichtprüfung**

Run: `npm run dev -- --host` · `http://100.109.175.125:5173`
Expected: Komplette Seite in neuer Reihenfolge, alle 9 Sektionen + Impressum/Datenschutz, alle Anker-Links springen korrekt, mobil sauber.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/Footer.jsx
git commit -m "feat(app): neue Sektions-Reihenfolge, Impuls/FAQ/Recht eingebunden, Footer-Links"
```

---

## Task 13: SEO-/KI-Dateien

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `public/llms.txt`

- [ ] **Step 1: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.silkeburkhardt.at/sitemap.xml
```

- [ ] **Step 2: `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.silkeburkhardt.at/</loc>
    <lastmod>2026-05-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: `public/llms.txt`**

```
# Silke Burkhardt — Supervision, Coaching & Teamentwicklung

> Mag. Silke Burkhardt bietet Supervision, Coaching und Teamentwicklung für
> Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern. Einzugsgebiet
> Kärnten und Steiermark. Verfügbar ab Juni 2026.

## Angebot
- Einzel- & Teamsupervision
- Coaching für Fach- & Führungskräfte
- Fachliche Fallbegleitung in komplexen Fallsituationen
- Konzept- & Prozessbegleitung
- Workshops & Klausurbegleitung

## Zielgruppe
Träger der ambulanten und stationären Kinder- und Jugendhilfe sowie
Bildungseinrichtungen in Kärnten und der Steiermark.

## Kontakt
Telefon: +43 680 2193 868
E-Mail: si.burkhardt@outlook.com
Website: https://www.silkeburkhardt.at/
```

- [ ] **Step 4 (Optional): Google Fonts self-hosten** — wenn die Datenschutz-Erklärung ohne Google-Fonts-Hinweis auskommen soll: Cardo + League Spartan lokal nach `public/fonts/` legen, `@font-face` in `index.css`, Google-Fonts-Link aus `index.html` entfernen. Sonst Step überspringen.

- [ ] **Step 5: Build prüfen**

Run: `npm run build`
Expected: `dist/robots.txt`, `dist/sitemap.xml`, `dist/llms.txt` vorhanden.

- [ ] **Step 6: Commit**

```bash
git add public/robots.txt public/sitemap.xml public/llms.txt
git commit -m "feat(seo): robots.txt, sitemap.xml und llms.txt"
```

---

## Task 14: Logo-Asset

**Files:**
- Modify/Create: `public/logo.svg` bzw. neues Logo-Asset

- [ ] **Step 1: Aktuelles Logo prüfen**

`public/logo.svg` im Browser öffnen. Ist es bereits das neue Petrol-Logo (Blob mit „SUPERVISION/COACHING/TEAMENTWICKLUNG · Silke Burkhardt"), Task ist erledigt → Step 3.

- [ ] **Step 2: Falls altes Logo** — die Datei `06 Web & Software/silkeburkhardt.at/material-aktenkoffer/logo silke.jpg` nach `public/logo.svg` bzw. `public/logo.jpg` kopieren und Referenzen (Navigation/Footer, falls Bild-Logo gewünscht) anpassen. Hinweis: aktuell ist die Wortmarke rein typografisch (Cardo) — ein Bild-Logo ist optional.

- [ ] **Step 3: Commit** (nur falls geändert)

```bash
git add public/
git commit -m "chore(assets): Logo-Asset aktualisiert"
```

---

## Task 15: Veraltete Dublette löschen (Auftrag f)

**Files:**
- Delete: lose Vite-Projektdateien in `06 Web & Software/silkeburkhardt.at/` (Ebene **über** `HOMEPAGE-SILKE/`)

- [ ] **Step 1: Sicherheits-Check vor dem Löschen**

Vergleichen, ob in der Dublette (`silkeburkhardt.at/src/`, `/public/`, `/dist/` etc.) Inhalte liegen, die **nicht** auch in `HOMEPAGE-SILKE/` existieren. `git log` der Dublette gibt es nicht (kein eigenes Repo) — daher Datei-Diff `silkeburkhardt.at/src` ↔ `HOMEPAGE-SILKE/src`. Einzigartiges zuerst sichern.

- [ ] **Step 2: Dublette entfernen**

Löschen: `silkeburkhardt.at/src/`, `silkeburkhardt.at/public/`, `silkeburkhardt.at/dist/`, `silkeburkhardt.at/node_modules/`, `silkeburkhardt.at/package.json`, `package-lock.json`, `vite.config.js`, `eslint.config.js`, `index.html`. **Behalten:** `HOMEPAGE-SILKE/`, `material-aktenkoffer/`, `CLAUDE.md`, `README.md`.

- [ ] **Step 3: Verifizieren**

`ls "06 Web & Software/silkeburkhardt.at/"` → nur noch `HOMEPAGE-SILKE/`, `material-aktenkoffer/`, `CLAUDE.md`, `README.md`.

Hinweis: Die Dublette liegt im Brain-Vault, nicht im Repo — kein Git-Commit nötig; die Löschung wird über den Brain-Sync verteilt.

---

## Task 16: Abschluss — Build, Qualität, Verifikation

- [ ] **Step 1: Produktions-Build**

Run: `npm run build`
Expected: Build ohne Fehler/Warnungen.

- [ ] **Step 2: Preview + Gesamtdurchsicht**

Run: `npm run preview -- --host` · `http://100.109.175.125:4173`
Prüfen: alle Sektionen, alle Anker-Links, mobile Ansicht, keine alten Farben/Texte, kein „Privatpersonen/Lebensberatung", keine toten Links.

- [ ] **Step 3: Lighthouse**

Im Browser (DevTools → Lighthouse) für die Preview-URL ausführen.
Expected: SEO ≥ 95, Best Practices ≥ 95, Accessibility ≥ 90.

- [ ] **Step 4: Structured Data final prüfen**

`dist/index.html` — beide JSON-LD-Blöcke (ProfessionalService, FAQPage) im [Schema-Validator](https://validator.schema.org/) → keine Errors.

- [ ] **Step 5: Verifikation per webapp-testing/Playwright**

Mit dem `webapp-testing`-Skill die Preview laden: Screenshot Desktop + Mobile, Konsole auf Fehler prüfen.

- [ ] **Step 6: Abschluss-Commit**

```bash
git add -A
git commit -m "chore: Homepage-Relaunch abgeschlossen — Build, SEO, Verifikation"
```

- [ ] **Step 7: Branch abschließen** — über das `superpowers:finishing-a-development-branch`-Skill (Merge/PR-Entscheidung mit Michael). Deployment/DNS ist ein **separater** Schritt (nicht Teil dieses Plans).

---

## Offene Punkte (vor Live-Gang, nicht blockierend für die Implementierung)

- **GISA-Zahl** und finale Impressum-Daten von Silke bestätigen lassen (Platzhalter `[[ ... ]]` in Task 11).
- **Datenschutz**: Entscheidung Google Fonts self-hosten (Task 13, Step 4) oder Hinweis belassen.
- **Portraitfoto** `silke-portrait.jpg` auf Auflösung/Eignung prüfen.
- **Deployment**: Die aktuell live geschaltete silkeburkhardt.at zeigt noch ältere Fremd-Inhalte — beim Deployment (separater Schritt, `homepage-manager`-Skill) berücksichtigen.
