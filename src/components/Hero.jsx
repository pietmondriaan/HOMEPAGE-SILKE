import { useContent } from '../hooks/useContent'

export default function Hero() {
  const content = useContent()
  const { hero } = content
  return (
    <section className="relative overflow-hidden bg-canvas">

      {/* dezente Blob-Dekoration hinter dem Text */}
      <div
        className="absolute -top-28 -right-32 w-[460px] h-[460px] bg-petrol/[0.06] animate-blob-morph pointer-events-none"
        style={{ borderRadius: '62% 38% 48% 52% / 55% 45% 55% 45%' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pt-28 pb-12 lg:pt-36 lg:pb-20">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-8 lg:gap-16 items-start">

          {/* Silke — auf Desktop links, mobil unter dem Text */}
          <div
            className="animate-fade-up order-2 lg:order-1"
            style={{ animationDelay: '300ms' }}
          >
            <div className="mx-auto w-[230px] sm:w-[280px] lg:w-full lg:max-w-[330px]">
              {/* ordentliches rechteckiges Foto, dezent gerundet */}
              <img
                src={hero.portrait_image}
                alt={content.meta.business_name}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Text — auf Desktop rechts, mobil oben */}
          <div className="order-1 lg:order-2">
            <span
              className="animate-fade-up inline-block text-xs uppercase tracking-[0.16em] text-petrol font-sans font-medium mb-4"
              style={{ animationDelay: '0ms' }}
            >
              {hero.eyebrow}
            </span>

            <h1
              className="animate-fade-up font-serif font-normal leading-[1.1] tracking-[-0.02em] text-azure mb-6"
              style={{
                fontSize: 'clamp(2.2rem, 3.2vw, 3.35rem)',
                animationDelay: '80ms',
                textWrap: 'balance',
              }}
            >
              {hero.title}
            </h1>

            <p
              className="animate-fade-up text-base lg:text-lg font-light leading-[1.7] text-ink-soft mb-8 max-w-xl"
              style={{ animationDelay: '160ms' }}
            >
              {hero.subtitle}
            </p>

            <div
              className="animate-fade-up flex flex-wrap gap-3.5"
              style={{ animationDelay: '240ms' }}
            >
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-petrol text-white font-sans text-sm font-medium rounded-full hover:bg-petrol-dark transition-colors duration-[180ms]"
              >
                {hero.cta_text}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 7.5h11M9 3l4 4.5-4 4.5" />
                </svg>
              </a>
              <a
                href="#angebot"
                className="inline-flex items-center px-7 py-3.5 text-ink font-sans text-sm font-medium rounded-full border border-line hover:border-petrol hover:text-petrol transition-colors duration-[180ms]"
              >
                Meine Angebote
              </a>
            </div>

            <div
              className="animate-fade-in mt-11 pt-6 border-t border-line/60 flex flex-wrap gap-x-6 gap-y-2.5"
              style={{ animationDelay: '420ms' }}
            >
              {[
                'Mag. Silke Burkhardt',
                'Sozial- und Integrationspädagogin',
                'Kärnten & Steiermark',
                'Verfügbar ab Juni 2026',
              ].map((item) => (
                <span
                  key={item}
                  className="font-sans text-xs text-ink-soft/70 tracking-wide flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-petrol/60 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
