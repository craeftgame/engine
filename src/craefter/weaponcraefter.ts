import Weapon from "../items/weapon";
import Craefter from "./craefter";

import {
  CraefterTypes,
  ItemCategories,
  ResourceTypes,
  Unknown,
  WeaponTypes,
} from "../data/types";

import { getRandomInt } from "../tools/rand";

import { log, round } from "mathjs";

import config from "../config";
import Resources from "../resources";
import PreItem from "../items/PreItem";

export default class WeaponCraefter extends Craefter {
  constructor({
    delay = config.initialCraefterDelay,
    str = config.weaponCraefterInitialStr,
    int = config.weaponCraefterInitialInt,
    dex = config.weaponCraefterInitialDex,
    luk = config.weaponCraefterInitialLuk,
  } = {}) {
    super({
      type: CraefterTypes.WeaponCraefter,
      delay,
      str,
      int,
      dex,
      luk,
    });

    this.expMax = config.weaponCraefterInitialRequiredExp;
  }

  static hydrate(obj) {
    const weaponcraefter = Object.assign(new WeaponCraefter(), obj);

    Craefter.hydrate(weaponcraefter, obj);

    return weaponcraefter;
  }

  protected evaluateItemType(ratios, highestResource) {
    let type = Unknown;

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

        if (ratios[ResourceTypes.Diamond] > 0) {
          type = WeaponTypes.Wand;
        }
        break;
      case ResourceTypes.Diamond:
        if (
          ratios[ResourceTypes.Wood] > 0 &&
          ratios[ResourceTypes.Wood] > ratios[ResourceTypes.Metal] * 2 &&
          ratios[ResourceTypes.Diamond] > ratios[ResourceTypes.Wood] * 2
        ) {
          type = WeaponTypes.JewelWand;
        }

        if (
          ratios[ResourceTypes.Metal] > 0 &&
          ratios[ResourceTypes.Wood] > 0 &&
          ratios[ResourceTypes.Diamond] >
            ratios[ResourceTypes.Metal] + ratios[ResourceTypes.Wood]
        ) {
          type = WeaponTypes.JewelKnife;
        }

        if (
          ratios[ResourceTypes.Metal] > 0 &&
          ratios[ResourceTypes.Diamond] > ratios[ResourceTypes.Metal] * 2
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

  public evaluateItem(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources(),
    },
  ): PreItem {
    // 2 percent of all resources is the base
    const baseline = resources.sum() / 100;

    // add atk mainly based on metal
    // todo add str influence
    const atk =
      round(
        baseline +
          Craefter.calculateMaterialImpact(resources[ResourceTypes.Metal]),
      ) * this.level;

    // add matk mainly based on wood
    // todo add int influence
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
      // todo: let this be influenced by luk
      atkMax: round(atk + atk * log(2)) || 1,
      matk,
      // todo: let this be influenced by luk
      matkMax: round(matk + matk * log(2)) || 1,
    };
  }

  public craeft(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources(),
    },
  ) {
    super.craeft({
      resources,
    });

    const { type, material, atk, atkMax, matk, matkMax } = this.evaluateItem({
      resources,
    });

    const item = new Weapon({
      type,
      material,
      resources,
      delay: resources.sum() / this.level,
      level: this.level,
      craefterId: this.id,
      // todo include luk
      atk: getRandomInt(atk, atkMax),
      matk: getRandomInt(matk, matkMax),
    });

    this.itemId = item.id;

    return item;
  }
}
