import { useEffect } from 'react'
import { useApp } from '../store/app'

export function CartDrawer() {
  const { cartOpen, closeCart, items, count, total, setQty, removeFromCart } =
    useApp()

  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, closeCart])

  if (!cartOpen) return null

  return (
    <div
      className="fixed inset-0 z-200 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <button
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 w-full h-full bg-ink/70 cursor-pointer"
      />

      <aside className="relative w-full sm:w-105 h-full bg-paper border-l-4 border-ink flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-ink px-5 py-3 bg-accent shrink-0">
          <h3 className="font-display text-lg sm:text-xl tracking-[0.04em] uppercase text-ink">
            Cart · {count}
          </h3>
          <button
            aria-label="Close"
            onClick={closeCart}
            className="brutal-lift w-9 h-9 flex items-center justify-center bg-paper border-[3px] border-ink shadow-brutal-sm hover:shadow-brutal-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="m-auto text-center">
              <div className="font-display text-2xl uppercase text-ink mb-2">
                Empty.
              </div>
              <div className="font-ui text-sm text-ink opacity-60">
                Add a ball to get started.
              </div>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.variantId}
                className="bg-paper border-[3px] border-ink p-3.5 shadow-brutal-sm flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-display text-sm uppercase text-ink">
                    {it.name}
                  </div>
                  <button
                    aria-label={`Remove ${it.name}`}
                    onClick={() => removeFromCart(it.variantId)}
                    className="font-display text-[11px] tracking-[0.18em] uppercase text-ink hover:text-bg transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQty(it.variantId, it.qty - 1)}
                      className="brutal-lift w-7 h-7 bg-paper border-2 border-ink shadow-brutal-sm flex items-center justify-center font-display text-ink"
                    >
                      −
                    </button>
                    <span className="font-display text-base text-ink w-7 text-center">
                      {it.qty}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQty(it.variantId, it.qty + 1)}
                      className="brutal-lift w-7 h-7 bg-paper border-2 border-ink shadow-brutal-sm flex items-center justify-center font-display text-ink"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-display text-base text-ink">
                    ${(it.price * it.qty).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-ink p-5 flex flex-col gap-3 shrink-0 bg-paper">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-[11px] tracking-[0.2em] uppercase text-ink opacity-70">
              Subtotal
            </span>
            <span className="font-display text-2xl text-ink">
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => {
              if (items.length === 0) return
              alert(`Checkout: $${total.toFixed(2)} — payment flow stub.`)
            }}
            className="brutal-lift bg-ink text-accent font-display text-[13px] sm:text-[15px] tracking-[0.18em] uppercase border-4 border-ink shadow-brutal-lg hover:shadow-brutal-xl hover:bg-accent hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 w-full h-14"
          >
            Checkout →
          </button>
        </div>
      </aside>
    </div>
  )
}
