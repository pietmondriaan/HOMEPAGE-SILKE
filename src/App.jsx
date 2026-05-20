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

export default function App() {
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
