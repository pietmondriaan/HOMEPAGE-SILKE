import { useState, useEffect } from 'react'
import { useContent } from '../hooks/useContent'

export default function Navigation() {
  const content = useContent()
  const navItems = content.navigation.items
  const ctaLabel = content.navigation.cta_label
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
      data-cms-section="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[280ms] ${
        isScrolled
          ? 'bg-canvas/92 backdrop-blur-sm shadow-[0_1px_2px_rgba(31,29,25,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Wortmarke */}
          <a href="#" className="leading-none group">
            <span className="font-serif text-[17px] font-normal text-azure group-hover:text-petrol transition-colors duration-[180ms]" data-cms="meta.business_name">
              Silke Burkhardt
            </span>
          </a>

          {/* Desktop-Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a
                key={`${item.target}-${index}`}
                href={item.target}
                data-cms={`navigation.items.${index}.label`}
                className="font-sans text-[13px] font-normal text-ink-soft hover:text-petrol transition-colors duration-[180ms] relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-px after:bg-petrol after:transition-all after:duration-[280ms] hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="font-sans text-[13px] font-medium px-5 py-2.5 bg-petrol text-white rounded-full hover:bg-petrol-dark transition-colors duration-[180ms]"
              data-cms="navigation.cta_label"
            >
              {ctaLabel}
            </a>
          </div>

          {/* Mobile-Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
            aria-label="Menü öffnen"
          >
            <span
              className={`block w-5 h-px bg-ink transition-all duration-[280ms] ${
                isMobileOpen ? 'rotate-45 translate-y-[3px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-ink transition-all duration-[280ms] ${
                isMobileOpen ? '-rotate-45 -translate-y-[3px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile-Menü */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-canvas transition-all duration-[280ms] ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-9">
          {navItems.map((item, index) => (
            <a
              key={`${item.target}-${index}`}
              href={item.target}
              onClick={() => setIsMobileOpen(false)}
              data-cms={`navigation.items.${index}.label`}
              className="font-sans text-2xl text-ink hover:text-petrol transition-colors duration-[180ms]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setIsMobileOpen(false)}
            className="mt-2 font-sans text-sm font-medium px-8 py-3 bg-petrol text-white rounded-full hover:bg-petrol-dark transition-colors duration-[180ms]"
            data-cms="navigation.cta_label"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </nav>
  )
}
