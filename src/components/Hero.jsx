export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas">

      {/* dezente Blob-Dekoration hinter dem Text */}
      <div
        className="absolute -top-28 -right-32 w-[460px] h-[460px] bg-petrol/[0.06] animate-blob-morph pointer-events-none"
        style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-12 lg:pt-36 lg:pb-20">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-8 lg:gap-16 items-center">

          {/* Silke — auf Desktop links, mobil unter dem Text */}
          <div
            className="animate-fade-up order-2 lg:order-1"
            style={{ animationDelay: '300ms' }}
          >
            <div className="relative mx-auto w-[270px] sm:w-[330px] lg:w-full lg:max-w-[400px]">
              {/* Petrol-Blob als Markenfläche, in die die Figur übergeht */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[106%] h-[84%] bg-petrol animate-blob-morph"
                style={{
                  borderRadius: '58% 42% 45% 55% / 55% 52% 48% 45%',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)',
                  maskImage:
                    'linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)',
                }}
                aria-hidden="true"
              />
              <div
                className="absolute -left-3 top-1/3 w-10 h-10 rounded-full bg-petrol/20"
                aria-hidden="true"
              />
              {/* freigestellte Figur — unten weich auslaufend, kein harter Schnitt, kein Schatten */}
              <img
                src="/silke-hero.png"
                alt="Mag. Silke Burkhardt — Supervisorin, Coach und Teamentwicklerin"
                className="relative z-10 w-full h-auto"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to bottom, #000 0%, #000 70%, transparent 97%)',
                  maskImage:
                    'linear-gradient(to bottom, #000 0%, #000 70%, transparent 97%)',
                }}
              />
            </div>
          </div>

          {/* Text — auf Desktop rechts, mobil oben */}
          <div className="order-1 lg:order-2">
            <span
              className="animate-fade-up inline-block text-xs uppercase tracking-[0.16em] text-petrol font-sans font-medium mb-4"
              style={{ animationDelay: '0ms' }}
            >
              Supervision & Coaching · Kärnten & Steiermark
            </span>

            <h1
              className="animate-fade-up font-serif font-normal leading-[1.1] tracking-[-0.02em] text-azure mb-6"
              style={{
                fontSize: 'clamp(2.2rem, 3.2vw, 3.35rem)',
                animationDelay: '80ms',
                textWrap: 'balance',
              }}
            >
              Orientierung und Handlungssicherheit — für Teams und Leitungen in der sozialen Arbeit.
            </h1>

            <p
              className="animate-fade-up text-base lg:text-lg font-light leading-[1.7] text-ink-soft mb-8 max-w-xl"
              style={{ animationDelay: '160ms' }}
            >
              Supervision, Coaching und Teamentwicklung für Fach- und Führungskräfte in
              betreuungsintensiven Arbeitsfeldern. Haltungs- und ressourcenorientiert,
              getragen von 24 Jahren Praxis- und Leitungserfahrung.
            </p>

            <div
              className="animate-fade-up flex flex-wrap gap-3.5"
              style={{ animationDelay: '240ms' }}
            >
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-petrol text-white font-sans text-sm font-medium rounded-full hover:bg-petrol-dark transition-colors duration-[180ms]"
              >
                Erstgespräch vereinbaren
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 7.5h11M9 3l4 4.5-4 4.5" />
                </svg>
              </a>
              <a
                href="#angebot"
                className="inline-flex items-center px-7 py-3.5 text-ink font-sans text-sm font-medium rounded-full border border-line hover:border-petrol hover:text-petrol transition-colors duration-[180ms]"
              >
                Meine Angebote
              </a>
            </div>

            <div
              className="animate-fade-in mt-11 pt-6 border-t border-line/60 flex flex-wrap gap-x-6 gap-y-2.5"
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
                  className="font-sans text-xs text-ink-soft/70 tracking-wide flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-petrol/60 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
