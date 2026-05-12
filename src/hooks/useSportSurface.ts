import { useEffect } from 'react'

type Surface = {
  bg: string
  ghost: string
  accent: string
  /** Primary copy on `bg` — light on green / orange / blue bands */
  fg: string
}

const SURFACES: Record<string, Surface> = {
  /** Opening view — pitch green (before scroll handoff to sport bands) */
  hero: {
    bg: '#0b3d22',
    ghost: '#1f7a4d',
    accent: '#c8ff3d',
    fg: '#f2faf5',
  },
  football: {
    bg: '#0b3d22',
    ghost: '#18794e',
    accent: '#c8ff3d',
    fg: '#f2faf5',
  },
  basketball: {
    bg: '#ea580c',
    ghost: '#fb923c',
    accent: '#fef9c3',
    fg: '#fffbeb',
  },
  tennis: {
    bg: '#1d4ed8',
    ghost: '#38bdf8',
    accent: '#bef264',
    fg: '#eff6ff',
  },
  stats: {
    bg: '#0c0e14',
    ghost: '#334155',
    accent: '#22d3ee',
    fg: '#f1f5f9',
  },
  outro: {
    bg: '#1a0a2e',
    ghost: '#4c1d95',
    accent: '#f472b6',
    fg: '#f8fafc',
  },
}

const DEFAULT = SURFACES.hero

function applySurface(id: string | null) {
  const root = document.documentElement
  const s = (id && SURFACES[id]) || DEFAULT
  root.style.setProperty('--color-bg', s.bg)
  root.style.setProperty('--color-ghost', s.ghost)
  root.style.setProperty('--color-accent', s.accent)
  root.style.setProperty('--color-fg', s.fg)
  /** Keep “ink” as true black for borders, shadows, eyebrow-on-accent, cards */
  root.style.setProperty('--color-ink', '#0a0a0a')
}

export function useSportSurface() {
  useEffect(() => {
    const els = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[data-surface]'),
      )

    const pick = () => {
      const vh = window.innerHeight
      const mid = vh * 0.42
      let best: HTMLElement | null = null
      let bestScore = -1

      for (const el of els()) {
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

      const surfaceId = best?.dataset.surface ?? null
      applySurface(surfaceId)
    }

    const tick = () => pick()

    pick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick, { passive: true })
    const ro = new ResizeObserver(tick)
    if (document.body) ro.observe(document.body)

    return () => {
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
      ro.disconnect()
      applySurface('hero')
    }
  }, [])
}
