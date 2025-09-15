import { config } from "../../config";

import {
  ItemCategories,
  ItemNames,
  ItemSlots,
  ItemTypes,
  Rarities,
  RarityNames,
  ResourceTypes,
  SlotNames,
  Unknown,
} from "../../data";

import { Resources } from "..";
import {
  CraeftMixin,
  Delay,
  getRandomArrayItem,
  getRandomInt,
  HydrateableMixin,
} from "../../tools";
import { Craefter } from "../craefter";
import { secureRandom } from "@craeft/map-generator/dist/tools/rand";
import type { ICraeft, PlayerStats } from "../../interfaces";

export abstract class Item
  extends CraeftMixin(HydrateableMixin())
  implements PlayerStats
{
  public isEquipped = false;
  public isMultiSlot = false;
  public isBroken = false;

  public delay: Delay;
  public onDoneCreating?: (craefter: Craefter, exp: number) => void;

  protected _str: number;
  protected _int: number;
  protected _vit: number;
  protected _dex: number;
  protected _agi: number;

  // item type
  protected type: ItemTypes | string;
  // original craefter id
  private readonly craefter?: Craefter;
  // in which slot does this item fit?
  public readonly slot?: ItemSlots;
  // item category
  public readonly category: ItemCategories | typeof Unknown;
  // rarity of the item
  public readonly rarity: Rarities;
  // leading material that lead to the crafting of this item
  public readonly material: ResourceTypes | typeof Unknown;
  // item level
  public readonly level: number;
  // the name of the item
  private readonly name?: string;
  // resources used to craeft this item
  private readonly resources?: Resources;

  constructor({
    craeft,
    category = Unknown,
    name,
    craefter,
    slot,
    level = 1,
    type = Unknown,
    rarity,
    material = Unknown,
    resources,
    delay = config.initialItemDelay,
  }: { craeft: ICraeft } & Partial<{
    category: ItemCategories | typeof Unknown;
    delay: number;
    name: string;
    craefter: Craefter;
    slot: ItemSlots;
    level: number;
    type: ItemTypes;
    rarity: Rarities;
    material: ResourceTypes | typeof Unknown;
    resources: Resources;
  }>) {
    super(craeft);

    this.name = name;

    this.category = category;
    this.craefter = craefter;
    this.slot = slot;
    this.level = level;
    this.type = type ?? Unknown;
    this.material = material;
    this.resources = resources;

    this.rarity = rarity ?? Item.evaluateRarity();

    // init
    this._str = 0;
    this._int = 0;
    this._vit = 0;
    this._dex = 0;
    this._agi = 0;

    this.delay = new Delay({
      craeft,
      delayInSeconds: delay,
      onDelayExpired: () => {
        this.materialize();
      },
    });
  }

  public dex(): number {
    return this.applyRarityMultiplier(this._dex);
  }

  public str(): number {
    return this.applyRarityMultiplier(this._str);
  }

  public int(): number {
    return this.applyRarityMultiplier(this._int);
  }

  public vit(): number {
    return this.applyRarityMultiplier(this._vit);
  }

  public agi(): number {
    return this.applyRarityMultiplier(this._agi);
  }

  protected applyRarityMultiplier(stat: number): number {
    return Math.floor(
      (stat ?? 0) *
        this.level *
        (this.rarity ? config.rarityMultiplier[this.rarity] : 1),
    );
  }

  public getName(): string {
    return `${this.name ?? this.evaluateItemName()}`;
  }

  public evaluateItemName(): string {
    return `${this.rarity ? RarityNames[this.rarity] : Unknown} ${this.slot ? SlotNames[this.slot] : Unknown} ${this.type && ItemNames[this.type] ? ItemNames[this.type] : this.type}`;
  }

  protected static evaluateRarity() {
    const chance = secureRandom() * 100;

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

  public tick(_delta: number) {
    // TODO: tick, tock
  }

  protected addedAdditionalAttributes() {
    if (this.rarity === Rarities.Common) return;

    const actions = [
      () => (!this._str ? (this._str = 1) : this._str++),
      () => (!this._int ? (this._int = 1) : this._int++),
      () => (!this._vit ? (this._vit = 1) : this._vit++),
      () => (!this._dex ? (this._dex = 1) : this._dex++),
      () => (!this._agi ? (this._agi = 1) : this._agi++),
    ];

    const attribNum = Math.ceil(config.rarityMultiplier[this.rarity] / 2);

    for (let index = 0; index < attribNum; index++) {
      getRandomArrayItem({ array: actions })();
    }
  }

  protected materialize() {
    if (this.craefter) {
      this.onDoneCreating?.(
        this.craefter,
        // TODO: evaluate exp properly
        (this.resources?.sum() ?? 1) * 2,
      );

      if (this.craefter.isDead) {
        this.isBroken = true;
      }

      this.addedAdditionalAttributes();
    }
  }

  public disentchant() {
    // this item did not have any resources
    if (!this.resources) {
      // return a dummy set
      return new Resources({
        craeft: this.craeft,
        resources: {
          [ResourceTypes.Wood]: 1,
        },
      });
    }

    return new Resources({
      craeft: this.craeft,
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
        [ResourceTypes.Gemstone]: getRandomInt(
          Math.floor(
            (this.resources[ResourceTypes.Gemstone] / 100) *
              config.disentchantRecyclingPercentFrom,
          ),
          Math.floor(
            (this.resources[ResourceTypes.Gemstone] / 100) *
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

  public static hydrate(craeft: ICraeft, item: Item, obj: Item): Item {
    item.delay = Delay.hydrate(craeft, obj.delay);

    return item;
  }
}
