import ExtendedArray from "../tools/ExtendedArray";
import Item from "./item";
import Resources from "../resources";
import { ItemCategories } from "../data/types";
import Weapon from "./weapon";
import Armor from "./armor";

export default class Items extends ExtendedArray<Item> {
  public disentchant = (
    itemId,
  ): {
    name: string;
    resources: Resources;
  } => {
    const item = this.findById(itemId);
    const name = item.getName();
    const resources = item.disentchant();

    this.removeItem(item);

    return {
      name,
      resources,
    };
  };

  static hydrate(obj: Item[]): Items {
    const items = Object.assign(new Items(), obj);

    for (const itemIndex in obj) {
      const item = obj[itemIndex];
      let ti;

      switch (item.category) {
        case ItemCategories.Weapon:
          ti = Weapon.hydrate(item);
          break;
        case ItemCategories.Armor:
          ti = Armor.hydrate(item);
          break;
        default:
          break;
      }

      items[itemIndex] = ti;
    }

    return items;
  }
}
