export const arraysHaveCommonItems = (
  array1: string[],
  array2: string[]
): boolean => array1.some((item) => array2.includes(item));
