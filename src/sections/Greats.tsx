/**
 * Sport-of-the-greats section.
 *
 * Cards show Wikipedia infobox portraits for each named athlete.
 * Parallax cards use `.parallax-card` (CSS scroll-driven animation) where supported.
 */

import { GsapSplitTitle } from '../components/GsapSplitTitle'
import type { Great, SportConfig } from './greatsConfig'

const cardBgByIndex = [
  'bg-paper',
  'bg-accent',
  'bg-ink text-paper',
  'bg-paper',
]

function CardBody({ g, i, dark }: { g: Great; i: number; dark: boolean }) {
  const ink = dark ? 'text-paper' : 'text-ink'
  const inkMuted = dark ? 'text-paper/75' : 'text-ink/65'
  const accent = dark ? 'text-accent' : 'text-ink'

  switch (i % 4) {
    case 0:
      return (
        <div className="p-5 flex flex-col grow min-h-[140px]">
          <div className={`flex items-center justify-between gap-2 mb-3 ${inkMuted}`}>
            <span className="font-ui font-bold text-[9px] tracking-[0.32em] uppercase">{g.country}</span>
          </div>
          <h3 className={`font-display text-[clamp(1.35rem,4.2vw,1.85rem)] uppercase leading-[0.95] tracking-[-0.03em] ${ink}`}>
            {g.name}
          </h3>
          <p className={`font-ui italic text-sm mt-2 ${accent}`}>{g.nick}</p>
          <p className={`font-ui text-[11px] font-medium leading-snug mt-auto pt-4 border-t-2 border-dashed ${dark ? 'border-paper/25' : 'border-ink/15'} ${inkMuted}`}>
            {g.honor}
          </p>
        </div>
      )
    case 1:
      return (
        <div className="p-5 flex flex-col grow min-h-[140px]">
          <p className={`font-display text-[10px] tracking-[0.42em] uppercase mb-2 ${inkMuted}`}>{g.nick}</p>
          <h3 className={`font-display text-[clamp(1.5rem,4.5vw,2rem)] uppercase leading-none tracking-tight ${ink}`}>
            {g.name}
          </h3>
          <div className={`mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-ui text-[11px] font-semibold tracking-wide ${inkMuted}`}>
            <span>{g.country}</span>
            <span className="opacity-40" aria-hidden>
              ·
            </span>
            <span className={`font-mono tabular-nums ${accent}`}>{g.honor}</span>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="p-5 flex flex-col grow min-h-[140px] justify-between">
          <p className={`font-ui text-[12px] sm:text-sm font-medium leading-relaxed max-w-[95%] ${dark ? 'text-paper/90' : 'text-ink/85'}`}>
            {g.honor}
          </p>
          <div className="mt-5 pt-4 border-t-4 border-ink">
            <h3 className={`font-display text-xl uppercase tracking-tight ${ink}`}>{g.name}</h3>
            <div className={`mt-1 flex items-center justify-between gap-2 ${inkMuted}`}>
              <span className="font-ui font-bold text-[9px] tracking-[0.28em] uppercase">{g.country}</span>
              <span className="font-ui italic text-xs">{g.nick}</span>
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div className="p-5 flex flex-col grow min-h-[140px] border-l-[5px] border-ink pl-5 -ml-px">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-display text-2xl uppercase leading-none tracking-[-0.04em] ${ink}`}>{g.name}</h3>
            {g.number && (
              <span
                className={`font-display text-lg shrink-0 border-2 border-ink w-9 h-9 flex items-center justify-center bg-paper ${
                  dark ? 'text-ink' : 'text-accent'
                }`}
              >
                {g.number}
              </span>
            )}
          </div>
          <p className={`font-mono text-[10px] tracking-[0.2em] uppercase mt-3 ${inkMuted}`}>
            {g.nick}
            <span className="mx-2 opacity-35">/</span>
            {g.country}
          </p>
          <p className={`font-ui text-xs font-semibold mt-auto pt-4 leading-snug ${accent}`}>{g.honor}</p>
        </div>
      )
  }
}

function TrophyCopy({ config }: { config: SportConfig }) {
  return (
    <div className="flex flex-col justify-center min-w-0 text-center md:text-left">
      <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-fg/50 mb-2">The hardware</p>
      <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-fg leading-[1.05] border-b-4 border-ink pb-2 inline-block self-center md:self-start">
        {config.trophy.label}
      </h3>
      <p className="font-ui text-sm text-fg/75 mt-4 max-w-md mx-auto md:mx-0 leading-relaxed">
        The piece of metal the whole myth bends toward — same chase, different pitch.
      </p>
    </div>
  )
}

export function SportGreats({ config }: { config: SportConfig }) {
  return (
    <section
      id={config.id}
      data-surface={config.id}
      className="relative w-full min-h-screen bg-bg px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 overflow-x-hidden scroll-mt-24 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="parallax-header flex flex-col">
          <div className="eyebrow">
            {config.eyebrowNum} / {config.eyebrowLabel}
          </div>
          <GsapSplitTitle
            className="section-title"
            line1={config.title.line1}
            line2={config.title.line2}
          />
          <p className="font-ui font-medium text-[15px] lg:text-base xl:text-lg leading-[1.4] text-fg max-w-160 mb-10 mt-2">
            {config.lede}
          </p>
        </div>

        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row items-stretch gap-6 md:gap-10 max-w-3xl lg:max-w-5xl lg:mx-0">
          <div className="relative shrink-0 mx-auto md:mx-0 w-full max-w-[200px] sm:max-w-[240px] aspect-square border-4 border-ink bg-ink overflow-hidden shadow-brutal-lg">
            <img
              src={config.trophy.image}
              alt={config.trophy.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover contrast-[1.06] saturate-[1.05]"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.opacity = '0.2'
              }}
            />
          </div>
          <TrophyCopy config={config} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {config.greats.map((g, i) => {
            const bg = cardBgByIndex[i % 4]
            const dark = bg.includes('bg-ink')
            return (
              <article
                key={g.name}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`parallax-card brutal-lift ${bg} border-4 border-ink shadow-brutal-md hover:shadow-brutal-lg flex flex-col overflow-hidden`}
              >
                <div className="relative aspect-square border-b-4 border-ink bg-ink overflow-hidden">
                  <img
                    src={g.image}
                    alt={`${g.name} · ${g.nick}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                    className="absolute inset-0 w-full h-full object-cover contrast-[1.03] saturate-[1.02]"
                  />
                  <div
                    className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/35"
                    aria-hidden
                  />
                  {g.number && i % 4 !== 3 && (
                    <div className="absolute bottom-2 right-2 z-[3] bg-ink text-accent px-2 py-1 font-display text-[11px] tracking-[0.14em] border-2 border-paper">
                      #{g.number}
                    </div>
                  )}
                </div>
                <CardBody g={g} i={i} dark={dark} />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
