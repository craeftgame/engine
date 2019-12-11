import Item from "./item";
import {
    getRandomInt
} from "../tools/rand";

import {
    Unknown,
    ItemCategories,
    WeaponTypes,
    Rarities
} from "../data/types";

import {
    ItemNames,
    RarityNames
} from "../data/names";
import Resources from "../resources";

export default class Weapon extends Item {

    atk;
    matk;

    constructor(
        {
            type = Unknown,
            slot = Unknown,
            // @ts-ignore
            craefterId,
            // @ts-ignore
            name,
            // @ts-ignore
            level = 1,
            // @ts-ignore
            rarity,
            atk = 0,
            matk = 0,
            // @ts-ignore
            material,
            // @ts-ignore
            resources,
            // @ts-ignore
            delay
        } = {}
    ) {
        super({
            category: ItemCategories.Weapon,
            name,
            craefterId,
            slot,
            level,
            type,
            rarity,
            material,
            resources,
            delay
        });

        this.isMultiSlot = this.canBeTwoHanded() && getRandomInt(0, 1) === 1;

        this.atk = atk;
        this.matk = matk;
    }

    canBeTwoHanded() {
        return !(
            this.type === WeaponTypes.Knife ||
            this.type === WeaponTypes.JewelKnife ||
            this.type === WeaponTypes.Wand ||
            this.type === WeaponTypes.JewelWand
        );
    }

    evaluateItemName() {
        const prefixes: string[] = [];

        if (this.rarity !== Rarities.Common) {
            prefixes.push(RarityNames[this.rarity]);
        }

        if (this.canBeTwoHanded()) {
            prefixes.push(this.isMultiSlot ? "Two-Handed" : "One-Handed");
        }

        const parts: string[] = [];

        parts.push(...prefixes);
        parts.push(ItemNames[this.type]);

        return parts.join(" ")
    }

    static hydrate(obj) {
        const weapon = Object.assign(new Weapon(), obj);

        Item.hydrate(
            weapon,
            obj
        );

        return weapon;
    }
}
