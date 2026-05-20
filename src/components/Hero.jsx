export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-canvas">

      {/* Blob-Dekorationen */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[580px] h-[540px] bg-petrol/[0.13] animate-blob-morph pointer-events-none"
        style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-32 w-[320px] h-[300px] bg-petrol/[0.08] animate-blob-morph pointer-events-none"
        style={{ borderRadius: '38% 62% 52% 48% / 45% 55% 45% 55%', animationDelay: '-5s' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 lg:pt-44 lg:pb-32">
        <div className="max-w-[760px]">

          {/* Eyebrow */}
          <p
            className="animate-fade-up font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-10"
            style={{ animationDelay: '0ms' }}
          >
            Supervision · Coaching · Teamentwicklung
          </p>

          {/* Display-Headline */}
          <h1
            className="animate-fade-up font-serif font-normal leading-[1.06] tracking-[-0.02em] text-azure mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              animationDelay: '80ms',
              textWrap: 'balance',
            }}
          >
            Orientierung und Handlungssicherheit — für Teams und Leitungen in der sozialen Arbeit.
          </h1>

          {/* Subtext */}
          <p
            className="animate-fade-up text-lg lg:text-xl font-light leading-[1.7] text-ink-soft max-w-xl mb-11"
            style={{ animationDelay: '160ms' }}
          >
            Supervision, Coaching und Teamentwicklung für Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern. Haltungs- und ressourcenorientiert, getragen von 24 Jahren Praxis- und Leitungserfahrung.
          </p>

          {/* Call-to-Action */}
          <div
            className="animate-fade-up flex flex-wrap gap-4"
            style={{ animationDelay: '240ms' }}
          >
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-petrol text-white text-sm font-medium rounded-full hover:bg-petrol-dark transition-colors duration-[180ms]"
            >
              Erstgespräch vereinbaren
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 7.5h11M9 3l4 4.5-4 4.5" />
              </svg>
            </a>
            <a
              href="#angebot"
              className="inline-flex items-center px-7 py-3.5 text-ink text-sm font-medium rounded-full border border-line hover:border-petrol hover:text-petrol transition-colors duration-[180ms]"
            >
              Meine Angebote
            </a>
          </div>

          {/* Credentials */}
          <div
            className="animate-fade-in mt-16 pt-7 border-t border-line/50 flex flex-wrap gap-6"
            style={{ animationDelay: '420ms' }}
          >
            {[
              'Mag. Silke Burkhardt',
              'Sozial- und Integrationspädagogin',
              'Kärnten & Steiermark',
              'Verfügbar ab Juni 2026',
            ].map((item) => (
              <span
                key={item}
                className="text-xs text-ink-soft/55 tracking-wide flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-petrol/50 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
