import { useScrollAnimation } from '../hooks/useScrollAnimation'

const SHOW_IMPULS = true

export default function Impuls() {
  const [ref, isVisible] = useScrollAnimation()

  if (!SHOW_IMPULS) return null

  return (
    <section id="impuls" className="py-24 lg:py-36 bg-petrol-pale">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`animate-on-scroll bg-surface rounded-2xl border border-line p-10 lg:p-14 ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-petrol uppercase mb-5">
            Aktueller Impuls
          </p>

          <h2
            className="font-serif font-normal text-azure leading-[1.12] mb-6"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            Abschließen, Ordnen, Neu ausrichten
          </h2>

          <p className="text-base leading-[1.75] text-ink mb-10 max-w-3xl">
            Zum Ende eines intensiven sozialen Arbeitsjahres lohnt es sich, bewusst innezuhalten: Was hat getragen? Was wurde noch nicht ausreichend gewürdigt? Was darf eher als Erfahrung denn als persönlicher Erfolg eingeordnet werden? In einem begleiteten Format — für Einzelpersonen, Fach- und Führungskräfte oder ganze Teams — schließen Sie das Arbeitsjahr bewusst ab und starten aufgeräumt: mit Klarheit und einem Kompass für die kommenden Aufgaben.
          </p>

          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium px-7 py-3.5 bg-petrol text-white rounded-full hover:bg-petrol-dark transition-colors duration-[180ms]"
          >
            Impuls anfragen
          </a>
        </div>
      </div>
    </section>
  )
}
