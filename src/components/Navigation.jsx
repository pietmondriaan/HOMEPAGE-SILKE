import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Über mich', href: '#ueber-mich' },
  { label: 'Angebote', href: '#leistungen' },
  { label: 'Arbeitsweise', href: '#arbeitsweise' },
  { label: 'Kontakt', href: '#kontakt' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[280ms] ${
        isScrolled
          ? 'bg-cream/92 backdrop-blur-sm shadow-[0_1px_2px_rgba(31,29,25,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Wortmarke */}
          <a href="#" className="flex flex-col leading-none group">
            <span className="font-sans text-[10px] font-medium tracking-[0.2em] text-bark group-hover:text-sage transition-colors duration-[180ms]">
              ÜBERBLICK.
            </span>
            <span className="font-serif text-[15px] font-normal text-bark-light group-hover:text-bark transition-colors duration-[180ms]">
              Silke Burkhardt
            </span>
          </a>

          {/* Desktop-Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] font-normal text-bark-light hover:text-sage transition-colors duration-[180ms] relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-px after:bg-sage after:transition-all after:duration-[280ms] hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="text-[13px] font-medium px-5 py-2.5 bg-sage text-white rounded-full hover:bg-sage-dark transition-colors duration-[180ms]"
            >
              Erstgespräch
            </a>
          </div>

          {/* Mobile-Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
            aria-label="Menü öffnen"
          >
            <span
              className={`block w-5 h-px bg-bark transition-all duration-[280ms] ${
                isMobileOpen ? 'rotate-45 translate-y-[3px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-bark transition-all duration-[280ms] ${
                isMobileOpen ? '-rotate-45 -translate-y-[3px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile-Menü */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-cream transition-all duration-[280ms] ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-9">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="font-serif text-2xl text-bark hover:text-sage transition-colors duration-[180ms]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 text-sm font-medium px-8 py-3 bg-sage text-white rounded-full hover:bg-sage-dark transition-colors duration-[180ms]"
          >
            Erstgespräch vereinbaren
          </a>
        </div>
      </div>
    </nav>
  )
}
