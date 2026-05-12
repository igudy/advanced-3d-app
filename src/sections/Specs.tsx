const SPECS = [
  { n: '01', label: 'Full-Grain Leather', val: '100%' },
  { n: '02', label: 'Lace Grip', val: 'Pebbled' },
  { n: '03', label: 'Inflation', val: '12.5 PSI' },
  { n: '04', label: 'Bladder', val: 'Butyl' },
]

// Variant styles by index: white, accent, ink, white
const variants = [
  'bg-paper text-ink',
  'bg-accent text-ink',
  'bg-ink text-paper',
  'bg-paper text-ink',
]

export function Specs() {
  return (
    <section className="relative w-full min-h-screen px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 grid lg:grid-cols-2 gap-8 lg:gap-15 items-center overflow-hidden">
      <div className="max-w-full">
        <div className="eyebrow">02 / Engineered</div>
        <h2 className="section-title">
          NINETY
          <br />
          TEN.
        </h2>
        <p className="font-ui font-medium text-[15px] lg:text-base xl:text-lg leading-[1.4] text-ink max-w-120">
          Ninety percent leather. Ten percent rubber. <br />
          One ball built for every Sunday.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 w-full max-w-120 justify-self-stretch lg:justify-self-end">
        {SPECS.map((s, i) => (
          <article
            key={s.n}
            className={`brutal-lift ${variants[i]} border-4 border-ink p-4.5 sm:p-5.5 shadow-brutal-md hover:shadow-brutal-lg flex flex-col gap-2.5 sm:min-h-40`}
          >
            <span
              className={`font-display text-[13px] tracking-[0.16em] ${i === 2 ? 'text-accent' : 'text-ink'}`}
            >
              {s.n}
            </span>
            <span className="font-display text-[28px] lg:text-[40px] tracking-[-0.02em] leading-none uppercase">
              {s.val}
            </span>
            <span
              className={`font-ui font-bold text-[11px] tracking-[0.14em] uppercase mt-auto ${i === 2 ? 'text-accent' : 'text-ink'}`}
            >
              {s.label}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
