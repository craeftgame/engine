import { config } from "../config";
import {
  CraefterTypes,
  FirstNames,
  ResourceTypes,
  SurNames,
  Types,
  Unknown,
} from "../data";
import { Ratios, Resources } from "../game";
import { Item, PreItem } from "../items";
import { Organism } from "../organism";
import { Delay, getRandomArrayItem, getRandomId } from "../tools";

export abstract class Craefter<T = typeof Unknown> extends Organism {
  isCraefting: boolean = false;
  itemId?: string;
  onDoneCreating?: (exp: number) => void;
  type: CraefterTypes | typeof Unknown;

  str: number;
  int: number;
  dex: number;
  luk: number;

  delay: Delay;

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
        if (this.onDoneCreating) {
          this.onDoneCreating(
            // todo evaluate exp properly
            5,
          );
        }
      },
    });

    this.id = getRandomId();

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

  public tick(tick: number) {
    if (this.staCurrent < this.staMax) {
      // todo calculate some creafter parameters in
      this.staCurrent += 0.1;
    }
  }

  static calculateMaterialImpact(material: number) {
    return ((material ? material : 0.1) / 100) * 80;
  }

  protected evaluateItemType(ratios: Ratios, highestResource: ResourceTypes) {
    // stub please override
  }

  public evaluateItem(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources(),
    },
    // @ts-ignore
  ): PreItem<T> {
    // stub please override
  }

  public craeft(
    {
      resources,
    }: {
      resources: Resources;
    } = {
      resources: new Resources(),
    },
    // @ts-ignore
  ): Item {
    // stub please override
    this.isCraefting = true;

    // todo include resource heaviness / complexity
    this.exhaust(1);
  }

  public finishCraefting(exp: number) {
    this.isCraefting = false;
    this.itemId = undefined;

    // todo inlcude resource heaviness / complexity
    this.addExp(exp);
  }

  protected evaluateSlot(type: Types) {}

  public exhaust(sta: number) {
    super.exhaust(sta);

    if (Math.floor(this.staCurrent) === 0) {
      this.dead = true;
    }
  }
}
