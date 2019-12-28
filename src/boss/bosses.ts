import ExtendedArray from "../tools/ExtendedArray";
import Boss from "./boss";

export default class Bosses extends ExtendedArray<Boss> {

    constructor() {
        super();

        const bosses: Boss[] = [
            new Boss({
                name: 'sdasdsd',
                type: "dragon",
                hp: 123
            }),
            new Boss({
                name: 'daasd',
                type: "spider",
                hp: 12
            })
        ];

        this.push(...bosses);
    }

    static hydrate(
        obj: Boss[]
    ): Bosses {
        const bosses = Object.assign(new Bosses(), obj);

        return bosses
    }
}