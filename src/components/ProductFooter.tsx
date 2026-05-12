import { useApp } from '../store/app'

export function ProductFooter() {
  const { variant, addToCart, nextVariant, prevVariant } = useApp()

  return (
    <div className="absolute left-5.5 right-5.5 bottom-5.5 sm:left-9 sm:right-9 sm:bottom-9 lg:left-16 lg:right-16 lg:bottom-16 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 sm:gap-6 z-5 flex-wrap">
      {/* Price block — driven by selected variant */}
      <div className="bg-paper border-4 border-ink px-5 py-3 sm:px-5.5 sm:pt-3 sm:pb-4 shadow-brutal-md flex flex-col gap-1.5 min-w-0 sm:min-w-55">
        <div className="font-display text-[40px] sm:text-5xl lg:text-[56px] tracking-[-0.02em] leading-none text-ink">
          ${variant.price.toFixed(2)}
        </div>
        <div className="font-ui font-bold text-[11px] tracking-[0.16em] uppercase text-ink">
          Size:{' '}
          <strong className="bg-accent px-1.5 py-px font-extrabold border border-ink">
            9"
          </strong>{' '}
          &nbsp;•&nbsp; Official
        </div>
        <div className="font-display text-[11px] tracking-[0.18em] uppercase text-ink opacity-75">
          {variant.name}
        </div>
      </div>

      <button
        type="button"
        onClick={() => addToCart()}
        className="brutal-lift bg-ink text-accent font-display text-[13px] sm:text-[15px] tracking-[0.18em] uppercase border-4 border-ink shadow-brutal-lg hover:shadow-brutal-xl hover:bg-accent hover:text-ink flex items-center justify-center gap-2.5 w-full sm:w-75 h-14 sm:h-15"
      >
        Add to Cart <span className="font-display text-lg">→</span>
      </button>

      <div className="flex gap-3 self-end">
        <button
          type="button"
          aria-label="Previous variant"
          onClick={prevVariant}
          className="brutal-lift w-11 h-11 sm:w-12 sm:h-12 lg:w-13.5 lg:h-13.5 bg-paper border-4 border-ink shadow-brutal-md hover:bg-accent hover:shadow-brutal-lg flex items-center justify-center text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next variant"
          onClick={nextVariant}
          className="brutal-lift w-11 h-11 sm:w-12 sm:h-12 lg:w-13.5 lg:h-13.5 bg-paper border-4 border-ink shadow-brutal-md hover:bg-accent hover:shadow-brutal-lg flex items-center justify-center text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
