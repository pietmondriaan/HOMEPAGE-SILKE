import { useScrollAnimation } from '../hooks/useScrollAnimation'

const services = [
  {
    eyebrow: 'Für Privatpersonen',
    title: 'Lebensberatung',
    description:
      'Begleitung in persönlichen Lebensfragen, Umbruchphasen und Krisensituationen. Empathisch, lösungsorientiert und auf Augenhöhe.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 21s-8-4.35-8-10.5a5.5 5.5 0 0 1 8-4.9A5.5 5.5 0 0 1 20 10.5c0 6.15-8 10.5-8 10.5z" />
      </svg>
    ),
  },
  {
    eyebrow: 'Für Fachkräfte',
    title: 'Sozialberatung',
    description:
      'Supervision, Fallberatung und fachliche Begleitung für sozialpädagogische Fachkräfte und Einrichtungen. Reflexion, die trägt.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <path d="M2 20c0-4 2.7-6 6-6M16 14c3.3 0 6 2 6 6" />
        <path d="M9 20c0-3 1.3-5 3-5s3 2 3 5" />
      </svg>
    ),
  },
  {
    eyebrow: 'Für Teams',
    title: 'Teambuilding',
    description:
      'Workshops und Prozessbegleitung für Teams in Veränderungs- und Entwicklungsphasen. Interaktiv, praxisnah und nachhaltig wirksam.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    eyebrow: 'Für Unternehmen & NGOs',
    title: 'Organisations­entwicklung',
    description:
      'Strategische Beratung und Begleitung von Organisationen. Konzeptentwicklung, Personalentwicklung, strukturelle Neuausrichtung.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="M12 7v4M12 11l-5.3 6.5M12 11l5.3 6.5" />
      </svg>
    ),
  },
]

function ServiceCard({ service, index }) {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      className={`animate-on-scroll group flex flex-col p-7 lg:p-8 rounded-2xl bg-cream border border-sand-dark/50 hover:border-sage/40 hover:shadow-[0_8px_24px_rgba(60,55,40,0.07)] transition-all duration-[280ms] ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="w-11 h-11 rounded-xl bg-sage/10 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-all duration-[280ms] mb-5">
        {service.icon}
      </div>

      <p className="font-sans text-[10px] font-medium tracking-[0.16em] text-sage/70 uppercase mb-2">
        {service.eyebrow}
      </p>

      <h3 className="font-serif text-xl font-normal text-bark mb-3 leading-snug">
        {service.title}
      </h3>

      <p className="text-[14px] leading-[1.75] text-bark-light flex-1">
        {service.description}
      </p>

      <div className="mt-6 flex items-center gap-1.5 text-sage text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-[280ms]">
        <span>Mehr erfahren</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" />
        </svg>
      </div>
    </div>
  )
}

export default function Services() {
  const [headerRef, headerVisible] = useScrollAnimation()

  return (
    <section id="leistungen" className="py-24 lg:py-36 bg-cream relative">

      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className={`max-w-xl mb-14 lg:mb-20 animate-on-scroll ${headerVisible ? 'is-visible' : ''}`}
        >
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-sage uppercase mb-5">
            Angebote
          </p>
          <h2
            className="font-serif font-normal text-bark leading-[1.12] mb-5"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            Vier ineinandergreifende
            <br />
            <em>Leistungsbereiche.</em>
          </h2>
          <p className="text-base leading-[1.75] text-bark-light">
            Ob persönliche Lebenskrise, Teamkonflikte oder strukturelle Fragen —
            mein Angebot orientiert sich an Ihren Bedürfnissen und Zielen.
          </p>
        </div>

        {/* Cards — 2×2 Grid */}
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
