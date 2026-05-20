import { useScrollAnimation } from '../hooks/useScrollAnimation'

const stats = [
  { value: '24', label: 'Jahre Berufspraxis in der sozialen Arbeit' },
  { value: '3', label: 'intensive Betreuungssettings in Leitung (2016–2026)' },
  { value: '2026', label: 'bewusster Schritt in die Selbstständigkeit' },
]

const qualifications = [
  'Mag. — Pädagogik',
  'Sozial- und Integrationspädagogin',
  'Lebens- & Sozialberatung (Gewerbe)',
  'Unternehmensberatung (Gewerbe)',
]

export default function About() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="ueber-mich" className="py-20 lg:py-28 bg-canvas relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start animate-on-scroll ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          {/* Linke Spalte — Überschrift + Eckdaten */}
          <div>
            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-petrol uppercase mb-5">
              Über mich
            </p>
            <h2
              className="font-serif font-normal text-azure leading-[1.16] mb-9"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              24 Jahre Praxis. Ein klarer Blick auf das, was Teams trägt.
            </h2>

            <div className="space-y-5 border-t border-line pt-7">
              {stats.map((stat) => (
                <div key={stat.value} className="flex items-baseline gap-4">
                  <span className="font-serif text-petrol text-2xl lg:text-[1.7rem] leading-none shrink-0 w-[5.5rem]">
                    {stat.value}
                  </span>
                  <span className="font-sans text-[13px] leading-snug text-ink-soft">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rechte Spalte — Text + Qualifikationen */}
          <div>
            <div className="space-y-4 text-ink text-base leading-[1.8]">
              <p>
                Mein Fachwissen ist in 24 Jahren sozialpädagogischer Praxis gewachsen —
                zuletzt, von 2016 bis 2026, als Leiterin dreier intensiver Betreuungssettings.
              </p>
              <p>
                In dieser Zeit habe ich Mitarbeiter*innenentwicklung, fachliche
                Qualitätssicherung und konzeptionelle Neuausrichtung verantwortet — mit dem
                Fokus auf stabile Teams als Grundlage gelingenden Kinderschutzes.
              </p>
              <p>
                2026 habe ich mich bewusst aus der Anstellung gelöst, um Fach- und
                Führungskräfte an anderer Stelle selbstbestimmt zu begleiten. Ich kenne den
                Ruf nach Handlungssicherheit und Entlastung aus allen Perspektiven — und ich
                kenne Wege, ihm zu begegnen.
              </p>
            </div>

            <p className="font-sans text-[10px] font-semibold tracking-[0.2em] text-petrol uppercase mt-10 mb-4">
              Qualifikationen
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {qualifications.map((qual) => (
                <div
                  key={qual}
                  className="flex items-center gap-3 font-sans text-sm text-ink py-3 px-4 rounded-xl border border-line bg-surface"
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
