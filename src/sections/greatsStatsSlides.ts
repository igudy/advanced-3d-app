import { FOOTBALL, BASKETBALL, TENNIS } from './greatsConfig'
import type { Great } from './greatsConfig'

export type StatLine = { label: string; value: string }

export type GreatStatSlide = Great & {
  sportLabel: string
  sportKey: 'football' | 'basketball' | 'tennis'
  stats: StatLine[]
}

const FB: StatLine[][] = [
  [
    { label: 'Career goals', value: '1,281+' },
    { label: 'FIFA World Cups', value: '3' },
    { label: 'Brazil caps', value: '92' },
    { label: 'Ballon d’Or', value: '7' },
  ],
  [
    { label: 'World Cup', value: '1986 · Argentina' },
    { label: 'FIFA Goal of Century', value: '2002 poll' },
    { label: 'Argentina caps', value: '91' },
    { label: 'Clubs', value: 'Boca · Barça · Napoli' },
  ],
  [
    { label: 'Ballon d’Or', value: '8' },
    { label: 'World Cup', value: '2022 · Golden Ball' },
    { label: 'Copa América', value: '2021 · 2024' },
    { label: 'Career goals', value: '800+' },
  ],
  [
    { label: 'Career goals', value: '900+' },
    { label: 'UEFA Champions League', value: '5' },
    { label: 'Ballon d’Or', value: '5' },
    { label: 'Nations League', value: '2019' },
  ],
]

const BB: StatLine[][] = [
  [
    { label: 'NBA titles', value: '6' },
    { label: 'Finals MVP', value: '6' },
    { label: 'Scoring titles', value: '10' },
    { label: 'Career PPG', value: '30.1' },
  ],
  [
    { label: 'Career points', value: '40,000+' },
    { label: 'NBA titles', value: '4' },
    { label: 'Season MVP', value: '4' },
    { label: 'All-NBA', value: '20×' },
  ],
  [
    { label: 'Single-game high', value: '81 pts' },
    { label: 'NBA titles', value: '5' },
    { label: 'All-Star', value: '18' },
    { label: 'Oscars', value: '2018 · Animated Short' },
  ],
  [
    { label: 'Career points', value: '38,387' },
    { label: 'Season MVP', value: '6' },
    { label: 'NBA titles', value: '6' },
    { label: 'All-Star', value: '19' },
  ],
]

const TN: StatLine[][] = [
  [
    { label: 'Grand Slam singles', value: '20' },
    { label: 'Weeks at No. 1', value: '310' },
    { label: 'Wimbledon', value: '8 titles' },
    { label: 'Tour Finals', value: '6' },
  ],
  [
    { label: 'Roland Garros', value: '14 titles' },
    { label: 'Grand Slam singles', value: '22' },
    { label: 'Olympic gold', value: '2008 · Beijing' },
    { label: 'Career titles', value: '92' },
  ],
  [
    { label: 'Grand Slam singles', value: '24' },
    { label: 'Weeks at No. 1', value: '428+' },
    { label: 'ATP Masters', value: '40' },
    { label: 'Career titles', value: '100+' },
  ],
  [
    { label: 'Grand Slam singles', value: '23' },
    { label: 'Weeks at No. 1', value: '319' },
    { label: 'Olympic gold', value: '4' },
    { label: 'WTA titles', value: '73' },
  ],
]

function pack(
  great: Great,
  sportLabel: string,
  sportKey: GreatStatSlide['sportKey'],
  stats: StatLine[],
): GreatStatSlide {
  return { ...great, sportLabel, sportKey, stats }
}

export const FOOTBALL_STAT_SLIDES: GreatStatSlide[] = FOOTBALL.greats.map((g, i) =>
  pack(g, 'Football', 'football', FB[i]!),
)

export const BASKETBALL_STAT_SLIDES: GreatStatSlide[] = BASKETBALL.greats.map((g, i) =>
  pack(g, 'Basketball', 'basketball', BB[i]!),
)

export const TENNIS_STAT_SLIDES: GreatStatSlide[] = TENNIS.greats.map((g, i) =>
  pack(g, 'Tennis', 'tennis', TN[i]!),
)

/** All twelve slides (e.g. tests or future combined views) */
export const GREAT_STAT_SLIDES: GreatStatSlide[] = [
  ...FOOTBALL_STAT_SLIDES,
  ...BASKETBALL_STAT_SLIDES,
  ...TENNIS_STAT_SLIDES,
]
