export type MapData = {
  name: string;
  path: string;
};

export type MapGroup = {
  name: string;
  maps: MapData[];
};

export const MAPS: Record<string, MapGroup> = {
  archolos: {
    name: 'Archolos',
    maps: [
      { name: 'Glowna', path: '/imgs/maps/archolos/9_main.webp' },
      { name: 'Miasto', path: '/imgs/maps/archolos/10_city.webp' },
      { name: 'Silbach', path: '/imgs/maps/archolos/11_silbach.webp' },
    ],
  },

  g1: {
    name: 'Gothic',
    maps: [
      { name: 'Glowna', path: '/imgs/maps/g1/1_main.webp' },
      { name: 'Bagna', path: '/imgs/maps/g1/2_swamp.webp' },
      { name: 'Nowy Oboz', path: '/imgs/maps/g1/3_newcamp.webp' },
      { name: 'Stary Oboz', path: '/imgs/maps/g1/4_oldcamp.webp' },
    ],
  },

  g2nk: {
    name: 'Gothic 2: Noc Kruka',
    maps: [
      { name: 'Glowna', path: '/imgs/maps/g2nk/5_main.webp' },
      {
        name: 'Gornicza Dolina',
        path: '/imgs/maps/g2nk/6_valley.webp',
      },
      { name: 'Jarkendar', path: '/imgs/maps/g2nk/7_jarkendar.webp' },
      { name: 'Miasto', path: '/imgs/maps/g2nk/8_city.webp' },
    ],
  },
};
