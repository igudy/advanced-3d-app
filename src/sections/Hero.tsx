import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<HTMLDivElement>(null)
  const bottomTitle = useRef<HTMLDivElement>(null)
  const bottomSub = useRef<HTMLDivElement>(null)
  const cta = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const section = root.current
    if (!section) return

    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const introEls = intro.current?.querySelectorAll('span, p') ?? []
      gsap.from(introEls, {
        y: 36,
        opacity: 0,
        rotateX: -25,
        transformOrigin: '50% 0%',
        stagger: 0.08,
        duration: 0.95,
        ease: 'power3.out',
        delay: 0.12,
      })

      const bottomBits = [bottomTitle.current, bottomSub.current, cta.current].filter(Boolean)
      gsap.from(bottomBits, {
        yPercent: 40,
        opacity: 0,
        skewY: 3,
        stagger: 0.12,
        duration: 1.05,
        ease: 'power4.out',
        delay: 0.35,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="top"
      data-surface="hero"
      className="relative w-full h-screen overflow-hidden scroll-mt-24 pointer-events-none"
    >
      <div
        ref={intro}
        className="parallax-header absolute top-24 left-5.5 sm:top-27.5 sm:left-9 lg:top-35 lg:left-16 flex flex-col gap-2 max-w-md z-5 pointer-events-auto"
      >
        <span className="eyebrow self-start">01 / Tribute</span>
        <p className="font-display text-base sm:text-lg uppercase tracking-[0.02em] text-fg leading-[1.2]">
          A scroll through three sports
          <br />
          and the bodies that bent them.
        </p>
      </div>

      <div
        className="hidden sm:pointer-events-auto sm:block absolute top-1/2 right-4.5 sm:right-7.5 font-display text-[11px] sm:text-[13px] tracking-[0.16em] text-ink bg-accent border-[3px] border-ink px-2.5 py-1.5 shadow-brutal-sm z-5 whitespace-nowrap uppercase"
        style={{
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'right center',
        }}
      >
        12 Greats / 3 Sports
      </div>

      <div className="absolute left-5.5 right-5.5 bottom-5.5 sm:left-9 sm:right-9 sm:bottom-9 lg:left-16 lg:right-16 lg:bottom-16 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 sm:gap-6 z-5 pointer-events-auto">
        <div className="bg-paper border-4 border-ink px-5 py-3 sm:px-5.5 sm:pt-3 sm:pb-4 shadow-brutal-md flex flex-col gap-1.5 min-w-0 sm:min-w-55 max-w-md">
          <div
            ref={bottomTitle}
            className="font-display text-[28px] sm:text-3xl lg:text-4xl tracking-[-0.02em] leading-none text-ink uppercase"
          >
            The Goats.
          </div>
          <div
            ref={bottomSub}
            className="font-ui font-bold text-[11px] tracking-[0.16em] uppercase text-ink"
          >
            Football · Basketball · Tennis
          </div>
        </div>

        <a
          ref={cta}
          href="#the-greats"
          className="brutal-lift bg-ink text-accent font-display text-[13px] sm:text-[15px] tracking-[0.18em] uppercase border-4 border-ink shadow-brutal-lg hover:shadow-brutal-xl hover:bg-accent hover:text-ink flex items-center justify-center gap-2.5 w-full sm:w-75 h-14 sm:h-15"
        >
          Start Scrolling <span className="font-display text-lg">↓</span>
        </a>
      </div>
    </section>
  )
}
