import {
  ArmorSlots,
  ItemCategories,
  JewelerySlots,
  WeaponSlots,
} from "./data/types";
import Item from "./items/item";

export default class Equipment {
  [ArmorSlots.Head]: Item | null = null;
  [ArmorSlots.Body]: Item | null = null;
  [ArmorSlots.Legs]: Item | null = null;
  [ArmorSlots.Feet]: Item | null = null;

  [WeaponSlots.LeftHand]: Item | null = null;
  [WeaponSlots.RightHand]: Item | null = null;

  [JewelerySlots.Left]: Item | null = null;
  [JewelerySlots.Right]: Item | null = null;

  private findSlotByItemId(itemId: string): symbol | null {
    const slots = Object.getOwnPropertySymbols(this);

    for (const slot of slots) {
      if (this[slot]?.id === itemId) {
        return slot;
      }
    }

    return null;
  }

  public getEquipped(): Item[] {
    const equipped = [];

    for (const equipmentSymbol of Object.getOwnPropertySymbols(this)) {
      const equipment: Item[] | null = this[equipmentSymbol];
      // @ts-ignore
      if (equipment && equipped.indexOf(equipment) < 0) {
        // @ts-ignore
        equipped.push(equipment);
      }
    }

    return equipped;
  }

  public equip(item: Item): boolean {
    let equipped = false;

    if (item.category === ItemCategories.Weapon) {
      // we have a weapon, assign to hand
      // if it's a multi slit
      if (item.isMultiSlot) {
        // unequip right
        if (this[WeaponSlots.RightHand]) {
          this[WeaponSlots.RightHand].equipped = false;
        }

        // unequip left
        if (this[WeaponSlots.LeftHand]) {
          this[WeaponSlots.LeftHand].equipped = false;
        }

        // equip both
        this[WeaponSlots.RightHand] = item;
        this[WeaponSlots.LeftHand] = item;

        equipped = true;
      } else {
        // we have a one handed weapon

        // is right hand free?
        if (!this[WeaponSlots.RightHand]) {
          // yes, equip
          this[WeaponSlots.RightHand] = item;
          equipped = true;
        } else {
          // no, right hand is not free
          // is left hand free?
          if (!this[WeaponSlots.LeftHand]) {
            this[WeaponSlots.LeftHand] = item;
            equipped = true;
          } else {
            // no, both hands taken

            // if we unquipped a multi slot weapon, unequip the other hand as well
            if (this[WeaponSlots.RightHand].isMultiSlot) {
              this[WeaponSlots.LeftHand] = null;
            }

            // unequip what ever is in right hand
            this[WeaponSlots.RightHand].equipped = false;

            // equip ro right hand
            this[WeaponSlots.RightHand] = item;

            equipped = true;
          }
        }
      }
    } else if (item.category === ItemCategories.Armor) {
      const { slot } = item;

      if (this[slot]) {
        this[slot].equipped = false;
      }

      this[slot] = item;
      equipped = true;
    } else if (item.category === ItemCategories.Jewelery) {
      // we have a jewelery, assign to hand
      if (!this[JewelerySlots.Left]) {
        this[JewelerySlots.Left] = item;
        equipped = true;
      } else {
        if (this[JewelerySlots.Right]) {
          this[JewelerySlots.Right].equipped = false;
        }
        this[JewelerySlots.Right] = item;
        equipped = true;
      }
    }

    return equipped;
  }

  public unequip(itemId: string): boolean {
    // @ts-ignore
    this[this.findSlotByItemId(itemId)] = null;
    // @ts-ignore
    this[this.findSlotByItemId(itemId)] = null;

    return true;
  }

  static hydrate(obj): Equipment {
    const equipment = Object.assign(new Equipment(), obj);

    return equipment;
  }

  public tick() {
    // todo tick equipment
  }
}
