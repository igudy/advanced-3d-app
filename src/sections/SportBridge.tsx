import { GsapSplitTitle } from '../components/GsapSplitTitle'

type SportBridgeProps = {
  id: string
  surface: 'hero' | 'football' | 'basketball' | 'tennis' | 'outro'
  eyebrow: string
  title: [string, string]
  body: string
  /** Optional third line for extra length */
  sub?: string
}

export function SportBridge({
  id,
  surface,
  eyebrow,
  title,
  body,
  sub,
}: SportBridgeProps) {
  return (
    <section
      id={id}
      data-surface={surface}
      className="relative w-full min-h-[72vh] px-5.5 sm:px-9 lg:px-16 flex flex-col justify-center py-20 sm:py-24 overflow-hidden scroll-mt-24 border-y-4 border-ink/20"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="eyebrow">{eyebrow}</div>
        <GsapSplitTitle
          className="section-title !text-[clamp(44px,9vw,140px)] mb-6"
          line1={title[0]}
          line2={title[1]}
        />
        <p className="font-ui font-medium text-[15px] lg:text-lg xl:text-xl leading-[1.55] text-fg max-w-3xl opacity-95">
          {body}
        </p>
        {sub && (
          <p className="font-ui font-semibold text-[13px] lg:text-sm tracking-[0.06em] uppercase text-fg/75 mt-8 max-w-2xl">
            {sub}
          </p>
        )}
      </div>
    </section>
  )
}
