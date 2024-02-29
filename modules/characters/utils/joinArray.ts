export const joinArray = (arr: (string | null)[] | null): string => {
  if (!arr) return '';
  return arr.filter((item) => item !== null).join(', ');
};
