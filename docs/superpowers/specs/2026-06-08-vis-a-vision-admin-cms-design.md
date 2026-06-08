# Vis-à-Vision Admin CMS — Design Spec
**Datum:** 2026-06-08  
**Projekt:** silkeburkhardt.at (Pilot #1), dann cafemitherz.at (Pilot #2), dann DACH-Rollout  
**Eigentümer:** Michael Pietrowski / Vis-à-Vision  
**Status:** Approved

---

## 1. Ziel

Ein **multi-tenant Chat-CMS** das es Kleinbetrieben ermöglicht, ihre Website per natürlichsprachiger Texteingabe selbst zu pflegen — ohne Technik-Kenntnisse. Jede Kundensite bekommt eine passwortgeschützte `/admin`-Route. Michael betreibt alle Sites zentral über seinen Cloudflare- und Gemini-Account.

---

## 2. Scope

**In Scope (Pilot):**
- Admin-Panel mit Chat + Live-Vorschau (Zwei-Phasen: Draft → Publish)
- Datei-Upload: JPG, PNG, WebP, PDF, DOCX, TXT
- Rate-Limiting: 20 Previews/Tag, 10 Publishes/Tag pro Kunde
- Master-Passwort für Michael (kein Limit)
- Adapter für bestehende Vite+React-Site (Silke)
- Astro-Template für neue Kunden (Olli+)

**Out of Scope (Phase 2):**
- Klick-auf-Element-Editing (WYSIWYG)
- Kunden-Dashboard über mehrere Sites
- Automatische Rechnungsstellung
- Subdomain-Routing über vis-a-vision.com

---

## 3. Architektur

### 3.1 Übersicht

```
Cloudflare Account (Michael)
│
├── Gemini Flash 2.0 API Key (central, ~15 €/100 Kunden/Mo.)
│
└── Pro Kundensite:
    ├── Cloudflare Pages Project
    │   ├── /            → Public Site (liest Published-JSON aus KV)
    │   └── /admin       → Pages Function: Admin CMS
    ├── Cloudflare KV Namespace
    │   ├── content-{id}          Published content JSON
    │   ├── draft-{id}            Draft content JSON (Vorschau)
    │   └── limit-{id}-{date}     Daily rate limit counters
    └── Cloudflare R2 Bucket
        └── uploads/{id}/         Bilder und Dateien
```

### 3.2 Pro-Kunde-Config (Environment Variables im Pages Project)

```
CUSTOMER_ID=silke
CUSTOMER_PASSWORD=<hash>
MASTER_PASSWORD_HASH=<hash>          # gleich für alle Sites
GEMINI_API_KEY=<key>                 # gleich für alle Sites
KV_BINDING=CONTENT_KV
R2_BINDING=UPLOADS_R2
PREVIEW_LIMIT_PER_DAY=20
PUBLISH_LIMIT_PER_DAY=10
```

---

## 4. Admin-Panel (`/admin`)

### 4.1 Layout

Split-Screen:
- **Links (60%):** iFrame zeigt Draft-Preview der Site (lädt aus `/preview`-Endpoint)
- **Rechts (40%):** Chat-Interface

Header-Bar:
- Logo + Kundenname
- Badge: "Vorschau: N übrig" (gelb)
- Badge: "Veröffentlichen: N übrig" (grün)

Footer der Preview-Seite:
- `[✓ Jetzt veröffentlichen (N übrig)]` (grün, deaktiviert bei Limit=0)
- `[✗ Verwerfen]`

### 4.2 Chat-Interface

- Texteingabe + Senden-Button
- Datei-Drag-&-Drop-Zone über dem Input
- Akzeptierte Formate: `.jpg .jpeg .png .webp .pdf .docx .txt`
- Chat-Historie in der Session (kein persistentes Chat-Log)
- Freundliche Fehlermeldung bei Limit-Erreichen:
  > "Du hast heute 20 Vorschauen genutzt. Morgen früh hast du wieder 20 zur Verfügung."

### 4.3 Authentifizierung

- Single-page Password-Gate vor dem Admin-Panel
- `bcryptjs`-Hash-Vergleich im Worker, Rounds=10 (Cloudflare Workers CPU-Limit: max 50ms — bcryptjs mit 10 Rounds liegt darunter)
- Session: `HttpOnly`-Cookie mit 8h TTL, signiert mit `MASTER_PASSWORD_HASH` als Secret
- Master-Passwort: gleicher Login-Flow, aber Worker setzt `isMaster=true` im Session-Cookie → Rate-Limits werden übersprungen

---

## 5. Content-Flow (Zwei-Phasen)

### Phase 1: Preview

```
[User tippt] → POST /admin/chat
    → Rate-Limit-Check (preview counter in KV)
    → Gemini Flash API:
        system: "Du bist ein CMS. Übersetze den User-Input in ein JSON-Diff.
                 Gib NUR valides JSON zurück. Ändere nur genannte Felder."
        user: "<aktuelles content JSON>\n\nUser: <nachricht>"
    → JSON-Diff auf draft-{id} in KV anwenden
    → preview counter +1
    → Response: { ok: true, previewsLeft: N }
[Admin-JS empfängt Response → ruft previewIframe.contentWindow.location.reload() auf → zeigt Draft]
```

### Phase 2: Publish

```
[User klickt "Veröffentlichen"] → POST /admin/publish
    → Rate-Limit-Check (publish counter in KV)
    → draft-{id} → content-{id} kopieren
    → publish counter +1
    → Response: { ok: true, publishesLeft: N }
[iFrame lädt / (Public Site) neu → zeigt Live-Content]
```

### Verwerfen

```
POST /admin/discard
    → draft-{id} = content-{id} zurücksetzen
    → kein Counter-Increment
```

---

## 6. Content-Modell (JSON-Schema)

```json
{
  "meta": {
    "business_name": "string",
    "tagline": "string",
    "primary_color": "#hex",
    "secondary_color": "#hex",
    "font": "string"
  },
  "hero": {
    "title": "string",
    "subtitle": "string",
    "cta_text": "string",
    "background_image": "r2://uploads/silke/hero.jpg"
  },
  "about": {
    "text": "string",
    "portrait_image": "r2://uploads/silke/portrait.jpg"
  },
  "services": [
    { "title": "string", "description": "string" }
  ],
  "contact": {
    "phone": "string",
    "email": "string",
    "address": "string"
  },
  "footer": {
    "imprint_text": "string",
    "privacy_text": "string"
  }
}
```

R2-Bucket ist **public** (kein Signed-URL-Ablauf). Worker gibt die direkte R2-Public-URL zurück (`https://pub-{hash}.r2.dev/uploads/{id}/file.jpg`). Dateinamen werden beim Upload mit einem zufälligen Prefix versehen (Kollisionsschutz).

---

## 7. Datei-Upload

```
[User droppt Datei] → POST /admin/upload (multipart)
    → Typ-Check (whitelist: jpg/png/webp/pdf/docx/txt)
    → Größen-Limit: 10 MB
    → Bilder (jpg/png/webp): direkt in R2 → URL ins Draft-JSON
    → Textdateien (pdf/docx/txt):
        → Text extrahieren (pdf-parse / mammoth.js / plain)
        → Extrahierten Text als Chat-Nachricht an Gemini senden
        → JSON-Diff → Draft
    → Response: { url: "r2://..." } oder { text: "..." }
```

---

## 8. Rate-Limiting-Implementierung

KV-Keys (TTL: 25h, wird täglich überschrieben):
```
limit-silke-2026-06-08-preview  = "17"
limit-silke-2026-06-08-publish  = "3"
```

Worker-Logik:
```javascript
const key = `limit-${customerId}-${today}-${type}`
const current = parseInt(await KV.get(key) ?? "0")
const max = type === "preview" ? PREVIEW_LIMIT : PUBLISH_LIMIT
if (!isMaster && current >= max) return 429
await KV.put(key, String(current + 1), { expirationTtl: 90000 })
```

---

## 9. Öffentliche Site — Content-Integration

### Silke (Vite+React, bestehende Site)

Neuer Hook `useContent(key)` in `src/hooks/useContent.js`:
```javascript
export function useContent() {
  const [content, setContent] = useState(null)
  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(setContent)
  }, [])
  return content
}
```

Pages Function `functions/api/content.js`:
```javascript
export async function onRequest({ env }) {
  const content = await env.CONTENT_KV.get('content-silke', 'json')
  return Response.json(content)
}
```

Jede Komponente (Hero, About, Services, …) ruft `useContent()` auf und rendert aus dem JSON statt hartkodierten Werten.

### Neue Kunden (Astro-Template)

Astro-Seiten nutzen `getStaticProps`-Äquivalent mit KV-Fetch im Build. Kein Runtime-Fetch nötig — Cloudflare rebuildet automatisch bei Publish (Deploy Hook).

> **Hinweis:** Für Astro-Kunden ist eine Rebuild-Verzögerung von ~30–60 Sek. nach Publish akzeptabel, da `wrangler pages deploy` triggert.

---

## 10. Preview-Endpoint

`/preview` = identisch wie `/` aber:
- Liest `draft-{id}` statt `content-{id}` aus KV
- Nur zugänglich mit gültigem Admin-Session-Cookie
- Zeigt "ENTWURF"-Badge (gelbes Banner, CSS `position: fixed`)

---

## 11. Account-Migration (Gmail → vis-a-vision.com)

Wenn vis-a-vision.com Google-Account bereit:
1. Neuen Gemini API Key unter Business-Account erstellen
2. In Cloudflare: `GEMINI_API_KEY` Secret updaten (wrangler secret put)
3. Kein Code-Change, kein Deployment nötig
4. Gilt für alle Sites gleichzeitig (gleicher Secret-Name)

---

## 12. Deployment-Workflow (neuer Kunde)

```bash
# 1. Template clonen
cp -r template-astro/ kunden-projekte/neuer-kunde/

# 2. content.json mit Scraper befüllen
node scripts/scrape.js https://alte-seite.at > content.json

# 3. KV + R2 anlegen, Secrets setzen
wrangler kv:namespace create "CONTENT_KV"
wrangler secret put CUSTOMER_PASSWORD
wrangler secret put CUSTOMER_ID

# 4. Deployen
wrangler pages deploy ./dist --project-name=neuer-kunde
```

---

## 13. Offene Entscheidungen (keine Blocker)

| Thema | Optionen | Empfehlung |
|---|---|---|
| Session-Bibliothek | jose / iron-session / custom | iron-session (einfach, Workers-kompatibel) |
| PDF-Extraktion | pdf-parse / pdfjs-dist | pdf-parse (leichtgewichtig) |
| DOCX-Extraktion | mammoth.js | mammoth.js (bewährt) |
| Astro-Rebuild-Trigger | Deploy Hook / Wrangler API | Cloudflare Deploy Hook |
