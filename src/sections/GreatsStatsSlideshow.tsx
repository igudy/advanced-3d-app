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
import type { SportTrophy } from './greatsConfig'
import type { GreatStatSlide } from './greatsStatsSlides'

const AUTO_MS = 3000

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
  trophy: SportTrophy
}

export function SportStatsSlideshow({
  id,
  surface,
  slides,
  eyebrow,
  titleLine1,
  titleLine2,
  trophy,
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
      className="relative w-full min-h-[min(88vh,760px)] bg-transparent px-5.5 sm:px-9 lg:px-16 py-16 sm:py-22 overflow-hidden scroll-mt-24 outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper pointer-events-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setPaused(false)
      }}
      onKeyDown={onKeyDown}
    >
      <div className="max-w-7xl mx-auto w-full relative">
        <div
          className="absolute right-0 top-0 z-10 hidden md:flex flex-col items-stretch w-[5.5rem] lg:w-[6.25rem] border-4 border-ink bg-ink overflow-hidden shadow-brutal-md"
          aria-hidden
        >
          <div className="relative aspect-square w-full shrink-0 overflow-hidden">
            <img
              src={trophy.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="mb-8 max-w-4xl">
          <div className="eyebrow mb-5">{eyebrow}</div>
          <h2 className="section-title !text-[clamp(36px,7.5vw,110px)] mb-8 max-w-4xl">
            {titleLine1}
            <br />
            {titleLine2}
          </h2>
        </div>

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
                className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-black/88 via-black/20 to-transparent"
                aria-hidden
              />
              <div className="absolute bottom-0 left-0 right-0 z-[3] p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div
                      className={`font-ui font-bold text-[9px] tracking-[0.3em] uppercase ${accent.bar} text-ink w-max px-2.5 py-1 border-2 border-ink mb-3`}
                    >
                      {slide.sportLabel}
                    </div>
                    <h3 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] uppercase tracking-[-0.04em] text-paper leading-[0.92]">
                      {slide.name}
                    </h3>
                  </div>
                  <div className="shrink-0 sm:text-right sm:max-w-[12rem]">
                    <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-paper/55 mb-1">Alias</p>
                    <p className="font-ui font-semibold text-sm text-accent leading-tight">{slide.nick}</p>
                    <p className="font-ui text-[11px] text-paper/80 mt-2 tracking-wide">{slide.country}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="perspective-title flex flex-col justify-between p-6 sm:p-8 lg:p-10 min-h-[380px] lg:min-h-0">
              <div ref={stageRef}>
                <div className="mb-8 max-w-lg">
                  <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-fg/50 block mb-2">
                    Legacy line
                  </span>
                  <p className="font-ui font-medium text-fg text-[15px] sm:text-[17px] leading-[1.55]">
                    {slide.honor}
                  </p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 list-none p-0 m-0">
                  {slide.stats.map((s, j) => {
                    const alt = j % 2 === 1
                    return (
                      <li
                        key={s.label}
                        className={`stat-slide-row border-4 border-ink px-4 py-3.5 shadow-brutal-sm flex flex-col gap-1 ${
                          alt
                            ? 'bg-ink text-paper'
                            : 'bg-paper text-ink'
                        }`}
                      >
                        <span
                          className={`font-ui font-bold text-[8px] tracking-[0.26em] uppercase ${
                            alt ? 'text-paper/55' : 'text-ink/50'
                          }`}
                        >
                          {s.label}
                        </span>
                        <span
                          className={`font-display text-lg sm:text-xl uppercase tracking-tight leading-tight ${
                            alt ? 'text-accent' : 'text-ink'
                          }`}
                        >
                          {s.value}
                        </span>
                      </li>
                    )
                  })}
                </ul>
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
          Auto-advances about every 3 seconds — hover or focus pauses. Arrow keys step slides.
        </p>
      </div>
    </section>
  )
}
