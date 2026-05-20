import { useScrollAnimation } from '../hooks/useScrollAnimation'

const qualifications = [
  'Mag. — Pädagogik',
  'Sozial- und Integrationspädagogin',
  'Lebens- & Sozialberatung (Gewerbe)',
  'Unternehmensberatung (Gewerbe)',
]

export default function About() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="ueber-mich" className="py-24 lg:py-36 bg-canvas relative">

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid lg:grid-cols-[5fr,7fr] gap-12 lg:gap-24 items-start animate-on-scroll ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          {/* Portrait mit Blob-Maske */}
          <div className="lg:sticky lg:top-28">
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div
                className="w-full aspect-[4/5] bg-petrol-pale overflow-hidden animate-blob-morph"
                style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%' }}
              >
                <img
                  src="/silke-portrait.jpg"
                  alt="Silke Burkhardt"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-petrol/15 rounded-full" aria-hidden="true" />
              <div className="absolute -top-3 -left-5 w-8 h-8 bg-petrol-pale rounded-full" aria-hidden="true" />
            </div>
          </div>

          {/* Inhalt */}
          <div>
            <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-6">
              Über mich
            </p>

            <h2
              className="font-serif font-normal text-azure mb-7 leading-[1.15]"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
            >
              24 Jahre Praxis. Ein klarer Blick auf das, was Teams trägt.
            </h2>

            <div className="space-y-4 text-ink-soft text-base leading-[1.75] mb-10">
              <p>
                Mein Fachwissen ist in 24 Jahren sozialpädagogischer Praxis gewachsen — zuletzt, von 2016 bis 2026, als Leiterin dreier intensiver Betreuungssettings.
              </p>
              <p>
                In dieser Zeit habe ich Mitarbeiter*innenentwicklung, fachliche Qualitätssicherung und konzeptionelle Neuausrichtung verantwortet — mit dem Fokus auf stabile Teams als Grundlage gelingenden Kinderschutzes.
              </p>
              <p>
                2026 habe ich mich bewusst aus der Anstellung gelöst, um Fach- und Führungskräfte an anderer Stelle selbstbestimmt zu begleiten. Ich kenne den Ruf nach Handlungssicherheit und Entlastung aus allen Perspektiven — und ich kenne Wege, ihm zu begegnen.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              {qualifications.map((qual) => (
                <div
                  key={qual}
                  className="flex items-center gap-3 text-sm text-ink py-2.5 px-4 rounded-xl border border-line/60 bg-canvas/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-petrol shrink-0" />
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
