export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Organic Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-32 w-[500px] h-[500px] bg-terra/[0.07] animate-blob"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-sage/[0.1] animate-blob"
          style={{ animationDelay: '-4s' }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] bg-gold/[0.06] animate-blob"
          style={{ animationDelay: '-8s' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 w-full pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-[1fr,0.8fr] gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="animate-fade-up">
            <p className="text-terra font-medium text-sm tracking-widest uppercase mb-6">
              Systemische Beraterin · Supervisorin · Pädagogin
            </p>
            <h1 className="font-serif text-[2.75rem] sm:text-5xl lg:text-[3.5rem] xl:text-6xl leading-[1.1] font-medium text-bark mb-8 tracking-tight">
              Klarheit schaffen.{' '}
              <span className="text-terra">Entwicklung</span>{' '}
              begleiten.
            </h1>
            <p className="text-bark-light text-lg lg:text-xl leading-relaxed max-w-xl mb-10">
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
                className="inline-flex items-center px-7 py-3.5 text-bark text-sm font-medium rounded-full border border-sand-dark hover:border-terra hover:text-terra transition-all duration-300"
              >
                Leistungen entdecken
              </a>
            </div>
          </div>

          {/* Visual Element */}
          <div className="hidden lg:flex justify-center animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="relative">
              <div className="w-80 h-96 bg-gradient-to-br from-sand via-sand-dark/40 to-terra/20 animate-blob shadow-2xl shadow-terra/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-serif text-7xl text-terra/30 font-medium">SB</span>
                </div>
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-sage/20 rounded-full animate-float" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gold/15 rounded-full animate-float" style={{ animationDelay: '-3s' }} />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
          <span className="text-xs text-bark-light/60 tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-bark-light/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
