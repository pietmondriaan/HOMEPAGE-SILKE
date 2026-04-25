import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Contact() {
  const [ref, isVisible] = useScrollAnimation()
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    thema: '',
    nachricht: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const { name, email, thema, nachricht } = formState
    if (!name || !email || !nachricht) return
    const subject = encodeURIComponent((thema || 'Anfrage') + ' — ' + name)
    const body = encodeURIComponent('Name: ' + name + '\nE-Mail: ' + email + '\n\n' + nachricht)
    window.location.href = 'mailto:silke@silkeburkhardt.at?subject=' + subject + '&body=' + body
    setSubmitted(true)
  }

  return (
    <section id="kontakt" className="py-24 lg:py-36 bg-paper relative overflow-hidden">

      {/* Blob-Dekorationen */}
      <div
        className="absolute -top-20 -right-20 w-[320px] h-[300px] bg-sage/[0.08] pointer-events-none animate-blob-morph"
        style={{ borderRadius: '55% 45% 62% 38% / 45% 55% 45% 55%' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-[240px] h-[220px] bg-sage/[0.06] pointer-events-none animate-blob-morph"
        style={{ borderRadius: '40% 60% 45% 55% / 55% 45% 60% 40%', animationDelay: '-6s' }}
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 lg:px-8 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-14 lg:gap-24">

          {/* Linke Seite */}
          <div>
            <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-sage uppercase mb-6">
              Kontakt
            </p>

            <h2
              className="font-serif font-normal text-bark leading-[1.12] mb-6"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
            >
              Lassen Sie uns
              <br />
              <em>miteinander sprechen.</em>
            </h2>

            <p className="text-bark-light text-base leading-[1.75] mb-10">
              Der erste Schritt ist oft der wichtigste. Kontaktieren Sie mich für
              ein unverbindliches Erstgespräch — ich freue mich, Sie kennenzulernen.
            </p>

            <div className="space-y-5">
              {/* Telefon */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage/12 flex items-center justify-center shrink-0 text-sage">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.21 2 2 0 014 .02h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-bark-light/60 uppercase mb-0.5">Telefon</p>
                  <a href="tel:+4306802193868" className="text-bark hover:text-sage transition-colors duration-[180ms] text-base font-normal">
                    0680 219 38 68
                  </a>
                </div>
              </div>

              {/* E-Mail */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage/12 flex items-center justify-center shrink-0 text-sage">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-bark-light/60 uppercase mb-0.5">E-Mail</p>
                  <a href="mailto:silke@silkeburkhardt.at" className="text-bark hover:text-sage transition-colors duration-[180ms] text-base font-normal">
                    silke@silkeburkhardt.at
                  </a>
                </div>
              </div>

              {/* Standort */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage/12 flex items-center justify-center shrink-0 text-sage">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-bark-light/60 uppercase mb-0.5">Standort</p>
                  <p className="text-bark text-base font-normal">Kärnten, Österreich</p>
                </div>
              </div>

              {/* Erstgespräch */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sage/12 flex items-center justify-center shrink-0 text-sage">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-bark-light/60 uppercase mb-0.5">Erstgespräch</p>
                  <p className="text-bark text-base font-normal">Kostenlos & unverbindlich</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formular */}
          <div>
            {submitted ? (
              <div className="bg-cream border border-sand-dark/60 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-6">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sage" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-normal text-bark mb-2">Vielen Dank.</h3>
                <p className="text-bark-light text-sm leading-relaxed">
                  Ihre Nachricht ist angekommen. Ich melde mich in Kürze bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[11px] font-medium tracking-wide text-bark-light/70 uppercase mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="Ihr Name"
                      className="w-full px-4 py-3 bg-cream border border-sand-dark rounded-xl text-bark placeholder:text-bark-light/35 focus:outline-none focus:border-sage transition-colors duration-[180ms] text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-medium tracking-wide text-bark-light/70 uppercase mb-2">
                      E-Mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="ihre@email.at"
                      className="w-full px-4 py-3 bg-cream border border-sand-dark rounded-xl text-bark placeholder:text-bark-light/35 focus:outline-none focus:border-sage transition-colors duration-[180ms] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="thema" className="block text-[11px] font-medium tracking-wide text-bark-light/70 uppercase mb-2">
                    Thema
                  </label>
                  <select
                    id="thema"
                    name="thema"
                    value={formState.thema}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-cream border border-sand-dark rounded-xl text-bark focus:outline-none focus:border-sage transition-colors duration-[180ms] text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Bitte wählen ...</option>
                    <option value="Lebensberatung">Lebensberatung</option>
                    <option value="Sozialberatung">Sozialberatung</option>
                    <option value="Teambuilding">Teambuilding</option>
                    <option value="Organisationsentwicklung">Organisationsentwicklung</option>
                    <option value="Supervision">Supervision</option>
                    <option value="Sonstiges">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="nachricht" className="block text-[11px] font-medium tracking-wide text-bark-light/70 uppercase mb-2">
                    Nachricht
                  </label>
                  <textarea
                    id="nachricht"
                    name="nachricht"
                    value={formState.nachricht}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Erzählen Sie mir kurz von Ihrem Anliegen ..."
                    className="w-full px-4 py-3 bg-cream border border-sand-dark rounded-xl text-bark placeholder:text-bark-light/35 focus:outline-none focus:border-sage transition-colors duration-[180ms] text-sm resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <button
                    type="submit"
                    className="sm:w-auto px-8 py-3.5 bg-sage text-white text-sm font-medium rounded-full hover:bg-sage-dark transition-colors duration-[180ms]"
                  >
                    Nachricht senden
                  </button>
                  <p className="text-[11px] text-bark-light/45 leading-relaxed">
                    Ihre Daten werden vertraulich behandelt.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
