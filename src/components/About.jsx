import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'
import Rich from './Rich'

export default function About() {
  const content = useContent()
  const stats = content.about.stats
  const qualifications = content.about.qualifications
  const sektionen = content.sektionen
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section id="ueber-mich" data-cms-section="ueber-mich" className="py-20 lg:py-28 bg-canvas relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start animate-on-scroll ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          {/* Linke Spalte — Überschrift + Eckdaten */}
          <div>
            <p data-cms="about.heading" className="font-sans text-[10px] font-semibold tracking-[0.2em] text-petrol uppercase mb-5">
              {content.about.heading}
            </p>
            <h2
              data-cms="sektionen.ueber_heading"
              className="font-serif font-normal text-azure leading-[1.16] mb-9"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', textWrap: 'balance' }}
            >
              {sektionen.ueber_heading}
            </h2>

            <div className="space-y-5 border-t border-line pt-7">
              {stats.map((stat, index) => (
                <div key={stat.value} className="flex items-baseline gap-4">
                  <span data-cms={`about.stats.${index}.value`} className="font-serif text-petrol text-2xl lg:text-[1.7rem] leading-none shrink-0 w-[5.5rem]">
                    {stat.value}
                  </span>
                  <span data-cms={`about.stats.${index}.label`} className="font-sans text-[13px] leading-snug text-ink-soft">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rechte Spalte — Text + Qualifikationen */}
          <div>
            <div className="space-y-4 text-ink text-base leading-[1.8]">
              <Rich as="p" data-cms="about.text" text={content.about.text} />
            </div>

            <p data-cms="sektionen.qualifikationen_heading" className="font-sans text-[10px] font-semibold tracking-[0.2em] text-petrol uppercase mt-10 mb-4">
              {sektionen.qualifikationen_heading}
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {qualifications.map((qual, index) => (
                <div
                  key={qual}
                  data-cms={`about.qualifications.${index}`}
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
