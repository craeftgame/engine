import { secureRandom } from "@craeft/map-generator/dist/tools/rand";

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  //The maximum is exclusive and the minimum is inclusive
  return Math.floor(secureRandom() * (max - min + 1)) + min;
};

export const getRandomArrayItem = <T>({
  array,
  start = 0,
}: {
  array: T[];
  start?: number;
}) => {
  const randomIndex = getRandomInt(start, array.length - 1);
  return array[randomIndex];
};

export const getRandomObjectEntry = <T>({
  object,
  start = 0,
}: {
  object: { [key: string]: T };
  start?: number;
}) => {
  const array = Object.keys(object);

  const randomIndex = getRandomArrayItem<string>({
    array,
    start,
  });

  return object[randomIndex];
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
