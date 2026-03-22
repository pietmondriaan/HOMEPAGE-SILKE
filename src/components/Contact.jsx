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
    <section id="kontakt" className="py-16 lg:py-24 bg-bark relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bark-light/30 to-transparent" />

      <div className="absolute top-0 right-0 w-80 h-80 bg-terra/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sage/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-6 lg:px-8 animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      >
        <div className="grid lg:grid-cols-[1fr,1.1fr] gap-12 lg:gap-20">
          {/* Left Side */}
          <div>
            <p className="text-terra font-semibold text-sm tracking-widest uppercase mb-3">
              Kontakt
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-medium text-white leading-snug mb-5">
              Lassen Sie uns{' '}
              <em className="text-terra not-italic">sprechen</em>
            </h2>
            <p className="text-white/60 text-base lg:text-lg leading-relaxed mb-8">
              Der erste Schritt ist oft der wichtigste. Kontaktieren Sie mich
              für ein unverbindliches Erstgespräch — ich freue mich darauf,
              Sie kennenzulernen.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-terra/15 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-0.5">Telefon</p>
                  <a href="tel:+4306802193868" className="text-white hover:text-terra transition-colors text-lg">
                    0680 219 38 68
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-terra/15 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-0.5">Standort</p>
                  <p className="text-white text-lg">Kärnten, Österreich</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-terra/15 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-terra" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-0.5">Erstgespräch</p>
                  <p className="text-white text-lg">Kostenlos & unverbindlich</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            {submitted ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">Vielen Dank!</h3>
                <p className="text-white/60">
                  Ihre Nachricht ist angekommen. Ich melde mich in Kürze bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-white/50 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-terra/50 focus:ring-1 focus:ring-terra/30 transition-all"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-white/50 mb-1.5">
                      E-Mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-terra/50 focus:ring-1 focus:ring-terra/30 transition-all"
                      placeholder="ihre@email.at"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="thema" className="block text-sm text-white/50 mb-1.5">
                    Thema
                  </label>
                  <select
                    id="thema"
                    name="thema"
                    value={formState.thema}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-terra/50 focus:ring-1 focus:ring-terra/30 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-bark">Bitte wählen...</option>
                    <option value="Supervision" className="bg-bark">Supervision</option>
                    <option value="Coaching" className="bg-bark">Coaching</option>
                    <option value="Fallberatung" className="bg-bark">Fallberatung</option>
                    <option value="Workshop" className="bg-bark">Workshop</option>
                    <option value="Lebens- & Sozialberatung" className="bg-bark">Lebens- & Sozialberatung</option>
                    <option value="Mitarbeiterentwicklung" className="bg-bark">Mitarbeiterentwicklung</option>
                    <option value="Sonstiges" className="bg-bark">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="nachricht" className="block text-sm text-white/50 mb-1.5">
                    Nachricht
                  </label>
                  <textarea
                    id="nachricht"
                    name="nachricht"
                    value={formState.nachricht}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-terra/50 focus:ring-1 focus:ring-terra/30 transition-all resize-none"
                    placeholder="Erzählen Sie mir kurz von Ihrem Anliegen..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-terra text-white text-sm font-medium rounded-full hover:bg-terra-dark transition-all duration-300 hover:shadow-lg hover:shadow-terra/20"
                >
                  Nachricht senden
                </button>
                <p className="text-white/30 text-xs">
                  Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
