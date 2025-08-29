import { generate } from "@craeft/map-generator/dist/map/generator";
import Map from "@craeft/map-generator/dist/map/map";
import { TerrainTypes } from "@craeft/map-generator/dist/TerrainTypes";

// @ts-expect-error bad exports on serializer
import Serializer from "@craeft/serializer";
// local storage
import { get, remove, set } from "local-storage";
import { compress, decompress } from "lz-string";
import { log, pow } from "mathjs";
import { Bosses } from "./boss";

import { config } from "./config";
import { ArmorCraefter, Craefter, Craefters, WeaponCraefter } from "./craefter";
import {
  CraefterTypes,
  Rarities,
  ResourceTypes,
  SlotNames,
  Types,
  WeaponTypes,
} from "./data";
import { Farm, Player, Resources } from "./game";
import { Item, Items, Weapon } from "./items";

const version = `v${process.env.NEXT_PUBLIC_CRAEFT_VERSION ?? "Test"}`;
const versionMsg = `Welcome to Cräft! version: ${version}`;

console.log(versionMsg);

if (config.debug) {
  console.log("Running in debug mode!");
}

export default class Craeft {
  readonly logs: string[] = [versionMsg];

  public readonly player: Player;
  public readonly farm: Farm;
  public readonly craefters: Craefters;
  public readonly items: Items;
  public readonly resources: Resources;
  public readonly bosses: Bosses;
  public map?: Map;

  private gameTick?: number;
  private onTick?: () => void;
  private onUpdate?: () => void;

  private ticker: number = 0;

  constructor() {
    this.player = new Player();
    this.farm = new Farm();
    this.craefters = new Craefters();
    this.items = new Items();
    this.bosses = new Bosses();

    generate({
      height: 256,
      width: 256,
      treeChance: 30,
      pondMax: 5,
    }).then((map) => (this.map = map));

    this.resources = new Resources({
      initialResources: config.startResources,
      resources: {},
    });

    const knife = new Weapon({
      name: "Novice Knife",
      type: WeaponTypes.Knife,
      material: ResourceTypes.Metal,
      rarity: Rarities.Common,
      atk: 1,
      matk: 1,
      delay: -1,
    });

    knife.isEquipped = this.player.equipment.equip(knife);

    this.items.push(knife);
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

  static deserialize(json: string): Craeft {
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

  public startFarming({ callback }: { callback?: () => void } = {}) {
    if (!this.player.isFarming && this.player.staCurrent > 0) {
      this.player.isFarming = true;
      this.farm.start({
        player: this.player,
        callback: ({ result, dmg, exp, usedStamina }) => {
          this.resources.add(result);

          this.player.takeDamage(dmg);
          this.player.addExp(exp);
          this.player.exhaust(usedStamina);

          this.player.isFarming = false;

          callback?.();
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

      this.logs.push(`"${item.getName()}" cräfted by ${craefter.name}! `);
    };

    this.items.push(item);
  }

  public addCraefter(which: CraefterTypes) {
    let craefter: Craefter<Types>;

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
        const slotName = slot ? SlotNames[slot] : "???";

        this.logs.push(`"${item.getName()}" put in ${slotName}.`);

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

  public static saveState(): boolean {
    if (config.useLocalStorage && !craeft.player.isDead) {
      const state = craeft.serialize();

      set("state", config.compressLocalStorage ? compress(state) : state);
      return true;
    }

    return false;
  }

  public static loadState(): void {
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
        craeft = Craeft.deserialize(state);
      }
    }
  }

  private static deleteState(): void {
    if (config.useLocalStorage) {
      remove("state");
    }
  }
}

export let craeft = new Craeft();
