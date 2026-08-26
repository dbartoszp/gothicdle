export type ClickZone = {
  polygon: [number, number][];
  targetMapPath: string;
};

export type MapData = {
  name: string;
  path: string;
  naturalWidth: number;
  naturalHeight: number;
  clickZones?: ClickZone[];
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
      {
        name: 'Glowna',
        path: '/imgs/maps/g2nk/5_main.webp',
        naturalWidth: 1000,
        naturalHeight: 767,
        clickZones: [
          {
            targetMapPath: '/imgs/maps/g2nk/8_city.webp',
            polygon: [[210,408],[210,405],[213,399],[225,376],[235,366],[236,359],[236,353],[249,341],[252,341],[254,339],[264,337],[267,336],[270,336],[274,336],[278,336],[281,336],[285,339],[289,346],[300,353],[303,355],[308,357],[327,358],[333,358],[335,359],[340,357],[348,357],[353,356],[355,358],[357,359],[372,369],[374,372],[383,392],[384,398],[384,401],[384,406],[384,412],[380,422],[373,428],[371,429],[320,465],[302,471],[295,471],[267,463],[254,471],[239,469],[236,467],[234,462],[229,460],[224,460],[213,463],[210,462],[205,464],[200,466],[188,470],[184,470],[180,471],[179,470],[176,470],[172,471],[170,470],[178,463],[168,468],[169,466],[169,465],[169,464],[201,441],[202,437],[204,434],[204,431],[209,416]],
          },
        ],
      },
      { name: 'Gornicza Dolina', path: '/imgs/maps/g2nk/6_valley.webp', naturalWidth: 990, naturalHeight: 740 },
      { name: 'Jarkendar', path: '/imgs/maps/g2nk/7_jarkendar.webp', naturalWidth: 1000, naturalHeight: 750 },
      { name: 'Miasto', path: '/imgs/maps/g2nk/8_city.webp', naturalWidth: 1024, naturalHeight: 768 },
    ],
  },
};
