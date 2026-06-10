import { useContent } from '../hooks/useContent'

export default function Footer() {
  const content = useContent()
  const navItems = content.navigation.items
  const { footer } = content

  return (
    <footer data-cms-section="footer" className="bg-canvas border-t border-line">
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
            {navItems.map((item, index) => (
              <a
                key={`${item.target}-${index}`}
                href={item.target}
                data-cms={`navigation.items.${index}.label`}
                className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]"
              >
                {item.label}
              </a>
            ))}
            <a href="#impressum" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              {footer.imprint_heading}
            </a>
            <a href="#datenschutz" className="font-sans text-ink-soft/60 hover:text-petrol transition-colors duration-[180ms]">
              {footer.privacy_heading}
            </a>
          </nav>

          {/* Copyright */}
          <div>
            <p className="text-[11px] text-ink-soft/40" data-cms="footer.copyright">
              {footer.copyright}
            </p>
            {footer.extra_line && (
              <p className="text-[11px] text-ink-soft/40 mt-1" data-cms="footer.extra_line">
                {footer.extra_line}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
