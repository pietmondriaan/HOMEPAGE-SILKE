import { useRef, useEffect } from 'react'

// Endungen, die wir als hochgeladenes Video behandeln.
const VIDEO_RE = /\.(mp4|mov|webm|m4v)(\?.*)?$/i

// Bild-Feld, das auch ein hochgeladenes Video rendern kann (gleiche CMS-Felder
// wie zuvor, src kann jetzt ein Video sein). Auf der ruhigen Beratungs-Seite
// bewusst gedämpft: stumm, in den Slot eingepasst, Autoplay erst wenn sichtbar —
// kein Ton, keine Überraschung. data-cms/alt/className werden durchgereicht.
export default function CmsMedia({ src, alt, className, ...rest }) {
  if (src && VIDEO_RE.test(src)) {
    return <CmsVideo src={src} className={className} {...rest} />
  }
  return <img src={src} alt={alt} loading="lazy" className={className} {...rest} />
}

function CmsVideo({ src, className, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {})
          observer.disconnect()
        }
      },
      { rootMargin: '150px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      className={className}
      {...rest}
    />
  )
}
