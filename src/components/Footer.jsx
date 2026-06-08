export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-canvas border-t border-line">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Wortmarke */}
          <div className="leading-none">
            <span className="font-serif text-sm font-normal text-azure" data-cms="meta.business_name">
              Silke Burkhardt
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]" aria-label="Footer-Navigation">
            <a href="#angebot" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              Angebot
            </a>
            <a href="#ueber-mich" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              Über mich
            </a>
            <a href="#arbeitsweise" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              Arbeitsweise
            </a>
            <a href="#faq" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              FAQ
            </a>
            <a href="#kontakt" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              Kontakt
            </a>
            <a href="#impressum" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              Impressum
            </a>
            <a href="#datenschutz" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              Datenschutz
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-ink-soft/40" data-cms="footer.copyright">
            © {year} Mag. Silke Burkhardt
          </p>
        </div>
      </div>
    </footer>
  )
}
