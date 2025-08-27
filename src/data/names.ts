import { english as FirstNames } from "./lists/firstnames";
import { english as SurNames } from "./lists/surnames";
import ArmorNames from "./lists/weaponnames";
import WeaponNames from "./lists/weaponnames";
import {
  ArmorSlots,
  ArmorTypes,
  Classes,
  CraefterTypes,
  Rarities,
  Slots,
  Types,
  Unknown,
  WeaponSlots,
  WeaponTypes,
} from "./types";

export const CraefterTypeNames: Partial<{
  [key in CraefterTypes | typeof Unknown]: string;
}> = {
  [Unknown]: "???",
  [CraefterTypes.WeaponCraefter]: "Weaponcräfter",
  [CraefterTypes.ArmorCraefter]: "Armorcräfter",
  [CraefterTypes.JewelCraefter]: "Jewelcräfter",
  [CraefterTypes.Alchemist]: "Alchemist",
};

export const ItemNames: Partial<{
  [key in Types]: string;
}> = {
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
};

export const SlotNames: Partial<{
  [key in Slots]: string;
}> = {
  [ArmorSlots.Head]: "Head",
  [ArmorSlots.Body]: "Body",
  [ArmorSlots.Legs]: "Legs",
  [ArmorSlots.Feet]: "Feet",
  [WeaponSlots.RightHand]: "Right Hand",
  [WeaponSlots.LeftHand]: "Left Hand",
};

export const RarityNames: Partial<{
  [key in Rarities]: string;
}> = {
  [Rarities.Common]: "Common",
  [Rarities.Rare]: "Rare",
  [Rarities.Epic]: "Epic",
  [Rarities.Legendary]: "Legendary",
};

export const ClassNames: Partial<{
  [key in Classes]: string;
}> = {
  [Classes.Novice]: "Novice",
  [Classes.Mage]: "Mage",
  [Classes.Swordsman]: "Swordsman",
  [Classes.Hunter]: "Hunter",
};

export { FirstNames, SurNames, WeaponNames, ArmorNames };
