/**
 * Which `[data-surface]` band owns the reading line (~42% viewport height).
 * Kept in sync with `useSportSurface` — theme and 3D ball should agree on “chapter”.
 */

const SURFACE_KEYS = new Set([
  'hero',
  'football',
  'basketball',
  'tennis',
  'stats',
  'outro',
])

export function pickFocalSurfaceKey(): string | null {
  if (typeof document === 'undefined') return null

  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-surface]'),
  )
  if (els.length === 0) return null

  const vh = window.innerHeight
  const vw = window.innerWidth
  const focalY = vh * 0.42
  const focalX = vw * 0.5

  let best: HTMLElement | null = null

  const hit = els.filter((el) => {
    const r = el.getBoundingClientRect()
    return (
      focalX >= r.left &&
      focalX <= r.right &&
      focalY >= r.top &&
      focalY <= r.bottom
    )
  })

  if (hit.length > 0) {
    hit.sort(
      (a, b) =>
        a.getBoundingClientRect().height - b.getBoundingClientRect().height,
    )
    best = hit[0]!
  } else {
    const mid = vh * 0.42
    let bestScore = -1
    for (const el of els) {
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > vh) continue
      const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0)
      const center = (r.top + r.bottom) / 2
      const dist = Math.abs(center - mid)
      const score = visible * 1.2 - dist * 0.15
      if (score > bestScore) {
        bestScore = score
        best = el
      }
    }
  }

  const attr = best?.getAttribute('data-surface')?.trim() ?? ''
  return attr && SURFACE_KEYS.has(attr) ? attr : null
}
