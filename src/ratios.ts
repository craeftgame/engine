import {
    Unknown,
    ResourceTypes
} from "./data/types";

// todo make this more generic, it is really resource centric
export default class Ratios {

    // @ts-ignore
    [ResourceTypes.Wood] = 0;
    // @ts-ignore
    [ResourceTypes.Metal] = 0;
    // @ts-ignore
    [ResourceTypes.Cloth] = 0;
    // @ts-ignore
    [ResourceTypes.Diamond] = 0;

    getHighest() {
        const sortable: any[] = [];

        for (const resource of Object.getOwnPropertySymbols(this)) {
            sortable.push([
                resource,
                this[resource]
            ]);
        }

        sortable.sort(function (a, b) {
            return a[1] - b[1];
        });

        const highest = sortable[sortable.length - 1][0];

        if (this[highest] === 0) {
            return Unknown;
        }

        return highest;
    }
}