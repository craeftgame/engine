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
    FirstNames,
    SurNames
} from "./data/names";
import Armor from "./items/armor";
import Weapon from "./items/weapon";

export default class Player extends Organism {

    equipment = new Equipment();

    dex;
    str;
    int;
    vit;

    class;

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
            )
        } = {}
    ) {
        super({
            name,
            sta,
            hp,
        });

        this.dex = dex;
        this.str = str;
        this.int = int;
        this.vit = vit;

        this.class = "Novice"
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
    }

    public tick(tick: number): void {
        // regenerate stamina
        if (this.staCurrent < this.staMax) {
            this.staCurrent += 0.10;
        }

        // regenerate hp
        if (this.hpCurrent < this.hpMax) {
            this.hpCurrent += (0.50 * this.vit);
        }
    }

    public atk(): number {
        let atk = 0;

        for (const equipment of this.equipment.getEquipped() as Weapon[]) {
            if (equipment.atk) {
                atk += equipment.atk * this.str;
            }
        }

        return atk;
    }

    public matk(): number {
        let matk = 0;

        for (const equipment of this.equipment.getEquipped() as Weapon[]) {
            if (equipment.matk) {
                matk += equipment.matk * this.int;
            }
        }

        return matk;
    }

    public def(): number {
        let def = 0;

        for (const armor of this.equipment.getEquipped() as Armor[]) {
            if (armor.def) {
                def += armor.def * this.vit;
            }
        }

        return def;
    }

    public mdef(): number {
        let mdef = 0;

        for (const equipment of this.equipment.getEquipped() as Armor[]) {
            if (equipment.mdef) {
                mdef += equipment.mdef * this.int;
            }
        }

        return mdef;
    }

    public takeDamage(
        dmg
    ): boolean {
        const dead: boolean = super.takeDamage(dmg);

        if (dead) {
            global.craeft.logs.push(`${this.class} ${this.name} died!`);
            global.craeft.stop(true);
        }

        return dead;
    }

}
