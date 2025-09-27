import { config } from "../../config";
import {
  CraefterTypes,
  FirstNames,
  ItemSlots,
  ItemTypes,
  ResourceTypes,
  SurNames,
  Unknown,
} from "../../data";
import { Ratios, Resources } from "..";
import { Item } from "../items";
import { Organism } from "../../organism";
import { Delay, getRandomArrayItem } from "../../tools";
import type { CraefterStats, ICraeft, PreItem } from "../../interfaces";

export abstract class Craefter<T = ItemTypes>
  extends Organism
  implements CraefterStats
{
  public isCraefting: boolean = false;
  public itemId?: string;
  public onDoneCreating?: (exp: number) => void;
  public type: CraefterTypes | typeof Unknown;

  protected _str: number;
  protected _int: number;
  protected _dex: number;
  protected _luk: number;

  public delay: Delay;

  protected constructor({
    craeft,
    type = Unknown,
    name = getRandomArrayItem({
      array: FirstNames,
    }) +
      " " +
      getRandomArrayItem({
        array: SurNames,
      }),
    delay = config.initialCraefterDelay,
    str,
    int,
    dex,
    luk,
    sta = config.craefterInitialSta,
  }: { craeft: ICraeft } & Partial<{
    type: CraefterTypes | typeof Unknown;
    name: string;
    delay: number;
    str: number;
    int: number;
    dex: number;
    luk: number;
    sta: number;
  }>) {
    super({
      name,
      craeft,
      sta,
    });

    this.delay = new Delay({
      craeft: this.craeft,
      delayInSeconds: delay,
      onDelayExpired: () => {
        this.onDoneCreating?.(5);
      },
    });

    this.type = type;
    this.name = name;

    this._str = str ?? 0;
    this._int = int ?? 0;
    this._dex = dex ?? 0;
    this._luk = luk ?? 0;
  }

  public str(): number {
    return this._str;
  }

  public int(): number {
    return this._int;
  }

  public dex(): number {
    return this._dex;
  }

  public luk(): number {
    return this._luk;
  }

  public static hydrate(craeft: ICraeft, craefter: Craefter, obj: Craefter) {
    craefter.delay = Delay.hydrate(craeft, obj.delay);

    return craefter;
  }

  public tick?(_tick: number): void {
    if (this.staCurrent < this.staMax && !this.isDead) {
      // TODO: calculate some craefter's parameters in
      this.staCurrent += (99.9 / this.staMax) * 0.1;
    }
  }

  static calculateMaterialImpact(material: number) {
    return ((material ? material : 0.1) / 100) * 80;
  }

  public static calculateExhaustion(resources: Resources) {
    return Math.floor(
      resources.sum() * config.craefterMaterialExhaustionMultiplier,
    );
  }

  protected abstract evaluateItemType(
    ratios: Ratios,
    highestResource: ResourceTypes,
  ): T | typeof Unknown;

  public abstract evaluateItem({
    resources,
  }: {
    resources: Resources;
  }): PreItem<T>;

  public craeftItem(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources({ craeft: this.craeft }),
    },
    // @ts-expect-error base class implementation
  ): Item {
    // stub please override
    this.isCraefting = true;

    // TODO: include resource heaviness / complexity
    this.exhaust(Craefter.calculateExhaustion(resources));
  }

  public finishCraefting(exp: number) {
    this.isCraefting = false;
    delete this.itemId;

    this.addExp(exp);

    if (this.isDead) {
      this.craeft.log(`Cräfter "${this.name}" has died!`);
    }
  }

  protected evaluateSlot(_type: ItemTypes): ItemSlots | typeof Unknown {
    return Unknown;
  }

  public exhaust(sta: number) {
    super.exhaust(sta);

    if (Math.floor(this.staCurrent) === 0) {
      this.isDead = true;
    }
  }
}
