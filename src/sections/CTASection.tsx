import { useApp } from '../store/app'

export function CTASection() {
  const { addToCart, variant } = useApp()
  return (
    <section className="relative w-full min-h-[80vh] px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-24 flex items-center justify-center text-center overflow-hidden">
      <div className="flex flex-col items-center text-center gap-2 w-full max-w-full">
        <div className="eyebrow">06 / Ship Today</div>
        <h2 className="section-title mega text-center">
          READY?
          <br />
          PLAY.
        </h2>

        <button
          type="button"
          onClick={() => addToCart()}
          className="brutal-lift bg-ink text-accent font-display text-[15px] sm:text-lg tracking-[0.18em] uppercase border-4 border-ink shadow-brutal-lg hover:shadow-brutal-xl hover:bg-accent hover:text-ink flex items-center justify-center gap-2.5 mt-7 w-full sm:w-110 h-18 sm:h-21"
        >
          Add to Cart · ${variant.price.toFixed(2)} <span className="font-display text-xl">→</span>
        </button>

        <div className="mt-5.5 font-ui font-semibold text-[11px] tracking-[0.18em] uppercase text-ink opacity-70">
          Free shipping over $50 · 90-day returns
        </div>
      </div>
    </section>
  )
}
