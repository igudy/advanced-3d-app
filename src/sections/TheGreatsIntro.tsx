import { HALL_ROW_A, HALL_ROW_B, type HallPlayer } from "./greatsHallPlayers";

function HallMarquee({
  players,
  reverse,
}: {
  players: HallPlayer[];
  reverse?: boolean;
}) {
  const track = [...players, ...players];
  return (
    <div
      className={`hall-marquee pointer-events-none flex w-max ${
        reverse ? "hall-marquee--reverse" : ""
      }`}
      aria-hidden
    >
      {track.map((p, i) => (
        <div key={`${p.name}-${i}`} className="hall-card">
          <div className="hall-card__media">
            <img
              src={p.image}
              alt=""
              className="hall-card__img"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hall-card__meta">
            <p className="font-display text-[10px] sm:text-[11px] uppercase leading-tight tracking-tight text-ink line-clamp-2">
              {p.name}
            </p>
            <p className="font-mono text-[7px] sm:text-[8px] tracking-[0.14em] uppercase text-ink/60 mt-1">
              {p.sport}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full-width hall: SportBridge-style title, large player cards (~6 / viewport),
 * marquees keep CSS auto-scroll; Commons URLs load via `commonsImage` helper.
 */
export function TheGreatsIntro() {
  return (
    <section
      id="the-greats"
      data-surface="hero"
      aria-label="The Greats, hall of players"
      className="relative w-full min-h-screen scroll-mt-24 pointer-events-auto overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-center gap-6 sm:gap-7 py-28 sm:py-32 opacity-100">
        <div className="min-h-0 overflow-hidden">
          <HallMarquee players={HALL_ROW_A} />
        </div>
        <div className="min-h-0 overflow-hidden">
          <HallMarquee players={HALL_ROW_B} reverse />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-none flex-col items-stretch px-5.5 sm:px-9 lg:px-16 pt-26 sm:pt-28 lg:pt-32 pb-16 sm:pb-20">
        <div className="eyebrow self-start">02 / Hall</div>
      </div>
    </section>
  );
}
