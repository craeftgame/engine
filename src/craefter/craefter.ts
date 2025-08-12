import { getRandomArrayItem, getRandomId } from "../tools/rand";
import { Unknown } from "../data/types";
import Organism from "../organism";
import Delay from "../delay";
import config from "../../config";
import { FirstNames, SurNames } from "../data/names";
import Resources from "../resources";
import PreItem from "../items/PreItem";

export default class Craefter extends Organism {
  isCraefting: boolean = false;
  itemId: string | null = null;
  onDoneCreating: any = null;
  type: any;

  str: number;
  int: number;
  dex: number;
  luk: number;

  delay: Delay;

  constructor({
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
  } = {}) {
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

  static hydrate(craefter, obj) {
    craefter.delay = Delay.hydrate(obj.delay);
  }

  public tick(tick: number) {
    if (this.staCurrent < this.staMax) {
      // todo calculate some creafter parameters in
      this.staCurrent += 0.1;
    }
  }

  static calculateMaterialImpact(material) {
    return ((material ? material : 0.1) / 100) * 80;
  }

  protected evaluateItemType(ratios, highestResource) {
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
  ): PreItem {
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
  ) {
    // stub please override
    this.isCraefting = true;

    // todo include resource heaviness / complexity
    this.exhaust(1);
  }

  public finishCraefting(exp) {
    this.isCraefting = false;
    this.itemId = null;

    // todo inlcude resource heaviness / complexity
    this.addExp(exp);
  }

  protected evaluateSlot(type) {}

  public exhaust(sta) {
    super.exhaust(sta);

    if (Math.floor(this.staCurrent) === 0) {
      this.dead = true;
    }
  }
}
