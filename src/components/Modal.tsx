import { useEffect, type ReactNode } from 'react'

/**
 * Generic neubrutalist modal. Backdrop click + ESC dismiss.
 * Pass `open={false}` to unmount entirely (no transition — instant on/off
 * fits the chunky aesthetic).
 */
export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  panelClassName = 'w-full max-w-md',
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  labelledBy?: string
  panelClassName?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-ink/70 cursor-pointer"
      />
      <div
        className={`relative bg-paper border-4 border-ink shadow-brutal-lg ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({
  title,
  onClose,
  id,
}: {
  title: string
  onClose: () => void
  id?: string
}) {
  return (
    <div className="flex items-center justify-between border-b-4 border-ink px-5 py-3 bg-accent">
      <h3
        id={id}
        className="font-display text-lg sm:text-xl tracking-[0.04em] uppercase text-ink"
      >
        {title}
      </h3>
      <button
        aria-label="Close"
        onClick={onClose}
        className="brutal-lift w-9 h-9 flex items-center justify-center bg-paper border-[3px] border-ink shadow-brutal-sm hover:shadow-brutal-md"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
