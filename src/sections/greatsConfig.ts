/**
 * Bundled images under `src/assets/` (trophies + Messi/Ronaldo).
 * Other greats use Commons `Special:FilePath` (see `commonsImage`).
 */

import { commonsImage } from '../lib/commonsImage'

/** World Cup photo lives with other chapter art under `images/`. */
const FOOTBALL_CUP = new URL('../assets/images/worldcup.jpg', import.meta.url).href
const FOOTBALL_MESSI = new URL('../assets/images/messi picture.png', import.meta.url).href
const FOOTBALL_RONALDO = new URL('../assets/images/ronaldo.png', import.meta.url).href
const BASKETBALL_TROPHY = new URL('../assets/images/larry o brian trophy.png', import.meta.url).href
const TENNIS_TROPHY = new URL('../assets/images/wimbledon.png', import.meta.url).href

export type Great = {
  name: string
  nick: string
  country: string
  honor: string
  number?: string
  image: string
}

export type SportTrophy = {
  /** Short label under the photo (e.g. “FIFA World Cup”) */
  label: string
  image: string
  alt: string
}

export type SportConfig = {
  id: 'football' | 'basketball' | 'tennis'
  eyebrowNum: string
  eyebrowLabel: string
  title: { line1: string; line2: string }
  lede: string
  /** Signature hardware for this chapter (local PNG or Wikimedia). */
  trophy: SportTrophy
  greats: Great[]
}

export const FOOTBALL: SportConfig = {
  id: 'football',
  eyebrowNum: '02',
  eyebrowLabel: 'Football',
  title: { line1: 'GOAL', line2: 'MACHINES.' },
  lede: 'Five-time World Cup winners. Ballon d’Or dynasties. The boys who turned 22 men chasing a ball into religion.',
  trophy: {
    label: 'FIFA World Cup',
    alt: 'FIFA World Cup trophy',
    image: FOOTBALL_CUP,
  },
  greats: [
    {
      name: 'Messi',
      nick: 'La Pulga',
      country: 'Argentina',
      honor: '8 Ballons d’Or · WC ’22',
      number: '10',
      image: FOOTBALL_MESSI,
    },
    {
      name: 'Ronaldo',
      nick: 'CR7',
      country: 'Portugal',
      honor: '900+ career goals',
      number: '7',
      image: FOOTBALL_RONALDO,
    },
    {
      name: 'Pelé',
      nick: 'The King',
      country: 'Brazil',
      honor: '1281 goals · 3 World Cups',
      number: '10',
      image: commonsImage('Pele_con_brasil_(cropped).jpg'),
    },
    {
      name: 'Maradona',
      nick: 'El Diego',
      country: 'Argentina',
      honor: 'Hand of God · ’86 lone savior',
      number: '10',
      image: commonsImage('Maradona_1986_vs_italy.jpg'),
    },
  ],
}

export const BASKETBALL: SportConfig = {
  id: 'basketball',
  eyebrowNum: '03',
  eyebrowLabel: 'Basketball',
  title: { line1: 'HARD', line2: 'COURT KINGS.' },
  lede: 'Six rings without a Game 7 loss. 40k career points. Mamba mentality. Hardwood gods on 94 feet of polished maple.',
  trophy: {
    label: 'Larry O’Brien trophy',
    alt: 'NBA Larry O’Brien Championship Trophy',
    image: BASKETBALL_TROPHY,
  },
  greats: [
    {
      name: 'Jordan',
      nick: 'His Airness',
      country: 'USA · Bulls',
      honor: '6× champion · 6× Finals MVP',
      number: '23',
      image: commonsImage('Michael_Jordan_in_2014.jpg'),
    },
    {
      name: 'LeBron',
      nick: 'King James',
      country: 'USA · Lakers',
      honor: '40,000+ points · 4× MVP',
      number: '23',
      image: commonsImage('LeBron_James_(51959977144)_(cropped2).jpg'),
    },
    {
      name: 'Kobe',
      nick: 'Black Mamba',
      country: 'USA · Lakers',
      honor: '81-point night · 5 rings',
      number: '24',
      image: commonsImage('Kobe_Bryant_Dec_2014.jpg'),
    },
    {
      name: 'Kareem',
      nick: 'The Captain',
      country: 'USA · Lakers',
      honor: '6× MVP · sky hook never blocked',
      number: '33',
      image: commonsImage('Kareem_Abdul-Jabbar_May_2014.jpg'),
    },
  ],
}

export const TENNIS: SportConfig = {
  id: 'tennis',
  eyebrowNum: '04',
  eyebrowLabel: 'Tennis',
  title: { line1: 'BASELINE', line2: 'IMMORTALS.' },
  lede: 'Big Three. Twenty-plus slams each. Plus the woman who beat the men’s rankings while breaking the sport open.',
  trophy: {
    label: 'Wimbledon · Gentlemen’s singles',
    alt: 'Wimbledon Championships gentlemen’s singles trophy',
    image: TENNIS_TROPHY,
  },
  greats: [
    {
      name: 'Federer',
      nick: 'Maestro',
      country: 'Switzerland',
      honor: '20 Grand Slams · 310 weeks #1',
      image: commonsImage('Roger_Federer_2015_(cropped).jpg'),
    },
    {
      name: 'Nadal',
      nick: 'King of Clay',
      country: 'Spain',
      honor: '14 French Opens · 22 Slams',
      image: commonsImage('Rafael_Nadal_en_2024_(cropped).jpg'),
    },
    {
      name: 'Djokovic',
      nick: 'Djoker',
      country: 'Serbia',
      honor: '24 Grand Slams · most ever',
      image: commonsImage('Novak_Djokovic_2024_Paris_Olympics.jpg'),
    },
    {
      name: 'Serena',
      nick: 'Queen of Tennis',
      country: 'USA',
      honor: '23 Slams · open era GOAT',
      image: commonsImage(
        'Serena_Williams_at_the_2025_International_Tennis_Hall_of_Fame_Induction_Ceremony_Press_Conference_(cropped).jpg',
      ),
    },
  ],
}
