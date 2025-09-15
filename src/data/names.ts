import { english as FirstNames } from "./lists/firstnames";
import { english as SurNames } from "./lists/surnames";
import ArmorNames from "./lists/armornames";
import WeaponNames from "./lists/weaponnames";
import WorldNames from "./lists/worldnames";
import JeweleryNames from "./lists/jewelerynames";

import {
  ArmorSlots,
  ArmorTypes,
  Classes,
  CraefterTypes,
  ItemSlots,
  ItemTypes,
  Rarities,
  ResourceTypes,
  Unknown,
  WeaponSlots,
  WeaponTypes,
} from "./types";

export const Mysterious = "???";

export const CraefterTypeNames: Partial<{
  [key in CraefterTypes | typeof Unknown]: string;
}> = {
  [Unknown]: Mysterious,
  [CraefterTypes.WeaponCraefter]: "Weaponcräfter",
  [CraefterTypes.ArmorCraefter]: "Armorcräfter",
  [CraefterTypes.JewelCraefter]: "Jewelcräfter",
  [CraefterTypes.Alchemist]: "Alchemist",
};

export const ItemNames: Partial<{
  [key in ItemTypes | string]: string;
}> = {
  [Unknown]: Mysterious,
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
  [key in ItemSlots]: string;
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

export const ResourceNames: Partial<{
  [key in ResourceTypes]: string;
}> = {
  [ResourceTypes.Wood]: "Wood",
  [ResourceTypes.Metal]: "Metal",
  [ResourceTypes.Cloth]: "Cloth",
  [ResourceTypes.Gemstone]: "Gemstone",
  [ResourceTypes.Water]: "Water",
  [ResourceTypes.Earth]: "Earth",
};

export {
  FirstNames,
  SurNames,
  WeaponNames,
  ArmorNames,
  WorldNames,
  JeweleryNames,
};
