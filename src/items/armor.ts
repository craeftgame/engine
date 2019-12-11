import Item from "./item";
import {
    Unknown,
    ItemCategories
} from "../data/types";

export default class Armor extends Item {

    def: number;
    mdef: number;

    constructor(
        {
            type = Unknown,
            slot = Unknown,
            // @ts-ignore
            craefterId,
            // @ts-ignore
            name,
            // @ts-ignore
            level,
            // @ts-ignore
            rarity,
            def = 0,
            mdef = 0,
            // @ts-ignore
            material,
            // @ts-ignore
            resources,
            // @ts-ignore
            delay
        } = {}
    ) {
        super({
            category: ItemCategories.Armor,
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

        this.def = def;
        this.mdef = mdef;
    }

    static hydrate(obj) {
        const armor = Object.assign(new Armor(), obj);

        Item.hydrate(
            armor,
            obj
        );

        return armor;
    }
}
