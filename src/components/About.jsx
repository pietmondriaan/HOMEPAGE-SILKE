import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function About() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="ueber-mich" className="py-16 lg:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/50 to-transparent" />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 lg:px-8 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="grid lg:grid-cols-[0.35fr,1fr] gap-10 lg:gap-16 items-start">
          {/* Left Column - Label & Visual */}
          <div>
            <p className="text-terra font-semibold text-sm tracking-widest uppercase mb-4 lg:sticky lg:top-28">
              Über mich
            </p>
            <div className="hidden lg:block lg:sticky lg:top-40">
              <div className="w-28 h-36 bg-gradient-to-br from-sage/20 via-terra/10 to-sand-dark/20 animate-blob mt-4" />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-medium text-bark leading-snug">
              Dort, wo Menschen geführt werden, braucht es{' '}
              <em className="text-terra not-italic">Klarheit, Kreativität</em>{' '}
              und innere Haltung.
            </h2>

            <div className="space-y-4 text-bark-light text-base lg:text-[1.0625rem] leading-relaxed">
              <p>
                Mein Fachwissen ist in der sozialen und sozialpädagogischen Praxis gewachsen —
                dort, wo Beziehung, Verantwortung und Haltung täglich spürbar werden.
              </p>
              <p>
                Im Lauf der Jahre hat sich mein Fokus von der pädagogischen Praxis hin
                zur strategischen und personellen Entwicklung auf Leitungsebene erweitert.
                Seit fast einem Jahrzehnt leite ich mehrere intensivpädagogische Wohngruppen
                und verantworte die konzeptionelle Neuausrichtung, Personalentwicklung und
                fachliche Qualitätssicherung.
              </p>
              <p>
                Ich begleite Fachkräfte und Teams durch Veränderungsprozesse, Konfliktfelder
                und Wachstumsphasen — mit klarer systemischer Perspektive, fundierter
                Praxiserfahrung und echter Begeisterung für Entwicklung.
              </p>
            </div>

            {/* Qualifications */}
            <div className="pt-4 grid sm:grid-cols-2 gap-3">
              {[
                'Systemische Beraterin',
                'Diplomierte Supervisorin',
                'Pädagogin (Mag.)',
                'Lebens- & Sozialberaterin',
              ].map((qual) => (
                <div
                  key={qual}
                  className="flex items-center gap-3 text-sm font-medium text-bark py-2 px-3 rounded-lg bg-sage/8 border border-sage/15"
                >
                  <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
                  {qual}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
