import { log } from "mathjs";

import { config } from "./config";
import type { Tickable } from "./tools";
import { CraeftMixin, getRandomId, HydrateableMixin } from "./tools";
import type { ICraeft } from "./interfaces";

export abstract class Organism
  extends CraeftMixin(HydrateableMixin())
  implements Tickable
{
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

  public onLevelUp?: () => void;

  protected constructor({
    name,
    craeft,
    sta,
    hp,
  }: { craeft: ICraeft } & Partial<{
    name: string;
    sta: number;
    hp: number;
  }>) {
    super(craeft);

    this.id = getRandomId();
    this.isDead = false;

    this.name = name ?? "Unknown";

    this.expMax = config.organismInitialRequiredExp;

    this.staMax = sta ?? 0;
    this.staCurrent = this.staMax;

    this.hpMax = hp ?? 0;
    this.hpCurrent = this.hpMax;
  }

  protected levelUp(): void {
    this.level++;
    this.expMax = Math.floor(this.expMax + 50 * log(this.level, 10));
    this.staMax = this.staMax * 2;

    this.onLevelUp?.();
    this.craeft.log(`"${this.name}" has reached Level ${this.level}`);
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

    this.craeft.log(`${this.name} has taken ${Math.floor(dmg)} Damage!`);

    if (Math.floor(this.hpCurrent) <= 0) {
      // killed
      this.hpCurrent = 0;
      this.isDead = true;
    }

    return this.isDead;
  }

  public abstract tick(_tick: number): void;
}
