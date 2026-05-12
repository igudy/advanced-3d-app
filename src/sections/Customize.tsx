import { useState } from 'react'
import { setBallColor } from '../store/ballSignal'

const COLORS = [
  { hex: '#4A1F10', name: 'Classic' },
  { hex: '#0A0A0A', name: 'Onyx' },
  { hex: '#FFFFFF', name: 'Snow' },
  { hex: '#FFE51F', name: 'Voltage' },
  { hex: '#FF5A1F', name: 'Inferno' },
]

const SIZES = ['7"', '9"', '11"']

export function Customize() {
  const [colorIdx, setColorIdx] = useState(0)
  const [sizeIdx, setSizeIdx] = useState(1)
  const [engrave, setEngrave] = useState('')

  function pickColor(i: number) {
    setColorIdx(i)
    setBallColor(COLORS[i].hex)
  }

  return (
    <section
      id="customize"
      className="relative w-full min-h-screen px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 grid lg:grid-cols-2 gap-8 lg:gap-15 items-center overflow-hidden scroll-mt-24"
    >
      <div className="lg:col-start-2 max-w-full w-full lg:justify-self-end">
        <div className="eyebrow">03 / Customize</div>
        <h2 className="section-title">
          MAKE IT
          <br />
          YOURS.
        </h2>
        <p className="font-ui font-medium text-[15px] lg:text-base xl:text-lg leading-[1.4] text-ink max-w-120 mt-2">
          {COLORS[colorIdx].name} · Size {SIZES[sizeIdx]}
          {engrave && ` · "${engrave.toUpperCase()}"`}
        </p>
      </div>

      <div className="lg:col-start-2 bg-paper border-4 border-ink p-5 sm:p-6 shadow-brutal-lg flex flex-col gap-5 w-full max-w-120 lg:justify-self-end">
        <CustomizeRow label="Color">
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map((c, i) => {
              const active = i === colorIdx
              return (
                <button
                  key={c.name}
                  aria-label={c.name}
                  aria-pressed={active}
                  onClick={() => pickColor(i)}
                  style={{ background: c.hex }}
                  className={
                    active
                      ? 'w-9 h-9 border-[3px] border-ink cursor-pointer transition-transform duration-100 -translate-x-0.5 -translate-y-0.5 shadow-brutal-sm'
                      : 'w-9 h-9 border-[3px] border-ink cursor-pointer transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-sm'
                  }
                />
              )
            })}
          </div>
        </CustomizeRow>

        <CustomizeRow label="Size">
          <div className="flex gap-2 flex-wrap">
            {SIZES.map((s, i) => {
              const active = i === sizeIdx
              return (
                <button
                  key={s}
                  aria-pressed={active}
                  onClick={() => setSizeIdx(i)}
                  className={
                    active
                      ? 'font-display text-sm tracking-[0.06em] bg-ink text-accent border-[3px] border-ink px-4.5 py-2.5'
                      : 'font-display text-sm tracking-[0.06em] text-ink bg-paper border-[3px] border-ink px-4.5 py-2.5 hover:bg-accent transition-colors'
                  }
                >
                  {s}
                </button>
              )
            })}
          </div>
        </CustomizeRow>

        <CustomizeRow label="Engrave">
          <input
            className="engrave-input"
            placeholder="Your name"
            maxLength={12}
            value={engrave}
            onChange={(e) => setEngrave(e.target.value)}
          />
        </CustomizeRow>
      </div>
    </section>
  )
}

function CustomizeRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5">
      <span className="font-display text-xs tracking-[0.18em] uppercase text-ink sm:w-20 shrink-0">
        {label}
      </span>
      {children}
    </div>
  )
}
