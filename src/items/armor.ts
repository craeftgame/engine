import {
  ItemCategories,
  ItemNames,
  Rarities,
  RarityNames,
  ResourceTypes,
  SlotNames,
  Slots,
  Types,
  Unknown,
} from "../data";
import { Resources } from "../game";
import { Item } from "./item";
import { Craefter } from "../craefter";

export class Armor extends Item {
  private readonly _def: number;
  private readonly _mdef: number;

  constructor({
    type,
    slot,
    craefter,
    name,
    level,
    rarity,
    def = 0,
    mdef = 0,
    material,
    resources,
    delay,
  }: Partial<{
    type?: Types;
    slot?: Slots;
    craefter?: Craefter;
    name?: string;
    level?: number;
    rarity?: Rarities;
    def?: number;
    mdef?: number;
    material: ResourceTypes | typeof Unknown;
    resources?: Resources;
    delay?: number;
  }> = {}) {
    super({
      category: ItemCategories.Armor,
      name,
      craefter,
      slot,
      level,
      type,
      rarity,
      material: material ?? Unknown,
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

    if (this.rarity && this.rarity !== Rarities.Common) {
      if (RarityNames[this.rarity])
        prefixes.push(RarityNames[this.rarity] ?? Unknown);
    }

    const parts: string[] = [];

    parts.push(...prefixes);

    if (this.slot) parts.push(SlotNames[this.slot] ?? Unknown);
    if (this.type) parts.push(ItemNames[this.type] ?? Unknown);

    return parts.join(" ");
  }

  static hydrate(obj: Item) {
    const armor = Object.assign(new Armor(), obj);

    Item.hydrate(armor, obj);

    return armor;
  }
}
