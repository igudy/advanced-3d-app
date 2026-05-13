import { BASKETBALL, FOOTBALL, TENNIS } from './greatsConfig'
import { commonsImage } from '../lib/commonsImage'

export type HallPlayer = {
  name: string
  sport: 'Football' | 'Basketball' | 'Tennis'
  image: string
}

/** Featured twelve from the site + extras (Commons `File:` names via `commonsImage`; titles must exist on Commons). */
const EXTRAS: HallPlayer[] = [
  {
    name: 'Neymar',
    sport: 'Football',
    image: commonsImage('Neymar_Jr._with_Al_Hilal,_3_October_2023_-_03_(cropped).jpg'),
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
    image: commonsImage('David_Beckham_UNICEF_(cropped2).jpg'),
  },
  {
    name: 'Curry',
    sport: 'Basketball',
    image: commonsImage('Stephen_Curry,_Olympic_Games_2024_(cropped).jpg'),
  },
  {
    name: 'Magic',
    sport: 'Basketball',
    image: commonsImage('Magic_Johnson_at_SXSW_2022_(51958828669)_(cropped).jpg'),
  },
  {
    name: 'Bird',
    sport: 'Basketball',
    image: commonsImage('Larrybird.jpg'),
  },
  {
    name: 'Shaq',
    sport: 'Basketball',
    image: commonsImage('TechCrunch_Disrupt_2023_-_Day_1_(cropped).jpg'),
  },
  {
    name: 'Duncan',
    sport: 'Basketball',
    image: commonsImage("Tim_Duncan_Walks_Verizon_Center's_Floor_(cropped)_(cropped).jpg"),
  },
  {
    name: 'Alcaraz',
    sport: 'Tennis',
    image: commonsImage('Carlos_Alcaraz_2025_FO.jpg'),
  },
  {
    name: 'Graf',
    sport: 'Tennis',
    image: commonsImage('Steffi_Graf_in_Hamburg_2010_(cropped).jpg'),
  },
  {
    name: 'Sampras',
    sport: 'Tennis',
    image: commonsImage('Pete_Sampras_Champions_Shootout_2.jpg'),
  },
  {
    name: 'Murray',
    sport: 'Tennis',
    image: commonsImage('2015_Australian_Open_-_Andy_Murray_12_(cropped).jpg'),
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
