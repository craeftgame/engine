import { config } from "../../config";

import {
  ArmorSlots,
  ArmorTypes,
  CraefterTypes,
  ItemCategories,
  ItemSlots,
  ResourceTypes,
  Unknown,
} from "../../data";
import { Ratios, Resources } from "..";
import { Armor } from "../items";

import { getRandomInt, getRandomObjectEntry } from "../../tools";
import { Craefter } from "./craefter";
import type { ICraeft, PreItem } from "../../interfaces";

export class ArmorCraefter extends Craefter<ArmorTypes> {
  constructor({
    craeft,
    delay = config.initialCraefterDelay,
    str = getRandomInt(
      config.armorCraefterInitialStr.from,
      config.armorCraefterInitialStr.to,
    ),
    int = getRandomInt(
      config.armorCraefterInitialInt.from,
      config.armorCraefterInitialInt.to,
    ),
    dex = getRandomInt(
      config.armorCraefterInitialDex.from,
      config.armorCraefterInitialDex.to,
    ),
    luk = getRandomInt(
      config.armorCraefterInitialLuk.from,
      config.armorCraefterInitialLuk.to,
    ),
  }: { craeft: ICraeft } & Partial<{
    delay: number;
    str: number;
    int: number;
    dex: number;
    luk: number;
  }>) {
    super({
      type: CraefterTypes.ArmorCraefter,
      craeft,
      delay,
      str,
      int,
      dex,
      luk,
    });

    this.expMax = config.armorCraefterInitialRequiredExp;
  }

  public static hydrate(craeft: ICraeft, craefter: Craefter) {
    const armorCraefter = Object.assign(
      new ArmorCraefter({ craeft }),
      craefter,
    );

    Craefter.hydrate(craeft, armorCraefter, craefter);

    return armorCraefter;
  }

  protected evaluateItemType(
    ratios: Ratios,
    highestResource: ResourceTypes | typeof Unknown,
  ) {
    let type: ArmorTypes | typeof Unknown = Unknown;

    switch (highestResource) {
      case ResourceTypes.Metal:
        type = ArmorTypes.MetalPlate;

        if (ratios[ResourceTypes.Cloth] > 0) {
          type = ArmorTypes.MetalChainmail;
        }
        break;
      case ResourceTypes.Wood:
        type = ArmorTypes.WoodenPlate;

        if (ratios[ResourceTypes.Cloth] > 0) {
          type = ArmorTypes.WoodenChainmail;
        }
        break;
      case ResourceTypes.Cloth:
        type = ArmorTypes.Woven;

        if (ratios[ResourceTypes.Gemstone] > 0) {
          type = ArmorTypes.JewelWoven;
        }
        break;
      default:
        break;
    }

    return type;
  }

  public override evaluateItem(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources({
        craeft: this.craeft,
      }),
    },
  ): PreItem<ArmorTypes> {
    // 2 percent of all resources is the base
    const baseline = resources.sum() / 100;

    // add atk mainly based on metal
    // TODO: add str influence
    const def =
      Math.round(
        baseline +
          Craefter.calculateMaterialImpact(resources[ResourceTypes.Metal]),
      ) * this.level;

    // add matk mainly based on wood
    // TODO: add int influence
    const mdef =
      Math.round(
        baseline +
          Craefter.calculateMaterialImpact(resources[ResourceTypes.Wood]),
      ) * this.level;

    const ratios = resources.ratios();
    const highestResource = ratios.getHighest();

    return {
      category: ItemCategories.Armor,
      type: this.evaluateItemType(ratios, highestResource),
      rarity: Unknown,
      material: highestResource,
      def,
      defMax: Math.round(def + def * Math.log(2)) ?? 1,
      mdef,
      mdefMax: Math.round(mdef + mdef * Math.log(2)) ?? 1,
    };
  }

  protected evaluateSlot(_type: ArmorTypes | typeof Unknown): ItemSlots {
    return getRandomObjectEntry({
      object: ArmorSlots,
    });
  }

  public craeftItem(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources({ craeft: this.craeft }),
    },
  ) {
    super.craeftItem({
      resources,
    });

    const { type, material, def, defMax, mdef, mdefMax } = this.evaluateItem({
      resources,
    });

    const slot = this.evaluateSlot(type);

    const item = new Armor({
      craeft: this.craeft,
      type,
      material,
      resources,
      slot,
      delay: resources.sum() / this.level,
      craefter: this,
      level: this.level,
      def: def && defMax ? getRandomInt(def, defMax) : 0,
      mdef: mdef && mdefMax ? getRandomInt(mdef, mdefMax) : 0,
    });

    this.itemId = item.id;

    return item;
  }
}
