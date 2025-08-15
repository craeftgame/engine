import {
  ArmorSlots,
  ArmorTypes,
  Classes,
  CraefterTypes,
  Rarities,
  Unknown,
  WeaponTypes,
} from "./types";

import { english as FirstNames } from "./lists/firstnames";
import { english as SurNames } from "./lists/surnames";
import ArmorNames from "./lists/weaponnames";
import WeaponNames from "./lists/weaponnames";

export const CraefterTypeNames = {
  [Unknown]: "???",
  [CraefterTypes.WeaponCraefter]: "Weaponcräfter",
  [CraefterTypes.ArmorCraefter]: "Armorcräfter",
  [CraefterTypes.JewelCraefter]: "Jewelcräfter",
  [CraefterTypes.Alchemist]: "Alchemist",
} as const;

export const ItemNames = {
  [Unknown]: "???",
  [WeaponTypes.Sword]: "Sword",
  [WeaponTypes.JewelSword]: "Jewel Sword",
  [WeaponTypes.Knife]: "Knife",
  [WeaponTypes.JewelKnife]: "Jewel Knife",
  [WeaponTypes.Staff]: "Staff",
  [WeaponTypes.Wand]: "Wand",
  [WeaponTypes.JewelWand]: "Jewel Wand",
  [ArmorTypes.WoodenPlate]: "Wooden Plate",
  [ArmorTypes.WoodenChainmail]: "Wooden Chainmail",
  [ArmorTypes.MetalPlate]: "Metal Plate",
  [ArmorTypes.MetalChainmail]: "Metal Chainmail",
  [ArmorTypes.Woven]: "Woven",
  [ArmorTypes.JewelWoven]: "Jewel Woven",
} as const;

export const SlotNames = {
  [ArmorSlots.Head]: "Head",
  [ArmorSlots.Body]: "Body",
  [ArmorSlots.Legs]: "Legs",
  [ArmorSlots.Feet]: "Feet",
} as const;

export const RarityNames = {
  [Rarities.Common]: "Common",
  [Rarities.Rare]: "Rare",
  [Rarities.Epic]: "Epic",
  [Rarities.Legendary]: "Legendary",
} as const;

export const ClassNames = {
  [Classes.Novice]: "Novice",
  [Classes.Mage]: "Mage",
  [Classes.Swordsman]: "Swordsman",
  [Classes.Hunter]: "Hunter",
} as const;

export { FirstNames, SurNames, WeaponNames, ArmorNames };
