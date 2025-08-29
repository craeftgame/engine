import { gcd } from "mathjs";
import { ResourceTypes } from "../data";
import { Ratios } from "./ratios";

export type ResourcesCollection = {
  [key in ResourceTypes]: number;
};

export const toEnum = <T extends { [key: string]: string }>(
  enumObj: T,
  key: string,
): T[keyof T] | undefined => {
  // Try matching against keys first (case-insensitive)
  const matchedKey = Object.keys(enumObj).find(
    (tempKey) => tempKey.toLowerCase() === key.toLowerCase(),
  );
  if (matchedKey) return enumObj[matchedKey as keyof T];

  // If no match, try matching against values (case-insensitive)
  const matchedValue = Object.values(enumObj).find(
    (tmpValue) => tmpValue.toLowerCase() === key.toLowerCase(),
  );
  if (matchedValue) return matchedValue as T[keyof T];

  return undefined; // not found
};

export class Resources implements ResourcesCollection {
  [ResourceTypes.Wood]: number;
  [ResourceTypes.Cloth]: number;
  [ResourceTypes.Metal]: number;
  [ResourceTypes.Diamond]: number;
  [ResourceTypes.Water]: number;
  [ResourceTypes.Earth]: number;

  constructor(
    {
      initialResources = 0,
      resources,
    }: {
      initialResources?: number;
      resources: Partial<ResourcesCollection>;
    } = {
      resources: {},
    },
  ) {
    // propagate all the fields
    for (const resource in ResourceTypes) {
      const key = toEnum(ResourceTypes, resource);

      if (key) {
        this[key] = resources[key]
          ? resources[key]
          : initialResources
            ? initialResources
            : 0;
      }
    }
  }

  static hydrate(resources: Resources) {
    return Object.assign(new Resources(), resources);
  }

  add(resources: Resources) {
    for (const resource of Object.keys(this)) {
      const key = toEnum(ResourceTypes, resource);
      if (key) this[key] += resources[key];
    }

    return this;
  }

  sub(resources: Resources) {
    for (const resource of Object.keys(this)) {
      const key = toEnum(ResourceTypes, resource);
      if (key) this[key] -= resources[key];
    }

    return this;
  }

  sum() {
    let sum = 0;

    for (const resource of Object.keys(this)) {
      const key = toEnum(ResourceTypes, resource);
      if (key) sum += this[key];
    }

    return sum;
  }

  gcd() {
    const gcdValues: number[] = [];

    for (const resource of Object.keys(this)) {
      const key = toEnum(ResourceTypes, resource);
      if (key) gcdValues.push(this[key]);
    }

    return gcd(...gcdValues);
  }

  public ratios() {
    const gcd = this.gcd();
    const ratios = new Ratios();

    for (const resource of Object.keys(this)) {
      const key = toEnum(ResourceTypes, resource);
      if (key) ratios[key] = this[key] / gcd;
    }

    return ratios;
  }
}
