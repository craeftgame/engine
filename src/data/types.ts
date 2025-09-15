import type { Item } from "../game";

export const Unknown = "unknown";

export enum WeaponTypes {
  Knife = "knife",
  JewelKnife = "jewel_knife",
  Sword = "sword",
  JewelSword = "jewel_sword",
  Staff = "staff",
  Wand = "wand",
  JewelWand = "jewel_wand",
}

export enum ArmorTypes {
  WoodenPlate = "wooden_plate",
  MetalPlate = "metal_plate",
  WoodenChainmail = "wooden_chainmail",
  MetalChainmail = "metal_chainmail",
  Woven = "woven",
  JewelWoven = "jewel_woven",
}

export enum JeweleryTypes {
  Finger = "finger",
  Neck = "neck",
}

export type ItemTypes =
  | ArmorTypes
  | WeaponTypes
  | JeweleryTypes
  | typeof Unknown;

export enum ItemCategories {
  Weapon = "weapon",
  Armor = "armor",
  Jewelery = "jewelery",
}

export enum CraefterTypes {
  WeaponCraefter = "weaponcraefter",
  ArmorCraefter = "armorcraefter",
  JewelCraefter = "jewelcraefter",
  Alchemist = "alchemist",
}

export enum WeaponSlots {
  LeftHand = "left_hand",
  RightHand = "right_hand",
}

export enum ArmorSlots {
  Head = "head",
  Body = "body",
  Legs = "legs",
  Feet = "feet",
}

export enum JewelerySlots {
  Left = "left",
  Right = "right",
}

export type ItemSlots = JewelerySlots | ArmorSlots | WeaponSlots;

export type EquipmentSlots = {
  [key in ItemSlots]?: Item;
};

export enum ResourceTypes {
  Wood = "wood",
  Metal = "metal",
  Cloth = "cloth",
  Gemstone = "gemstone",
  Water = "water",
  Earth = "earth",
}

export type ResourcesCollection = {
  [key in ResourceTypes]: number;
};

export enum Rarities {
  Common = "common",
  Rare = "rare",
  Epic = "epic",
  Legendary = "legendary",
}

export enum Classes {
  Novice = "novice",
  Mage = "mage",
  Hunter = "hunter",
  Swordsman = "swordsman",
}
