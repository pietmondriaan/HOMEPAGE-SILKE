import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function About() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="ueber-mich" className="py-24 lg:py-32 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/50 to-transparent" />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 lg:px-8 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="grid lg:grid-cols-[0.4fr,1fr] gap-12 lg:gap-20 items-start">
          {/* Left Column - Label */}
          <div>
            <p className="text-terra font-medium text-sm tracking-widest uppercase mb-4 lg:sticky lg:top-28">
              Über mich
            </p>
            <div className="hidden lg:block lg:sticky lg:top-40">
              <div className="w-32 h-40 bg-gradient-to-br from-sage/20 to-terra/10 animate-blob mt-4" />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-medium text-bark leading-tight">
              Dort, wo Menschen geführt werden, braucht es{' '}
              <em className="text-terra not-italic">Klarheit, Kreativität</em>{' '}
              und innere Haltung.
            </h2>

            <div className="space-y-6 text-bark-light text-base lg:text-lg leading-relaxed">
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
            <div className="pt-6 grid sm:grid-cols-2 gap-4">
              {[
                'Systemische Beraterin',
                'Diplomierte Supervisorin',
                'Pädagogin (Mag.)',
                'Lebens- & Sozialberaterin',
              ].map((qual) => (
                <div
                  key={qual}
                  className="flex items-center gap-3 text-sm text-bark"
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
