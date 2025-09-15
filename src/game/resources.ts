import { gcd } from "mathjs";
import { ResourcesCollection, ResourceTypes } from "../data";
import { Ratios } from "./ratios";
import { CraeftMixin, HydrateableMixin, toEnum } from "../tools";
import type { ICraeft } from "../interfaces";

export class Resources
  extends CraeftMixin(HydrateableMixin())
  implements ResourcesCollection
{
  [ResourceTypes.Wood]: number;
  [ResourceTypes.Cloth]: number;
  [ResourceTypes.Metal]: number;
  [ResourceTypes.Gemstone]: number;
  [ResourceTypes.Water]: number;
  [ResourceTypes.Earth]: number;

  constructor({
    craeft,
    initialResources = 0,
    resources,
  }: { craeft: ICraeft } & Partial<{
    initialResources: number;
    resources: Partial<ResourcesCollection>;
  }>) {
    super(craeft);

    // propagate all the fields
    for (const resource in ResourceTypes) {
      const key = toEnum(ResourceTypes, resource);

      if (key) {
        this[key] = resources?.[key]
          ? resources[key]
          : initialResources
            ? initialResources
            : 0;
      }
    }
  }

  public static hydrate(craeft: ICraeft, resources: Resources) {
    return Object.assign(new Resources({ craeft }), resources);
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
