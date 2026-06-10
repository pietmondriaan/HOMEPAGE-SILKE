import { useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Approach from './components/Approach'
import Impuls from './components/Impuls'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Impressum from './components/Impressum'
import Datenschutz from './components/Datenschutz'
import Footer from './components/Footer'
import { loadContent } from './hooks/useContent'

// SPA-Fallback liefert index.html — /impressum und /datenschutz scrollen
// nach dem Content-Load sanft zur jeweiligen Sektion.
const ROUTE_SECTIONS = {
  '/impressum': 'impressum',
  '/datenschutz': 'datenschutz',
}

export default function App() {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/'
    const sectionId = ROUTE_SECTIONS[path]
    if (!sectionId) return
    let cancelled = false
    loadContent().then(() => {
      if (cancelled) return
      // kurz warten, bis das Layout mit geladenem Content steht
      requestAnimationFrame(() => {
        if (cancelled) return
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      })
    })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <About />
        <Approach />
        <Impuls />
        <Faq />
        <Contact />
      </main>
      <Impressum />
      <Datenschutz />
      <Footer />
    </>
  )
}
