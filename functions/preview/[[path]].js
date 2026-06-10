// functions/preview/[[path]].js
// Serves the site with draft content for authenticated admins.
// Injects: (1) fetch-override that returns draft content, (2) selection
// tooling — click-select AND rectangle marking (Rechteck-Markierung).
// Labels/sections come from the canonical schema (src/content-schema.js).
import { getSessionFromRequest } from '../_lib/session.js'
import { mergeContent, FIELD_META, SECTION_META } from '../../src/content-schema.js'

export async function onRequest({ request, env }) {
  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) return Response.redirect(new URL('/vavadmin', request.url).toString(), 302)

  const id = env.CUSTOMER_ID
  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json')
  const live = draft ? null : await env.CONTENT_KV.get(`content-${id}`, 'json')
  const content = mergeContent(draft ?? live)

  const url = new URL(request.url)
  const origin = url.origin
  url.pathname = '/'
  const siteRes = await env.ASSETS.fetch(new Request(url.toString(), { headers: request.headers }))
  const html = await siteRes.text()

  const injection = `<script>
    window.__VIS_DRAFT_CONTENT__ = ${JSON.stringify(content)};
    const _origFetch = window.fetch;
    window.fetch = function(url, ...args) {
      if (typeof url === 'string' && url.includes('/api/content')) {
        return Promise.resolve(new Response(JSON.stringify(window.__VIS_DRAFT_CONTENT__), {
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return _origFetch(url, ...args);
    };

    (function() {
      var ORIGIN = ${JSON.stringify(origin)};
      var FIELD_META = ${JSON.stringify(FIELD_META)};
      var SECTION_META = ${JSON.stringify(SECTION_META)};
      var selectionMode = false;   // Klick-Auswahl
      var rectMode = false;        // Rechteck-Markierung
      var hoveredEl = null;
      var flashed = [];

      function normalizePath(p) {
        return String(p).split('.').map(function(s){ return /^[0-9]+$/.test(s) ? '*' : s; }).join('.');
      }
      function getLabel(key) {
        var meta = FIELD_META[normalizePath(key)];
        if (!meta) return key;
        var m = key.match(/\\.([0-9]+)\\./);
        return m ? meta.label + ' ' + (parseInt(m[1]) + 1) : meta.label;
      }
      function post(msg) { window.parent.postMessage(msg, ORIGIN); }

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
      function clearFlash() {
        flashed.forEach(function(el){ el.style.outline = ''; el.style.outlineOffset = ''; });
        flashed = [];
      }
      function flash(els, color) {
        clearFlash();
        els.forEach(function(el){
          el.style.outline = '2px solid ' + (color || '#16a34a');
          el.style.outlineOffset = '3px';
          flashed.push(el);
        });
        setTimeout(clearFlash, 2500);
      }

      // ---------- Rechteck-Markierung ----------
      var overlay = null, rectBox = null, hint = null;
      var dragStart = null;

      function buildOverlay() {
        overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483646;cursor:crosshair;touch-action:none;background:rgba(15,20,24,0.08);';
        rectBox = document.createElement('div');
        rectBox.style.cssText = 'position:fixed;display:none;border:2px solid #2563eb;background:rgba(37,99,235,0.10);border-radius:4px;pointer-events:none;z-index:2147483647;';
        hint = document.createElement('div');
        hint.textContent = 'Ziehe einen Rahmen um den Bereich, den du ändern möchtest — Esc bricht ab';
        hint.style.cssText = 'position:fixed;top:12px;left:50%;transform:translateX(-50%);background:#101418;color:#fff;font:13px/1.4 system-ui;padding:8px 14px;border-radius:999px;z-index:2147483647;pointer-events:none;box-shadow:0 4px 14px rgba(0,0,0,0.25);';
        overlay.appendChild(rectBox);
        document.body.appendChild(overlay);
        document.body.appendChild(hint);
        overlay.addEventListener('pointerdown', onDown);
        overlay.addEventListener('pointermove', onMove);
        overlay.addEventListener('pointerup', onUp);
        overlay.addEventListener('pointercancel', endRectMode);
      }
      function destroyOverlay() {
        if (overlay) { overlay.remove(); overlay = null; rectBox = null; }
        if (hint) { hint.remove(); hint = null; }
        dragStart = null;
      }
      function endRectMode() {
        rectMode = false;
        destroyOverlay();
        post({ type: 'VAS_RECT_MODE_ENDED' });
      }
      function onDown(e) {
        if (!e.isPrimary) return;
        dragStart = { x: e.clientX, y: e.clientY };
        overlay.setPointerCapture(e.pointerId);
      }
      function onMove(e) {
        if (!dragStart || !e.isPrimary) return;
        var r = rectFrom(dragStart, e);
        rectBox.style.display = 'block';
        rectBox.style.left = r.x + 'px'; rectBox.style.top = r.y + 'px';
        rectBox.style.width = r.w + 'px'; rectBox.style.height = r.h + 'px';
      }
      function onUp(e) {
        if (!dragStart || !e.isPrimary) return;
        var r = rectFrom(dragStart, e);
        dragStart = null;
        rectBox.style.display = 'none';
        if (r.w < 8 && r.h < 8) {
          // Zu kleiner Drag = Klick: bestehende Klick-Auswahl simulieren
          var el = findCms(document.elementFromPoint(r.x, r.y));
          endRectMode();
          if (el) sendClickSelection(el);
          return;
        }
        resolveRect(r);
      }
      function rectFrom(a, e) {
        var x = Math.min(a.x, e.clientX), y = Math.min(a.y, e.clientY);
        return { x: x, y: y, w: Math.abs(e.clientX - a.x), h: Math.abs(e.clientY - a.y) };
      }

      function intersect(r, b) {
        var x = Math.max(r.x, b.left), y = Math.max(r.y, b.top);
        var x2 = Math.min(r.x + r.w, b.right), y2 = Math.min(r.y + r.h, b.bottom);
        return (x2 > x && y2 > y) ? (x2 - x) * (y2 - y) : 0;
      }

      function resolveRect(r) {
        var rectArea = Math.max(r.w * r.h, 1);
        var vw = window.innerWidth, vh = window.innerHeight;
        var fields = [], sections = [];
        document.querySelectorAll('[data-cms]').forEach(function(el) {
          var b = el.getBoundingClientRect();
          if (!b.width || !b.height) return;
          var inter = intersect(r, b);
          if (!inter) return;
          fields.push(cand(el, el.dataset.cms, 'field', inter, b, rectArea));
        });
        document.querySelectorAll('[data-cms-section]').forEach(function(el) {
          var b = el.getBoundingClientRect();
          if (!b.width || !b.height) return;
          var inter = intersect(r, b);
          if (!inter) return;
          sections.push(cand(el, el.dataset.cmsSection, 'section', inter, b, rectArea));
        });

        var hitFields = fields.filter(function(c){ return c.coverage >= 0.6; });
        var result, resolution;

        if (r.w * r.h > 0.7 * vw * vh) {
          // Rechteck fast ganze Seite
          var best = sections.sort(function(a,b){ return b.focus - a.focus; })[0];
          resolution = 'too_large';
          result = best ? [best] : [];
        } else if (hitFields.length) {
          // Eltern-Kind-Regel: Felder gewinnen, wenn alle in einer Sektion liegen
          // und die Sektion selbst nicht großflächig gemeint war
          var sec = sections.filter(function(s){ return s.coverage >= 0.5; })
                            .sort(function(a,b){ return b.coverage - a.coverage; })[0];
          if (sec && hitFields.length > 3) {
            result = [sec]; resolution = 'unique';
          } else if (hitFields.length > 5) {
            var bySec = sections.sort(function(a,b){ return b.focus - a.focus; })[0];
            result = bySec ? [bySec] : hitFields.slice(0, 5);
            resolution = 'ambiguous';
          } else {
            result = hitFields.sort(function(a,b){ return b.coverage - a.coverage; });
            resolution = result.length === 1 ? 'unique' : 'multiple';
          }
        } else {
          // Kein Feld voll getroffen → bester focus-Kandidat als Vorschlag
          var pool = fields.concat(sections).filter(function(c){ return c.focus >= 0.4; })
                           .sort(function(a,b){ return b.focus - a.focus; });
          if (pool.length) { result = pool.slice(0, 2); resolution = 'ambiguous'; }
          else { result = []; resolution = 'none'; }
        }

        // Editierbarkeit von Sektionen mitgeben
        result.forEach(function(c) {
          if (c.kind === 'section') {
            var sm = SECTION_META[c.path] || {};
            c.label = sm.label || c.path;
            c.editable = sm.editable !== false;
          } else {
            c.editable = true;
          }
        });

        flash(result.map(function(c){ return c.el; }), resolution === 'none' ? '#dc2626' : '#16a34a');
        post({
          type: 'VAS_RECT_SELECTED',
          resolution: resolution,
          rect: { x: r.x, y: r.y, w: r.w, h: r.h, viewport: { w: vw, h: vh } },
          candidates: result.map(function(c) {
            return { path: c.path, kind: c.kind, label: c.label, text: c.text,
                     coverage: +c.coverage.toFixed(2), focus: +c.focus.toFixed(2), editable: c.editable };
          }),
        });
        endRectMode();
      }
      function cand(el, path, kind, inter, b, rectArea) {
        var elArea = Math.max(b.width * b.height, 1);
        return {
          el: el, path: path, kind: kind,
          label: kind === 'field' ? getLabel(path) : path,
          text: (el.textContent || '').trim().substring(0, 80),
          coverage: inter / elArea, focus: inter / rectArea,
        };
      }

      function sendClickSelection(target) {
        var field = target.dataset.cms;
        var text = target.textContent.trim().substring(0, 80);
        post({ type: 'VAS_SELECTED', field: field, label: getLabel(field), text: text });
      }

      // ---------- Steuerung vom Admin ----------
      window.addEventListener('message', function(e) {
        if (e.origin !== ORIGIN || !e.data) return;
        if (e.data.type === 'VAS_SELECTION_MODE') {
          selectionMode = e.data.enabled;
          document.body.style.cursor = selectionMode ? 'crosshair' : '';
          if (!selectionMode) setHover(null);
        }
        if (e.data.type === 'VAS_RECT_MODE') {
          if (e.data.enabled && !rectMode) { rectMode = true; buildOverlay(); }
          else if (!e.data.enabled && rectMode) { rectMode = false; destroyOverlay(); }
        }
        if (e.data.type === 'VAS_HIGHLIGHT_SECTION') {
          var el = document.querySelector('[data-cms-section="' + e.data.section + '"]');
          if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); flash([el]); }
        }
        if (e.data.type === 'VAS_SCROLL_TO_FIELD') {
          var sel = '[data-cms="' + e.data.field + '"]';
          var el2 = document.querySelector(sel);
          if (!el2) {
            var norm = normalizePath(e.data.field).split('.')[0];
            el2 = document.querySelector('[data-cms-section="' + norm + '"]');
          }
          if (el2) { el2.scrollIntoView({ behavior: 'smooth', block: 'center' }); flash([el2]); }
        }
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && rectMode) endRectMode();
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
        sendClickSelection(target);
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
