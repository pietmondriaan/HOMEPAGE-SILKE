import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const faqs = [
  { q: 'In welcher Region bieten Sie Supervision und Coaching an?',
    a: 'Mein Einzugsgebiet umfasst Kärnten und die Steiermark. Teamsupervisionen finden in der Regel in den Einrichtungen statt, Einzelsettings nach Vereinbarung.' },
  { q: 'Ab wann sind Sie verfügbar?',
    a: 'Mein Unternehmen startet im Juni 2026. Erste Anfragen und Terminvereinbarungen sind bereits jetzt möglich.' },
  { q: 'Für wen ist Ihr Angebot gedacht?',
    a: 'Für Fach- und Führungskräfte in betreuungsintensiven Arbeitsfeldern — insbesondere Träger der ambulanten und stationären Kinder- und Jugendhilfe sowie Bildungseinrichtungen.' },
  { q: 'Sind Supervisionen für Träger verpflichtend?',
    a: 'In der ambulanten und stationären Kinder- und Jugendhilfe sind Supervision, Fortbildungen und Klausuren in der Regel konzeptionell festgeschrieben und trägerfinanziert. Die Teilnahme wird von der Abteilung 6 der Kärntner Landesregierung im Rahmen von Fachaufsichten überprüft.' },
  { q: 'Finden Supervisionen vor Ort statt?',
    a: 'Team- und Gruppensettings finden in der Regel in den Räumlichkeiten der Träger statt. Für Einzelsettings ist ein Praxisraum in Klagenfurt geplant.' },
  { q: 'Was unterscheidet Ihr Angebot?',
    a: 'Ich bringe 24 Jahre Praxis und langjährige Leitungserfahrung in intensiven Betreuungssettings mit. Diese Kombination aus fundierter Ausbildung und gelebter Führungspraxis macht mein Angebot anschlussfähig.' },
  { q: 'Wie läuft der Erstkontakt ab?',
    a: 'Über ein kurzes, unverbindliches Erstgespräch — telefonisch oder per E-Mail. Darin klären wir Anliegen, Rahmen und nächste Schritte.' },
]

export default function Faq() {
  const [headerRef, headerVisible] = useScrollAnimation()
  const [openIndex, setOpenIndex] = useState(null)

  function toggle(index) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faq" className="py-20 lg:py-28 bg-canvas">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div
          ref={headerRef}
          className={`max-w-xl mb-10 lg:mb-12 animate-on-scroll ${headerVisible ? 'is-visible' : ''}`}
        >
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-5">
            FAQ
          </p>
          <h2
            className="font-serif font-normal text-azure leading-[1.12]"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            Häufige Fragen.
          </h2>
        </div>

        {/* Accordion */}
        <dl className="max-w-3xl divide-y divide-line">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-btn-${index}`

            return (
              <div key={index}>
                <dt>
                  <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-serif text-lg font-normal text-azure leading-snug">
                      {faq.q}
                    </span>
                    <span
                      className="shrink-0 w-7 h-7 rounded-full border border-line flex items-center justify-center text-petrol transition-transform duration-[220ms]"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      aria-hidden="true"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M6 1v10M1 6h10" />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-6"
                >
                  <p className="text-base leading-[1.75] text-ink">
                    {faq.a}
                  </p>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
