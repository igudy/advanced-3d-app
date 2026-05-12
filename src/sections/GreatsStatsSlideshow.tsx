import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import gsap from 'gsap'
import type { GreatStatSlide } from './greatsStatsSlides'

const AUTO_MS = 6200

const accentBySport: Record<
  GreatStatSlide['sportKey'],
  { bar: string; glow: string }
> = {
  football: { bar: 'bg-[#c8ff3d]', glow: 'shadow-[0_0_40px_rgba(200,255,61,0.35)]' },
  basketball: { bar: 'bg-[#fde047]', glow: 'shadow-[0_0_40px_rgba(253,224,71,0.35)]' },
  tennis: { bar: 'bg-[#bef264]', glow: 'shadow-[0_0_40px_rgba(190,242,100,0.35)]' },
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export type SportStatsSlideshowProps = {
  id: string
  /** Drives page theme while this band is in view */
  surface: GreatStatSlide['sportKey']
  slides: GreatStatSlide[]
  eyebrow: string
  titleLine1: string
  titleLine2: string
}

export function SportStatsSlideshow({
  id,
  surface,
  slides,
  eyebrow,
  titleLine1,
  titleLine2,
}: SportStatsSlideshowProps) {
  const n = slides.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])

  const slide = slides[Math.min(index, Math.max(0, n - 1))]!
  const accent = accentBySport[slide.sportKey]

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % n)
  }, [n])
  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + n) % n)
  }, [n])
  const go = useCallback(
    (i: number) => {
      setIndex(((i % n) + n) % n)
    },
    [n],
  )

  useLayoutEffect(() => {
    if (reduced || !stageRef.current) return
    const el = stageRef.current
    const rows = el.querySelectorAll<HTMLElement>('.stat-slide-row')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0.15 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 0.72,
          ease: 'power4.out',
        },
      )
      gsap.fromTo(
        rows,
        { y: 36, opacity: 0, rotateX: -12 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.08,
        },
      )
    }, el)
    return () => ctx.revert()
  }, [index, reduced])

  useLayoutEffect(() => {
    if (reduced || !imageRef.current) return
    const img = imageRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.08, filter: 'blur(8px)' },
        { scale: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' },
      )
    }, img)
    return () => ctx.revert()
  }, [index, reduced])

  useLayoutEffect(() => {
    if (reduced || !progressRef.current) return
    const bar = progressRef.current
    gsap.killTweensOf(bar)
    if (paused) {
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })
      return
    }
    gsap.fromTo(
      bar,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: AUTO_MS / 1000, ease: 'none' },
    )
    return () => {
      gsap.killTweensOf(bar)
    }
  }, [index, paused, reduced])

  useEffect(() => {
    if (paused || reduced) return
    const idTimer = window.setInterval(() => {
      setIndex((i) => (i + 1) % n)
    }, AUTO_MS)
    return () => clearInterval(idTimer)
  }, [paused, reduced, index, n])

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  return (
    <section
      ref={rootRef}
      id={id}
      data-surface={surface}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${surface} legends — stats slideshow`}
      className="relative w-full min-h-[min(88vh,760px)] px-5.5 sm:px-9 lg:px-16 py-16 sm:py-22 overflow-hidden scroll-mt-24 outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setPaused(false)
      }}
      onKeyDown={onKeyDown}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="eyebrow mb-5">{eyebrow}</div>
        <h2 className="section-title !text-[clamp(36px,7.5vw,110px)] mb-8 max-w-4xl">
          {titleLine1}
          <br />
          {titleLine2}
        </h2>

        <div className="relative border-4 border-ink bg-ink/10 shadow-brutal-lg backdrop-blur-[2px]">
          <div
            className={`absolute left-0 top-0 h-1.5 w-[30%] max-w-xs ${accent.bar} ${accent.glow}`}
            aria-hidden
          />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-0 lg:gap-0">
            <div className="relative aspect-[5/6] sm:aspect-[4/5] lg:aspect-auto lg:min-h-[min(62vh,560px)] border-b-4 lg:border-b-0 lg:border-r-4 border-ink overflow-hidden bg-ink">
              <img
                key={slide.image}
                ref={imageRef}
                src={slide.image}
                alt={`${slide.name} — portrait`}
                className="absolute inset-0 w-full h-full object-cover"
                decoding="async"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.12) 45%, transparent 100%)',
                }}
                aria-hidden
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 flex flex-col gap-1">
                <div
                  className={`font-ui font-bold text-[10px] tracking-[0.28em] uppercase ${accent.bar} text-ink w-max px-2 py-1 border-2 border-ink`}
                >
                  {slide.sportLabel}
                </div>
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-[-0.02em] text-paper leading-[0.95]">
                  {slide.name}
                </div>
                <div className="font-ui font-semibold text-sm text-paper/85">
                  {slide.nick} · {slide.country}
                </div>
              </div>
            </div>

            <div className="perspective-title flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[380px] lg:min-h-0">
              <div ref={stageRef}>
                <p className="font-ui font-medium text-fg/90 text-[15px] sm:text-base leading-[1.5] mb-8 max-w-md border-l-4 border-ink pl-4">
                  {slide.honor}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {slide.stats.map((s) => (
                    <div
                      key={s.label}
                      className="stat-slide-row border-4 border-ink bg-paper px-4 py-3 shadow-brutal-sm"
                    >
                      <div className="font-ui font-bold text-[9px] tracking-[0.22em] uppercase text-ink/55 mb-1">
                        {s.label}
                      </div>
                      <div className="font-display text-xl sm:text-2xl uppercase tracking-[0.02em] text-ink leading-tight">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous legend"
                    className="brutal-lift h-12 w-12 sm:h-13 sm:w-13 border-4 border-ink bg-accent text-ink font-display text-lg flex items-center justify-center shadow-brutal-sm hover:shadow-brutal-md"
                    onClick={prev}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next legend"
                    className="brutal-lift h-12 w-12 sm:h-13 sm:w-13 border-4 border-ink bg-accent text-ink font-display text-lg flex items-center justify-center shadow-brutal-sm hover:shadow-brutal-md"
                    onClick={next}
                  >
                    →
                  </button>
                  <span className="font-ui font-bold text-[11px] tracking-[0.2em] uppercase text-fg/70 ml-1">
                    {index + 1} / {n}
                  </span>
                </div>

                <div className="flex-1 flex flex-wrap gap-1.5 sm:gap-2 items-center">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show slide ${i + 1}`}
                      aria-current={i === index ? true : undefined}
                      className={`relative h-2.5 overflow-hidden border-2 border-ink transition-[flex] duration-300 ${
                        i === index ? 'flex-[2] min-w-[40px]' : 'flex-1 min-w-[6px] max-w-[18px]'
                      } bg-paper`}
                      onClick={() => go(i)}
                    >
                      {i === index && (
                        <div
                          ref={progressRef}
                          className={`absolute inset-0 origin-left ${accent.bar}`}
                          aria-hidden
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 font-ui text-[11px] tracking-[0.14em] uppercase text-fg/60 max-w-2xl">
          Tribute stats for motion design — focus this panel and use arrow keys, or use the controls.
        </p>
      </div>
    </section>
  )
}
