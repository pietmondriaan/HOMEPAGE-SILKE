import { useScrollAnimation } from '../hooks/useScrollAnimation'

const services = [
  {
    title: 'Supervision',
    description:
      'Reflexion und Begleitung für Einzelpersonen und Teams in herausfordernden beruflichen Kontexten. Für mehr Klarheit im professionellen Handeln.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 4v8M24 36v8M4 24h8M36 24h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Coaching',
    description:
      'Individuelle Begleitung für Führungskräfte und Fachkräfte bei persönlichen und beruflichen Entwicklungsthemen.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <path d="M8 40l8-12 8 6 8-18 8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Fallberatung',
    description:
      'Fachliche Analyse und systemische Bearbeitung komplexer Fallsituationen in der Sozialpädagogik und angrenzenden Feldern.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 18h36M14 10V6M34 10V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 26h12M18 32h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Workshops',
    description:
      'Praxisnahe Workshops zu pädagogischen Themen, Teamentwicklung und professioneller Haltung — interaktiv und nachhaltig.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <path d="M12 36c0-8 6-12 12-12s12 4 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="38" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Lebens- & Sozialberatung',
    description:
      'Begleitung in persönlichen Lebensfragen und Krisensituationen — empathisch, lösungsorientiert und auf Augenhöhe.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <path d="M24 42s-16-8.4-16-20a10 10 0 0 1 16-8 10 10 0 0 1 16 8c0 11.6-16 20-16 20z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Mitarbeiter\u00ADentwicklung',
    description:
      'Strategische Personalentwicklung und Begleitung von Führungskräften bei der Gestaltung lernender Organisationen.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <path d="M14 38V28M24 38V20M34 38V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="34" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

function ServiceCard({ service, index }) {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      className={`animate-on-scroll group relative p-6 lg:p-7 rounded-2xl bg-white/70 border border-sand/80 hover:border-terra/30 hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-terra/8 hover:-translate-y-1 ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-terra/8 flex items-center justify-center text-terra/80 group-hover:text-terra group-hover:bg-terra/12 transition-all duration-300 mb-4">
        {service.icon}
      </div>
      <h3 className="font-serif text-lg font-medium text-bark mb-2">
        {service.title}
      </h3>
      <p className="text-bark-light text-sm leading-relaxed">
        {service.description}
      </p>
      <div className="mt-5 flex items-center gap-2 text-terra text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Mehr erfahren</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  )
}

export default function Services() {
  const [headerRef, headerVisible] = useScrollAnimation()

  return (
    <section id="leistungen" className="py-16 lg:py-24 bg-sand/25 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/50 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`max-w-2xl mb-12 lg:mb-16 animate-on-scroll ${headerVisible ? 'is-visible' : ''}`}
        >
          <p className="text-terra font-semibold text-sm tracking-widest uppercase mb-3">
            Leistungen
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-medium text-bark leading-snug mb-4">
            Begleitung, die{' '}
            <em className="text-terra not-italic">wirkt</em>
          </h2>
          <p className="text-bark-light text-lg leading-relaxed">
            Ob Einzelsupervision, Teambegleitung oder strategische Beratung —
            mein Angebot orientiert sich an Ihren individuellen Bedürfnissen und Zielen.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
