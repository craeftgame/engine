import { Resources } from "game";
import { config } from "../config";

import {
  ItemCategories,
  ItemNames,
  Rarities,
  RarityNames,
  ResourceTypes,
  Slots,
  Types,
  Unknown,
  WeaponTypes,
} from "../data";
import { getRandomInt } from "../tools";
import { Item } from "./item";

export class Weapon extends Item {
  private readonly _atk: number = 0;
  private readonly _matk: number = 0;

  constructor({
    type = Unknown,
    slot,
    craefterId,
    name,
    level = 1,
    rarity,
    atk = 0,
    matk = 0,
    material,
    resources,
    delay,
  }: {
    delay?: number;
    name?: string;
    type?: Types;
    slot?: Slots;
    craefterId?: string;
    material?: ResourceTypes | typeof Unknown;
    rarity?: Rarities;
    level?: number;
    atk?: number;
    matk?: number;
    resources?: Resources;
  } = {}) {
    super({
      category: ItemCategories.Weapon,
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

    this.isMultiSlot = this.canBeTwoHanded() && getRandomInt(0, 1) === 1;

    this._atk = atk;
    this._matk = matk;
  }

  public atk() {
    return (
      this._atk *
      this.level *
      (this.rarity ? config.rarityMultiplier[this.rarity] : 1)
    );
  }

  public matk() {
    return (
      this._matk *
      this.level *
      (this.rarity ? config.rarityMultiplier[this.rarity] : 1)
    );
  }

  private canBeTwoHanded() {
    return !(
      this.type === WeaponTypes.Knife ||
      this.type === WeaponTypes.JewelKnife ||
      this.type === WeaponTypes.Wand ||
      this.type === WeaponTypes.JewelWand
    );
  }

  evaluateItemName() {
    const prefixes: string[] = [];

    if (this.rarity && this.rarity !== Rarities.Common) {
      prefixes.push(RarityNames[this.rarity] ?? Unknown);
    }

    if (this.canBeTwoHanded()) {
      prefixes.push(this.isMultiSlot ? "Two-Handed" : "One-Handed");
    }

    const parts: string[] = [];

    parts.push(...prefixes);
    if (this.type) parts.push(ItemNames[this.type] ?? Unknown);

    return parts.join(" ");
  }

  static hydrate(obj: Item) {
    const weapon = Object.assign(new Weapon(), obj);

    Item.hydrate(weapon, obj);

    return weapon;
  }
}
