export default function Datenschutz() {
  return (
    <section id="datenschutz" className="py-16 bg-canvas">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        <h2 className="font-serif font-normal text-azure text-2xl mb-8">Datenschutzerklärung</h2>

        <div className="text-ink text-sm leading-relaxed space-y-6 max-w-2xl">

          <div>
            <h3 className="font-serif font-normal text-azure text-lg mb-2">Verantwortliche</h3>
            <p>
              Mag. Silke Ursula Burkhardt, St. Michael ob Bleiburg 130/1, 9143 St. Michael ob
              Bleiburg, Österreich.{' '}
              E-Mail:{' '}
              <a
                href="mailto:si.burkhardt@outlook.com"
                className="hover:text-petrol transition-colors duration-[180ms]"
              >
                si.burkhardt@outlook.com
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-serif font-normal text-azure text-lg mb-2">
              Datenverarbeitung auf dieser Website
            </h3>
            <p>
              Diese Website verarbeitet keine personenbezogenen Daten über Formulare, setzt keine
              Cookies und kein Tracking ein. Beim Aufruf der Website verarbeitet der
              Hosting-Provider technisch notwendige Server-Logdaten (IP-Adresse, Zeitpunkt,
              abgerufene Seite) zur Auslieferung und Sicherheit. Diese Daten werden nicht mit
              anderen Daten zusammengeführt und nach kurzer Zeit gelöscht.
            </p>
          </div>

          <div>
            <h3 className="font-serif font-normal text-azure text-lg mb-2">Google Fonts</h3>
            <p>
              Schriftarten werden von Google Fonts geladen. Dabei wird eine Verbindung zu Servern
              von Google LLC aufgebaut, wobei die IP-Adresse übertragen werden kann. Weitere
              Informationen finden Sie unter{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-petrol transition-colors duration-[180ms]"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </div>

          <div>
            <h3 className="font-serif font-normal text-azure text-lg mb-2">Kontaktaufnahme</h3>
            <p>
              Bei Kontaktaufnahme per E-Mail oder Telefon werden die übermittelten Daten
              ausschließlich zur Bearbeitung der Anfrage verwendet und nicht an Dritte
              weitergegeben. Die Daten werden gelöscht, sobald die Anfrage abschließend
              bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </div>

          <div>
            <h3 className="font-serif font-normal text-azure text-lg mb-2">Ihre Rechte</h3>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
              Verarbeitung sowie Widerspruch. Darüber hinaus steht Ihnen ein Beschwerderecht bei
              der österreichischen Datenschutzbehörde zu:{' '}
              <a
                href="https://www.dsb.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-petrol transition-colors duration-[180ms]"
              >
                dsb.gv.at
              </a>
              .
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
