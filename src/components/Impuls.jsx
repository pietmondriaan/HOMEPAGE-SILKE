import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'

// Heutiges Datum in Europe/Vienna als YYYY-MM-DD (en-CA liefert ISO-Format)
function todayVienna() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(new Date())
}

export default function Impuls() {
  const content = useContent()
  const [ref, isVisible] = useScrollAnimation()
  const aktuelles = content.aktuelles

  if (aktuelles.enabled === false) return null
  if (aktuelles.expires && todayVienna() > aktuelles.expires) return null

  return (
    <section id="aktuelles" data-cms-section="aktuelles" className="py-20 lg:py-28 bg-petrol-pale">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`animate-on-scroll bg-surface rounded-2xl border border-line p-10 lg:p-14 ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          <p data-cms="aktuelles.eyebrow" className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-5">
            {aktuelles.eyebrow}
          </p>

          <h2
            data-cms="aktuelles.heading"
            className="font-serif font-normal text-azure leading-[1.12] mb-6"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            {aktuelles.heading}
          </h2>

          <p data-cms="aktuelles.text" className="text-base leading-[1.75] text-ink mb-10 max-w-3xl">
            {aktuelles.text}
          </p>

          {aktuelles.image && (
            <img
              src={aktuelles.image}
              alt={aktuelles.heading}
              data-cms="aktuelles.image"
              className="w-full max-w-3xl h-auto rounded-2xl mb-10"
            />
          )}

          <a
            href="#kontakt"
            data-cms="aktuelles.cta_text"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium px-7 py-3.5 bg-petrol text-white rounded-full hover:bg-petrol-dark transition-colors duration-[180ms]"
          >
            {aktuelles.cta_text}
          </a>
        </div>
      </div>
    </section>
  )
}
