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
  /** Deep ember orange — avoids “washed” reads on some displays + keeps fg readable */
  basketball: {
    bg: '#c2410c',
    ghost: '#fb923c',
    accent: '#fef08a',
    fg: '#fffbeb',
  },
  /** Muted court blue — keeps white copy readable vs saturated royal */
  tennis: {
    bg: '#122a45',
    ghost: '#5a9bc4',
    accent: '#b8e86b',
    fg: '#f4f8fc',
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

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number) {
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x)))
  const R = c(r)
  const G = c(g)
  const B = c(b)
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`
}

function mulRgb(hex: string, rMul: number, gMul = rMul, bMul = rMul) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return rgbToHex(rgb[0] * rMul, rgb[1] * gMul, rgb[2] * bMul)
}

/** Night UI — deepen bands, slightly dim accent + copy for less glare */
function nightSurface(s: Surface): Surface {
  return {
    bg: mulRgb(s.bg, 0.56),
    ghost: mulRgb(s.ghost, 0.7),
    accent: mulRgb(s.accent, 0.84),
    fg: mulRgb(s.fg, 0.93),
  }
}

function applySurface(id: string | null) {
  const raw = id?.trim()
  const s =
    raw && Object.prototype.hasOwnProperty.call(SURFACES, raw)
      ? SURFACES[raw]
      : DEFAULT

  const night =
    typeof document !== 'undefined' &&
    document.documentElement.dataset.ui === 'night'
  const out = night ? nightSurface(s) : s

  const targets: HTMLElement[] = [document.documentElement]
  const app = document.getElementById('root')
  if (app) targets.push(app)

  for (const el of targets) {
    el.style.setProperty('--color-bg', out.bg)
    el.style.setProperty('--color-ghost', out.ghost)
    el.style.setProperty('--color-accent', out.accent)
    el.style.setProperty('--color-fg', out.fg)
    /** Keep “ink” as true black for borders, shadows, pills on accent, nav chrome */
    el.style.setProperty('--color-ink', '#0a0a0a')
  }
}

export function useSportSurface() {
  useEffect(() => {
    const els = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>('[data-surface]'),
      )

    const pick = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const focalY = vh * 0.42
      const focalX = vw * 0.5

      let best: HTMLElement | null = null

      /** Prefer the band that actually contains the focal point (typical reading line). */
      const hit = els().filter((el) => {
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
      }

      const attr = best?.getAttribute('data-surface')?.trim() ?? ''
      const surfaceId =
        attr && Object.prototype.hasOwnProperty.call(SURFACES, attr)
          ? attr
          : null
      applySurface(surfaceId)
    }

    const tick = () => pick()

    pick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick, { passive: true })
    window.addEventListener('sport-theme', tick)
    const ro = new ResizeObserver(tick)
    if (document.body) ro.observe(document.body)

    return () => {
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
      window.removeEventListener('sport-theme', tick)
      ro.disconnect()
      applySurface('hero')
    }
  }, [])
}
