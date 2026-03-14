import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Über mich', href: '#ueber-mich' },
  { label: 'Leistungen', href: '#leistungen' },
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
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_3px_rgba(45,41,38,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a
            href="#"
            className="font-serif text-xl lg:text-2xl font-medium text-bark tracking-tight hover:text-terra transition-colors"
          >
            Silke Burkhardt
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-bark-light hover:text-terra transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-terra after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="text-sm font-medium px-5 py-2.5 bg-terra text-white rounded-full hover:bg-terra-dark transition-colors"
            >
              Gespräch buchen
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menü öffnen"
          >
            <span
              className={`block w-6 h-[1.5px] bg-bark transition-all duration-300 ${
                isMobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''
              }`}
            />
            <span
              className={`block w-6 h-[1.5px] bg-bark transition-all duration-300 ${
                isMobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-cream/98 backdrop-blur-lg transition-all duration-400 ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 -mt-16">
          {navItems.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="text-2xl font-serif text-bark hover:text-terra transition-colors"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setIsMobileOpen(false)}
            className="mt-4 text-lg font-medium px-8 py-3 bg-terra text-white rounded-full hover:bg-terra-dark transition-colors"
          >
            Gespräch buchen
          </a>
        </div>
      </div>
    </nav>
  )
}
