export default function Impressum() {
  return (
    <section id="impressum" data-cms-section="impressum" className="py-16 bg-canvas">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        <h2 className="font-serif font-normal text-azure text-2xl mb-8">Impressum</h2>

        <div className="text-ink text-sm leading-relaxed space-y-6 max-w-2xl">

          <div>
            <p className="font-medium text-ink mb-1">Medieninhaberin &amp; für den Inhalt verantwortlich:</p>
            <p>Mag. Silke Ursula Burkhardt</p>
            <p>St. Michael ob Bleiburg 130/1, 9143 St. Michael ob Bleiburg, Österreich</p>
            <p>
              Telefon:{' '}
              <a href="tel:+436802193868" className="hover:text-petrol transition-colors duration-[180ms]">
                +43 680 2193 868
              </a>
              {' · '}
              E-Mail:{' '}
              <a href="mailto:si.burkhardt@outlook.com" className="hover:text-petrol transition-colors duration-[180ms]">
                si.burkhardt@outlook.com
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-medium">Unternehmensgegenstand:</span>{' '}
              Lebens- und Sozialberatung; Unternehmensberatung
            </p>
            <p>
              <span className="font-medium">GISA-Zahlen:</span>{' '}
              32669015 (Lebens- und Sozialberatung), 32816167 (Unternehmensberatung)
            </p>
            <p>
              <span className="font-medium">Berufsrecht:</span>{' '}
              Gewerbeordnung 1994 — abrufbar unter{' '}
              <a
                href="https://ris.bka.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-petrol transition-colors duration-[180ms]"
              >
                ris.bka.gv.at
              </a>
            </p>
            <p>
              <span className="font-medium">Mitgliedschaft:</span>{' '}
              Wirtschaftskammer Kärnten
            </p>
            <p>
              <span className="font-medium">Aufsichtsbehörde:</span>{' '}
              Bezirkshauptmannschaft Völkermarkt
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
