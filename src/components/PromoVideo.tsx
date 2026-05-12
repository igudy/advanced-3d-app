import { useApp } from '../store/app'

export function PromoVideo() {
  const { openVideo } = useApp()
  return (
    <button
      type="button"
      onClick={openVideo}
      aria-label="Play promotion video"
      className="brutal-lift absolute top-24 left-5.5 sm:top-27.5 sm:left-9 lg:top-35 lg:left-16 flex items-center gap-2 sm:gap-3 bg-paper border-[3px] border-ink p-1.5 pr-2.5 sm:p-2.5 sm:pr-3.5 shadow-brutal-md hover:shadow-brutal-lg z-5"
    >
      <span className="w-8.5 h-8.5 sm:w-10.5 sm:h-10.5 rounded-full bg-ink flex items-center justify-center shrink-0">
        <span
          className="w-0 h-0 ml-0.75"
          style={{
            borderLeft: '10px solid var(--color-accent)',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
          }}
        />
      </span>
      <span className="font-display text-[10px] sm:text-xs uppercase text-ink leading-[1.15] tracking-[0.02em] text-left">
        Promotion
        <br />
        video
      </span>
    </button>
  )
}
