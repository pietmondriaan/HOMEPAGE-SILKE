// functions/preview/[[path]].js
// Serves the site with draft content for authenticated admins.
// Injects a fetch-override script into the HTML that returns draft content
// instead of the real /api/content response.
import { getSessionFromRequest } from '../_lib/session.js'
import { DEFAULT_CONTENT } from '../../src/content-schema.js'

export async function onRequest({ request, env }) {
  const session = await getSessionFromRequest(request, env.SESSION_SECRET)
  if (!session) return Response.redirect(new URL('/admin', request.url).toString(), 302)

  const id = env.CUSTOMER_ID
  const draft = await env.CONTENT_KV.get(`draft-${id}`, 'json') ?? DEFAULT_CONTENT

  // Fetch the site's index.html from static assets
  const url = new URL(request.url)
  url.pathname = '/'
  const siteRes = await env.ASSETS.fetch(new Request(url.toString(), { headers: request.headers }))
  const html = await siteRes.text()

  // Inject a script at the top of <head> that overrides /api/content with draft data
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
