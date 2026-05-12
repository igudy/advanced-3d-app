import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setBallColor } from './ballSignal'

/* ------------------------------------------------------------------
   Product variants
   ------------------------------------------------------------------ */

export type Variant = {
  id: string
  name: string
  color: string
  price: number
}

export const VARIANTS: Variant[] = [
  { id: 'classic',  name: 'Classic Leather',  color: '#4A1F10', price: 34.99 },
  { id: 'voltage',  name: 'Voltage Yellow',   color: '#FFE51F', price: 39.99 },
  { id: 'inferno',  name: 'Inferno Orange',   color: '#FF5A1F', price: 44.99 },
  { id: 'onyx',     name: 'Onyx Pro',         color: '#0A0A0A', price: 49.99 },
]

/* ------------------------------------------------------------------
   Cart
   ------------------------------------------------------------------ */

export type CartItem = {
  variantId: string
  name: string
  price: number
  qty: number
}

/* ------------------------------------------------------------------
   Context
   ------------------------------------------------------------------ */

type AppState = {
  /* Variant carousel */
  variantIdx: number
  variant: Variant
  nextVariant: () => void
  prevVariant: () => void
  setVariantIdx: (i: number) => void

  /* Cart */
  items: CartItem[]
  count: number
  total: number
  addToCart: (v?: Variant, qty?: number) => void
  removeFromCart: (variantId: string) => void
  setQty: (variantId: string, qty: number) => void

  /* UI panels */
  cartOpen: boolean
  accountOpen: boolean
  videoOpen: boolean
  openCart: () => void
  closeCart: () => void
  openAccount: () => void
  closeAccount: () => void
  openVideo: () => void
  closeVideo: () => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [variantIdx, setVariantIdxRaw] = useState(0)
  const [items, setItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  const variant = VARIANTS[variantIdx]

  const setVariantIdx = useCallback((i: number) => {
    const next = ((i % VARIANTS.length) + VARIANTS.length) % VARIANTS.length
    setVariantIdxRaw(next)
    setBallColor(VARIANTS[next].color)
  }, [])

  const nextVariant = useCallback(
    () => setVariantIdx(variantIdx + 1),
    [variantIdx, setVariantIdx],
  )
  const prevVariant = useCallback(
    () => setVariantIdx(variantIdx - 1),
    [variantIdx, setVariantIdx],
  )

  const addToCart = useCallback(
    (v?: Variant, qty = 1) => {
      const target = v ?? VARIANTS[variantIdx]
      setItems((prev) => {
        const existing = prev.find((it) => it.variantId === target.id)
        if (existing) {
          return prev.map((it) =>
            it.variantId === target.id ? { ...it, qty: it.qty + qty } : it,
          )
        }
        return [
          ...prev,
          {
            variantId: target.id,
            name: target.name,
            price: target.price,
            qty,
          },
        ]
      })
      setCartOpen(true)
    },
    [variantIdx],
  )

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.variantId !== id))
  }, [])

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((it) => it.variantId !== id))
      return
    }
    setItems((prev) =>
      prev.map((it) => (it.variantId === id ? { ...it, qty } : it)),
    )
  }, [])

  const { count, total } = useMemo(() => {
    let c = 0
    let t = 0
    for (const it of items) {
      c += it.qty
      t += it.qty * it.price
    }
    return { count: c, total: t }
  }, [items])

  const value: AppState = {
    variantIdx,
    variant,
    nextVariant,
    prevVariant,
    setVariantIdx,
    items,
    count,
    total,
    addToCart,
    removeFromCart,
    setQty,
    cartOpen,
    accountOpen,
    videoOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    openAccount: () => setAccountOpen(true),
    closeAccount: () => setAccountOpen(false),
    openVideo: () => setVideoOpen(true),
    closeVideo: () => setVideoOpen(false),
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
