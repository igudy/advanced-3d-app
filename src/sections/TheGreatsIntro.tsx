import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Second screen — split layout: left lane keeps visual space for the triple
 * 3D balls; right lane carries the title stack (desktop). Mobile stacks copy
 * first, then a tall visual band so the canvas can read clearly.
 */
export function TheGreatsIntro() {
  const root = useRef<HTMLElement>(null)
  const eyebrow = useRef<HTMLParagraphElement>(null)
  const lineThe = useRef<HTMLSpanElement>(null)
  const lineGreats = useRef<HTMLSpanElement>(null)
  const sub = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const section = root.current
    if (!section || prefersReducedMotion()) return

    const bits = [eyebrow.current, lineThe.current, lineGreats.current, sub.current].filter(
      Boolean,
    ) as HTMLElement[]

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bits,
        {
          x: 48,
          y: 36,
          opacity: 0,
          rotateX: -12,
          transformOrigin: '0% 0%',
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.05,
          stagger: 0.11,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            end: 'top 48%',
            scrub: 0.65,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="the-greats"
      data-surface="hero"
      className="relative w-full min-h-screen scroll-mt-24 pointer-events-auto px-5.5 sm:px-9 lg:px-16 pt-24 sm:pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto w-full grid min-h-[min(100dvh,920px)] grid-cols-1 lg:grid-cols-2 lg:items-center gap-10 lg:gap-12 xl:gap-20">
        {/* Visual lane — ball reads here without type sitting on top */}
        <div className="order-2 relative flex min-h-[36vh] flex-col items-center justify-center lg:order-1 lg:min-h-[min(72vh,640px)]">
          <div
            className="pointer-events-none absolute top-[12%] bottom-[12%] right-0 hidden w-px bg-fg/15 lg:block"
            aria-hidden
          />
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-fg/35 lg:absolute lg:bottom-[14%] lg:left-0" aria-hidden>
            Three sports
          </p>
        </div>

        {/* Copy lane */}
        <div className="order-1 flex flex-col justify-center gap-6 border-b border-fg/15 pb-10 text-center perspective-[900px] lg:order-2 lg:border-b-0 lg:pb-0 lg:pl-4 lg:text-left xl:pl-8">
          <p ref={eyebrow} className="eyebrow self-center lg:self-start">
            02 / Hall
          </p>
          <h1 className="font-display text-fg m-0 max-w-[14ch] leading-[0.88] tracking-[-0.04em] self-center lg:self-start">
            <span
              ref={lineThe}
              className="block text-[clamp(1.35rem,4.2vw,2.75rem)] uppercase tracking-[0.42em] pl-[0.42em] text-fg/90"
            >
              The
            </span>
            <span ref={lineGreats} className="block text-[clamp(2.75rem,10vw,7.25rem)]">
              Greats
            </span>
          </h1>
          <p
            ref={sub}
            className="font-ui font-medium text-[15px] sm:text-base text-fg/75 max-w-md leading-relaxed m-0 self-center lg:self-start"
          >
            Twelve names, three sports — scroll when you are ready.
          </p>
        </div>
      </div>
    </section>
  )
}
