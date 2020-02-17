import {
    log
} from "mathjs";
import {
    getRandomArrayItem,
    getRandomInt
} from "./tools/rand";
import Organism from "./organism";
import Equipment from "./equipment";
import config from "../config"
import {
    ClassNames,
    FirstNames,
    SurNames
} from "./data/names";
import Armor from "./items/armor";
import Weapon from "./items/weapon";
import {Classes} from "./data/types";
import {getRandomEnumEntry} from "../../map-generator/src/tools/rand";

export default class Player extends Organism {

    equipment = new Equipment();

    private _dex: number;
    private _str: number;
    private _int: number;
    private _vit: number;
    private _agi: number;

    private _class: any;

    constructor(
        {
            name = getRandomArrayItem({
                array: FirstNames
            }) + " " + getRandomArrayItem({
                array: SurNames
            }),
            // stats
            hp = config.playerInitialHp,
            sta = config.playerInitialSta,
            // physical attack power
            str = getRandomInt(
                config.playerInitialStrFrom,
                config.playerInitialStrTo
            ),
            // regeneration and hit points
            vit = getRandomInt(
                config.playerInitialVitFrom,
                config.playerInitialVitTo
            ),
            // magic attack power
            int = getRandomInt(
                config.playerInitialIntFrom,
                config.playerInitialIntTo
            ),
            // change to hit and forging powers
            dex = getRandomInt(
                config.playerInitialDexFrom,
                config.playerInitialDexTo
            ),
            agi = getRandomInt(
                config.playerInitialAgiFrom,
                config.playerInitialAgiTo
            )
        } = {}
    ) {
        super({
            name,
            sta,
            hp,
        });

        this._dex = dex;
        this._str = str;
        this._int = int;
        this._vit = vit;
        this._agi = agi;

        this._class = Classes.Novice;

        this.level = config.playerStartLevel;
    }

    static hydrate(obj): Player {
        const player = Object.assign(new Player(), obj);

        player.equipment = Equipment.hydrate(obj.equipment);

        return player;
    }

    protected levelUp(): void {
        super.levelUp();

        this.hpMax = this.hpMax + (50 * log(this.level, 10));
        this.hpCurrent = this.hpMax;

        // todo make this nicer
        this._vit *= this.level;
        this._agi *= this.level;
        this._int *= this.level;
        this._dex *= this.level;
        this._str *= this.level;

        // evaluate class on level 10
        if (this.level === 10) {
            this._class = getRandomEnumEntry({
                en: Classes,
                start: 1 // do not assign novice again
            })
        }
    }

    public tick(tick: number): void {

        // do not tick when farming
        if (this.isFarming) {
            return;
        }

        // regenerate stamina
        if (this.staCurrent < this.staMax) {
            this.staCurrent += 0.10;
            if (this.staCurrent > this.staMax) {
                this.staCurrent = this.staMax
            }
        }

        // regenerate hp
        if (this.hpCurrent < this.hpMax) {
            this.hpCurrent += (0.50 * this.vit());
            if (this.hpCurrent > this.hpMax) {
                this.hpCurrent = this.hpMax
            }
        }

        this.equipment.tick()
    }

    public className(): string {
        return ClassNames[this._class]
    }

    public dex() {
        return this._dex
    }

    public agi() {
        return this._agi
    }

    public int() {
        return this._int
    }

    public str() {
        return this._str
    }

    public vit() {
        return this._vit
    }

    public atk(): number {
        let atk = 0;

        for (const equipment of this.equipment.getEquipped() as Weapon[]) {
            if (equipment.atk) {
                atk += equipment.atk() * this.str();
            }
        }

        return atk;
    }

    public matk(): number {
        let matk = 0;

        for (const equipment of this.equipment.getEquipped() as Weapon[]) {
            if (equipment.matk) {
                matk += equipment.matk() * this.int();
            }
        }

        return matk;
    }

    public def(): number {
        let def = 0;

        for (const armor of this.equipment.getEquipped() as Armor[]) {
            if (armor.def) {
                def += armor.def() * this.vit();
            }
        }

        return def;
    }

    public mdef(): number {
        let mdef = 0;

        for (const equipment of this.equipment.getEquipped() as Armor[]) {
            if (equipment.mdef) {
                mdef += equipment.mdef() * this.int();
            }
        }

        return mdef;
    }

    public takeDamage(
        dmg
    ): boolean {
        const dead: boolean = super.takeDamage(dmg);

        if (dead) {
            global.craeft.logs.push(`${this.className()} ${this.name} died!`);
            global.craeft.stop(true);
        }

        return dead;
    }

}
