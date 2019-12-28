import Organism from "../organism";

export default class Boss extends Organism {
    type: string;

    constructor(
        {
            hp = 100,
            name = "Boss",
            type = "spider"
        }: {
            hp: number
            name: string
            type: string
        } = {
            hp: 100,
            name: "Boss",
            type: "spider"
        }
    ) {
        super({
            name,
            hp
        });

        this.type = type;
    }
}
