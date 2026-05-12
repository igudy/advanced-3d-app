import { lazy, Suspense, useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Frame } from './components/Frame'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { TheGreatsIntro } from './sections/TheGreatsIntro'
import { SportGreats } from './sections/Greats'
import { FOOTBALL, BASKETBALL, TENNIS } from './sections/greatsConfig'
import { SportBridge } from './sections/SportBridge'
import { CTASection } from './sections/CTASection'
import { SportStatsSlideshow } from './sections/GreatsStatsSlideshow'
import {
  BASKETBALL_STAT_SLIDES,
  FOOTBALL_STAT_SLIDES,
  TENNIS_STAT_SLIDES,
} from './sections/greatsStatsSlides'
import { LoadingCurtain } from './components/LoadingCurtain'
import { initScroll } from './hooks/scrollSignal'
import { useSportSurface } from './hooks/useSportSurface'
import { ThemeProvider } from './theme/ThemeProvider'
import './App.css'

const Scene = lazy(() => import('./three/Scene').then((m) => ({ default: m.Scene })))

function App() {
  useEffect(() => initScroll(), [])
  useSportSurface()

  const [sceneGlReady, setSceneGlReady] = useState(false)
  const [assets, setAssets] = useState({ progress: 0, active: true })
  /** Avoid dismissing the curtain on the first “idle” tick before loaders spin up. */
  const [loadGate, setLoadGate] = useState(false)

  useEffect(() => {
    const onMount = () => setSceneGlReady(true)
    const onAssets = (e: Event) => {
      const d = (e as CustomEvent<{ progress: number; active: boolean }>).detail
      setAssets(d)
    }
    window.addEventListener('scene-mounted', onMount)
    window.addEventListener('scene-assets', onAssets)
    return () => {
      window.removeEventListener('scene-mounted', onMount)
      window.removeEventListener('scene-assets', onAssets)
    }
  }, [])

  useEffect(() => {
    if (!sceneGlReady) return
    const id = window.setTimeout(() => setLoadGate(true), 700)
    return () => clearTimeout(id)
  }, [sceneGlReady])

  const assetsSettled =
    sceneGlReady && loadGate && !assets.active && assets.progress >= 99.5

  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (!assetsSettled) return
    const id = window.setTimeout(() => setShowLoader(false), 380)
    return () => window.clearTimeout(id)
  }, [assetsSettled])

  useEffect(() => {
    if (showLoader) return
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => clearTimeout(id)
  }, [showLoader])

  return (
    <ThemeProvider>
    <div className="relative w-full max-w-full overflow-x-hidden bg-bg min-h-screen">
      <LoadingCurtain show={showLoader} progress={assets.progress} />

      <Frame />
      <Nav />

      <Suspense fallback={<div className="scene-fallback" aria-hidden />}>
        <Scene />
      </Suspense>

      <main className="relative z-10 w-full max-w-full overflow-x-hidden">
        <Hero />

        <TheGreatsIntro />

        <SportBridge
          id="football-prelude"
          surface="football"
          eyebrow="Pitch · prelude"
          title={['GRASS', 'STITCHES.']}
          body="The first sport where a nation paints its heart on a rectangle of green. Eleven versus eleven — geometry, improvisation, and a ball that bends time when it finds the right boot."
          sub="Scroll keeps the ball alive while the canvas shifts from pitch green to hardwood orange, then electric blue."
        />

        <SportGreats config={FOOTBALL} />

        <SportStatsSlideshow
          id="greats-stats-football"
          surface="football"
          slides={FOOTBALL_STAT_SLIDES}
          eyebrow="Football · tape"
          titleLine1="TAPE"
          titleLine2="DOESN’T LIE."
          trophy={FOOTBALL.trophy}
        />

        <SportBridge
          id="football-after"
          surface="football"
          eyebrow="Echo · terraces"
          title={['ANTHEMS', 'IN RAIN.']}
          body="From concrete cages to floodlit cathedrals: the same leather song, just louder. The ball remembers every touchline sprint — it is the only witness that never blinks."
        />

        <SportBridge
          id="basketball-prelude"
          surface="basketball"
          eyebrow="Arena · varnish"
          title={['RIMS', 'ON FIRE.']}
          body="Ninety-four feet of maple where giants invent hang time. The rock talks through every palm — a metronome of squeaks, screens, and fourth-quarter breath held in the rafters."
          sub="The canvas warms to ember court tones while the ball trades grass for varnish."
        />

        <SportGreats config={BASKETBALL} />

        <SportStatsSlideshow
          id="greats-stats-basketball"
          surface="basketball"
          slides={BASKETBALL_STAT_SLIDES}
          eyebrow="Basketball · tape"
          titleLine1="WOOD"
          titleLine2="DOESN’T LIE."
          trophy={BASKETBALL.trophy}
        />

        <SportBridge
          id="basketball-after"
          surface="basketball"
          eyebrow="Overtime · chorus"
          title={['SHOT', 'CLOCK POETRY.']}
          body="Rhythm is the cheat code: between-the-legs, step-back, glass. The ball floats like it owes gravity an apology — then drops through the net like a verdict."
        />

        <SportBridge
          id="tennis-prelude"
          surface="tennis"
          eyebrow="Court · cobalt"
          title={['SILENCE,', 'THEN THUNDER.']}
          body="A yellow sun on a blue ocean — serve, return, slide, scream. Tennis is the only sport where politeness and violence share the same handshake at the net."
          sub="The atmosphere cools into electric cobalt while the fuzzy sphere learns to sing topspin."
        />

        <SportGreats config={TENNIS} />

        <SportStatsSlideshow
          id="greats-stats-tennis"
          surface="tennis"
          slides={TENNIS_STAT_SLIDES}
          eyebrow="Tennis · tape"
          titleLine1="FELT"
          titleLine2="DOESN’T LIE."
          trophy={TENNIS.trophy}
        />

        <SportBridge
          id="tennis-after"
          surface="tennis"
          eyebrow="Match · electricity"
          title={['LINES', 'LIKE LASERS.']}
          body="Championship point is a full stop written in sweat. The ball compresses against carbon, paints the chalk, and dares the crowd to forget how to sit still."
        />

        <CTASection />
      </main>
    </div>
    </ThemeProvider>
  )
}

export default App
