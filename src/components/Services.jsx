import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'
import Rich from './Rich'

const SERVICE_ICONS = [
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M2 20c0-4 2.7-6 6-6M16 14c3.3 0 6 2 6 6" />
      <path d="M9 20c0-3 1.3-5 3-5s3 2 3 5" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M12 7v4M12 11l-5.3 6.5M12 11l5.3 6.5" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
]

function ServiceCard({ service, index }) {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      data-cms={"services." + index}
      className={`animate-on-scroll group flex flex-col p-7 lg:p-8 rounded-2xl bg-surface border border-line hover:border-petrol/40 hover:shadow-[0_10px_30px_rgba(28,70,84,0.08)] transition-all duration-[280ms] lg:col-span-2 ${index === 3 ? 'lg:col-start-2' : ''} ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="w-11 h-11 rounded-xl bg-petrol/10 flex items-center justify-center text-petrol group-hover:bg-petrol group-hover:text-white transition-all duration-[280ms] mb-5">
        {SERVICE_ICONS[index % SERVICE_ICONS.length]}
      </div>

      <p data-cms={"services." + index + ".eyebrow"} className="font-sans text-[10px] font-medium tracking-[0.16em] text-petrol/70 uppercase mb-2">
        {service.eyebrow}
      </p>

      <h3 data-cms={"services." + index + ".title"} className="font-serif text-xl font-normal text-azure mb-3 leading-snug">
        {service.title}
      </h3>

      <Rich as="p" data-cms={"services." + index + ".description"} className="text-[14px] leading-[1.75] text-ink-soft flex-1" text={service.description} />

      <a href="#kontakt" className="mt-6 flex items-center gap-1.5 text-petrol text-[13px] font-sans font-medium">
        <span>Anfragen</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" />
        </svg>
      </a>
    </div>
  )
}

export default function Services() {
  const content = useContent()
  const services = content.services
  const sektionen = content.sektionen
  const [headerRef, headerVisible] = useScrollAnimation()

  return (
    <section id="angebot" data-cms-section="angebot" className="py-20 lg:py-28 bg-canvas relative">

      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className={`max-w-xl mb-12 lg:mb-16 animate-on-scroll ${headerVisible ? 'is-visible' : ''}`}
        >
          <p data-cms="sektionen.angebot_eyebrow" className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-5">
            {sektionen.angebot_eyebrow}
          </p>
          <h2
            data-cms="sektionen.angebot_heading"
            className="font-serif font-normal text-azure leading-[1.12] mb-5"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            {sektionen.angebot_heading}
          </h2>
          <Rich as="p" data-cms="sektionen.angebot_intro" className="text-base leading-[1.75] text-ink-soft" text={sektionen.angebot_intro} />
        </div>

        {/* Cards — Grid passt sich an die Anzahl der Leistungen an */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
