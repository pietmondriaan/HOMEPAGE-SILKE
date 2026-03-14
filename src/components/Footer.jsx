export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-bark border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-serif text-lg text-white/80 hover:text-terra transition-colors"
            >
              Silke Burkhardt
            </a>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#ueber-mich" className="text-white/40 hover:text-white/70 transition-colors">
              Über mich
            </a>
            <a href="#leistungen" className="text-white/40 hover:text-white/70 transition-colors">
              Leistungen
            </a>
            <a href="#kontakt" className="text-white/40 hover:text-white/70 transition-colors">
              Kontakt
            </a>
          </nav>

          <p className="text-xs text-white/25">
            © {year} Silke Burkhardt
          </p>
        </div>
      </div>
    </footer>
  )
}
