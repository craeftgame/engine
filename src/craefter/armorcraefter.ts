import Armor from "../items/armor";
import Craefter from "./craefter";

import {
    Unknown,
    ArmorSlots,
    ArmorTypes,
    CraefterTypes,
    ItemCategories,
    ResourceTypes,
} from "../data/types";

import {getRandomInt, getRandomObjectEntry} from "../tools/rand";
import Resources from "../resources";
import {PreItem} from "../items/PreItem";
import config from "../../config";

export default class ArmorCraefter extends Craefter {

    constructor(
        {
            // @ts-ignore
            delay,
            str = 4,
            int = 2,
            dex = 3,
            luk = 9
        } = {}
    ) {
        super({
            type: CraefterTypes.ArmorCraefter,
            delay,
            str,
            int,
            dex,
            luk
        });

        this.expMax = config.armorCraefterInitialRequiredExp
    }

    static hydrate(obj) {
        const armorCraefter = Object.assign(new ArmorCraefter(), obj);

        Craefter.hydrate(armorCraefter, obj);

        return armorCraefter;
    }

    protected evaluateItemType(
        ratios,
        highestResource
    ) {
        let type = Unknown;

        switch (highestResource) {
            case ResourceTypes.Metal:
                type = ArmorTypes.MetalPlate;

                if (ratios[ResourceTypes.Cloth] > 0) {
                    type = ArmorTypes.MetalChainmail;
                }
                break;
            case ResourceTypes.Wood:
                type = ArmorTypes.WoodenPlate;

                if (ratios[ResourceTypes.Cloth] > 0) {
                    type = ArmorTypes.WoodenChainmail;
                }
                break;
            case ResourceTypes.Cloth:
                type = ArmorTypes.Woven;

                if (ratios[ResourceTypes.Diamond] > 0) {
                    type = ArmorTypes.JewelWoven;
                }
                break;
            default:
                break
        }

        return type;
    }

    public evaluateItem(
        {
            resources
        }: {
            resources: Resources
        } = {
            resources: new Resources()
        }
    ): PreItem {
        // 2 percent of all resources is the base
        const baseline = (resources.sum() / 100);

        // add atk mainly based on metal
        // todo add str influence
        const def = Math.round(
            baseline + Craefter.calculateMaterialImpact(
            resources[ResourceTypes.Metal]
            )
        ) * this.level;

        // add matk mainly based on wood
        // todo add int influence
        const mdef = Math.round(
            baseline + Craefter.calculateMaterialImpact(
            resources[ResourceTypes.Wood]
            )
        ) * this.level;

        const ratios = resources.ratios();
        const highestResource = ratios.getHighest();

        return {
            category: ItemCategories.Armor,
            type: this.evaluateItemType(
                ratios,
                highestResource
            ),
            rarity: Unknown,
            material: highestResource,
            def,
            defMax: Math.round(def + (def * Math.log(2))) || 1,
            mdef,
            mdefMax: Math.round(mdef + (mdef * Math.log(2))) || 1
        }
    }

    protected evaluateSlot(
        /* eslint-disable-next-line no-unused-vars */
        type
    ) {
        return getRandomObjectEntry({
            object: ArmorSlots,
            start: 0
        });
    }

    public craeft(
        {
            resources
        }: {
            resources: Resources
        } = {
            resources: new Resources()
        }
    ) {
        super.craeft({
            resources
        });

        const {
            type,
            material,
            def,
            defMax,
            mdef,
            mdefMax
        } = this.evaluateItem({
            resources
        });

        const slot = this.evaluateSlot(type);

        const item = new Armor({
            type,
            material,
            resources,
            slot,
            delay: resources.sum() / this.level,
            craefterId: this.id,
            level: this.level,
            def: getRandomInt(
                def,
                defMax
            ),
            mdef: getRandomInt(
                mdef,
                mdefMax
            )
        });

        this.itemId = item.id;

        return item;
    }
}
