import { MAPS } from '../mapPaths/mapPaths';

export const getMapPathById = (mapId: number): string | null => {
  for (const group of Object.values(MAPS)) {
    for (const map of group.maps) {
      const idFromPath = Number(map.path.match(/\/(\d+)_/)?.[1]);

      if (idFromPath === mapId) {
        return map.path;
      }
    }
  }

  return null;
};
