import {
    CraefterTypes,
    ItemCategories,
    Rarities,
    ResourceTypes,
    WeaponTypes
} from "./data/types";

import Resources from "./resources";
import Player from "./player";
import Farm from "./farm";
import Weapon from "./items/weapon";
import Armor from "./items/armor";

import WeaponCraefter from "./craefter/weaponcraefter";
import ArmorCraefter from "./craefter/armorcraefter";

import Serializer from "@craeft/serializer";
import {
    log,
    pow
} from "mathjs";

import config from "../config"

// storage
import ls from "local-storage";
import zip from "lz-string/libs/lz-string";
import Items from "./items";
import Craefters from "./craefters";

const version = `v${process.env.REACT_APP_VERSION}`;
const versionMsg = `Welcome to Cräft! version: ${version}`;

/* eslint-disable-next-line no-console */
console.log(versionMsg);

if (config.debug) {
    console.log("Running in debug mode!");
}

export default class Craeft {

    onTick;

    logs = [
        versionMsg
    ];

    // the player
    player: Player;
    // the farm
    farm: Farm;
    // craefters
    craefters: Craefters;

    // todo move to craefters
    craeftersCount = 0;

    gameTick;
    items: Items;

    // resources
    resources;

    serialize() {

        return Serializer.serialize({
            obj: this,
            compress: true
        });
    }

    static deserialize(
        json
    ) {

        const obj = Serializer.deserialize(json);

        const craeft = Object.assign(new Craeft(), obj);

        craeft.resources = Resources.hydrate(obj.resources);
        craeft.farm = Farm.hydrate(obj.farm);

        for (const itemIndex in craeft.items) {

            const item = craeft.items[itemIndex];
            let ti;

            switch (item.category) {
                case ItemCategories.Weapon:
                    ti = Weapon.hydrate(item);
                    break;
                case ItemCategories.Armor:
                    ti = Armor.hydrate(item);
                    break;
                default:
                    break;
            }

            craeft.items[itemIndex] = ti;
        }

        for (const craefterIndex in craeft.craefters) {

            const craefter = craeft.craefters[craefterIndex];
            let tc;

            switch (craefter.type) {
                case CraefterTypes.WeaponCraefter:
                    tc = WeaponCraefter.hydrate(craefter);
                    break;
                case CraefterTypes.ArmorCraefter:
                    tc = ArmorCraefter.hydrate(craefter);
                    break;
                default:
                    break;
            }

            craeft.craefters[craefterIndex] = tc;
        }

        craeft.player = Player.hydrate(obj.player);

        return craeft;
    }

    constructor() {

        this.player = new Player();
        this.farm = new Farm();
        this.craefters = new Craefters();
        this.resources = new Resources({
            initialResources: config.startResources
        });

        // items
        this.items = new Items();

        const knife = new Weapon({
            name: "Newbie Knife",
            type: WeaponTypes.Knife,
            material: ResourceTypes.Metal,
            rarity: Rarities.Common,
            atk: 1,
            matk: 1
        } as Weapon);

        knife.equipped = this.player.equipment.equip(knife);

        this.items.push(knife);
    }

    tick() {
        // tick the player
        this.player.tick();

        // tick all craefters
        for (const craefter of this.craefters) {
            craefter.tick();
        }

        // tick all the items
        for (const item of this.items) {
            item.tick();
        }

        if (this.onTick) {
            this.onTick();
        }
    }

    start(
        {
            onTick
        }: {
            onTick?: any
        } = {}
    ) {
        // re-render every second
        const timeoutInSeconds = 1;
        this.onTick = onTick;

        if (this.gameTick) {
            this.stop();
        }

        this.gameTick = setInterval(() => {
            this.tick();
        }, timeoutInSeconds * 1000);
    }

    stop(
        hard?: boolean
    ) {
        clearInterval(this.gameTick);

        this.gameTick = null;

        // final tick
        this.tick();

        if (hard) {
            Craeft.deleteState();
        }
    }

    startFarming(
        {
            callback
        }: {
            callback: any
        }
    ) {
        this.farm.start({
            player: this.player,
            callback: (
                {
                    result,
                    dmg,
                    exp,
                    usedStamina
                }: {
                    result: Resources,
                    dmg: number,
                    exp: number
                    usedStamina: number
                }
            ) => {

                this.resources = new Resources()
                    .add(this.resources)
                    .add(result);

                this.player.damage(dmg);
                this.player.addExp(exp);
                this.player.exhaust(usedStamina);

                callback();
            }
        });
    }

    addItem(
        item,
        resourcesConsumed
    ) {
        this.resources.sub(resourcesConsumed);

        item.onDoneCreating = (
            craefterId,
            exp
        ) => {

            const craefter = this.craefters.findById(craefterId)
            craefter.finishCraefting(
                exp
            );

            this.logs.push(`"${item.getName()}" cräfted by ${craefter.name}! `);
        };

        this.items.push(item);
    }

    addCraefter(
        which
    ) {
        let craefter;

        const delay = config.startDelay * pow(log(this.craeftersCount + 2), 20);

        switch (which) {
            case CraefterTypes.WeaponCraefter:
                craefter = new WeaponCraefter({
                    delay
                });
                break;

            case CraefterTypes.ArmorCraefter:
                craefter = new ArmorCraefter({
                    delay
                });
                break;

            default:
                throw new Error("Unknown craefter type")
        }

        this.craefters.push(craefter);

        this.craeftersCount++;

        craefter.onDoneCreating = (exp) => {
            this.player.addExp(exp);
        };
    }

    disentchant(
        itemId
    ) {
        const item = this.items.findById(itemId);
        const name = item.getName();
        const resources = item.disentchant();

        this.items.removeItem(item);

        this.resources = new Resources(
            {
                resources: this.resources
            })
            .add(resources);

        return {
            name,
            resources
        }
    }

    bury(
        craefterId
    ) {
        const craefter = this.craefters.findById(craefterId);
        const name = craefter.name;
        this.craefters.removeItem(craefter);

        return name;
    }

    static saveState() {
        if (config.useLocalStorage && !global.craeft.player.dead) {
            const state = global.craeft.serialize();

            // @ts-ignore
            ls.set(
                "state",
                config.compressLocalStorage ?
                    zip.compress(state) : state
            );
        }
    }

    static loadState() {

        let state = null;

        if (config.useLocalStorage) {

            // @ts-ignore
            const localState = ls.get("state");

            if (localState) {
                // if the state starts with { it is uncompressed
                state = localState.startsWith("{") ?
                    localState : zip.decompress(localState)
            }

            if (state) {
                global.craeft = Craeft.deserialize(state)
            }
        }
    }

    static deleteState() {
        if (config.useLocalStorage) {
            // @ts-ignore
            ls.remove("state");
        }
    }
}

global.craeft = new Craeft();