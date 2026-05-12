/**
 * Wikipedia infobox portraits (upload.wikimedia.org) — real likenesses per athlete page.
 */

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
  /** Signature hardware for this chapter (Wikimedia photo). */
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
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/FIFA_World_Cup_Trophy_%28cropped%29.jpg/800px-FIFA_World_Cup_Trophy_%28cropped%29.jpg',
  },
  greats: [
    {
      name: 'Messi',
      nick: 'La Pulga',
      country: 'Argentina',
      honor: '8 Ballons d’Or · WC ’22',
      number: '10',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/6/6b/Lionel_Messi_White_House_2026_%283x4_cropped%29.jpg',
    },
    {
      name: 'Ronaldo',
      nick: 'CR7',
      country: 'Portugal',
      honor: '900+ career goals',
      number: '7',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/9/9c/President_Donald_Trump_meets_with_Cristiano_Ronaldo_in_the_Oval_Office_%2854933344262%29_%28cropped_and_rotated%29.jpg',
    },
    {
      name: 'Pelé',
      nick: 'The King',
      country: 'Brazil',
      honor: '1281 goals · 3 World Cups',
      number: '10',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_%28cropped%29.jpg',
    },
    {
      name: 'Maradona',
      nick: 'El Diego',
      country: 'Argentina',
      honor: 'Hand of God · ’86 lone savior',
      number: '10',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Maradona_1986_vs_italy.jpg/500px-Maradona_1986_vs_italy.jpg',
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
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Larry_O%27Brien_NBA_Championship_Trophy.jpg/800px-Larry_O%27Brien_NBA_Championship_Trophy.jpg',
  },
  greats: [
    {
      name: 'Jordan',
      nick: 'His Airness',
      country: 'USA · Bulls',
      honor: '6× champion · 6× Finals MVP',
      number: '23',
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg',
    },
    {
      name: 'LeBron',
      nick: 'King James',
      country: 'USA · Lakers',
      honor: '40,000+ points · 4× MVP',
      number: '23',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/7/7a/LeBron_James_%2851959977144%29_%28cropped2%29.jpg',
    },
    {
      name: 'Kobe',
      nick: 'Black Mamba',
      country: 'USA · Lakers',
      honor: '81-point night · 5 rings',
      number: '24',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Kobe_Bryant_Dec_2014.jpg',
    },
    {
      name: 'Kareem',
      nick: 'The Captain',
      country: 'USA · Lakers',
      honor: '6× MVP · sky hook never blocked',
      number: '33',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/a/a0/Kareem_Abdul-Jabbar_May_2014.jpg',
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
    image:
      'https://upload.wikimedia.org/wikipedia/commons/1/1a/Gentlemen%27s_Singles_Trophy_Wimbledon_2023.jpg',
  },
  greats: [
    {
      name: 'Federer',
      nick: 'Maestro',
      country: 'Switzerland',
      honor: '20 Grand Slams · 310 weeks #1',
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Roger_Federer_2015_%28cropped%29.jpg',
    },
    {
      name: 'Nadal',
      nick: 'King of Clay',
      country: 'Spain',
      honor: '14 French Opens · 22 Slams',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/7/71/Rafael_Nadal_en_2024_%28cropped%29.jpg',
    },
    {
      name: 'Djokovic',
      nick: 'Djoker',
      country: 'Serbia',
      honor: '24 Grand Slams · most ever',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/d/d7/Novak_Djokovic_2024_Paris_Olympics.jpg',
    },
    {
      name: 'Serena',
      nick: 'Queen of Tennis',
      country: 'USA',
      honor: '23 Slams · open era GOAT',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/d/d3/Serena_Williams_at_the_2025_International_Tennis_Hall_of_Fame_Induction_Ceremony_Press_Conference_%28cropped%29.jpg',
    },
  ],
}
