// functions/preview/[[path]].js
// Serves the site with draft content for authenticated admins.
// Injects a fetch-override script into the HTML that returns draft content
// instead of the real /api/content response.
import { getSessionFromRequest } from '../_lib/session.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function onRequest({ request, env }) {
  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) return Response.redirect(new URL('/vavadmin', request.url).toString(), 302)

  const id = env.CUSTOMER_ID
  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT

  // Fetch the site's index.html from static assets
  const url = new URL(request.url)
  url.pathname = '/'
  const siteRes = await env.ASSETS.fetch(new Request(url.toString(), { headers: request.headers }))
  const html = await siteRes.text()

  // Inject a script at the top of <head> that overrides /api/content with draft data
  // and enables element selection mode via postMessage
  const injection = `<script>
    window.__VIS_DRAFT_CONTENT__ = ${JSON.stringify(draft)};
    const _origFetch = window.fetch;
    window.fetch = function(url, ...args) {
      if (typeof url === 'string' && url.includes('/api/content')) {
        return Promise.resolve(new Response(JSON.stringify(window.__VIS_DRAFT_CONTENT__), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return _origFetch(url, ...args);
    };

    // Element selection overlay
    (function() {
      var selectionMode = false;
      var hoveredEl = null;
      var LABELS = {
        'hero.eyebrow': 'Eyebrow-Text (Hauptbereich)',
        'hero.title': 'Haupttitel',
        'hero.subtitle': 'Untertitel',
        'hero.cta_text': 'Button-Text',
        'about.heading': 'Über-mich Abschnitt-Label',
        'about.text': 'Über-mich Text',
        'contact.heading': 'Kontakt Abschnitt-Label',
        'contact.intro': 'Kontakt Einleitungstext',
        'contact.phone': 'Telefonnummer',
        'contact.email': 'E-Mail-Adresse',
        'contact.address': 'Einzugsgebiet',
      };
      function getLabel(key) {
        if (LABELS[key]) return LABELS[key];
        var m = key.match(/^services\\.([0-9]+)\\.(.+)$/);
        if (m) { var n = parseInt(m[1])+1; var f = {eyebrow:'Eyebrow',title:'Titel',description:'Beschreibung'}[m[2]]||m[2]; return 'Leistung '+n+' — '+f; }
        m = key.match(/^services\\.([0-9]+)$/);
        if (m) return 'Leistung '+(parseInt(m[1])+1);
        return key;
      }
      function findCms(el) {
        while (el && el !== document.body) {
          if (el.dataset && el.dataset.cms) return el;
          el = el.parentElement;
        }
        return null;
      }
      function setHover(el) {
        if (hoveredEl === el) return;
        if (hoveredEl) { hoveredEl.style.outline = ''; hoveredEl.style.outlineOffset = ''; }
        hoveredEl = el;
        if (hoveredEl) { hoveredEl.style.outline = '2px solid #2563eb'; hoveredEl.style.outlineOffset = '3px'; }
      }
      window.addEventListener('message', function(e) {
        if (!e.data || e.data.type !== 'VAS_SELECTION_MODE') return;
        selectionMode = e.data.enabled;
        document.body.style.cursor = selectionMode ? 'crosshair' : '';
        if (!selectionMode) setHover(null);
      });
      document.addEventListener('mouseover', function(e) {
        if (selectionMode) setHover(findCms(e.target));
      });
      document.addEventListener('mouseout', function(e) {
        if (!selectionMode) return;
        var rel = e.relatedTarget ? findCms(e.relatedTarget) : null;
        if (rel !== hoveredEl) setHover(rel);
      });
      document.addEventListener('click', function(e) {
        if (!selectionMode) return;
        var target = findCms(e.target);
        if (!target) return;
        e.preventDefault(); e.stopPropagation();
        var field = target.dataset.cms;
        var text = target.textContent.trim().substring(0, 80);
        window.parent.postMessage({ type: 'VAS_SELECTED', field: field, label: getLabel(field), text: text }, '*');
        selectionMode = false;
        document.body.style.cursor = '';
        setHover(null);
      }, true);
    })();
  </script>`

  const modified = html.replace('<head>', '<head>' + injection)
  return new Response(modified, {
    headers: {
      'Content-Type': 'text/html',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
    },
  })
}
