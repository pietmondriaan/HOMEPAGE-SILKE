import { useScrollAnimation } from '../hooks/useScrollAnimation'

const steps = [
  {
    number: '01',
    title: 'Ankommen & Verstehen',
    description:
      'Wir klären das Anliegen, beleuchten den Kontext und entwickeln ein gemeinsames Verständnis der Situation.',
  },
  {
    number: '02',
    title: 'Ressourcen sichtbar machen',
    description:
      'Mit systemischer Perspektive lenken wir den Blick auf das, was bereits trägt — und auf ungenutzte Handlungsspielräume.',
  },
  {
    number: '03',
    title: 'Handlungssicherheit gewinnen',
    description:
      'Gemeinsam erarbeiten wir konkrete, umsetzbare Schritte, die im Berufsalltag Orientierung und Sicherheit geben.',
  },
]

export default function Approach() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="arbeitsweise" className="py-24 lg:py-36 bg-petrol relative overflow-hidden">

      {/* Helle Blob-Dekoration */}
      <div
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.06] pointer-events-none animate-blob-morph"
        style={{ borderRadius: '55% 45% 60% 40% / 45% 60% 40% 55%', animationDelay: '-3s' }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 lg:px-8 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="grid lg:grid-cols-[1fr,1.3fr] gap-14 lg:gap-24 items-start">

          {/* Linke Spalte */}
          <div className="lg:sticky lg:top-28">
            <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-white/60 uppercase mb-6">
              Arbeitsweise
            </p>

            <h2
              className="font-serif font-normal text-white leading-[1.12] mb-6"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
            >
              Haltungs- und ressourcenorientiert.
            </h2>

            <p className="text-white/70 text-base leading-[1.75] mb-8">
              Im Zentrum meiner Arbeit steht nicht das Problem, sondern die Fähigkeit, tragfähige Lösungen zu entwickeln. Fachlichkeit und Persönlichkeit stehen dabei gleichrangig nebeneinander.
            </p>

            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/20 bg-white/8">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <span className="text-[12px] font-medium text-white/80 tracking-wide">
                Haltungsorientiert · Ressourcenorientiert · Praxisnah
              </span>
            </div>
          </div>

          {/* Schritte */}
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative pl-16 pb-11 last:pb-0 group"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-[23px] top-12 bottom-0 w-px bg-white/20" />
                )}

                <div className="absolute left-0 top-0 w-12 h-12 rounded-full border border-white/25 bg-white/8 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/15 transition-all duration-[280ms]">
                  <span className="font-serif text-sm font-normal text-white/80">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-normal text-white mb-2 pt-2.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-white/65 text-[14px] leading-[1.75]">
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
