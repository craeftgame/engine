import { CraefterTypes, ItemTypes } from "../../data";
import { ExtendedArray } from "../../tools";
import { ArmorCraefter } from "./armorcraefter";
import { Craefter } from "./craefter";
import { WeaponCraefter } from "./weaponcraefter";
import type { ICraeft } from "../../interfaces";

export class Craefters extends ExtendedArray<Craefter<ItemTypes>> {
  public bury = (craefter: Craefter): string => {
    const name = craefter.name;
    this.removeItem(craefter);

    return name;
  };

  public static hydrate(craeft: ICraeft, craefters: Craefter[]): Craefters {
    const newCraefters = Object.assign(new Craefters({ craeft }), craefters);

    for (const craefterIndex in craefters) {
      const craefter = craefters[craefterIndex];
      let tc;

      switch (craefter.type) {
        case CraefterTypes.WeaponCraefter:
          tc = WeaponCraefter.hydrate(craeft, craefter);
          break;
        case CraefterTypes.ArmorCraefter:
          tc = ArmorCraefter.hydrate(craeft, craefter);
          break;
        default:
          break;
      }

      if (tc) {
        newCraefters[craefterIndex] = tc;
      }
    }

    return newCraefters;
  }
}
