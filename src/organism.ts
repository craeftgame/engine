import { log } from "mathjs";

import { config } from "./config";
import type { Tickable } from "./tools";
import { getRandomId, log as logger } from "./tools";

export abstract class Organism implements Tickable {
  public readonly id: string;

  public name: string;
  public level: number = 1;

  public isDead: boolean;

  public staCurrent: number;
  public staMax: number;

  public expCurrent: number = 0;
  public expMax: number;

  public hpCurrent: number;
  public hpMax: number;

  protected constructor(
    {
      name,
      sta,
      hp,
    }: {
      name: string;
      sta?: number;
      hp?: number;
    } = {
      name: "Organism",
    },
  ) {
    this.isDead = false;

    this.id = getRandomId();

    this.name = name;

    this.expMax = config.organismInitialRequiredExp;

    this.staCurrent = sta ? sta : 0;
    this.staMax = sta ? sta : 0;

    this.hpCurrent = hp ? hp : 0;
    this.hpMax = hp ? hp : 0;
  }

  protected levelUp(): void {
    this.level++;
    this.expMax = Math.floor(this.expMax + 50 * log(this.level, 10));
    logger(`"${this.name}" has reached Level ${this.level}`);
  }

  public addExp(exp: number): void {
    if (!this.isDead) {
      if (this.expCurrent + exp >= this.expMax) {
        const nextExp = this.expCurrent + exp - this.expMax;
        // level up
        this.expCurrent = 0;
        this.levelUp();

        this.addExp(nextExp);
      } else {
        this.expCurrent += exp;
      }
    }
  }

  public exhaust(sta: number): void {
    this.staCurrent -= sta;

    if (this.staCurrent < 0) {
      this.staCurrent = 0;
    }
  }

  public takeDamage(dmg: number): boolean {
    this.hpCurrent -= dmg;

    logger(`${this.name} has taken ${Math.floor(dmg)} Damage!`);

    if (Math.floor(this.hpCurrent) <= 0) {
      // killed
      this.hpCurrent = 0;
      this.isDead = true;
    }

    return this.isDead;
  }

  public tick(_tick: number): void {}
}
