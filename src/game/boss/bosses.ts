import { ExtendedArray } from "../../tools";
import { Boss } from "./boss";
import type { ICraeft } from "../../interfaces";

/**
 * Spider - Tsuchigumo
 * Dragon - Tatsu
 * Fish - Namazu
 */
export class Bosses extends ExtendedArray<Boss> {
  constructor({ craeft }: { craeft: ICraeft }) {
    super({ craeft });

    const bosses: Boss[] = [
      new Boss({
        craeft,
        name: "Namazu",
        level: 12,
        type: "fish",
        hp: 123,
      }),
      new Boss({
        craeft,
        name: "Tsuchigumo",
        level: 1,
        type: "spider",
        hp: 12,
      }),
      new Boss({
        craeft,
        name: "Tatsu",
        level: 3,
        type: "dragon",
        hp: 12,
      }),
    ];

    bosses[0]!.isDead = true;

    this.push(...bosses);
  }

  public static hydrate(craeft: ICraeft, boss: Boss[]): Bosses {
    return Object.assign(new Bosses({ craeft }), boss);
  }
}
