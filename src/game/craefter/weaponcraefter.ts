import { log, round } from "mathjs";

import { config } from "../../config";

import {
  CraefterTypes,
  ItemCategories,
  ItemTypes,
  ResourceTypes,
  Unknown,
  WeaponTypes,
} from "../../data";
import { Ratios, Resources } from "..";
import { Weapon } from "../items";

import { getRandomInt } from "../../tools";
import { Craefter } from "./craefter";
import type { ICraeft, PreItem } from "../../interfaces";

export class WeaponCraefter extends Craefter<WeaponTypes> {
  constructor({
    craeft,
    delay = config.initialCraefterDelay,
    str = getRandomInt(
      config.weaponCraefterInitialStr.from,
      config.weaponCraefterInitialStr.to,
    ),
    int = getRandomInt(
      config.weaponCraefterInitialInt.from,
      config.weaponCraefterInitialInt.to,
    ),
    dex = getRandomInt(
      config.weaponCraefterInitialDex.from,
      config.weaponCraefterInitialDex.to,
    ),
    luk = getRandomInt(
      config.weaponCraefterInitialLuk.from,
      config.weaponCraefterInitialLuk.to,
    ),
  }: { craeft: ICraeft } & Partial<{
    delay: number;
    str: number;
    int: number;
    dex: number;
    luk: number;
  }>) {
    super({
      type: CraefterTypes.WeaponCraefter,
      craeft,
      delay,
      str,
      int,
      dex,
      luk,
    });

    this.expMax = config.weaponCraefterInitialRequiredExp;
  }

  public static hydrate(craeft: ICraeft, craefter: Craefter) {
    const weaponcraefter = Object.assign(
      new WeaponCraefter({ craeft }),
      craefter,
    );

    Craefter.hydrate(craeft, weaponcraefter, craefter);

    return weaponcraefter;
  }

  protected evaluateItemType(
    ratios: Ratios,
    highestResource: ResourceTypes | typeof Unknown,
  ) {
    let type: ItemTypes = Unknown;

    switch (highestResource) {
      case ResourceTypes.Metal:
        type = WeaponTypes.Sword;

        if (ratios[ResourceTypes.Wood] > 0) {
          type = WeaponTypes.Knife;

          if (ratios[ResourceTypes.Metal] > ratios[ResourceTypes.Wood] * 2) {
            type = WeaponTypes.Sword;
          }
        }
        break;
      case ResourceTypes.Wood:
        type = WeaponTypes.Staff;

        if (ratios[ResourceTypes.Gemstone] > 0) {
          type = WeaponTypes.Wand;
        }
        break;
      case ResourceTypes.Gemstone:
        if (
          ratios[ResourceTypes.Wood] > 0 &&
          ratios[ResourceTypes.Wood] > ratios[ResourceTypes.Metal] * 2 &&
          ratios[ResourceTypes.Gemstone] > ratios[ResourceTypes.Wood] * 2
        ) {
          type = WeaponTypes.JewelWand;
        }

        if (
          ratios[ResourceTypes.Metal] > 0 &&
          ratios[ResourceTypes.Wood] > 0 &&
          ratios[ResourceTypes.Gemstone] >
            ratios[ResourceTypes.Metal] + ratios[ResourceTypes.Wood]
        ) {
          type = WeaponTypes.JewelKnife;
        }

        if (
          ratios[ResourceTypes.Metal] > 0 &&
          ratios[ResourceTypes.Gemstone] > ratios[ResourceTypes.Metal] * 2
        ) {
          if (ratios[ResourceTypes.Metal] > ratios[ResourceTypes.Wood] * 2) {
            type = WeaponTypes.JewelSword;
          }
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
      resources: new Resources({ craeft: this.craeft }),
    },
  ): PreItem<WeaponTypes> {
    // 2 percent of all resources is the base
    const baseline = resources.sum() / 100;

    // add atk mainly based on metal
    // TODO: add str influence
    const atk =
      round(
        baseline +
          Craefter.calculateMaterialImpact(resources[ResourceTypes.Metal]),
      ) * this.level;

    // add matk mainly based on wood
    // TODO: add int influence
    const matk =
      round(
        baseline +
          Craefter.calculateMaterialImpact(resources[ResourceTypes.Wood]),
      ) * this.level;

    const ratios = resources.ratios();
    const highestResource = ratios.getHighest();

    return {
      category: ItemCategories.Weapon,
      type: this.evaluateItemType(ratios, highestResource),
      rarity: Unknown,
      material: highestResource,
      atk,
      // TODO: let this be influenced by luk
      atkMax: round(atk + atk * log(2)) ?? 1,
      matk,
      // TODO: let this be influenced by luk
      matkMax: round(matk + matk * log(2)) ?? 1,
    };
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

    const { type, material, atk, atkMax, matk, matkMax } = this.evaluateItem({
      resources,
    });

    const item = new Weapon({
      craeft: this.craeft,
      type,
      material,
      resources,
      delay: resources.sum() / this.level,
      level: this.level,
      craefter: this,
      // TODO: include luk
      atk: atk && atkMax ? getRandomInt(atk, atkMax) : 0,
      matk: matk && matkMax ? getRandomInt(matk, matkMax) : 0,
    });

    this.itemId = item.id;

    return item;
  }
}
