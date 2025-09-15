import { generate } from "@craeft/map-generator/dist/map/generator";
import Map from "@craeft/map-generator/dist/map/map";
import { TerrainTypes } from "@craeft/map-generator/dist/TerrainTypes";

// @ts-expect-error bad exports on serializer
import Serializer from "@craeft/serializer";
// local storage
import { get, remove, set } from "local-storage";
import { compress, decompress } from "lz-string";
import { log, multiply, pow } from "mathjs";
import {
  ArmorCraefter,
  Bosses,
  Craefter,
  Craefters,
  Farm,
  Item,
  Items,
  Player,
  Resources,
  Weapon,
  WeaponCraefter,
} from "./game";

import { config } from "./config";
import {
  CraefterTypes,
  Mysterious,
  Rarities,
  ResourceTypes,
  SlotNames,
  WeaponTypes,
} from "./data";
import { getRandomArrayItem } from "./tools";
import type { ICraeft } from "./interfaces";

const version = `v${process.env.NEXT_PUBLIC_CRAEFT_VERSION ?? "Test"}`;
const versionMsg = `Welcome to Cräft! version: ${version}`;

console.log(versionMsg);

if (config.debug) {
  console.log("Running in debug mode!");
}

export default class Craeft implements ICraeft {
  public readonly logs: string[] = [versionMsg];

  public readonly player: Player;
  public readonly farm: Farm;
  public readonly craefters: Craefters;
  public readonly items: Items;
  public readonly resources: Resources;
  public readonly bosses: Bosses;
  public map?: Map;

  gameTick?: number;
  onTick?: () => void;
  onUpdate?: () => void;

  ticker: number = 0;

  constructor() {
    this.player = new Player({ craeft: this });
    this.bosses = new Bosses({ craeft: this });
    this.farm = new Farm({ craeft: this });
    this.craefters = new Craefters({ craeft: this });
    this.items = new Items({ craeft: this });

    generate({
      height: 256,
      width: 256,
      treeChance: 30,
      pondMax: 5,
    }).then((map) => (this.map = map));

    this.resources = new Resources({
      craeft: this,
      initialResources: config.startResources,
      resources: {},
    });

    const weapons = [
      new Weapon({
        craeft: this,
        name: "Novice Knife",
        type: WeaponTypes.Knife,
        material: ResourceTypes.Metal,
        rarity: Rarities.Common,
        atk: 1,
        delay: -1,
      }),
    ];

    const startWeapon = getRandomArrayItem({
      array: weapons,
    });

    startWeapon.isEquipped = this.player.equipment.equip(startWeapon);

    this.items.push(startWeapon);
  }

  public serialize(): string {
    return Serializer.serialize({
      obj: this,
      compress: true,
    });
  }

  public move(direction: string): void {
    if (!this.map) {
      return;
    }

    if (this.player.staCurrent >= 1) {
      const results = this.map.move(direction);

      if (results.hasMoved) {
        let staminaConsumption = 1;

        if (results.terrain === TerrainTypes.Tree) {
          staminaConsumption *= 2;
        } else if (results.terrain === TerrainTypes.Water) {
          staminaConsumption *= 4;
        }

        this.player.exhaust(staminaConsumption);

        this.update();
      }
    }
  }

  public static deserialize(json: string): Craeft {
    const obj = Serializer.deserialize(json);

    const craeft = Object.assign(new Craeft(), obj);

    craeft.resources = Resources.hydrate(craeft, obj.resources);
    craeft.farm = Farm.hydrate(craeft, obj.farm);
    craeft.items = Items.hydrate(craeft, obj.items);
    craeft.craefters = Craefters.hydrate(craeft, obj.craefters);
    craeft.bosses = Bosses.hydrate(craeft, obj.bosses);

    craeft.player = Player.hydrate(craeft, obj.player);

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

  public log = (log: string) => {
    this.logs.push(log);
  };

  public update(): void {
    if (this.onUpdate) this.onUpdate();
  }

  public start({
    onTick,
    onUpdate,
  }: {
    onTick?: () => void;
    onUpdate?: () => void;
  } = {}): void {
    // re-render every second
    const timeoutInSeconds = 1;
    this.onTick = onTick;
    this.onUpdate = onUpdate;

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

    delete this.gameTick;

    // final tick
    this.tick();

    if (hard) {
      Craeft.deleteState();
    }
  }

  public startFarming({ onEndFarming }: { onEndFarming?: () => void } = {}) {
    if (!this.player.isFarming && this.player.staCurrent > 0) {
      this.player.isFarming = true;
      this.farm.start({
        player: this.player,
        onFarmEnd: ({ result, dmg, exp, usedStamina }) => {
          this.resources.add(result);

          this.player.takeDamage(dmg);
          this.player.addExp(exp);
          this.player.exhaust(usedStamina);

          this.player.isFarming = false;

          onEndFarming?.();
          this.update();
        },
      });

      this.update();
    }
  }

  public addItem(item: Item, resourcesConsumed: Resources) {
    this.resources.sub(resourcesConsumed);

    item.onDoneCreating = (craefter: Craefter, exp: number) => {
      craefter.finishCraefting(exp);

      this.logs.push(
        `"${item.isBroken ? "Broken " : ""}${item.getName()}" cräfted by ${craefter.name}! `,
      );
    };

    this.items.push(item);
  }

  public addCraefter(which: CraefterTypes) {
    let craefter: Craefter;

    const delay = multiply(
      config.startDelay,
      pow(
        log(this.craefters.count + config.craefterDelayCurve.floor),
        config.craefterDelayCurve.top,
      ),
    ).valueOf() as number;

    switch (which) {
      case CraefterTypes.WeaponCraefter:
        craefter = new WeaponCraefter({
          craeft: this,
          delay,
        });
        break;

      case CraefterTypes.ArmorCraefter:
        craefter = new ArmorCraefter({
          craeft: this,
          delay,
        });
        break;

      default:
        throw new Error(`Unknown craefter type: ${which}`);
    }

    this.craefters.push(craefter);

    craefter.onDoneCreating = (exp: number) => {
      this.player.addExp(exp);
    };

    this.update();
  }

  public disentchant(item: Item): void {
    const result = this.items.disentchant(item);
    this.resources.add(result.resources);

    this.logs.push(
      `"${result.name}" disenchanted! ${result.resources.sum()} resource(s) retrieved!`,
    );

    this.update();
  }

  public equipItem(item: Item): boolean {
    let equipped = false;

    if (!this.player.isFarming) {
      equipped = this.player.equipment.equip(item);

      if (equipped) {
        item.isEquipped = equipped;
        const slot = this.player.equipment.findSlotByItem(item);
        const slotName = slot ? SlotNames[slot] : Mysterious;

        this.logs.push(`"${item.getName()}" put in slot ${slotName}.`);

        this.update();
      } else {
        this.logs.push("Equip failed!");
      }
    }

    return equipped;
  }

  public unEquipItem(item: Item): boolean {
    let unequipped = false;

    if (!this.player.isFarming) {
      unequipped = this.player.equipment.unequip(item);

      if (unequipped) {
        item.isEquipped = !unequipped;

        this.logs.push(`"${item.getName()}" taken off.`);
        this.update();
      } else {
        this.logs.push("Unequip failed!");
      }
    }

    return unequipped;
  }

  public static saveState(craeft: Craeft): boolean {
    if (config.useLocalStorage && !craeft.player.isDead) {
      const state = craeft.serialize();

      set("state", config.compressLocalStorage ? compress(state) : state);
      return true;
    }

    return false;
  }

  public static loadState(): Craeft | undefined {
    let state;

    if (config.useLocalStorage) {
      const localState: string = get("state");

      if (localState) {
        // if the state starts with { it is uncompressed
        state = localState.startsWith("{")
          ? localState
          : decompress(localState);
      }

      if (state) {
        return Craeft.deserialize(state);
      }
    }
  }

  private static deleteState(): void {
    if (config.useLocalStorage) {
      remove("state");
    }
  }
}
