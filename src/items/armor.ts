import Item from "./item";
import { Unknown, ItemCategories, Rarities } from "../data/types";
import { ItemNames, RarityNames, SlotNames } from "../data/names";
import Resources from "../resources";

export default class Armor extends Item {
  private readonly _def: number = 0;
  private readonly _mdef: number = 0;

  constructor({
    type = Unknown,
    slot = Unknown,
    craefterId,
    name,
    level,
    rarity,
    def = 0,
    mdef = 0,
    material,
    resources,
    delay,
  }: {
    type?: any;
    slot?: any;
    craefterId?: string;
    name?: string;
    level?: number;
    rarity?: any;
    def?: number;
    mdef?: number;
    material?: string;
    resources?: Resources;
    delay?: number;
  } = {}) {
    super({
      category: ItemCategories.Armor,
      name,
      craefterId,
      slot,
      level,
      type,
      rarity,
      material,
      resources,
      delay,
    });

    this._def = def;
    this._mdef = mdef;
  }

  public def() {
    return this._def * this.level;
  }

  public mdef() {
    return this._mdef * this.level;
  }

  evaluateItemName() {
    const prefixes: string[] = [];

    if (this.rarity !== Rarities.Common) {
      prefixes.push(RarityNames[this.rarity]);
    }

    const parts: string[] = [];

    parts.push(...prefixes);

    parts.push(SlotNames[this.slot]);
    parts.push(ItemNames[this.type]);

    return parts.join(" ");
  }

  static hydrate(obj) {
    const armor = Object.assign(new Armor(), obj);

    Item.hydrate(armor, obj);

    return armor;
  }
}
