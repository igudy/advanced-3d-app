export function VerticalText() {
  return (
    <div
      className="hidden sm:block absolute top-1/2 right-4.5 sm:right-7.5 font-display text-[11px] sm:text-[13px] tracking-[0.16em] text-ink bg-accent border-[3px] border-ink px-2.5 py-1.5 shadow-brutal-sm z-5 whitespace-nowrap uppercase"
      style={{
        transform: 'translateY(-50%) rotate(90deg)',
        transformOrigin: 'right center',
      }}
    >
      90 / 10
    </div>
  )
}
