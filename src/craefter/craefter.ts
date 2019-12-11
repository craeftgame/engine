import {
    getRandomArrayItem,
    getRandomId
} from "../tools/rand";
import peopleNames from "../data/people_names"
import {
    Unknown
} from "../data/types";
import Organism from "../organism";
import Delay from "../delay";
import config from "../../config"

export default class Craefter extends Organism {

    isCraefting = false;
    itemId = null;
    onDoneCreating;
    type;

    str;
    int;
    dex;
    luk;

    delay;

    constructor(
        {
            type = Unknown,
            name = getRandomArrayItem({
                array: peopleNames
            }),
            delay = config.initialCraefterDelay,
            str = 0,
            int = 0,
            dex = 0,
            luk = 0,
            sta = config.craefterInitialSta
        } = {}
    ) {
        super({
            name,
            sta
        });

        this.delay = new Delay({
            delayInSeconds: delay,
            onDelayExpired: () => {
                if (this.onDoneCreating) {
                    this.onDoneCreating(
                        // todo evaluate exp properly
                        5
                    );
                }
            }
        });

        this.id = getRandomId();

        this.type = type;
        this.name = name;

        this.str = str;
        this.int = int;
        this.dex = dex;
        this.luk = luk;
    }

    static hydrate(
        craefter,
        obj
    ) {
        craefter.delay = Delay.hydrate(obj.delay)
    }

    tick() {
        if (this.staCurrent < this.staMax) {
            this.staCurrent += 0.01;
        }
    }

    static calculateMaterialImpact(
        material
    ) {
        return ((material ? material : 0.1) / 100) * 80
    }

    evaluateItemType(
        ratios,
        highestResource
    ) {
        // stub please override
    }

    evaluateItem(
        {
            // @ts-ignore
            resources
        } = {}
    ) {
        // stub please override
    }

    craeft(
        {
            // @ts-ignore
            resources
        } = {}
    ) {
        // stub please override
        this.isCraefting = true;
    }

    finishCraefting(
        exp
    ) {
        this.isCraefting = false;
        this.itemId = null;

        this.addExp(
            exp
        );
    }

    evaluateSlot(
        /* eslint-disable-next-line no-unused-vars */
        type
    ) {

    }

    evaluateItemName(
        /* eslint-disable-next-line no-unused-vars */
        type,
        /* eslint-disable-next-line no-unused-vars */
        slot,
        /* eslint-disable-next-line no-unused-vars */
        isMultiSlot
    ) {
    }

    exhaust(
        sta
    ) {
        super.exhaust(sta);

        if (Math.floor(this.staCurrent) === 0) {
            this.dead = true;
        }
    }
}