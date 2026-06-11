import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'

export default function Contact() {
  const content = useContent()
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="kontakt" data-cms-section="kontakt" className="py-20 lg:py-28 bg-canvas relative overflow-hidden">

      {/* Blob-Dekorationen */}
      <div
        className="absolute -top-20 -right-20 w-[320px] h-[300px] bg-petrol/[0.08] pointer-events-none animate-blob-morph"
        style={{ borderRadius: '55% 45% 62% 38% / 45% 55% 45% 55%' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-[240px] h-[220px] bg-petrol/[0.06] pointer-events-none animate-blob-morph"
        style={{ borderRadius: '40% 60% 45% 55% / 55% 45% 60% 40%', animationDelay: '-6s' }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 lg:px-8 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="max-w-2xl mx-auto text-center">

          <p data-cms="contact.heading" className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-6">
            {content.contact.heading}
          </p>

          <h2
            className="font-serif font-normal text-azure leading-[1.12] mb-6"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            Lassen Sie uns ins Gespräch kommen.
          </h2>

          <p data-cms="contact.intro" className="text-ink text-base leading-[1.75] mb-10">
            {content.contact.intro}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left">

            {/* Telefon */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-line bg-surface">
              <div className="w-10 h-10 rounded-full bg-petrol/12 flex items-center justify-center shrink-0 text-petrol">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.21 2 2 0 014 .02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-ink-soft uppercase mb-0.5">Telefon</p>
                <a data-cms="contact.phone" href={"tel:" + content.contact.phone.replace(/\s/g, '')} className="text-ink hover:text-petrol transition-colors duration-[180ms] text-base font-normal">
                  {content.contact.phone}
                </a>
              </div>
            </div>

            {/* E-Mail */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-line bg-surface">
              <div className="w-10 h-10 rounded-full bg-petrol/12 flex items-center justify-center shrink-0 text-petrol">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-ink-soft uppercase mb-0.5">E-Mail</p>
                <a data-cms="contact.email" href={"mailto:" + content.contact.email} className="text-ink hover:text-petrol transition-colors duration-[180ms] text-base font-normal">
                  {content.contact.email}
                </a>
              </div>
            </div>

            {/* Einzugsgebiet */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-line bg-surface">
              <div className="w-10 h-10 rounded-full bg-petrol/12 flex items-center justify-center shrink-0 text-petrol">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-ink-soft uppercase mb-0.5">Einzugsgebiet</p>
                <p data-cms="contact.address" className="text-ink text-base font-normal">{content.contact.address}</p>
              </div>
            </div>

            {/* Öffnungszeiten — nur sichtbar, wenn gepflegt (via vavadmin) */}
            {content.contact.hours ? (
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-line bg-surface">
              <div className="w-10 h-10 rounded-full bg-petrol/12 flex items-center justify-center shrink-0 text-petrol">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-ink-soft uppercase mb-0.5">Öffnungszeiten</p>
                <p data-cms="contact.hours" className="text-ink text-base font-normal">{content.contact.hours}</p>
              </div>
            </div>
            ) : null}

            {/* Verfügbarkeit */}
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-line bg-surface">
              <div className="w-10 h-10 rounded-full bg-petrol/12 flex items-center justify-center shrink-0 text-petrol">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-wide text-ink-soft uppercase mb-0.5">Verfügbarkeit</p>
                <p className="text-ink text-base font-normal">Verfügbar ab Juni 2026 · Erstgespräch kostenlos &amp; unverbindlich</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
