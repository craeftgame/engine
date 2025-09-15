import { ResourcesCollection, ResourceTypes, Unknown } from "../data";
import { toEnum } from "../tools";

// TODO: make this more generic, it is really resource centric
export class Ratios implements ResourcesCollection {
  [ResourceTypes.Wood]: number;
  [ResourceTypes.Metal]: number;
  [ResourceTypes.Cloth]: number;
  [ResourceTypes.Gemstone]: number;
  [ResourceTypes.Water]: number;
  [ResourceTypes.Earth]: number;

  constructor() {
    for (const resource in this) {
      const key = toEnum(ResourceTypes, resource);
      if (key) this[key] = 0;
    }
  }

  getHighest(): ResourceTypes | typeof Unknown {
    const sortable: {
      resource: ResourceTypes;
      amount: number;
    }[] = [];

    for (const resource in this) {
      const key = toEnum(ResourceTypes, resource);

      if (key)
        sortable.push({
          resource: key,
          amount: this[key] as number,
        });
    }

    sortable.sort((first, second) => {
      return first.amount - second.amount;
    });

    const highest: ResourceTypes = sortable[sortable.length - 1].resource;

    if (this[highest] === 0) {
      return Unknown;
    }

    return highest;
  }
}
