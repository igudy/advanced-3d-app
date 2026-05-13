import { GsapSplitTitle } from '../components/GsapSplitTitle'

export function CTASection() {
  return (
    <section
      id="legends"
      data-surface="outro"
      className="relative w-full min-h-[80vh] bg-bg px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-24 flex items-center justify-center text-center overflow-hidden scroll-mt-24 pointer-events-auto"
    >
      <div className="parallax-header flex flex-col items-center text-center gap-2 w-full max-w-full">
        <div className="eyebrow">10 / Legends</div>
        <GsapSplitTitle
          className="section-title mega text-center"
          line1="NEVER"
          line2="FORGOTTEN."
        />
        <p className="font-ui font-medium text-[15px] lg:text-base xl:text-lg leading-[1.4] text-fg max-w-160 mt-2 mb-8 mx-auto">
          Twelve names. Three sports. One shared verb: dominate.
          <br />
          Scroll up. Watch them again.
        </p>

        <a
          href="#top"
          className="brutal-lift bg-ink text-accent font-display text-[15px] sm:text-lg tracking-[0.18em] uppercase border-4 border-ink shadow-brutal-lg hover:shadow-brutal-xl hover:bg-accent hover:text-ink flex items-center justify-center gap-2.5 mt-4 w-full sm:w-110 h-18 sm:h-21"
        >
          Back to the top <span className="font-display text-xl">↑</span>
        </a>

        <div className="mt-5.5 font-ui font-semibold text-[11px] tracking-[0.18em] uppercase text-fg/75 max-w-lg">
          Portraits: Wikimedia Commons / English Wikipedia infobox sources (CC-licensed where noted on
          Commons). Tribute site — not affiliated with any league or athlete.
        </div>
      </div>
    </section>
  )
}
