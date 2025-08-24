import { ResourceTypes, Unknown } from "../data";

// todo make this more generic, it is really resource centric
export class Ratios {
  [ResourceTypes.Wood]: number = 0;
  [ResourceTypes.Metal]: number = 0;
  [ResourceTypes.Cloth]: number = 0;
  [ResourceTypes.Diamond]: number = 0;

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

    sortable.sort((a, b) => {
      return a.amt - b.amt;
    });

    const highest: ResourceTypes = sortable[sortable.length - 1].resource;

    if (this[highest] === 0) {
      return Unknown;
    }

    return highest;
  }
}
