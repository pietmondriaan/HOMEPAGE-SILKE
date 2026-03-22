import { useScrollAnimation } from '../hooks/useScrollAnimation'

const steps = [
  {
    number: '01',
    title: 'Ankommen & Verstehen',
    description:
      'Im ersten Schritt höre ich zu. Wir klären Ihr Anliegen, beleuchten den Kontext und entwickeln ein gemeinsames Verständnis der Situation.',
  },
  {
    number: '02',
    title: 'Perspektiven öffnen',
    description:
      'Mit systemischen Methoden eröffnen wir neue Blickwinkel. Muster werden sichtbar, Zusammenhänge klarer — ohne vorschnelle Lösungen.',
  },
  {
    number: '03',
    title: 'Entwicklung gestalten',
    description:
      'Gemeinsam erarbeiten wir konkrete, umsetzbare Schritte. Nachhaltige Veränderung entsteht dort, wo Erkenntnis auf Handlung trifft.',
  },
]

export default function Approach() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="arbeitsweise" className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/50 to-transparent" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sage/[0.06] rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 lg:px-8 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-20 items-start">
          {/* Left Column */}
          <div className="lg:sticky lg:top-28">
            <p className="text-terra font-semibold text-sm tracking-widest uppercase mb-3">
              Arbeitsweise
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-medium text-bark leading-snug mb-5">
              Systemisch denken.{' '}
              <em className="text-terra not-italic">Gemeinsam</em>{' '}
              handeln.
            </h2>
            <p className="text-bark-light text-base lg:text-lg leading-relaxed mb-6">
              Mein Ansatz verbindet systemische Theorie mit langjähriger
              Praxiserfahrung. Im Zentrum steht nicht das Problem, sondern
              die Fähigkeit zur Veränderung.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-sage/10 border border-sage/20">
              <span className="w-2.5 h-2.5 rounded-full bg-sage/60" />
              <span className="text-sm text-bark-light">
                Systemisch · Lösungsorientiert · Praxisnah
              </span>
            </div>
          </div>

          {/* Right Column - Steps */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative pl-16 pb-10 last:pb-0 group"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-[23px] top-12 bottom-0 w-[1px] bg-gradient-to-b from-sand-dark/60 to-sand-dark/20" />
                )}

                <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-cream border-2 border-sand-dark/40 flex items-center justify-center group-hover:border-terra/50 group-hover:bg-terra/5 transition-colors duration-300">
                  <span className="font-serif text-sm font-medium text-terra">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium text-bark mb-2 pt-2.5">
                  {step.title}
                </h3>
                <p className="text-bark-light text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
