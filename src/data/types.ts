export const Unknown = Object.freeze(Symbol.for("unknown"));

export const WeaponTypes = Object.freeze({
  Knife: Symbol.for("knife"),
  JewelKnife: Symbol.for("jewel_knife"),
  Sword: Symbol.for("sword"),
  JewelSword: Symbol.for("jewel_sword"),
  Staff: Symbol.for("staff"),
  Wand: Symbol.for("wand"),
  JewelWand: Symbol.for("jewel_wand"),
});

export const ArmorTypes = Object.freeze({
  WoodenPlate: Symbol.for("wooden_plate"),
  MetalPlate: Symbol.for("metal_plate"),
  WoodenChainmail: Symbol.for("wooden_chainmail"),
  MetalChainmail: Symbol.for("metal_chainmail"),
  Woven: Symbol.for("woven"),
  JewelWoven: Symbol.for("jewel_woven"),
});

export const ItemCategories = Object.freeze({
  Weapon: Symbol.for("weapon"),
  Armor: Symbol.for("armor"),
  Jewelery: Symbol.for("jewelery"),
});

export const CraefterTypes = Object.freeze({
  WeaponCraefter: Symbol.for("weaponcraefter"),
  ArmorCraefter: Symbol.for("armorcraefter"),
  JewelCraefter: Symbol.for("jewelcraefter"),
  Alchemist: Symbol.for("alchemist"),
});

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

export enum ResourceTypes {
  Wood = "wood",
  Metal = "metal",
  Cloth = "cloth",
  Diamond = "diamond",
}

export const Rarities = Object.freeze({
  Common: Symbol.for("common"),
  Rare: Symbol.for("rare"),
  Epic: Symbol.for("epic"),
  Legendary: Symbol.for("legendary"),
});

export const Classes = Object.freeze({
  Novice: Symbol.for("novice"),
  Mage: Symbol.for("mage"),
  Hunter: Symbol.for("hunter"),
  Swordsman: Symbol.for("swordsman"),
});
