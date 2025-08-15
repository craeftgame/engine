import {
  CraefterTypes,
  Rarities,
  ResourceTypes,
  WeaponTypes,
} from "./data/types";

import Resources from "./resources";
import Player from "./player";
import Farm from "./farm";
import Weapon from "./items/weapon";

import WeaponCraefter from "./craefter/weaponcraefter";
import ArmorCraefter from "./craefter/armorcraefter";

import Serializer from "@craeft/serializer";
import { log, pow } from "mathjs";

import config from "./config";
// storage
import ls from "local-storage";
import zip from "lz-string/libs/lz-string";
import Items from "./items/items";
import Craefters from "./craefter/craefters";
import Bosses from "./boss/bosses";
import { generate } from "@craeft/map-generator/dist/map/generator";
import Map from "@craeft/map-generator/dist/map/map";
import { TerrainTypes } from "@craeft/map-generator/dist/TerrainTypes";
import Item from "./items/item";

const version = `v${process.env.REACT_APP_VERSION}`;
const versionMsg = `Welcome to Cräft! version: ${version}`;

/* eslint-disable-next-line no-console */
console.log(versionMsg);

if (config.debug) {
  console.log("Running in debug mode!");
}

export default class Craeft {
  logs: string[] = [versionMsg];

  player: Player;
  farm: Farm;
  craefters: Craefters;
  items: Items;
  resources: Resources;
  bosses: Bosses;
  map?: Map;

  gameTick: number | null = null;
  onTick: { (): void } | null = null;

  ticker: number = 0;

  constructor() {
    this.player = new Player();
    this.farm = new Farm();
    this.craefters = new Craefters();
    this.items = new Items();
    this.bosses = new Bosses();
    generate({
      height: 200,
      width: 200,
      treeChance: 30,
      pondMax: 5,
    }).then((map) => (this.map = map));

    this.resources = new Resources({
      initialResources: config.startResources,
    });

    const knife = new Weapon({
      name: "Newbie Knife",
      type: WeaponTypes.Knife,
      material: ResourceTypes.Metal,
      rarity: Rarities.Common,
      atk: 1,
      matk: 1,
      delay: -1,
    });

    knife.equipped = this.player.equipment.equip(knife);

    this.items.push(knife);
  }

  public serialize(): string {
    return Serializer.serialize({
      obj: this,
      compress: true,
    });
  }

  public move(direction): void {
    if (!this.map) {
      return;
    }

    if (this.player.staCurrent >= 1) {
      const results = this.map.move(direction);

      if (results.hasMoved) {
        let a = 1;

        if (results.terrain === TerrainTypes.Tree) {
          a *= 2;
        } else if (results.terrain === TerrainTypes.Water) {
          a *= 4;
        }

        this.player.exhaust(a);
      }
    }
  }

  static deserialize(json): Craeft {
    const obj = Serializer.deserialize(json);

    const craeft = Object.assign(new Craeft(), obj);

    craeft.resources = Resources.hydrate(obj.resources);
    craeft.farm = Farm.hydrate(obj.farm);
    craeft.items = Items.hydrate(obj.items);
    craeft.craefters = Craefters.hydrate(obj.craefters);
    craeft.bosses = Bosses.hydrate(obj.bosses);

    craeft.player = Player.hydrate(obj.player);

    return craeft;
  }

  public tick(): void {
    this.ticker++;

    // tick the player
    this.player.tick(this.ticker);

    // tick all craefters
    for (const craefter of this.craefters) {
      craefter.tick(this.ticker);
    }

    // tick all the items
    for (const item of this.items) {
      item.tick(this.ticker);
    }

    if (this.onTick) {
      this.onTick();
    }
  }

  public start(
    {
      onTick,
    }: {
      onTick: { (): void } | null;
    } = {
      onTick: null,
    },
  ): void {
    // re-render every second
    const timeoutInSeconds = 1;
    this.onTick = onTick;

    if (this.gameTick) {
      this.stop();
    }

    this.gameTick = window.setInterval(() => {
      this.ticker = 0;
      this.tick();
    }, timeoutInSeconds * 1000);
  }

  public stop(hard?: boolean) {
    if (this.gameTick) {
      window.clearInterval(this.gameTick);
    }

    this.gameTick = null;

    // final tick
    this.tick();

    if (hard) {
      Craeft.deleteState();
    }
  }

  public startFarming({ callback }: { callback: any }) {
    if (!this.player.isFarming && this.player.staCurrent > 0) {
      this.player.isFarming = true;
      this.farm.start({
        player: this.player,
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
        }) => {
          this.resources = new Resources().add(this.resources).add(result);

          this.player.takeDamage(dmg);
          this.player.addExp(exp);
          this.player.exhaust(usedStamina);

          this.player.isFarming = false;

          callback();
        },
      });
    }
  }

  public addItem(item: Item, resourcesConsumed: Resources) {
    this.resources.sub(resourcesConsumed);

    item.onDoneCreating = (craefterId, exp) => {
      const craefter = this.craefters.findById(craefterId);
      craefter.finishCraefting(exp);

      this.logs.push(`"${item.getName()}" cräfted by ${craefter.name}! `);
    };

    this.items.push(item);
  }

  public addCraefter(which) {
    let craefter;

    const delay = config.startDelay * pow(log(this.craefters.count + 2), 20);

    switch (which) {
      case CraefterTypes.WeaponCraefter:
        craefter = new WeaponCraefter({
          delay,
        });
        break;

      case CraefterTypes.ArmorCraefter:
        craefter = new ArmorCraefter({
          delay,
        });
        break;

      default:
        throw new Error("Unknown craefter type");
    }

    this.craefters.push(craefter);

    craefter.onDoneCreating = (exp) => {
      this.player.addExp(exp);
    };
  }

  public disentchant(itemId): void {
    // console.log(this.items);

    const result = this.items.disentchant(itemId);

    this.resources = new Resources({
      resources: this.resources,
    }).add(result.resources);

    this.logs.push(
      `"${result.name}" disenchanted! ${result.resources.sum()} resource(s) retrieved!`,
    );
  }

  public equipItem(item: Item): boolean {
    let equipped = false;

    if (!this.player.isFarming) {
      equipped = this.player.equipment.equip(item);

      if (equipped) {
        item.equipped = equipped;

        this.logs.push(`"${item.getName()}" put on.`);
      } else {
        this.logs.push("Equip failed!");
      }
    }

    return equipped;
  }

  public unEquipItem(itemId): boolean {
    let unequipped = false;

    if (!this.player.isFarming) {
      unequipped = this.player.equipment.unequip(itemId);

      if (unequipped) {
        const item = this.items.find((i) => i.id === itemId);

        item.equipped = !unequipped;

        this.logs.push(`"${item.getName()}" taken off.`);
      } else {
        this.logs.push("Unequip failed!");
      }
    }

    return unequipped;
  }

  public static saveState(): boolean {
    if (config.useLocalStorage && !global.craeft.player.dead) {
      const state = global.craeft.serialize();

      // @ts-ignore
      ls.set(
        "state",
        config.compressLocalStorage ? zip.compress(state) : state,
      );
      return true;
    }

    return false;
  }

  public static loadState(): void {
    let state = null;

    if (config.useLocalStorage) {
      // @ts-ignore
      const localState: string = ls.get("state");

      if (localState) {
        // if the state starts with { it is uncompressed
        state = localState.startsWith("{")
          ? localState
          : zip.decompress(localState);
      }

      if (state) {
        global.craeft = Craeft.deserialize(state);
      }
    }
  }

  private static deleteState(): void {
    if (config.useLocalStorage) {
      // @ts-ignore
      ls.remove("state");
    }
  }
}

global.craeft = new Craeft();
