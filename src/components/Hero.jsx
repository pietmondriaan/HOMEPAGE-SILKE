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
            <p
              className="animate-fade-up font-sans text-[10px] font-semibold tracking-[0.2em] text-petrol uppercase mb-7"
              style={{ animationDelay: '0ms' }}
            >
              Supervision · Coaching · Teamentwicklung
            </p>

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

          {/* Portrait */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: '320ms' }}
          >
            <div className="relative w-[78%] max-w-sm mx-auto lg:w-full lg:max-w-none">
              <div
                className="w-full aspect-[4/5] bg-petrol-pale overflow-hidden animate-blob-morph"
                style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%' }}
              >
                <img
                  src="/silke-portrait.jpg"
                  alt="Mag. Silke Burkhardt"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full bg-petrol/15" aria-hidden="true" />
              <div className="absolute -top-3 -right-2 w-9 h-9 rounded-full bg-petrol/25" aria-hidden="true" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
