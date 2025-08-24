import { ItemCategories, Rarities, ResourceTypes, Unknown } from "../data";

export interface PreItem<T = typeof Unknown> {
  category: ItemCategories;
  type: T | typeof Unknown;
  material: ResourceTypes | typeof Unknown;
  rarity: Rarities | typeof Unknown;

  def?: number;
  defMax?: number;
  mdef?: number;
  mdefMax?: number;

  atk?: number;
  atkMax?: number;
  matk?: number;
  matkMax?: number;
}
