import ExtendedArray from "../tools/ExtendedArray"
import Craefter from "./craefter";
import {CraefterTypes} from "../data/types";
import WeaponCraefter from "./weaponcraefter";
import ArmorCraefter from "./armorcraefter";

export default class Craefters extends ExtendedArray<Craefter> {

    public bury = (
        craefterId
    ) => {
        const craefter = this.findById(craefterId);
        const name = craefter.name;
        this.removeItem(craefter);

        return name;
    };

    static hydrate(
        obj: Craefter[]
    ): Craefters {
        const craefters = Object.assign(new Craefters(), obj);

        for (const craefterIndex in obj) {

            const craefter = obj[craefterIndex];
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

            craefters[craefterIndex] = tc;
        }

        return craefters
    }
}