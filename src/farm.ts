import Timer from "./tools/timer";
import Resources from "./resources";

import {
    ResourceTypes
} from "./data/types";

import {
    getRandomArrayItem,
    getRandomInt
} from "./tools/rand";

import {
    pow,
    log
} from "mathjs";

import config from "../config";
import Player from "./player";

export default class Farm {

    timer;
    delay: number;
    counter;

    constructor(
        {
            delay = config.initialFarmDelay
        }: {
            delay: number
        } = {
            delay: config.initialFarmDelay
        }
    ) {

        this.delay = delay;

        this.timer = new Timer({
            delay,
            autoStart: false
        });

        this.counter = 0;
    }

    static hydrate(obj) {
        const farm = Object.assign(new Farm(), obj);

        farm.timer = Timer.hydrate(obj.timer);

        return farm;
    }

    start(
        {
            player,
            callback
        }: {
            player: Player
            callback?: any
        }
    ) {
        let delay: number = this.delay * pow(log(this.counter + 2), 5);

        if (player.dex() > 0) {
            delay /= player.dex() * player.level;
        }

        if (player.vit() > 0) {
            delay /= player.vit() * player.level;
        }

        delay = delay < 1 ? this.delay : delay;

        const cb = () => {

            this.timer.pause();

            // calculate amount of all resources first
            let amount = player.level;

            // todo fine tune this
            amount = amount * (player.atk() + player.matk());

            const resources = new Resources();
            const resTypes = [
                ResourceTypes.Wood,
                ResourceTypes.Metal,
                ResourceTypes.Cloth,
                ResourceTypes.Diamond
            ];

            // now distribute
            while (amount > 0) {

                const resType = getRandomArrayItem({
                    array: resTypes
                });

                resources[resType] = resources[resType] ? resources[resType]++ : 1;

                amount--;
            }

            this.counter++;

            // todo calculate dmg based on defense and dmg dealt
            let dmg = (getRandomInt(5, 15) * this.counter) - (player.def() + player.mdef())

            if (dmg < 0) {
                dmg = 0
            }

            callback({
                result: new Resources({
                    resources
                }),
                // todo calculate exp based on farm level
                exp: 4 * this.counter,
                dmg,
                // todo calculate stamina used
                usedStamina: this.counter
            });

        };

        this.timer = new Timer({
            delay,
            callback: cb
        });
    }
}