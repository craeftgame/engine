import { config } from "../config";
import { craeft } from "../craeft";
import {
  CraefterTypes,
  FirstNames,
  ResourceTypes,
  Slots,
  SurNames,
  Types,
  Unknown,
} from "../data";
import { Ratios, Resources } from "../game";
import { Item, PreItem } from "../items";
import { Organism } from "../organism";
import { Delay, getRandomArrayItem } from "../tools";

export abstract class Craefter<T = Types> extends Organism {
  isCraefting: boolean = false;
  itemId?: string;
  public onDoneCreating?: (exp: number) => void;
  type: CraefterTypes | typeof Unknown;

  public str: number;
  public int: number;
  public dex: number;
  public luk: number;

  public delay: Delay;

  protected constructor({
    type = Unknown,
    name = getRandomArrayItem({
      array: FirstNames,
    }) +
      " " +
      getRandomArrayItem({
        array: SurNames,
      }),
    delay = config.initialCraefterDelay,
    str = 0,
    int = 0,
    dex = 0,
    luk = 0,
    sta = config.craefterInitialSta,
  }: Partial<{
    type: CraefterTypes | typeof Unknown;
    name: string;
    delay: number;
    str: number;
    int: number;
    dex: number;
    luk: number;
    sta: number;
  }> = {}) {
    super({
      name,
      sta,
    });

    this.delay = new Delay({
      delayInSeconds: delay,
      onDelayExpired: () => {
        this.onDoneCreating?.(5);
      },
    });

    this.type = type;
    this.name = name;

    this.str = str;
    this.int = int;
    this.dex = dex;
    this.luk = luk;
  }

  static hydrate(craefter: Craefter, obj: Craefter) {
    craefter.delay = Delay.hydrate(obj.delay);
  }

  public tick(_tick: number) {
    if (this.staCurrent < this.staMax && !this.isDead) {
      // todo calculate some creafter parameters in
      this.staCurrent += 0.1;
    }
  }

  static calculateMaterialImpact(material: number) {
    return ((material ? material : 0.1) / 100) * 80;
  }

  public static calculateExhaustion(resources: Resources) {
    return Math.floor(resources.sum() * 0.75);
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

  public craeft(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources(),
    },
    // @ts-expect-error base class implementation
  ): Item {
    // stub please override
    this.isCraefting = true;

    // todo include resource heaviness / complexity
    this.exhaust(Craefter.calculateExhaustion(resources));
  }

  public finishCraefting(exp: number) {
    this.isCraefting = false;
    delete this.itemId;

    this.addExp(exp);

    if (this.isDead) {
      craeft.logs.push(`Cräfter "${this.name}" has died!`);
    }
  }

  protected evaluateSlot(_type: Types): Slots | typeof Unknown {
    return Unknown;
  }

  public exhaust(sta: number) {
    super.exhaust(sta);

    if (Math.floor(this.staCurrent) === 0) {
      this.isDead = true;
    }
  }
}
