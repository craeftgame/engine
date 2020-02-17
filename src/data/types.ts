export const Unknown = Object.freeze(Symbol.for("unknown"));

export const WeaponTypes = Object.freeze({
    Knife: Symbol.for("knife"),
    JewelKnife: Symbol.for("jewel_knife"),
    Sword: Symbol.for("sword"),
    JewelSword: Symbol.for("jewel_sword"),
    Staff: Symbol.for("staff"),
    Wand: Symbol.for("wand"),
    JewelWand: Symbol.for("jewel_wand")
});

export const ArmorTypes = Object.freeze({
    WoodenPlate: Symbol.for("wooden_plate"),
    MetalPlate: Symbol.for("metal_plate"),
    WoodenChainmail: Symbol.for("wooden_chainmail"),
    MetalChainmail: Symbol.for("metal_chainmail"),
    Woven: Symbol.for("woven"),
    JewelWoven: Symbol.for("jewel_woven")
});

export const ItemCategories = Object.freeze({
    Weapon: Symbol.for("weapon"),
    Armor: Symbol.for("armor"),
    Jewelery: Symbol.for("jewelery")
});

export const CraefterTypes = Object.freeze({
    WeaponCraefter: Symbol.for("weaponcraefter"),
    ArmorCraefter: Symbol.for("armorcraefter"),
    JewelCraefter: Symbol.for("jewelcraefter"),
    Alchemist: Symbol.for("alchemist")
});

export const WeaponSlots = Object.freeze({
    LeftHand: Symbol.for("left_hand"),
    RightHand: Symbol.for("right_hand")
});

export const ArmorSlots = Object.freeze({
    Head: Symbol.for("head"),
    Body: Symbol.for("body"),
    Legs: Symbol.for("legs"),
    Feet: Symbol.for("feet")
});

export const JewelerySlots = Object.freeze({
    Left: Symbol.for("left"),
    Right: Symbol.for("right")
});

export const ResourceTypes = Object.freeze({
    Wood: Symbol.for("wood"),
    Metal: Symbol.for("metal"),
    Cloth: Symbol.for("cloth"),
    Diamond: Symbol.for("diamond")
});

export const Rarities = Object.freeze({
    Common: Symbol.for("common"),
    Rare: Symbol.for("rare"),
    Epic: Symbol.for("epic"),
    Legendary: Symbol.for("legendary")
});

export const Classes = Object.freeze({
    Novice: Symbol.for("novice"),
    Mage: Symbol.for("mage"),
    Hunter: Symbol.for("hunter"),
    Swordsman: Symbol.for("swordsman")
});
