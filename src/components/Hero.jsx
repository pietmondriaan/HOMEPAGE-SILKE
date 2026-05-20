export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas">

      {/* Weicher Blob hinter dem Portrait */}
      <div
        className="absolute right-0 top-0 w-[640px] h-[640px] bg-petrol/[0.07] animate-blob-morph pointer-events-none hidden lg:block"
        style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%', transform: 'translate(26%, -14%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-32 w-[300px] h-[280px] bg-petrol/[0.06] animate-blob-morph pointer-events-none"
        style={{ borderRadius: '38% 62% 52% 48% / 45% 55% 45% 55%', animationDelay: '-5s' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="grid lg:grid-cols-[1.07fr_0.93fr] gap-12 lg:gap-16 items-center">

          {/* Textspalte */}
          <div>
            <img
              src="/logo-silke.png"
              alt="Silke Burkhardt — Supervision, Coaching & Teamentwicklung"
              className="animate-fade-up h-28 lg:h-32 w-auto mb-8"
              style={{ animationDelay: '0ms' }}
            />

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

          {/* Portrait — freigestellt vor Petrol-Blob */}
          <div
            className="animate-fade-up flex justify-center lg:justify-end"
            style={{ animationDelay: '320ms' }}
          >
            <div className="relative w-[260px] sm:w-[300px] lg:w-[350px]">
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[120%] aspect-square bg-petrol animate-blob-morph"
                style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%' }}
                aria-hidden="true"
              />
              <div className="absolute bottom-3 -left-4 w-14 h-14 rounded-full bg-petrol/20" aria-hidden="true" />
              <div className="absolute top-8 -right-3 w-8 h-8 rounded-full bg-petrol/30" aria-hidden="true" />
              <img
                src="/silke-hero.png"
                alt="Mag. Silke Burkhardt — Supervisorin, Coach und Teamentwicklerin"
                className="relative z-10 w-full h-auto drop-shadow-[0_20px_34px_rgba(28,70,84,0.20)]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
