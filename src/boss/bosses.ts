import { ExtendedArray } from "../tools";
import { Boss } from "./boss";

/**
 * Spider - Tsuchigumo
 * Dragon - Tatsu
 * Fish - Namazu
 */
export class Bosses extends ExtendedArray<Boss> {
  constructor() {
    super();

    const bosses: Boss[] = [
      new Boss({
        name: "Namazu",
        level: 12,
        type: "fish",
        hp: 123,
      }),
      new Boss({
        name: "Tsuchigumo",
        level: 1,
        type: "spider",
        hp: 12,
      }),
      new Boss({
        name: "Tatsu",
        level: 3,
        type: "dragon",
        hp: 12,
      }),
    ];

    bosses[0].dead = true;

    this.push(...bosses);
  }

  static hydrate(obj: Boss[]): Bosses {
    return Object.assign(new Bosses(), obj);
  }
}
