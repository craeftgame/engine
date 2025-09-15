import { secureRandom } from "@craeft/map-generator/dist/tools/rand";

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(secureRandom() * (max - min + 1)) + min;
};

export const getRandomArrayItem = <T>({
  array,
  start = 0,
}: {
  array: T[];
  start?: number;
}): NonNullable<T> => {
  const randomIndex = getRandomInt(start, array.length - 1);
  return array[randomIndex]!;
};

export const getRandomObjectEntry = <T>({
  object,
  start = 0,
}: {
  object: { [key: string]: T };
  start?: number;
}): T => {
  const array = Object.keys(object);

  const randomIndex = getRandomArrayItem({
    array,
    start,
  });

  return object[randomIndex]!;
};

export const getRandomId = (): string => {
  let num = "";

  const array = new Uint8Array(30);

  if (typeof window !== "undefined") {
    window.crypto.getRandomValues(array);
  }

  for (const char of array) {
    num += char.toString(16);
  }

  return num;
};
