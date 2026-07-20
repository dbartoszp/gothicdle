export type MapData = {
  name: string;
  path: string;
  naturalWidth: number;
  naturalHeight: number;
};

export type MapGroup = {
  name: string;
  maps: MapData[];
};

export const MAPS: Record<string, MapGroup> = {
  archolos: {
    name: 'Archolos',
    maps: [
      { name: 'Glowna', path: '/imgs/maps/archolos/9_main.webp', naturalWidth: 1000, naturalHeight: 991 },
      { name: 'Miasto', path: '/imgs/maps/archolos/10_city.webp', naturalWidth: 1000, naturalHeight: 1000 },
      { name: 'Silbach', path: '/imgs/maps/archolos/11_silbach.webp', naturalWidth: 1000, naturalHeight: 1018 },
    ],
  },

  g1: {
    name: 'Gothic',
    maps: [
      { name: 'Glowna', path: '/imgs/maps/g1/1_main.webp', naturalWidth: 2270, naturalHeight: 1770 },
      { name: 'Bagna', path: '/imgs/maps/g1/2_swamp.webp', naturalWidth: 1000, naturalHeight: 756 },
      { name: 'Nowy Oboz', path: '/imgs/maps/g1/3_newcamp.webp', naturalWidth: 1000, naturalHeight: 755 },
      { name: 'Stary Oboz', path: '/imgs/maps/g1/4_oldcamp.webp', naturalWidth: 1000, naturalHeight: 755 },
    ],
  },

  g2nk: {
    name: 'Gothic 2: Noc Kruka',
    maps: [
      { name: 'Glowna', path: '/imgs/maps/g2nk/5_main.webp', naturalWidth: 1000, naturalHeight: 767 },
      { name: 'Gornicza Dolina', path: '/imgs/maps/g2nk/6_valley.webp', naturalWidth: 990, naturalHeight: 740 },
      { name: 'Jarkendar', path: '/imgs/maps/g2nk/7_jarkendar.webp', naturalWidth: 1000, naturalHeight: 750 },
      { name: 'Miasto', path: '/imgs/maps/g2nk/8_city.webp', naturalWidth: 1024, naturalHeight: 768 },
    ],
  },
};
