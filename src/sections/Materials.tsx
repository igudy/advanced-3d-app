const STATS = [
  { num: '68', unit: 'Years', label: 'Of Craft', accent: false },
  { num: '42', unit: 'Hands', label: 'Per Ball', accent: true },
  { num: '1',  unit: 'Factory', label: 'In America', accent: false },
]

export function Materials() {
  return (
    <section className="relative w-full min-h-screen px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 grid lg:grid-cols-2 gap-8 lg:gap-15 items-center overflow-hidden">
      <div className="lg:col-start-2 max-w-full w-full">
        <div className="eyebrow">04 / Craft</div>
        <h2 className="section-title huge">
          STITCHED
          <br />
          BY HAND.
        </h2>
        <p className="font-ui font-medium text-[15px] lg:text-base xl:text-lg leading-[1.4] text-ink max-w-120">
          Each ball is hand-laced in Ada, Ohio. <br />
          Same way since 1955.
        </p>
      </div>

      <div className="lg:col-start-2 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
        {STATS.map((s) => (
          <div
            key={s.label}
            className={`brutal-lift ${s.accent ? 'bg-accent' : 'bg-paper'} border-4 border-ink p-4.5 shadow-brutal-md hover:shadow-brutal-lg flex flex-col gap-1`}
          >
            <span className="font-display text-[44px] lg:text-[72px] leading-[0.9] tracking-[-0.04em] text-ink">
              {s.num}
            </span>
            <span className="font-display text-sm tracking-[0.06em] uppercase text-ink">
              {s.unit}
            </span>
            <span className="font-ui font-semibold text-[10px] tracking-[0.18em] uppercase text-ink opacity-70">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
