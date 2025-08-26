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
  public equipped = false;
  public isMultiSlot = false;
  delay: Delay;
  onDoneCreating?: (crafterId: string, exp: number) => void;
  id: string;

  // item type
  protected readonly type?: Types;
  // original craefter id
  private readonly craefterId?: string;
  // in which slot does this item fit?
  public readonly slot?: Slots;
  // item category
  public readonly category: ItemCategories | typeof Unknown;
  // rarity of the item
  public readonly rarity?: Rarities;
  // leading material that lead to the crafting of this item
  public readonly material: ResourceTypes | typeof Unknown;
  // item level
  public readonly level: number;
  // the name of the item
  private readonly name?: string;
  // resources used to craeft this item
  private readonly resources?: Resources;

  constructor(
    {
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
      category: ItemCategories | typeof Unknown;
      delay?: number;
      name?: string;
      craefterId?: string;
      slot?: Slots;
      level?: number;
      type?: Types;
      rarity?: Rarities;
      material: ResourceTypes | typeof Unknown;
      resources?: Resources;
    } = {
      category: Unknown,
      material: Unknown,
    },
  ) {
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
        this.materialize();
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

  private materialize() {
    if (this.craefterId) {
      this.onDoneCreating?.(
        this.craefterId,
        // todo evaluate exp properly
        (this.resources?.sum() ?? 1) * 2,
      );
    }
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
