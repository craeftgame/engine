import {
  ArmorSlots,
  ItemCategories,
  JewelerySlots,
  Slots,
  WeaponSlots,
} from "../data";
import { Item } from "../items";

type EquipmentSlots = {
  [key in Slots]?: Item;
};

export class Equipment implements EquipmentSlots {
  [ArmorSlots.Head]?: Item;
  [ArmorSlots.Body]?: Item;
  [ArmorSlots.Feet]?: Item;
  [ArmorSlots.Legs]?: Item;

  [WeaponSlots.LeftHand]?: Item;
  [WeaponSlots.RightHand]?: Item;

  [JewelerySlots.Left]?: Item;
  [JewelerySlots.Right]?: Item;

  private findSlotByItemId(itemId: string): Slots | undefined {
    for (const slot in this) {
      if ((this[slot] as Item)?.id === itemId) {
        return slot as Slots;
      }
    }

    return;
  }

  public getEquipped(): Item[] {
    const equipped: Item[] = [];

    for (const slot in this) {
      const equipment: Item | undefined = this[slot] as Item;
      if (equipment && equipped.indexOf(equipment) < 0) {
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
        if (this[WeaponSlots.RightHand])
          this[WeaponSlots.RightHand].equipped = false;

        // unequip left
        if (this[WeaponSlots.LeftHand])
          this[WeaponSlots.LeftHand].equipped = false;

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
            if (this[WeaponSlots.RightHand]?.isMultiSlot) {
              delete this[WeaponSlots.LeftHand];
            }

            // unequip what ever is in right hand
            this[WeaponSlots.RightHand]!.equipped = false;

            // equip ro right hand
            this[WeaponSlots.RightHand] = item;

            equipped = true;
          }
        }
      }
    } else if (item.category === ItemCategories.Armor) {
      const { slot } = item;

      if (slot) {
        if (this[slot]) this[slot].equipped = false;
        this[slot] = item;
      }

      equipped = true;
    } else if (item.category === ItemCategories.Jewelery) {
      // we have a jewelery, assign to hand
      if (!this[JewelerySlots.Left]) {
        this[JewelerySlots.Left] = item;
        equipped = true;
      } else {
        if (this[JewelerySlots.Right]) {
          this[JewelerySlots.Right]!.equipped = false;
        }
        this[JewelerySlots.Right] = item;
        equipped = true;
      }
    }

    return equipped;
  }

  public unequip(itemId: string): boolean {
    const slot = this.findSlotByItemId(itemId);
    delete this[slot!];

    return true;
  }

  static hydrate(obj: Equipment): Equipment {
    return Object.assign(new Equipment(), obj);
  }

  public tick() {
    // todo tick equipment
  }
}
