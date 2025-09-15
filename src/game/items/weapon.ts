import { config } from "../../config";

import {
  ItemCategories,
  ItemNames,
  ItemSlots,
  ItemTypes,
  Rarities,
  RarityNames,
  ResourceNames,
  ResourceTypes,
  Unknown,
  WeaponNames,
  WeaponTypes,
} from "../../data";
import { Resources } from "..";
import { getRandomInt, toEnum } from "../../tools";
import { Item } from "./item";
import { Craefter } from "../craefter";
import { getRandomArrayItem } from "@craeft/map-generator/dist/tools/rand";
import type { ICraeft, WeaponStats } from "../../interfaces";

export class Weapon extends Item implements WeaponStats {
  private _atk: number;
  private _matk: number;

  constructor({
    craeft,
    type,
    slot,
    craefter,
    name,
    level,
    rarity,
    atk = 0,
    matk = 0,
    material,
    resources,
    delay,
  }: { craeft: ICraeft } & Partial<{
    delay: number;
    name: string;
    type: ItemTypes;
    slot: ItemSlots;
    craefter: Craefter;
    material: ResourceTypes | typeof Unknown;
    rarity: Rarities;
    level: number;
    atk: number;
    matk: number;
    resources: Resources;
  }>) {
    super({
      craeft,
      category: ItemCategories.Weapon,
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

    this._atk = atk;
    this._matk = matk;
  }

  public atk(): number {
    return this.applyRarityMultiplier(this._atk);
  }

  public matk(): number {
    return this.applyRarityMultiplier(this._matk);
  }

  override materialize() {
    if (!this.type || this.type === Unknown) {
      this.type = getRandomArrayItem({
        array: WeaponNames,
      });
    }

    this.isMultiSlot =
      this.canBeTwoHanded() &&
      getRandomInt(0, config.itemChanceTwoHanded - 1) === 0;

    if (this.isBroken) {
      this._atk += config.itemBrokenMultiplier;
      this._matk += config.itemBrokenMultiplier;
    }

    super.materialize();
  }

  private canBeTwoHanded() {
    return (
      this.type === WeaponTypes.Staff ||
      this.type === WeaponTypes.Sword ||
      this.type === WeaponTypes.JewelSword
    );
  }

  public evaluateItemName() {
    const prefixes: string[] = [];

    if (this.rarity !== Rarities.Common) {
      prefixes.push(RarityNames[this.rarity] ?? Unknown);
    }

    if (this.canBeTwoHanded() && this.isMultiSlot) {
      prefixes.push("Two-Handed");
    }

    const parts: string[] = [];

    parts.push(...prefixes);

    if (this.type) {
      const name = ItemNames[this.type];

      if (name) {
        parts.push(name);
      } else {
        const material = toEnum(ResourceTypes, this.material);

        if (material && ResourceNames[material]) {
          parts.push(ResourceNames[material]);
        }

        parts.push(this.type);
      }
    }

    return parts.join(" ");
  }

  public static hydrate(craeft: ICraeft, weapon: Item) {
    const newWeapon = Object.assign(new Weapon({ craeft }), weapon);

    Item.hydrate(craeft, newWeapon, weapon);

    return newWeapon;
  }
}
