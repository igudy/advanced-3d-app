import type { ReactNode } from 'react'
import { GsapSplitTitle } from '../components/GsapSplitTitle'

export type SportBridgeAlign = 'left' | 'right' | 'center'

type SportBridgeProps = {
  id: string
  surface: 'hero' | 'football' | 'basketball' | 'tennis' | 'outro'
  eyebrow: string
  title: [string, string]
  body: ReactNode
  /** Optional third line — string or spaced poetic lines */
  sub?: ReactNode
  /** Copy alignment; outer gutters match `SportGreats` (`max-w-7xl mx-auto`). */
  align?: SportBridgeAlign
}

export function SportBridge({
  id,
  surface,
  eyebrow,
  title,
  body,
  sub,
  align = 'left',
}: SportBridgeProps) {
  const stack =
    align === 'right'
      ? 'flex flex-col items-end text-right'
      : align === 'center'
        ? 'flex flex-col items-center text-center'
        : 'flex flex-col items-start text-left'

  const bodyWrap =
    align === 'center' ? 'max-w-3xl mx-auto w-full' : align === 'right' ? 'max-w-3xl ml-auto w-full' : 'max-w-3xl w-full'

  const subWrap =
    align === 'center' ? 'max-w-2xl mx-auto w-full' : align === 'right' ? 'max-w-2xl ml-auto w-full' : 'max-w-2xl w-full'

  return (
    <section
      id={id}
      data-surface={surface}
      className="relative w-full min-h-[72vh] bg-transparent px-5.5 sm:px-9 lg:px-16 flex flex-col justify-center py-20 sm:py-24 overflow-hidden scroll-mt-24 border-y-4 border-ink/20 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className={`${stack} w-full`}>
          <div className="eyebrow">{eyebrow}</div>
          <GsapSplitTitle
            className="section-title !text-[clamp(44px,9vw,140px)] mb-6"
            line1={title[0]}
            line2={title[1]}
          />
          {typeof body === 'string' ? (
            <p
              className={`font-ui font-medium text-[15px] lg:text-lg xl:text-xl leading-[1.65] text-fg opacity-95 tracking-tight text-pretty m-0 ${bodyWrap}`}
            >
              {body}
            </p>
          ) : (
            <div
              className={`font-ui font-medium text-[15px] lg:text-lg xl:text-xl leading-[1.65] text-fg opacity-95 tracking-tight text-pretty space-y-3.5 ${bodyWrap}`}
            >
              {body}
            </div>
          )}
          {sub != null && (
            <div
              className={`font-ui font-medium text-[12px] sm:text-sm tracking-[0.04em] text-fg/80 mt-8 leading-relaxed text-pretty ${subWrap}`}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
