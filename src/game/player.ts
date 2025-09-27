import { getRandomEnumEntry } from "@craeft/map-generator/dist/tools/rand";
import { log } from "mathjs";
import { config } from "../config";
import { Classes, ClassNames, FirstNames, SurNames, Unknown } from "../data";
import { Armor, Equipment, Weapon } from "../game";
import { Organism } from "../organism";
import { getRandomArrayItem, getRandomInt } from "../tools";
import type {
  ArmorStats,
  ICraeft,
  PlayerStats,
  WeaponStats,
} from "../interfaces";

export class Player
  extends Organism
  implements PlayerStats, WeaponStats, ArmorStats
{
  public equipment = new Equipment({ craeft: this.craeft });

  public isFarming: boolean;

  protected readonly _dex: number;
  protected readonly _str: number;
  protected readonly _int: number;
  protected readonly _vit: number;
  protected readonly _agi: number;

  private _class: Classes;

  constructor({
    craeft,
    name = getRandomArrayItem({
      array: FirstNames,
    }) +
      " " +
      getRandomArrayItem({
        array: SurNames,
      }),
    // stats
    hp = config.playerInitialHp,
    sta = config.playerInitialSta,
    // physical attack power
    str = getRandomInt(
      config.playerInitialStr.from,
      config.playerInitialStr.to,
    ),
    // regeneration and hit points
    vit = getRandomInt(
      config.playerInitialVit.from,
      config.playerInitialVit.to,
    ),
    // magic attack power
    int = getRandomInt(
      config.playerInitialInt.from,
      config.playerInitialInt.to,
    ),
    // change to hit and forging powers
    dex = getRandomInt(
      config.playerInitialDex.from,
      config.playerInitialDex.to,
    ),
    agi = getRandomInt(
      config.playerInitialAgi.from,
      config.playerInitialAgi.to,
    ),
  }: { craeft: ICraeft } & Partial<{
    name: string;
    hp: number;
    sta: number;
    str: number;
    vit: number;
    int: number;
    dex: number;
    agi: number;
  }>) {
    super({
      name,
      craeft,
      sta,
      hp,
    });

    this.isFarming = false;

    this._dex = dex;
    this._str = str;
    this._int = int;
    this._vit = vit;
    this._agi = agi;

    this._class = Classes.Novice;

    this.level = config.playerStartLevel;
  }

  public static hydrate(craeft: ICraeft, player: Player): Player {
    const newPlayer = Object.assign(new Player({ craeft }), player);

    newPlayer.equipment = Equipment.hydrate(craeft, player.equipment);

    return newPlayer;
  }

  protected levelUp(): void {
    super.levelUp();

    this.hpMax = this.hpMax + 50 * log(this.level, 10);
    this.hpCurrent = this.hpMax;

    // TODO: make this nicer
    /*
        this._vit *= this.level;
        this._agi *= this.level;
        this._int *= this.level;
        this._dex *= this.level;
        this._str *= this.level;
        */

    // evaluate class on level 10
    if (this.level === 10) {
      this._class = getRandomEnumEntry({
        en: Classes,
        start: 1, // do not assign novice again
      });
    }
  }

  public tick?(tick: number): void {
    // do not tick when farming
    if (this.isFarming) {
      return;
    }

    // regenerate stamina
    if (this.staCurrent < this.staMax) {
      // TODO: let some parameter influence stamina regen
      this.staCurrent += (99.9 / this.staMax) * 0.1;
      if (this.staCurrent > this.staMax) {
        this.staCurrent = this.staMax;
      }
    }

    // regenerate hp
    if (this.hpCurrent < this.hpMax) {
      this.hpCurrent += 0.5 * this.vit();
      if (this.hpCurrent > this.hpMax) {
        this.hpCurrent = this.hpMax;
      }
    }

    this.equipment.tick?.(tick);
  }

  public className(): string {
    return ClassNames[this._class] ?? Unknown;
  }

  public dex() {
    let dex = this._dex;

    for (const item of this.equipment.getEquipped()) {
      dex += item.dex() ?? 0;
    }

    return dex;
  }

  public agi() {
    let agi = this._agi;

    for (const item of this.equipment.getEquipped()) {
      agi += item.agi() ?? 0;
    }

    return agi;
  }

  public int() {
    let int = this._int;

    for (const item of this.equipment.getEquipped()) {
      int += item.int() ?? 0;
    }

    return int;
  }

  public str() {
    let str = this._str;

    for (const item of this.equipment.getEquipped()) {
      str += item.str() ?? 0;
    }

    return str;
  }

  public vit() {
    let vit = this._vit;

    for (const item of this.equipment.getEquipped()) {
      vit += item.vit() ?? 0;
    }

    return vit;
  }

  public atk(): number {
    let atk = 0;

    for (const item of this.equipment.getEquipped()) {
      if (item instanceof Weapon) {
        atk += item.atk() * this.str();
      }
    }

    return atk;
  }

  public matk(): number {
    let matk = 0;

    for (const item of this.equipment.getEquipped()) {
      if (item instanceof Weapon) {
        matk += item.matk() * this.int();
      }
    }

    return matk;
  }

  public def(): number {
    let def = 0;

    for (const item of this.equipment.getEquipped()) {
      if (item instanceof Armor) {
        def += item.def() * this.vit();
      }
    }

    return def;
  }

  public mdef(): number {
    let mdef = 0;

    for (const item of this.equipment.getEquipped()) {
      if (item instanceof Armor) {
        mdef += item.mdef() * this.int();
      }
    }

    return mdef;
  }

  public takeDamage(dmg: number): boolean {
    const isDead: boolean = super.takeDamage(dmg);

    if (isDead) {
      this.craeft.log(`${this.className()} ${this.name} died!`);
      this.craeft.stop(true);
    }

    return isDead;
  }
}
