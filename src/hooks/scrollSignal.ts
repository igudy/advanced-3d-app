/**
 * Module-level scroll signal.
 *
 * Why a module store and not React state:
 *   - Scroll fires at frame rate. Re-rendering the React tree every scroll
 *     pixel would tank perf.
 *   - The R3F `useFrame` loop already runs per-frame; it can read this signal
 *     directly with zero React churn.
 *
 * Usage:
 *   import { scroll, initScroll } from './scrollSignal'
 *   useEffect(() => initScroll(), [])
 *   useFrame(() => { ball.x = lerp(ball.x, target(scroll.progress), 0.08) })
 */

export const scroll = {
  /** 0..1 normalized scroll position across the whole page. */
  progress: 0,
  /** Raw pixel offset. */
  y: 0,
  /** Max scrollable pixels. */
  max: 0,
  /** Velocity in normalized units / frame (decays). */
  velocity: 0,
}

let lastProgress = 0
let rafId = 0
let initialized = false

const update = () => {
  scroll.y = window.scrollY
  scroll.max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  scroll.progress = Math.min(1, Math.max(0, scroll.y / scroll.max))
  scroll.velocity = scroll.progress - lastProgress
  lastProgress = scroll.progress
}

const tick = () => {
  // Decay velocity even when not scrolling so motion easing settles.
  scroll.velocity *= 0.9
  rafId = requestAnimationFrame(tick)
}

export function initScroll(): () => void {
  if (initialized) return () => {}
  initialized = true
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  rafId = requestAnimationFrame(tick)
  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    cancelAnimationFrame(rafId)
    initialized = false
  }
}
