import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'
import Rich from './Rich'
import CmsMedia from './CmsMedia'

function EventCard({ item, index }) {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      data-cms={'events.items.' + index}
      className={`animate-on-scroll group flex flex-col rounded-2xl bg-surface border border-line hover:border-petrol/40 hover:shadow-[0_10px_30px_rgba(28,70,84,0.08)] transition-all duration-[280ms] overflow-hidden ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {item.bild && (
        <CmsMedia
          src={item.bild}
          alt={item.titel}
          data-cms={'events.items.' + index + '.bild'}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="flex flex-col flex-1 p-7 lg:p-8">
        {item.datum && (
          <p
            data-cms={'events.items.' + index + '.datum'}
            className="font-sans text-[10px] font-medium tracking-[0.16em] text-petrol uppercase mb-2"
          >
            {item.datum}
          </p>
        )}

        <h3
          data-cms={'events.items.' + index + '.titel'}
          className="font-serif text-xl font-normal text-azure mb-3 leading-snug"
        >
          {item.titel}
        </h3>

        <Rich
          as="p"
          data-cms={'events.items.' + index + '.text'}
          className="text-[14px] leading-[1.75] text-ink-soft flex-1"
          text={item.text}
        />

        {(item.bild2 || item.bild3 || item.bild4) && (
          <div className="flex gap-2 mt-5">
            {[item.bild2, item.bild3, item.bild4].filter(Boolean).map((src, i) => (
              <CmsMedia
                key={i}
                src={src}
                alt={item.titel}
                data-cms={'events.items.' + index + '.bild' + (i + 2)}
                className="w-20 h-16 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Events() {
  const content = useContent()
  const events = content.events
  const [headerRef, headerVisible] = useScrollAnimation()

  if (events?.aktiv !== true) return null
  if (!events.items || events.items.length === 0) return null

  const items = events.items.slice(0, 12)

  return (
    <section id="events" data-cms-section="events" className="py-20 lg:py-28 bg-canvas relative">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className={`max-w-xl mb-12 lg:mb-16 animate-on-scroll ${headerVisible ? 'is-visible' : ''}`}
        >
          <p
            data-cms="events.eyebrow"
            className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-5"
          >
            {events.eyebrow}
          </p>
          <h2
            data-cms="events.heading"
            className="font-serif font-normal text-azure leading-[1.12]"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            {events.heading}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {items.map((item, index) => (
            <EventCard key={item.titel || index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
