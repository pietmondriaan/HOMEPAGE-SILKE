export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-cream">
      {/* Organic Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-32 w-[500px] h-[500px] bg-terra/[0.08] animate-blob"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-sage/[0.12] animate-blob"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] bg-gold/[0.08] animate-blob"
          style={{ animationDelay: '-8s' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 w-full pt-24 pb-12 lg:pt-28 lg:pb-16">
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="animate-fade-up">
            <p className="text-terra font-semibold text-sm tracking-widest uppercase mb-5">
              Systemische Beraterin · Supervisorin · Pädagogin
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.08] font-medium text-bark mb-6 tracking-tight">
              Klarheit schaffen.{' '}
              <span className="text-terra">Entwicklung</span>{' '}
              begleiten.
            </h1>
            <p className="text-bark-light text-lg lg:text-xl leading-relaxed max-w-xl mb-8">
              Ich unterstütze Fachkräfte und Teams durch Veränderungsprozesse,
              Konfliktfelder und Wachstumsphasen — mit systemischer Perspektive,
              fundierter Praxiserfahrung und echter Begeisterung für Entwicklung.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#kontakt"
                className="inline-flex items-center px-7 py-3.5 bg-terra text-white text-sm font-medium rounded-full hover:bg-terra-dark transition-all duration-300 hover:shadow-lg hover:shadow-terra/20 hover:-translate-y-0.5"
              >
                Erstgespräch vereinbaren
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#leistungen"
                className="inline-flex items-center px-7 py-3.5 text-bark text-sm font-medium rounded-full border border-bark/20 hover:border-terra hover:text-terra transition-all duration-300"
              >
                Leistungen entdecken
              </a>
            </div>
          </div>

          {/* Visual Element — Portrait */}
          <div className="flex justify-center order-first lg:order-last animate-fade-in mb-6 lg:mb-0" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="relative">
              <div className="w-64 h-72 sm:w-72 sm:h-80 lg:w-80 lg:h-96 overflow-hidden animate-blob shadow-2xl shadow-terra/20 ring-1 ring-sand-dark/20">
                <img
                  src="/silke-portrait.jpg"
                  alt="Silke Burkhardt — Systemische Beraterin, Supervisorin, Pädagogin"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-sage/25 rounded-full animate-float" />
              <div className="absolute -top-3 -right-3 w-14 h-14 bg-gold/20 rounded-full animate-float" style={{ animationDelay: '-3s' }} />
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-14 pt-8 border-t border-sand-dark/30">
          <div className="flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-3 text-sm text-bark-light/70">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              Diplomierte Supervisorin (ÖVS)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              Systemische Beraterin
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" />
              10+ Jahre Leitungserfahrung
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
        <span className="text-xs text-bark-light/50 tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-bark-light/30 to-transparent" />
      </div>
    </section>
  )
}
