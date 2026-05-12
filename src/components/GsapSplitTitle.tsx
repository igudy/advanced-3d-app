import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type GsapSplitTitleProps = {
  className?: string
  line1: string
  line2: string
  accent?: ReactNode
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function wrapChars(text: string, keyPrefix: string) {
  return text.split('').map((ch, i) => (
    <span
      key={`${keyPrefix}-${i}`}
      className="inline-block overflow-hidden align-baseline"
    >
      <span className="split-char-inner inline-block will-change-transform">
        {ch === ' ' ? '\u00a0' : ch}
      </span>
    </span>
  ))
}

export function GsapSplitTitle({
  className = '',
  line1,
  line2,
  accent,
}: GsapSplitTitleProps) {
  const root = useRef<HTMLHeadingElement>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const inners = el.querySelectorAll<HTMLElement>('.split-char-inner')
    if (!inners.length) return

    if (reduced) {
      gsap.set(inners, { clearProps: 'all' })
      return
    }

    gsap.set(inners, {
      yPercent: 118,
      rotateX: -68,
      opacity: 0,
      transformOrigin: '50% 100%',
    })

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 40%',
        scrub: 0.65,
      },
    })

    tl.to(inners, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      stagger: { each: 0.012, from: 'start' },
      duration: 1.05,
    })

    const st = tl.scrollTrigger
    return () => {
      tl.kill()
      if (st) st.kill()
    }
  }, [line1, line2, reduced])

  return (
    <h2 ref={root} className={`gsap-split-title perspective-title ${className}`.trim()}>
      <span className="block leading-[0.92] overflow-hidden">{wrapChars(line1, 'l1')}</span>
      <span className="block leading-[0.92] overflow-hidden">{wrapChars(line2, 'l2')}</span>
      {accent && (
        <span className="block mt-3 font-ui font-bold text-[11px] sm:text-xs tracking-[0.28em] uppercase text-fg/75">
          {accent}
        </span>
      )}
    </h2>
  )
}
