import {
  ArmorNames,
  ItemCategories,
  ItemNames,
  ItemSlots,
  ItemTypes,
  Rarities,
  RarityNames,
  ResourceNames,
  ResourceTypes,
  Unknown,
} from "../../data";
import { Resources } from "..";
import { Item } from "./item";
import { Craefter } from "../craefter";
import { config } from "../../config";
import { getRandomArrayItem } from "@craeft/map-generator/dist/tools/rand";
import type { ArmorStats, ICraeft } from "../../interfaces";
import { toEnum } from "../../tools";

export class Armor extends Item implements ArmorStats {
  private _def: number;
  private _mdef: number;

  constructor({
    craeft,
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
  }: { craeft: ICraeft } & Partial<{
    type: ItemTypes;
    slot: ItemSlots;
    craefter: Craefter;
    name: string;
    level: number;
    rarity: Rarities;
    def: number;
    mdef: number;
    material: ResourceTypes | typeof Unknown;
    resources: Resources;
    delay: number;
  }>) {
    super({
      craeft,
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
    return this.applyRarityMultiplier(this._def);
  }

  public mdef() {
    return this.applyRarityMultiplier(this._mdef);
  }

  override materialize() {
    if (!this.type || this.type === Unknown) {
      this.type = getRandomArrayItem({
        array: ArmorNames,
      });
    }

    if (this.isBroken) {
      this._def += config.itemBrokenMultiplier;
      this._mdef += config.itemBrokenMultiplier;
    }

    super.materialize();
  }

  public evaluateItemName() {
    const prefixes: string[] = [];

    if (this.rarity !== Rarities.Common) {
      if (RarityNames[this.rarity])
        prefixes.push(RarityNames[this.rarity] ?? Unknown);
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

  public static hydrate(craeft: ICraeft, armor: Item) {
    const newArmor = Object.assign(new Armor({ craeft }), armor);

    Item.hydrate(craeft, newArmor, armor);

    return newArmor;
  }
}
