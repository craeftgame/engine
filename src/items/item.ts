import { config } from "../config";

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
import { Delay, getRandomId, getRandomInt } from "../tools";

export class Item {
  equipped = false;
  isMultiSlot = false;
  delay: Delay;
  onDoneCreating?: (craefterId: string, exp: number) => void;
  id: string;

  type?: Types;
  craefterId?: string;
  slot?: Slots;
  category;
  rarity?: Rarities;
  material?: ResourceTypes | typeof Unknown;
  level: number;
  name?: string;
  private readonly resources?: Resources;

  constructor({
    category,
    name,
    craefterId,
    slot,
    level = 1,
    type,
    rarity,
    material,
    resources,
    delay = config.initialItemDelay,
  }: {
    category?: ItemCategories;
    delay?: number;
    name?: string;
    craefterId?: string;
    slot?: Slots;
    level?: number;
    type?: Types;
    rarity?: Rarities;
    material?: ResourceTypes | typeof Unknown;
    resources?: Resources;
  } = {}) {
    this.id = getRandomId();

    this.category = category;
    this.craefterId = craefterId;
    this.slot = slot;
    this.level = level;
    this.type = type;
    this.rarity = rarity;
    this.material = material;
    this.resources = resources;
    this.name = name;

    this.rarity = rarity || Item.evaluateRarity();

    this.delay = new Delay({
      delayInSeconds: delay,
      onDelayExpired: () => {
        this.meterialize();
      },
    });
  }

  public getName(): string {
    return this.name || this.evaluateItemName();
  }

  public evaluateItemName(): string {
    return `${this.rarity ? RarityNames[this.rarity] : Unknown} ${this.slot ? SlotNames[this.slot] : Unknown} ${this.type ? ItemNames[this.type] : Unknown}`;
  }

  static evaluateRarity() {
    const chance = Math.random() * 100;

    if (chance < config.rarityChancePercentCommon) {
      return Rarities.Common;
    } else if (chance < config.rarityChancePercentRare) {
      return Rarities.Rare;
    } else if (chance < config.rarityChancePercentEpic) {
      return Rarities.Epic;
    }
    // 98-99
    else {
      return Rarities.Legendary;
    }
  }

  public tick() {
    // todo: tick, tock
  }

  private meterialize() {
    this.craefterId &&
      this.onDoneCreating?.(
        this.craefterId,
        // todo evaluate exp properly
        (this.resources?.sum() ?? 1) * 2,
      );
  }

  public disentchant() {
    // this item did not have any resources
    if (!this.resources) {
      // return a dummy set
      return new Resources({
        resources: {
          [ResourceTypes.Wood]: 1,
        },
      });
    }

    return new Resources({
      resources: {
        [ResourceTypes.Wood]: getRandomInt(
          Math.floor(
            (this.resources[ResourceTypes.Wood] / 100) *
              config.disentchantRecyclingPercentFrom,
          ),
          Math.floor(
            (this.resources[ResourceTypes.Wood] / 100) *
              config.disentchantRecyclingPercentTo,
          ),
        ),
        [ResourceTypes.Metal]: getRandomInt(
          Math.floor(
            (this.resources[ResourceTypes.Metal] / 100) *
              config.disentchantRecyclingPercentFrom,
          ),
          Math.floor(
            (this.resources[ResourceTypes.Metal] / 100) *
              config.disentchantRecyclingPercentTo,
          ),
        ),
        [ResourceTypes.Diamond]: getRandomInt(
          Math.floor(
            (this.resources[ResourceTypes.Diamond] / 100) *
              config.disentchantRecyclingPercentFrom,
          ),
          Math.floor(
            (this.resources[ResourceTypes.Diamond] / 100) *
              config.disentchantRecyclingPercentTo,
          ),
        ),
        [ResourceTypes.Cloth]: getRandomInt(
          Math.floor(
            (this.resources[ResourceTypes.Cloth] / 100) *
              config.disentchantRecyclingPercentFrom,
          ),
          Math.floor(
            (this.resources[ResourceTypes.Cloth] / 100) *
              config.disentchantRecyclingPercentTo,
          ),
        ),
      },
    });
  }

  static hydrate(item: Item, obj: Item) {
    item.delay = Delay.hydrate(obj.delay);
  }
}
