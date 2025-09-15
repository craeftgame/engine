import {
  Bosses,
  Craefters,
  Farm,
  Item,
  Items,
  Player,
  Resources,
} from "../game";
import Map from "@craeft/map-generator/dist/map/map";
import { CraefterTypes } from "../data";

export interface ICraeft {
  player: Player;
  farm: Farm;
  craefters: Craefters;
  items: Items;
  resources: Resources;
  bosses: Bosses;
  map?: Map;
  gameTick?: number;
  onTick?: () => void;
  onUpdate?: () => void;
  ticker: number;
  log: (log: string) => void;

  serialize(): string;

  move(direction: string): void;

  tick(): void;

  update(): void;

  start({
    onTick,
    onUpdate,
  }: {
    onTick?: () => void;
    onUpdate?: () => void;
  }): void;

  stop(hard?: boolean): void;

  startFarming({ onEndFarming }: { onEndFarming?: () => void }): void;

  addItem(item: Item, resourcesConsumed: Resources): void;

  addCraefter(which: CraefterTypes): void;

  disentchant(item: Item): void;

  equipItem(item: Item): boolean;

  unEquipItem(item: Item): boolean;
}
