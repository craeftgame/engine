import Delay from "../delay";

import {
    ItemCategories,
    Rarities,
    ResourceTypes,
    Unknown
} from "../data/types";

import {
    getRandomId,
    getRandomInt
} from "../tools/rand";

import {
    ItemNames,
    RarityNames,
    SlotNames
} from "../data/names";

import Resources from "../resources";
import config from "../../config"

export default class Item {

    equipped = false;
    isMultiSlot = false;
    delay: Delay;
    onDoneCreating;
    id;

    type;
    craefterId;
    slot;
    category;
    rarity;
    material;
    level;
    name;
    resources;

    constructor(
        {
            category,
            name,
            craefterId,
            slot,
            level = 1,
            type,
            rarity,
            material,
            resources,
            delay = config.initialItemDelay
        }: {
            category?: any
            delay?: number
            name?: string
            craefterId?: string
            slot?: any
            level?: number
            type?: any
            rarity?: any
            material?: any
            resources?: any
        } = {}
    ) {

        this.delay = new Delay({
            delayInSeconds: delay,
            onDelayExpired: () => {
                this.meterialize();
            }
        });
        this.id = getRandomId();

        this.category = category;
        this.craefterId = craefterId;
        this.slot = slot;
        this.level = level;
        this.type = type;
        this.rarity = rarity;
        this.material = material;
        this.resources = resources;
        this.name = name;

        this.rarity = rarity || Item.evaluateRarity();
    }

    getName(): string {
        return this.name || this.evaluateItemName()
    }

    evaluateItemName(): string {
        return `${RarityNames[this.rarity]} ${SlotNames[this.slot]} ${ItemNames[this.type]}`
    }

    static evaluateRarity() {
        const chance = Math.random() * 100;

        if (chance < config.rarityChancePercentCommon) {
            return Rarities.Common;
        } else if (chance < config.rarityChancePercentRare) {
            return Rarities.Rare;
        } else if (chance < config.rarityChancePercentEpic) {
            return Rarities.Epic;
        }
        // 98-99
        else {
            return Rarities.Legendary;
        }
    }

    tick() {
        // todo: tick, tock
    }

    meterialize() {
        if (this.onDoneCreating) {
            this.onDoneCreating(
                this.craefterId,
                // todo evaluate exp properly
                5
            );
        }
    }

    disentchant() {
        // this item did not have any resources
        if (!this.resources) {
            // return a dummy set
            return new Resources({
                resources: {
                    [ResourceTypes.Wood]: 1
                } as unknown as Resources
            });
        }

        return new Resources({
            resources: {
                [ResourceTypes.Wood]:
                    getRandomInt(
                        Math.floor(this.resources[ResourceTypes.Wood] / 100 * config.disentchantRecyclingPercentFrom),
                        Math.floor(this.resources[ResourceTypes.Wood] / 100 * config.disentchantRecyclingPercentTo)
                    ),
                [ResourceTypes.Metal]:
                    getRandomInt(
                        Math.floor(this.resources[ResourceTypes.Metal] / 100 * config.disentchantRecyclingPercentFrom),
                        Math.floor(this.resources[ResourceTypes.Metal] / 100 * config.disentchantRecyclingPercentTo)
                    ),
                [ResourceTypes.Diamond]:
                    getRandomInt(
                        Math.floor(this.resources[ResourceTypes.Diamond] / 100 * config.disentchantRecyclingPercentFrom),
                        Math.floor(this.resources[ResourceTypes.Diamond] / 100 * config.disentchantRecyclingPercentTo)
                    ),
                [ResourceTypes.Cloth]:
                    getRandomInt(
                        Math.floor(this.resources[ResourceTypes.Cloth] / 100 * config.disentchantRecyclingPercentFrom),
                        Math.floor(this.resources[ResourceTypes.Cloth] / 100 * config.disentchantRecyclingPercentTo)
                    )
            } as Resources

        })
    }

    static hydrate(
        item,
        obj
    ) {
        item.delay = Delay.hydrate(obj.delay)
    }
}
