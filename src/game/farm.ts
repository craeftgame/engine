import { log, pow } from "mathjs";

import { config } from "../config";

import { ResourceTypes } from "../data";
import { Player, Resources } from "../game";

import { getRandomArrayItem, getRandomInt, Timer } from "../tools";

export class Farm {
  public timer: Timer;
  delay: number;
  counter: number;

  constructor(
    {
      delay = config.initialFarmDelay,
    }: {
      delay: number;
    } = {
      delay: config.initialFarmDelay,
    },
  ) {
    this.delay = delay;

    this.timer = new Timer({
      delay,
      autoStart: false,
    });

    this.counter = 0;
  }

  static hydrate(obj: Farm) {
    const farm = Object.assign(new Farm(), obj);

    farm.timer = Timer.hydrate(obj.timer);

    return farm;
  }

  start({
    player,
    callback,
  }: {
    player: Player;
    callback: ({
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
    let delay: number = this.delay * pow(log(this.counter + 2), 5);

    if (player.dex() > 0) {
      delay /= player.dex() * player.level;
    }

    if (player.vit() > 0) {
      delay /= player.vit() * player.level;
    }

    delay = delay < 1 ? this.delay : delay;

    const timerCallback = () => {
      this.timer.pause();

      // calculate amount of all resources first
      let amount = player.level;

      // todo fine tune this
      amount *= (player.atk() + player.matk()) / (this.counter + 1);

      const resources = new Resources();

      const resourceTypes = [
        ResourceTypes.Wood,
        ResourceTypes.Metal,
        ResourceTypes.Cloth,
        ResourceTypes.Diamond,
      ];

      // now distribute
      while (amount > 0) {
        const resourceType = getRandomArrayItem<ResourceTypes>({
          array: resourceTypes,
        });

        resources[resourceType] += 1;
        amount--;
      }

      this.counter++;

      // todo calculate dmg based on defense and dmg dealt
      let dmg =
        getRandomInt(5, 15) * this.counter - (player.def() + player.mdef());

      if (dmg < 0) {
        dmg = 0;
      }

      callback({
        result: resources,
        // todo calculate exp based on farm level
        exp: 4 * this.counter,
        dmg,
        // todo calculate stamina used
        usedStamina: this.counter,
      });
    };

    this.timer = new Timer({
      delay,
      callback: timerCallback,
    });
  }
}
