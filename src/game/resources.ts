import { gcd } from "mathjs";
import { ResourceTypes } from "../data";
import { Ratios } from "./ratios";

export type ResourcesCollection = {
  [key in ResourceTypes]: number;
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
      initialResources: 0,
      resources: {},
    },
  ) {
    this[ResourceTypes.Wood] = resources[ResourceTypes.Wood]
      ? resources[ResourceTypes.Wood]
      : initialResources;
    this[ResourceTypes.Metal] = resources[ResourceTypes.Metal]
      ? resources[ResourceTypes.Metal]
      : initialResources;
    this[ResourceTypes.Cloth] = resources[ResourceTypes.Cloth]
      ? resources[ResourceTypes.Cloth]
      : initialResources;
    this[ResourceTypes.Diamond] = resources[ResourceTypes.Diamond]
      ? resources[ResourceTypes.Diamond]
      : initialResources;
  }

  static hydrate(resources: Resources) {
    return Object.assign(new Resources(), resources);
  }

  add(resources: Resources) {
    this[ResourceTypes.Wood] += resources[ResourceTypes.Wood];
    this[ResourceTypes.Metal] += resources[ResourceTypes.Metal];
    this[ResourceTypes.Cloth] += resources[ResourceTypes.Cloth];
    this[ResourceTypes.Diamond] += resources[ResourceTypes.Diamond];
    return this;
  }

  sub(resources: Resources) {
    this[ResourceTypes.Wood] -= resources[ResourceTypes.Wood];
    this[ResourceTypes.Metal] -= resources[ResourceTypes.Metal];
    this[ResourceTypes.Cloth] -= resources[ResourceTypes.Cloth];
    this[ResourceTypes.Diamond] -= resources[ResourceTypes.Diamond];
    return this;
  }

  sum() {
    return (
      this[ResourceTypes.Wood] +
      this[ResourceTypes.Metal] +
      this[ResourceTypes.Cloth] +
      this[ResourceTypes.Diamond]
    );
  }

  gcd() {
    return gcd(
      this[ResourceTypes.Wood],
      this[ResourceTypes.Metal],
      this[ResourceTypes.Cloth],
      this[ResourceTypes.Diamond],
    );
  }

  ratios() {
    const gcd = this.gcd();
    const ratios = new Ratios();

    ratios[ResourceTypes.Wood] = this[ResourceTypes.Wood] / gcd;
    ratios[ResourceTypes.Metal] = this[ResourceTypes.Metal] / gcd;
    ratios[ResourceTypes.Cloth] = this[ResourceTypes.Cloth] / gcd;
    ratios[ResourceTypes.Diamond] = this[ResourceTypes.Diamond] / gcd;

    return ratios;
  }
}
