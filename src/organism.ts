/* globals craeft */
import Tickable from "./tickable";

import {
    log
} from "mathjs";

import {
    getRandomId
} from "./tools/rand";

import config from "../config"

export default class Organism extends Tickable {

    id: string;
    name: string;
    level: number;
    dead: boolean;

    staCurrent: number;
    staMax: number;

    expCurrent: number;
    expMax: number;

    hpCurrent: number;
    hpMax: number;

    constructor(
        {
            name,
            sta,
            hp
        }: {
            name: string,
            sta?: number,
            hp?: number
        } = {
            name: 'Organism'
        }
    ) {
        super();

        this.dead = false;

        this.id = getRandomId();

        this.level = 1;
        this.name = name;

        this.expCurrent = 0;
        this.expMax = config.organismInitialRequiredExp;

        this.staCurrent = sta ? sta : 0;
        this.staMax = sta ? sta : 0;

        this.hpCurrent = hp ? hp : 0;
        this.hpMax = hp ? hp : 0;
    }

    protected levelUp(): void {
        this.level++;
        this.expMax = Math.floor(this.expMax + (50 * log(this.level, 10)));
        global.craeft.logs.push(`"${this.name}" has reached Level ${this.level}`);
    }

    public addExp(
        exp
    ) {
        if (!this.dead) {
            this.expCurrent += exp;
            if (this.expCurrent >= this.expMax) {
                // level up
                this.expCurrent = 0;
                this.levelUp();
            }
        }
    }

    public exhaust(
        sta
    ) {
        this.staCurrent -= sta;

        if (this.staCurrent < 0) {
            this.staCurrent = 0
        }
    }

    public takeDamage(
        dmg
    ): boolean {
        this.hpCurrent -= dmg;

        if (Math.floor(this.hpCurrent) <= 0) {
            // killed
            this.hpCurrent = 0;
            this.dead = true;
        }

        return this.dead
    }
}