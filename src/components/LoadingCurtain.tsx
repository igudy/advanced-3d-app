import { useEffect, useMemo, useState } from 'react'

type LoadingCurtainProps = {
  /** While true, the curtain is visible (or playing its exit). */
  show: boolean
  /** 0–100 from R3F loading manager */
  progress: number
}

export function LoadingCurtain({ show, progress }: LoadingCurtainProps) {
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    if (show) return
    const id = window.setTimeout(() => setShouldRender(false), 900)
    return () => window.clearTimeout(id)
  }, [show])

  const pct = useMemo(() => Math.round(Math.min(100, Math.max(0, progress))), [progress])

  if (!shouldRender) return null

  return (
    <div
      className={`loading-curtain ${show ? '' : 'loading-curtain--out'}`}
      aria-live="polite"
      aria-busy={show ? 'true' : 'false'}
    >
      <div className="loading-curtain__inner">
        <div className="loading-curtain__ring" aria-hidden />
        <div className="loading-curtain__label font-display tracking-[0.22em] uppercase">
          Calibrating leather + polygons
        </div>
        <div
          className="loading-curtain__bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="loading-curtain__bar-fill"
            style={{ transform: `scaleX(${pct / 100})` }}
          />
        </div>
        <div className="loading-curtain__pct font-ui font-bold text-xs tracking-[0.2em]">{pct}%</div>
      </div>
    </div>
  )
}
