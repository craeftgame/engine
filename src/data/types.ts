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

export type Types = ArmorTypes | WeaponTypes | typeof Unknown;

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

export type Slots = JewelerySlots | ArmorSlots | WeaponSlots;

export enum ResourceTypes {
  Wood = "wood",
  Metal = "metal",
  Cloth = "cloth",
  Diamond = "diamond",
}

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
