import { ResourcesCollection } from "../game/resources";
import { ResourceTypes, Unknown } from "../data";

// todo make this more generic, it is really resource centric
export class Ratios implements ResourcesCollection {
  [ResourceTypes.Wood]: number = 0;
  [ResourceTypes.Metal]: number = 0;
  [ResourceTypes.Cloth]: number = 0;
  [ResourceTypes.Diamond]: number = 0;
  [ResourceTypes.Water]: number = 0;
  [ResourceTypes.Earth]: number = 0;

  getHighest(): ResourceTypes | typeof Unknown {
    const sortable: {
      resource: ResourceTypes;
      amt: number;
    }[] = [];

    for (const resource in this) {
      sortable.push({
        resource: resource as ResourceTypes,
        amt: this[resource] as number,
      });
    }

    sortable.sort((first, second) => {
      return first.amt - second.amt;
    });

    const highest: ResourceTypes = sortable[sortable.length - 1].resource;

    if (this[highest] === 0) {
      return Unknown;
    }

    return highest;
  }
}
