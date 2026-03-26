export const calculateExponentialScore = (
  distance: number,
  naturalWidth: number,
  naturalHeight: number
): number => {
  const diagonal = Math.sqrt(
    naturalWidth * naturalWidth + naturalHeight * naturalHeight
  );

  const A = 0.1 * diagonal;

  const perfectRadius = 20;

  const effectiveDistance = Math.max(0, distance - perfectRadius);

  const score = 5000 * Math.exp(-effectiveDistance / A);

  return Math.round(score);
};
