import {
    Unknown,
    CraefterTypes,
    WeaponTypes,
    ArmorTypes,
    ArmorSlots,
    Rarities, Classes
} from "./types";

import {english as FirstNames} from "./lists/firstnames"
import {english as SurNames} from "./lists/surnames"
import ArmorNames from "./lists/weaponnames"
import WeaponNames from "./lists/weaponnames"

export const CraefterTypeNames = Object.freeze({
    [Unknown]: "???",
    [CraefterTypes.WeaponCraefter]: "Weaponcräfter",
    [CraefterTypes.ArmorCraefter]: "Armorcräfter",
    [CraefterTypes.JewelCraefter]: "Jewelcräfter",
    [CraefterTypes.Alchemist]: "Alchemist"
});

export const ItemNames = Object.freeze({
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
    [ArmorTypes.JewelWoven]: "Jewel Woven"
});

export const SlotNames = Object.freeze({
    [ArmorSlots.Head]: "Head",
    [ArmorSlots.Body]: "Body",
    [ArmorSlots.Legs]: "Legs",
    [ArmorSlots.Feet]: "Feet",
});

export const RarityNames = Object.freeze({
    [Rarities.Common]: "Common",
    [Rarities.Rare]: "Rare",
    [Rarities.Epic]: "Epic",
    [Rarities.Legendary]: "Legendary",
});

export const ClassNames = Object.freeze({
    [Classes.Novice]: "Novice",
    [Classes.Mage]: "Mage",
    [Classes.Swordsman]: "Swordsman",
    [Classes.Hunter]: "Hunter",
});

export {
    FirstNames,
    SurNames,
    WeaponNames,
    ArmorNames
};
