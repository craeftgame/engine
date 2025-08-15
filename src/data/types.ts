export const Unknown: symbol = Symbol.for("unknown");

export const WeaponTypes = {
  Knife: Symbol.for("knife"),
  JewelKnife: Symbol.for("jewel_knife"),
  Sword: Symbol.for("sword"),
  JewelSword: Symbol.for("jewel_sword"),
  Staff: Symbol.for("staff"),
  Wand: Symbol.for("wand"),
  JewelWand: Symbol.for("jewel_wand"),
} as const;

export const ArmorTypes = {
  WoodenPlate: Symbol.for("wooden_plate"),
  MetalPlate: Symbol.for("metal_plate"),
  WoodenChainmail: Symbol.for("wooden_chainmail"),
  MetalChainmail: Symbol.for("metal_chainmail"),
  Woven: Symbol.for("woven"),
  JewelWoven: Symbol.for("jewel_woven"),
} as const;

export const ItemCategories = {
  Weapon: Symbol.for("weapon"),
  Armor: Symbol.for("armor"),
  Jewelery: Symbol.for("jewelery"),
} as const;

export const CraefterTypes = {
  WeaponCraefter: Symbol.for("weaponcraefter"),
  ArmorCraefter: Symbol.for("armorcraefter"),
  JewelCraefter: Symbol.for("jewelcraefter"),
  Alchemist: Symbol.for("alchemist"),
} as const;

export const WeaponSlots = {
  LeftHand: Symbol.for("left_hand"),
  RightHand: Symbol.for("right_hand"),
} as const;

export const ArmorSlots = {
  Head: Symbol.for("head"),
  Body: Symbol.for("body"),
  Legs: Symbol.for("legs"),
  Feet: Symbol.for("feet"),
} as const;

export const JewelerySlots = {
  Left: Symbol.for("left"),
  Right: Symbol.for("right"),
} as const;

export const ResourceTypes = {
  Wood: Symbol.for("wood"),
  Metal: Symbol.for("metal"),
  Cloth: Symbol.for("cloth"),
  Diamond: Symbol.for("diamond"),
} as const;

export const Rarities = {
  Common: Symbol.for("common"),
  Rare: Symbol.for("rare"),
  Epic: Symbol.for("epic"),
  Legendary: Symbol.for("legendary"),
} as const;

export const Classes = {
  Novice: Symbol.for("novice"),
  Mage: Symbol.for("mage"),
  Hunter: Symbol.for("hunter"),
  Swordsman: Symbol.for("swordsman"),
} as const;
