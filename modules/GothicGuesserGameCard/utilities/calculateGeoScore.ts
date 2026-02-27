export const calculateGeoScore = (
  distance: number,
  naturalWidth: number,
  naturalHeight: number
): number => {
  const maxDistance = Math.sqrt(
    naturalWidth * naturalWidth + naturalHeight * naturalHeight
  );

  const normalized = distance / maxDistance;

  const p = 1.5;

  const score = 5000 * (1 - Math.pow(normalized, p));

  return Math.max(0, Math.round(score));
};
