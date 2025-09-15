import { log, pow } from "mathjs";

import { config } from "../config";

import { ResourceTypes } from "../data";
import { Player, Resources } from "../game";

import {
  CraeftMixin,
  getRandomArrayItem,
  getRandomInt,
  HydrateableMixin,
  Timer,
} from "../tools";
import type { ICraeft } from "../interfaces";

export class Farm extends CraeftMixin(HydrateableMixin()) {
  public timer: Timer;
  delay: number;
  counter: number;

  constructor({
    craeft,
    delay = config.initialFarmDelay,
  }: {
    craeft: ICraeft;
  } & Partial<{
    delay: number;
  }>) {
    super(craeft);

    this.delay = delay;

    this.timer = new Timer({
      craeft: this.craeft,
      delay,
      autoStart: false,
    });

    this.counter = 0;
  }

  public static hydrate(craeft: ICraeft, farm: Farm) {
    const newFarm = Object.assign(new Farm({ craeft }), farm);

    newFarm.timer = Timer.hydrate(craeft, farm.timer);

    return newFarm;
  }

  start({
    player,
    onFarmEnd,
  }: {
    player: Player;
    onFarmEnd: ({
      result,
      dmg,
      exp,
      usedStamina,
    }: {
      result: Resources;
      dmg: number;
      exp: number;
      usedStamina: number;
    }) => void;
  }) {
    let delay: number =
      this.delay *
      pow(
        log(this.counter + config.farmDelayCurve.floor),
        config.farmDelayCurve.top,
      );

    if (player.dex() > 0) {
      delay /= player.dex() * player.level;
    }

    if (player.vit() > 0) {
      delay /= player.vit() * player.level;
    }

    delay = delay < 1 ? this.delay : delay;

    const onTimerEnd = () => {
      this.timer.pause();

      // calculate amount of all resources first
      let amount = player.level;

      amount *=
        // TODO: fine tune this
        (player.atk() + player.matk()) / (this.counter + config.farmHardness);

      const resources = new Resources({ craeft: this.craeft });

      const resourceTypes = [ResourceTypes.Wood, ResourceTypes.Metal];

      if (this.craeft.player.level >= 5) {
        resourceTypes.push(...[ResourceTypes.Cloth, ResourceTypes.Gemstone]);
      }

      // now distribute
      while (amount > 0) {
        const resourceType = getRandomArrayItem({
          array: resourceTypes,
        });

        // TODO: factor in different types of material drop in different locations

        resources[resourceType] += 1;
        amount--;
      }

      this.counter++;

      const def = player.def() + player.mdef();

      // TODO: calculate dmg based on defense and dmg dealt
      let dmg = pow(
        log(this.counter + config.craefterDelayCurve.floor),
        config.craefterDelayCurve.top,
      );

      dmg -= def;

      if (dmg < 0) {
        dmg = 0;
      }

      onFarmEnd({
        result: resources,
        // TODO: calculate exp based on farm level
        exp: 4 * this.counter,
        dmg,
        // TODO: calculate stamina used
        usedStamina: 3 * this.counter,
      });
    };

    this.timer = new Timer({
      craeft: this.craeft,
      delay,
      onTimerEnd,
    });
  }
}
