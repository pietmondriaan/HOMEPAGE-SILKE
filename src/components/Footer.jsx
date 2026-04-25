export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-cream border-t border-sand-dark/60">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Wortmarke */}
          <div className="flex flex-col leading-none">
            <span className="font-sans text-[10px] font-medium tracking-[0.2em] text-sage">
              ÜBERBLICK.
            </span>
            <span className="font-serif text-sm font-normal text-bark-light mt-0.5">
              Silke Burkhardt
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-[12px]" aria-label="Footer-Navigation">
            <a href="#ueber-mich" className="text-bark-light/50 hover:text-sage transition-colors duration-[180ms]">
              Über mich
            </a>
            <a href="#leistungen" className="text-bark-light/50 hover:text-sage transition-colors duration-[180ms]">
              Angebote
            </a>
            <a href="#arbeitsweise" className="text-bark-light/50 hover:text-sage transition-colors duration-[180ms]">
              Arbeitsweise
            </a>
            <a href="#kontakt" className="text-bark-light/50 hover:text-sage transition-colors duration-[180ms]">
              Kontakt
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-bark-light/30">
            © {year} Silke Burkhardt
          </p>
        </div>
      </div>
    </footer>
  )
}
