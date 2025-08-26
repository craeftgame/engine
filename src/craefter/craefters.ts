import { CraefterTypes, Types } from "../data";
import { ExtendedArray } from "../tools";
import { ArmorCraefter } from "./armorcraefter";
import { Craefter } from "./craefter";
import { WeaponCraefter } from "./weaponcraefter";

export class Craefters extends ExtendedArray<Craefter<Types>> {
  public bury = (craefter: Craefter): string => {
    const name = craefter.name;
    this.removeItem(craefter);

    return name;
  };

  static hydrate(obj: Craefter[]): Craefters {
    const craefters = Object.assign(new Craefters(), obj);

    for (const craefterIndex in obj) {
      const craefter = obj[craefterIndex];
      let tc;

      switch (craefter.type) {
        case CraefterTypes.WeaponCraefter:
          tc = WeaponCraefter.hydrate(craefter);
          break;
        case CraefterTypes.ArmorCraefter:
          tc = ArmorCraefter.hydrate(craefter);
          break;
        default:
          break;
      }

      craefters[craefterIndex] = tc;
    }

    return craefters;
  }
}
