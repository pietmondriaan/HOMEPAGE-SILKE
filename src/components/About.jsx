import { useScrollAnimation } from '../hooks/useScrollAnimation'

const qualifications = [
  'Systemische Beraterin',
  'Diplomierte Supervisorin (ÖVS)',
  'Mag. Pädagogik',
  'Lebens- & Sozialberaterin',
]

export default function About() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="ueber-mich" className="py-24 lg:py-36 bg-paper relative">

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
                className="w-full aspect-[4/5] bg-sage-bg overflow-hidden animate-blob-morph"
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
              <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-sage/15 rounded-full" aria-hidden="true" />
              <div className="absolute -top-3 -left-5 w-8 h-8 bg-sand rounded-full" aria-hidden="true" />
            </div>
          </div>

          {/* Inhalt */}
          <div>
            <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-sage uppercase mb-6">
              Über mich
            </p>

            <h2
              className="font-serif font-normal text-bark mb-7 leading-[1.15]"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
            >
              Außergewöhnlich hohe Expertise.
              <br />
              <em>Blick dorthin, wo wir zu selten hinsehen.</em>
            </h2>

            <div className="space-y-4 text-bark-light text-base leading-[1.75] mb-10">
              <p>
                Mein Fachwissen ist in der sozialen und sozialpädagogischen Praxis gewachsen —
                dort, wo Beziehung, Verantwortung und Haltung täglich spürbar werden.
              </p>
              <p>
                Im Lauf der Jahre hat sich mein Fokus von der pädagogischen Praxis hin
                zur strategischen und personellen Entwicklung erweitert. Ich leite
                intensivpädagogische Einrichtungen und verantworte konzeptionelle
                Neuausrichtung, Personalentwicklung und fachliche Qualitätssicherung.
              </p>
              <p>
                Als Beraterin begleite ich Menschen, Teams und Organisationen durch
                Veränderungsprozesse und Wachstumsphasen — mit klarer systemischer
                Perspektive, fundierter Praxiserfahrung und echtem Verständnis.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              {qualifications.map((qual) => (
                <div
                  key={qual}
                  className="flex items-center gap-3 text-sm text-bark py-2.5 px-4 rounded-xl border border-sand-dark/60 bg-cream/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />
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
