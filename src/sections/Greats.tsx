/**
 * Sport-of-the-greats section.
 *
 * Cards show Wikipedia infobox portraits for each named athlete.
 * Parallax cards use `.parallax-card` (CSS scroll-driven animation) where supported.
 */

import { GsapSplitTitle } from '../components/GsapSplitTitle'
import type { SportConfig } from './greatsConfig'

const cardBgByIndex = [
  'bg-paper',
  'bg-accent',
  'bg-ink text-paper',
  'bg-paper',
]

export function SportGreats({ config }: { config: SportConfig }) {
  return (
    <section
      id={config.id}
      data-surface={config.id}
      className="relative w-full min-h-screen px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 overflow-hidden scroll-mt-24"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {config.greats.map((g, i) => {
            const bg = cardBgByIndex[i % 4]
            const dark = bg.includes('bg-ink')
            return (
              <article
                key={g.name}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`parallax-card brutal-lift ${bg} border-4 border-ink shadow-brutal-md hover:shadow-brutal-lg flex flex-col`}
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
                  {g.number && (
                    <div className="absolute bottom-2 right-2 bg-ink text-accent px-2 py-1 font-display text-[11px] tracking-[0.14em] border-2 border-paper">
                      #{g.number}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-1 grow">
                  <div className="font-display text-lg uppercase tracking-[0.02em]">
                    {g.name}
                  </div>
                  <div
                    className={`font-ui font-bold text-[10px] tracking-[0.2em] uppercase ${
                      dark ? 'text-accent' : 'text-ink opacity-70'
                    }`}
                  >
                    {g.nick} · {g.country}
                  </div>
                  <div
                    className={`font-ui font-semibold text-[12px] leading-[1.4] mt-2 ${
                      dark ? 'text-paper' : 'text-ink'
                    }`}
                  >
                    {g.honor}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
