// functions/_middleware.js — vis·à·vision Reichweiten-Beacon, zentral.
// Injiziert das anonyme, cookielose Beacon in JEDE HTML-Seite dieser Site,
// damit die vavadmin-Statistik den GESAMTEN Besuchertraffic erfasst.
// Vorschau-Aufrufe (Worker holt die Seite mit Header X-VAV-Bypass) werden
// bewusst NICHT mitgezählt. Fail-open: bei jedem Fehler unverändert ausliefern.
const CUSTOMER_ID = 'silke'

export async function onRequest(context) {
  const res = await context.next()
  try {
    if (context.request.headers.get('X-VAV-Bypass')) return res
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('text/html')) return res
    return new HTMLRewriter()
      .on('body', {
        element(el) {
          el.append(
            '<script defer src="https://media.vis-a-vision.com/beacon.js?c=' + CUSTOMER_ID + '"></script>',
            { html: true }
          )
        },
      })
      .transform(res)
  } catch (e) {
    return res
  }
}
