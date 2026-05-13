import { BASKETBALL, FOOTBALL, TENNIS } from './greatsConfig'
import { commonsImage } from '../lib/commonsImage'

export type HallPlayer = {
  name: string
  sport: 'Football' | 'Basketball' | 'Tennis'
  image: string
}

/** Featured twelve from the site + extras (Commons file titles via `commonsImage`). */
const EXTRAS: HallPlayer[] = [
  {
    name: 'Neymar',
    sport: 'Football',
    image: commonsImage('Brazil_and_Croatia_match_at_the_FIFA_World_Cup_2018-10_(cropped).jpg'),
  },
  {
    name: 'Mbappé',
    sport: 'Football',
    image: commonsImage('Kylian_Mbappé_Russia_2018.jpg'),
  },
  {
    name: 'Zidane',
    sport: 'Football',
    image: commonsImage('Zinedine_Zidane_by_Tasnim_03.jpg'),
  },
  {
    name: 'Ronaldinho',
    sport: 'Football',
    image: commonsImage('Ronaldinho_11feb2007.jpg'),
  },
  {
    name: 'Beckham',
    sport: 'Football',
    image: commonsImage('David_Beckham_July_2017.jpg'),
  },
  {
    name: 'Curry',
    sport: 'Basketball',
    image: commonsImage('Stephen_Curry_in_2019.jpg'),
  },
  {
    name: 'Magic',
    sport: 'Basketball',
    image: commonsImage('Magic_Johnson_2019_(cropped).jpg'),
  },
  {
    name: 'Bird',
    sport: 'Basketball',
    image: commonsImage('Larry_Bird_(cropped).jpg'),
  },
  {
    name: 'Shaq',
    sport: 'Basketball',
    image: commonsImage('Shaq_attends_White_House_event_(cropped).jpg'),
  },
  {
    name: 'Duncan',
    sport: 'Basketball',
    image: commonsImage('Tim_Duncan_(cropped).jpg'),
  },
  {
    name: 'Alcaraz',
    sport: 'Tennis',
    image: commonsImage('Carlos_Alcaraz_2023_US_Open_(cropped).jpg'),
  },
  {
    name: 'Graf',
    sport: 'Tennis',
    image: commonsImage('Steffi_Graf_at_the_2019_French_Open_(cropped).jpg'),
  },
  {
    name: 'Sampras',
    sport: 'Tennis',
    image: commonsImage('Pete_Sampras_at_2010_US_Open.jpg'),
  },
  {
    name: 'Murray',
    sport: 'Tennis',
    image: commonsImage('Andy_Murray_2016.jpg'),
  },
]

function pack(
  greats: { name: string; image: string }[],
  sport: HallPlayer['sport'],
): HallPlayer[] {
  return greats.map((g) => ({ name: g.name, sport, image: g.image }))
}

const FEATURED: HallPlayer[] = [
  ...pack(FOOTBALL.greats, 'Football'),
  ...pack(BASKETBALL.greats, 'Basketball'),
  ...pack(TENNIS.greats, 'Tennis'),
]

/** Full roster for hall marquees (no duplicates by name). */
const BY_NAME = new Map<string, HallPlayer>()
for (const p of [...FEATURED, ...EXTRAS]) {
  if (!BY_NAME.has(p.name)) BY_NAME.set(p.name, p)
}
const ALL = [...BY_NAME.values()].sort((a, b) => a.name.localeCompare(b.name))

export const HALL_ROW_A: HallPlayer[] = ALL.filter((_, i) => i % 2 === 0)
export const HALL_ROW_B: HallPlayer[] = ALL.filter((_, i) => i % 2 === 1)
