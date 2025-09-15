import {
  ItemCategories,
  ItemTypes,
  Rarities,
  ResourceTypes,
  Unknown,
} from "../data";

export interface PreItem<T = ItemTypes> {
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
