import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Frame } from './components/Frame'
import { Nav } from './components/Nav'
import { AmbientSportSound } from './components/AmbientSportSound'
import { Hero } from './sections/Hero'
import { TheGreatsIntro } from './sections/TheGreatsIntro'
import { SportGreats } from './sections/Greats'
import { FOOTBALL, BASKETBALL, TENNIS } from './sections/greatsConfig'
import { SportBridge } from './sections/SportBridge'
import { CTASection } from './sections/CTASection'
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

const SportStatsSlideshow = lazy(() =>
  import('./sections/GreatsStatsSlideshow').then((m) => ({ default: m.SportStatsSlideshow })),
)

const statsSlideFallback: ReactNode = (
  <div className="min-h-[min(88vh,760px)] w-full bg-transparent" aria-hidden />
)

function App() {
  useEffect(() => initScroll(), [])

  /** Split titles + other ST triggers measure before fonts / lazy layout settle. */
  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    refresh()
    void document.fonts?.ready?.then(refresh)
    window.addEventListener('load', refresh)
    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(refresh, 120)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
    }
  }, [])

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
    <div className="relative w-full max-w-full overflow-x-hidden min-h-screen">
      <LoadingCurtain show={showLoader} progress={assets.progress} />

      <Frame />
      <Nav />
      <AmbientSportSound />

      <div className="field-backdrop" aria-hidden />

      <Suspense fallback={<div className="scene-fallback" aria-hidden />}>
        <Scene />
      </Suspense>

      <main className="relative z-2 w-full max-w-full overflow-x-hidden bg-transparent">
        <Hero />

        <SportBridge
          id="football-prelude"
          surface="football"
          eyebrow="Pitch · prelude"
          title={['GRASS', 'STITCHES.']}
          body={
            <>
              <span className="block">Where a nation paints its heart on a stitch of green —</span>
              <span className="block">eleven on eleven, mud on the boots, geometry learning to breathe.</span>
              <span className="block mt-1 italic text-fg/90">
                A ball that forgets the clock when the right foot tells it where to bend.
              </span>
            </>
          }
          sub={
            <>
              <span className="block">Scroll keeps the story turning —</span>
              <span className="block">pitch to varnish, green to ember, cobalt when the night comes down.</span>
            </>
          }
        />

        <SportGreats config={FOOTBALL} />

        <Suspense fallback={statsSlideFallback}>
          <SportStatsSlideshow
            id="greats-stats-football"
            surface="football"
            slides={FOOTBALL_STAT_SLIDES}
            eyebrow="Football · tape"
            titleLine1="TAPE"
            titleLine2="DOESN’T LIE."
            trophy={FOOTBALL.trophy}
          />
        </Suspense>

        <SportBridge
          id="football-after"
          surface="football"
          eyebrow="Echo · terraces"
          title={['ANTHEMS', 'IN RAIN.']}
          body={
            <>
              <span className="block">Concrete cages, floodlit cathedrals —</span>
              <span className="block">the same leather hymn, only louder in the throat.</span>
              <span className="block mt-1 italic text-fg/90">
                The ball remembers every sprint along the whitewash; the only witness that never blinks.
              </span>
            </>
          }
          align="right"
        />

        <SportBridge
          id="basketball-prelude"
          surface="basketball"
          eyebrow="Arena · varnish"
          title={['RIMS', 'ON FIRE.']}
          body={
            <>
              <span className="block">Ninety-four feet of maple where giants rehearse flight.</span>
              <span className="block">The rock speaks in squeaks, screens, breath — a metronome hung in the rafters.</span>
              <span className="block mt-1 italic text-fg/90">Fourth quarter: the air learns your pulse.</span>
            </>
          }
          sub={
            <>
              <span className="block">Ember underfoot — grass gives way to varnish;</span>
              <span className="block">the room warms from the floorboards up.</span>
            </>
          }
          align="center"
        />

        <SportGreats config={BASKETBALL} />

        <Suspense fallback={statsSlideFallback}>
          <SportStatsSlideshow
            id="greats-stats-basketball"
            surface="basketball"
            slides={BASKETBALL_STAT_SLIDES}
            eyebrow="Basketball · tape"
            titleLine1="WOOD"
            titleLine2="DOESN’T LIE."
            trophy={BASKETBALL.trophy}
          />
        </Suspense>

        <SportBridge
          id="basketball-after"
          surface="basketball"
          eyebrow="Overtime · chorus"
          title={['SHOT', 'CLOCK POETRY.']}
          body={
            <>
              <span className="block">Rhythm is the quiet cheat code:</span>
              <span className="block">between-the-legs, step-back, a kiss off the glass.</span>
              <span className="block mt-1 italic text-fg/90">
                The ball hangs like it owes gravity an apology — then drops through the net like a verdict.
              </span>
            </>
          }
        />

        <SportBridge
          id="tennis-prelude"
          surface="tennis"
          eyebrow="Court · cobalt"
          title={['SILENCE,', 'THEN THUNDER.']}
          body={
            <>
              <span className="block">A yellow sun on a blue sheet of water —</span>
              <span className="block">serve, slide, return, the crowd learning how to roar.</span>
              <span className="block mt-1 italic text-fg/90">
                Politeness and violence share the same handshake at the net.
              </span>
            </>
          }
          sub={
            <>
              <span className="block">Cobalt gathers; the fuzzy moon begins</span>
              <span className="block">to sing in topspin.</span>
            </>
          }
          align="center"
        />

        <SportGreats config={TENNIS} />

        <Suspense fallback={statsSlideFallback}>
          <SportStatsSlideshow
            id="greats-stats-tennis"
            surface="tennis"
            slides={TENNIS_STAT_SLIDES}
            eyebrow="Tennis · tape"
            titleLine1="FELT"
            titleLine2="DOESN’T LIE."
            trophy={TENNIS.trophy}
          />
        </Suspense>

        <SportBridge
          id="tennis-after"
          surface="tennis"
          eyebrow="Match · electricity"
          title={['LINES', 'LIKE LASERS.']}
          body={
            <>
              <span className="block">Championship point is punctuation —</span>
              <span className="block">a full stop written in salt and chalk.</span>
              <span className="block mt-1 italic text-fg/90">
                The ball compresses against carbon, paints the line, dares the stands to forget how to sit still.
              </span>
            </>
          }
        />

        <TheGreatsIntro />

        <CTASection />
      </main>
    </div>
    </ThemeProvider>
  )
}

export default App
