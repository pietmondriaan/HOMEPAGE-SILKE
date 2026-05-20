# Design-Spec — Homepage-Relaunch Silke Burkhardt

**Datum:** 2026-05-20
**Projekt:** silkeburkhardt.at (Repo `HOMEPAGE-SILKE`, `pietmondriaan/HOMEPAGE-SILKE`)
**Ansatz:** A — Marken- & Inhalts-Relaunch auf bestehender technischer Basis

---

## 1. Ziel & Ausgangslage

Silke Burkhardt gründet zum **15.06.2026** ein Einzelunternehmen für Supervision,
Coaching und Teamentwicklung. Die bestehende One-Pager-Website trägt noch eine
**veraltete, zu breite Positionierung** (u. a. „Lebensberatung für Privatpersonen",
persönlicher Ton, Salbeigrün-Design ohne Bezug zum neuen Logo).

Dieser Relaunch richtet die Website auf die **neue Positionierung** aus:
fokussiert, **B2B**, fachlich — abgeleitet aus drei Quellen (neue Signatur/Logo,
Ausschreibung vom 20.05.2026, Businessplan vom 07.05.2026).

**Kein technischer Neuaufbau:** Vite + React 18 + Tailwind bleiben. Erneuert werden
Design-Tokens, sämtliche Inhalte, die Angebots-Struktur; neu hinzu kommen FAQ-,
Impressum- und Datenschutz-Sektionen sowie ein SEO/KI-Layer.

## 2. Positionierung (der neue „Punkt")

- **Marke:** Mag. Silke Burkhardt — *Supervision · Coaching · Teamentwicklung*
- **Untertitel:** Sozial- und Integrationspädagogin
- **Zielgruppe:** Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern;
  Träger der ambulanten und stationären Kinder- und Jugendhilfe sowie
  Bildungseinrichtungen (Kindergärten, Kitas, Horte, Schulen). **B2B.**
- **Region:** Kärnten und Steiermark.
- **Verfügbar:** ab Juni 2026.
- **USP:** 24 Jahre Praxis, 2016–2026 Leiterin dreier intensiver Betreuungs-
  settings; bewusster Wechsel aus der Anstellung in die selbstbestimmte
  Tätigkeit. Kombination aus fundierter Aus-/Weiterbildung und Leitungserfahrung.
- **Haltung:** haltungs- und ressourcenorientiert; Fachlichkeit und Persönlichkeit
  gleichrangig; Ziel = Orientierung und Handlungssicherheit in komplexen
  Arbeitskontexten.

**Begrifflichkeit:** „Teamentwicklung" (nicht „Organisationsentwicklung") —
konsistent mit Logo und Ausschreibung. Entscheidung Michael 20.05.2026.

## 3. Design-System (festgelegt)

| Rolle | Wert |
|---|---|
| Hintergrund (Seite) | `#F1F7F7` — sehr blasses Azurblau |
| Flächen / Karten | `#FFFFFF` |
| Markenfarbe (Petrol) | `#318F9A` — Logo-Farbe |
| Überschriften | `#1C4654` — dunkles Azurblau |
| Fließtext | `#43403C` — dunkles Grau |
| Sekundärtext | `#5F6B6D` |
| Rahmen / Linien | `#E2EAEB`, `#EAF1F1` |

- **Kein reines Schwarz**, kein Salbeigrün, kein Terrakotta mehr.
- **Schriften:** `Cardo` (Serif) für Name/Logo-Wortmarke und Überschriften ·
  `League Spartan` (geom. Sans) für Labels, Navigation, Buttons. Beides Google Fonts.
- **Logo:** `material-aktenkoffer/logo silke.jpg` einbinden (Petrol-Blob).
- Organische Blob-Formen bleiben (passen zum Logo), eingefärbt in Petrol-Tönen.

Die Tokens werden zentral in `tailwind.config.js` + `src/index.css` gesetzt;
keine Hardcodes in Komponenten.

## 4. Seitenstruktur (One-Pager, 9 Sektionen)

### 1 — Navigation (sticky)
Logo „Silke Burkhardt" (Cardo) · Menü (League Spartan): Angebot · Über mich ·
Arbeitsweise · FAQ · Kontakt · Button „Erstgespräch". Backdrop-Blur, mobil als
Burger-Menü.

### 2 — Hero
- Eyebrow: `SUPERVISION · COACHING · TEAMENTWICKLUNG`
- Headline (Cardo, Entwurf): „Orientierung und Handlungssicherheit — für Teams
  und Leitungen in der sozialen Arbeit."
- Subtext (Entwurf): haltungs- und ressourcenorientierte Begleitung für Fach-
  und Führungskräfte in betreuungsintensiven Arbeitsfeldern, Kärnten & Steiermark.
- CTAs: „Erstgespräch vereinbaren" (primär) · „Meine Angebote" (sekundär).
- Credentials-Zeile: Mag. Silke Burkhardt · Sozial- und Integrationspädagogin ·
  24 Jahre Praxis · Kärnten & Steiermark · verfügbar ab Juni 2026.

### 3 — Angebot
Fünf Leistungen, 1:1 aus der Ausschreibung:
1. **Einzel- & Teamsupervision**
2. **Coaching für Fach- & Führungskräfte**
3. **Fachliche Begleitung** in komplexen Fallsituationen — (Wieder-)Herstellung
   von Handlungssicherheit
4. **Konzept- & Prozessbegleitung**
5. **Workshops & Klausurbegleitung** — Halb- und Tagesformate zu Fachthemen

Layout: Karten-Raster, das 5 Elemente sauber trägt (z. B. 3+2 oder eine
listenartige Anordnung). „Lebensberatung / Für Privatpersonen" entfällt.

### 4 — Über mich
Profil aus dem Businessplan: 24 Jahre im sozialpädagogischen Bereich, 2016–2026
Leiterin dreier intensiver Betreuungssettings; Fokus auf Mitarbeiter*innen-
entwicklung und Kinderschutz; bewusster Schritt in die Selbstständigkeit.
Portraitfoto (`material-aktenkoffer/silke-portrait.jpg`, in Blob-Maske).
Qualifikationen: Mag.; Gewerbeberechtigungen Lebens- & Sozialberatung (LSB) und
Unternehmensberatung (UB); Sozial- und Integrationspädagogin.

### 5 — Arbeitsweise
Haltungs- und ressourcenorientiert; tragfähige Lösungen für alle Beteiligten;
Fachlichkeit und Persönlichkeit gleichrangig; gute Anschlussfähigkeit durch
eigene Praxiserfahrung.

### 6 — Aktueller Impuls (saisonal)
Hervorgehobener, zeitlich begrenzter Block: **„Abschließen, Ordnen, Neu
ausrichten"** — das Angebot zum Ende des Arbeitsjahres aus der Ausschreibung.
Technisch so gebaut, dass er über ein Flag/eine Konstante leicht **abschaltbar
oder austauschbar** ist (kommende saisonale Impulse).

### 7 — FAQ (neu)
6–8 echte Fragen — zugleich Vertrauens-Element und Basis der KI-/SEO-Auffind-
barkeit. Entwurf:
- In welcher Region bieten Sie Supervision und Coaching an? *(Kärnten & Steiermark)*
- Ab wann sind Sie verfügbar? *(ab Juni 2026)*
- Für wen ist Ihr Angebot gedacht? *(Fach- & Führungskräfte, Träger der KJH,
  Bildungseinrichtungen)*
- Sind Supervisionen für Träger verpflichtend? *(In der ambulanten/stationären
  Kinder- und Jugendhilfe sind Supervision, Fortbildungen und Klausuren i. d. R.
  konzeptionell festgeschrieben und trägerfinanziert; die Teilnahme wird von
  Abt. 6 der Kärntner Landesregierung im Rahmen von Fachaufsichten überprüft.)*
- Finden Supervisionen vor Ort statt? *(Teamsettings i. d. R. in den
  Einrichtungen; Einzelsettings in Klagenfurt)*
- Was unterscheidet Ihr Angebot? *(24 Jahre Praxis + Leitungserfahrung)*
- Wie läuft der Erstkontakt ab? *(kurzes, unverbindliches Erstgespräch)*

### 8 — Kontakt
Kein Formular. Telefon **+43 680 2193 868** (`tel:`-Link) und E-Mail
**si.burkhardt@outlook.com** (`mailto:`-Link) prominent, plus Einzugsgebiet
und Hinweis „verfügbar ab Juni 2026".

### 9 — Footer + Impressum & Datenschutz
Footer mit Kurz-Navigation. **Impressum** (ECG §5) und **Datenschutzerklärung**
(DSGVO) als eigene Bereiche/Unterseiten — gesetzlich verpflichtend für eine
österreichische Unternehmenswebsite.

## 5. SEO- & KI-Konzept (volle Stufe — „SEO + KI/AEO")

**Technisches Fundament:** sprechender `<title>`, Meta-Description, Open-Graph- +
Twitter-Card-Tags, Favicon, `lang="de-AT"`, semantische HTML5-Struktur, saubere
Überschriften-Hierarchie (genau ein `h1`), Alt-Texte, `sitemap.xml`, `robots.txt`,
gute Performance (Lighthouse), Barrierefreiheits-Basis.

**Structured Data (JSON-LD):**
- `ProfessionalService` — Name, `areaServed` Kärnten + Steiermark, Leistungs-
  katalog, Gründerin, Kontakt.
- `FAQPage` — alle FAQ-Einträge maschinenlesbar.
- `Person` — Mag. Silke Burkhardt, Qualifikationen.

**Content-/Keyword-Ausrichtung:** Texte an realen Suchbegriffen der Zielgruppe
orientiert (z. B. „Supervision Kärnten", „Teamsupervision Kinder- und Jugend-
hilfe", „Coaching Führungskräfte Sozialbereich", „Supervisorin Klagenfurt") —
ohne Keyword-Stuffing, Ton bleibt fachlich.

**KI/AEO:** `llms.txt` im Root; FAQ als sauberes Frage-Antwort-Format; klar
zitierfähige, faktische Aussagen (Region, Verfügbarkeit, Leistungen), damit
ChatGPT, Perplexity und Google AI Overviews die Inhalte korrekt wiedergeben.

## 6. Technik

- **Stack:** Vite + React 18 + Tailwind CSS 3 — unverändert.
- **Design-Tokens:** zentral in `tailwind.config.js` + `src/index.css`.
- **Fonts:** Cardo + League Spartan via Google Fonts (`index.html`-Link oder
  self-hosted; Entscheidung im Implementierungsplan).
- **Kontakt:** kein Backend, kein Formular — `tel:`/`mailto:`-Links genügen.
- **Hosting:** statisch (bestehendes Setup). Deployment/DNS = eigener Schritt,
  nicht Teil dieser Spec.

## 7. Aufräumen (Auftrag f)

Die **veraltete Dublette** des Vite-Projekts direkt in
`06 Web & Software/silkeburkhardt.at/` (lose `src/`, `dist/`, `node_modules/`,
`package.json` etc., Stand 17.04.) wird **gelöscht**. Erhalten bleiben:
`HOMEPAGE-SILKE/` (das Repo) und `material-aktenkoffer/` (Design-Assets).
Vor dem Löschen: byte-genaue Prüfung, dass nichts Einzigartiges nur in der
Dublette liegt.

## 8. Offene Punkte / Platzhalter

- **Impressum-Daten:** Mag. Silke Ursula Burkhardt, St. Michael ob Bleiburg
  130/1, 9143 St. Michael ob Bleiburg; Gewerbe seit 16.07.2020 (Unternehmens-
  beratung + Lebens-/Sozialberatung). **GISA-Zahl noch zu beschaffen** (Silke /
  FirmenABC / gisa.gv.at). Gewerbe lt. Businessplan derzeit *stillgelegt* —
  Reaktivierung zur Gründung; finale Daten von Silke bestätigen lassen.
- **Datenschutzerklärung:** Inhalt zu erstellen; da keine Formulare/Tracking
  geplant, schlank haltbar.
- **Portraitfoto:** `silke-portrait.jpg` vorhanden — Eignung/Auflösung prüfen.
- **Beobachtung:** Die aktuell unter silkeburkhardt.at live geschaltete Seite
  zeigt noch ältere Fremd-Inhalte („Wir finden gemeinsam Ihren roten Faden") —
  beim späteren Deployment zu berücksichtigen.

## 9. Nicht im Scope

- Deployment, DNS, Domain-Umstellung (separater Schritt / `homepage-manager`).
- Finale Rechtstexte Impressum/Datenschutz (brauchen Silkes bestätigte Daten).
- Mehrsprachigkeit, Blog, Buchungssystem.

## 10. Erfolgskriterien

- Website spiegelt die B2B-Positionierung wider; keine „Privatpersonen"-Inhalte mehr.
- Marke (Farben, Cardo/League Spartan, Logo) konsistent zum neuen Logo.
- Alle 9 Sektionen vorhanden und inhaltlich aus den Quelldokumenten gedeckt.
- `npm run build` läuft fehlerfrei; Lighthouse SEO + Best Practices ≥ 95.
- Structured Data valide (Rich Results Test); `llms.txt`, `sitemap.xml`,
  `robots.txt` vorhanden.
- Veraltete Dublette entfernt.
