import { useCallback, useEffect, useRef, useState } from 'react'
import { pickFocalSurfaceKey } from '../lib/focalSurface'

const STORAGE_KEY = 'greats-ambient-sound'

type Chain = { input: GainNode }

function buildChain(
  ctx: AudioContext,
  dest: AudioNode,
  freqs: [number, number][],
  filterHz: number,
  filterType: BiquadFilterType = 'lowpass',
): Chain {
  const input = ctx.createGain()
  input.gain.value = 0
  const filter = ctx.createBiquadFilter()
  filter.type = filterType
  filter.frequency.value = filterHz
  filter.Q.value = 0.65
  for (const [hz, rel] of freqs) {
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = hz
    const g = ctx.createGain()
    g.gain.value = rel
    o.connect(g)
    g.connect(filter)
    o.start()
  }
  filter.connect(input)
  input.connect(dest)
  return { input }
}

export function AmbientSportSound() {
  const [enabled, setEnabled] = useState(() =>
    typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) === '1' : false,
  )
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const footballRef = useRef<GainNode | null>(null)
  const basketballRef = useRef<GainNode | null>(null)
  const tennisRef = useRef<GainNode | null>(null)

  const ensureGraph = useCallback(() => {
    if (ctxRef.current) return ctxRef.current
    const ctx = new AudioContext()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const wet = ctx.createGain()
    wet.gain.value = 0.14
    wet.connect(master)

    const football = buildChain(
      ctx,
      wet,
      [
        [55, 0.055],
        [110, 0.03],
        [165, 0.018],
      ],
      150,
    )
    const basketball = buildChain(
      ctx,
      wet,
      [
        [92, 0.048],
        [138, 0.03],
        [207, 0.018],
      ],
      480,
    )
    const tennis = buildChain(
      ctx,
      wet,
      [
        [990, 0.024],
        [1485, 0.016],
        [1980, 0.01],
      ],
      2400,
      'bandpass',
    )

    ctxRef.current = ctx
    masterRef.current = master
    footballRef.current = football.input
    basketballRef.current = basketball.input
    tennisRef.current = tennis.input
    return ctx
  }, [])

  const ramp = useCallback((g: GainNode | null, v: number, ctx: AudioContext) => {
    if (!g) return
    const t = ctx.currentTime
    g.gain.cancelScheduledValues(t)
    g.gain.setValueAtTime(g.gain.value, t)
    g.gain.linearRampToValueAtTime(v, t + 1.05)
  }, [])

  const syncLevels = useCallback(() => {
    if (!enabled) return
    const ctx = ctxRef.current
    if (!ctx || ctx.state === 'closed') return

    const surf = pickFocalSurfaceKey()
    const isFoot = surf === 'football'
    const isBask = surf === 'basketball'
    const isTen = surf === 'tennis'

    ramp(footballRef.current, isFoot ? 1 : 0, ctx)
    ramp(basketballRef.current, isBask ? 1 : 0, ctx)
    ramp(tennisRef.current, isTen ? 1 : 0, ctx)

    const master = masterRef.current
    if (master) {
      const t = ctx.currentTime
      const want = isFoot || isBask || isTen ? 1 : 0
      master.gain.cancelScheduledValues(t)
      master.gain.setValueAtTime(master.gain.value, t)
      master.gain.linearRampToValueAtTime(want * 0.9, t + 1.25)
    }
  }, [enabled, ramp])

  useEffect(() => {
    const onScroll = () => syncLevels()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('sport-theme', onScroll)
    const id = window.setInterval(onScroll, 380)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('sport-theme', onScroll)
      window.clearInterval(id)
    }
  }, [syncLevels])

  useEffect(() => {
    if (!enabled) {
      const ctx = ctxRef.current
      if (ctx && masterRef.current) {
        const t = ctx.currentTime
        masterRef.current.gain.cancelScheduledValues(t)
        masterRef.current.gain.setValueAtTime(masterRef.current.gain.value, t)
        masterRef.current.gain.linearRampToValueAtTime(0, t + 0.55)
        ramp(footballRef.current, 0, ctx)
        ramp(basketballRef.current, 0, ctx)
        ramp(tennisRef.current, 0, ctx)
      }
      return
    }
    const ctx = ensureGraph()
    void ctx.resume().then(() => {
      syncLevels()
    })
  }, [enabled, ensureGraph, ramp, syncLevels])

  const toggle = () => {
    setEnabled((v) => {
      const next = !v
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      if (next) {
        const ctx = ensureGraph()
        void ctx.resume().then(() => syncLevels())
      }
      return next
    })
  }

  return (
    <div className="fixed bottom-5 left-5 sm:bottom-7 sm:left-7 lg:bottom-9 lg:left-10 z-[85] pointer-events-auto">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={enabled}
        aria-label={
          enabled
            ? 'Turn off ambient sound'
            : 'Turn on soft ambient sound (changes with Football, Basketball, Tennis sections)'
        }
        title={enabled ? 'Ambient sound on' : 'Ambient sound off — tap for a soft pad per sport'}
        className="brutal-lift flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center border-[3px] border-ink bg-paper text-ink shadow-brutal-sm hover:shadow-brutal-md transition-shadow"
      >
        {enabled ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink">
            <path
              d="M11 5L6 9H2v6h4l5 4V5z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M15.5 9.5a3 3 0 010 5M18 7a6 6 0 010 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-ink/75">
            <path
              d="M11 5L6 9H2v6h4l5 4V5z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  )
}
