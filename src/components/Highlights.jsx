import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useContent } from '../hooks/useContent'
import Rich from './Rich'

function HighlightCard({ item, index }) {
  const [ref, isVisible] = useScrollAnimation(0.1)

  return (
    <div
      ref={ref}
      data-cms={'highlights.' + index}
      className={`animate-on-scroll bg-surface rounded-2xl border border-line overflow-hidden flex flex-col lg:flex-row ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {item.bild && (
        <div className="lg:w-2/5 flex-shrink-0">
          <img
            src={item.bild}
            alt={item.titel}
            data-cms={'highlights.' + index + '.bild'}
            className="w-full h-56 lg:h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col justify-center p-10 lg:p-14 flex-1">
        <p
          data-cms={'highlights.' + index + '.eyebrow'}
          className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-5"
        >
          {item.eyebrow}
        </p>

        <h2
          data-cms={'highlights.' + index + '.titel'}
          className="font-serif font-normal text-azure leading-[1.12] mb-6"
          style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', textWrap: 'balance' }}
        >
          {item.titel}
        </h2>

        <Rich
          as="p"
          data-cms={'highlights.' + index + '.text'}
          className="text-base leading-[1.75] text-ink mb-8 max-w-xl"
          text={item.text}
        />

        {item.cta_label && (
          <a
            href="#kontakt"
            data-cms={'highlights.' + index + '.cta_label'}
            className="inline-flex items-center gap-2 font-sans text-sm font-medium px-7 py-3.5 bg-petrol text-white rounded-full hover:bg-petrol-dark transition-colors duration-[180ms] self-start"
          >
            {item.cta_label}
          </a>
        )}
      </div>
    </div>
  )
}

export default function Highlights() {
  const content = useContent()
  const highlights = content.highlights

  if (!Array.isArray(highlights)) return null

  const activeWithIndex = highlights
    .map((h, i) => ({ item: h, index: i }))
    .filter(({ item }) => item?.aktiv === true)
    .slice(0, 3)
  if (activeWithIndex.length === 0) return null

  return (
    <section id="highlights" data-cms-section="highlights" className="py-20 lg:py-28 bg-petrol-pale">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col gap-6">
        {activeWithIndex.map(({ item, index }) => (
          <HighlightCard key={item.titel || index} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
