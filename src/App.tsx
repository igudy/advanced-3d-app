import { lazy, Suspense, useEffect } from 'react'
import { Frame } from './components/Frame'
import { Nav } from './components/Nav'
import { CartDrawer } from './components/CartDrawer'
import { AccountModal } from './components/AccountModal'
import { VideoModal } from './components/VideoModal'
import { Hero } from './sections/Hero'
import { Specs } from './sections/Specs'
import { Customize } from './sections/Customize'
import { Materials } from './sections/Materials'
import { Contacts } from './sections/Contacts'
import { CTASection } from './sections/CTASection'
import { AppProvider } from './store/app'
import { initScroll } from './hooks/scrollSignal'
import './App.css'

// Code-split the 3D scene — Three.js is ~900KB minified.
const Scene = lazy(() =>
  import('./three/Scene').then((m) => ({ default: m.Scene })),
)

function App() {
  useEffect(() => initScroll(), [])

  return (
    <AppProvider>
      <div className="relative w-full max-w-full overflow-x-hidden bg-bg">
        <Frame />
        <Nav />

        <Suspense fallback={<div className="scene-fallback" aria-hidden />}>
          <Scene />
        </Suspense>

        <main className="relative z-10 w-full max-w-full overflow-x-hidden">
          <Hero />
          <Specs />
          <Customize />
          <Materials />
          <Contacts />
          <CTASection />
        </main>

        <CartDrawer />
        <AccountModal />
        <VideoModal />
      </div>
    </AppProvider>
  )
}

export default App
