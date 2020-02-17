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
import config from "../../config";

export default class Weapon extends Item {

    private readonly _atk: number = 0;
    private readonly _matk: number = 0;

    constructor(
        {
            type = Unknown,
            slot = Unknown,
            craefterId,
            name,
            level = 1,
            rarity,
            atk = 0,
            matk = 0,
            material,
            resources,
            delay
        }: {
            delay?: number
            name?: string
            type?: any
            slot?: any
            craefterId?: string
            material?: any
            rarity?: any
            level?: number
            atk?: number
            matk?: number
            resources?: any
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

        this._atk = atk;
        this._matk = matk;
    }

    public atk() {
        return this._atk * this.level * config.rarityMultiplier[this.rarity];
    }

    public matk() {
        return this._matk * this.level * config.rarityMultiplier[this.rarity];
    }

    private canBeTwoHanded() {
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
