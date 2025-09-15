import { ItemCategories } from "../../data";
import { Resources } from "../";
import { ExtendedArray } from "../../tools";
import { Armor } from "./armor";
import { Item } from "./item";
import { Weapon } from "./weapon";
import type { ICraeft } from "../../interfaces";

export class Items extends ExtendedArray<Item> {
  public disentchant = (
    item: Item,
  ): {
    name: string;
    resources: Resources;
  } => {
    const name = item.getName();
    const resources = item.disentchant();

    this.removeItem(item);

    return {
      name,
      resources,
    };
  };

  public static hydrate(craeft: ICraeft, items: Item[]): Items {
    const newItems = Object.assign(new Items({ craeft }), items);

    for (const itemIndex in items) {
      const item = items[itemIndex];
      let ti;

      switch (item.category) {
        case ItemCategories.Weapon:
          ti = Weapon.hydrate(craeft, item);
          break;
        case ItemCategories.Armor:
          ti = Armor.hydrate(craeft, item);
          break;
        default:
          break;
      }

      if (ti) {
        newItems[itemIndex] = ti;
      }
    }

    return newItems;
  }
}
