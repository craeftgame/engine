import {
  ArmorSlots,
  EquipmentSlots,
  ItemCategories,
  ItemSlots,
  JewelerySlots,
  WeaponSlots,
} from "../data";
import { Item } from ".";
import { CraeftMixin, HydrateableMixin, Tickable } from "../tools";
import type { ICraeft } from "../interfaces";

export class Equipment
  extends CraeftMixin(HydrateableMixin())
  implements EquipmentSlots, Tickable
{
  [ArmorSlots.Head]?: Item;
  [ArmorSlots.Body]?: Item;
  [ArmorSlots.Feet]?: Item;
  [ArmorSlots.Legs]?: Item;

  [WeaponSlots.LeftHand]?: Item;
  [WeaponSlots.RightHand]?: Item;

  [JewelerySlots.Left]?: Item;
  [JewelerySlots.Right]?: Item;

  public findSlotByItem(item: Item): ItemSlots | undefined {
    for (const slot in this) {
      if (this[slot] === item) {
        return slot as ItemSlots;
      }
    }
  }

  public getEquipped(): Item[] {
    const equipped: Item[] = [];

    for (const slot in this) {
      const equipment = this[slot];
      if (equipment instanceof Item && equipped.indexOf(equipment) < 0) {
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
          this[WeaponSlots.RightHand].isEquipped = false;
        }

        // unequip left
        if (this[WeaponSlots.LeftHand]) {
          this[WeaponSlots.LeftHand].isEquipped = false;
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
            if (this[WeaponSlots.RightHand]?.isMultiSlot) {
              delete this[WeaponSlots.LeftHand];
            }

            // unequip what ever is in right hand
            this[WeaponSlots.RightHand]!.isEquipped = false;

            // equip ro right hand
            this[WeaponSlots.RightHand] = item;

            equipped = true;
          }
        }
      }
    } else if (item.category === ItemCategories.Armor) {
      const { slot } = item;

      if (slot) {
        if (this[slot]) this[slot].isEquipped = false;
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
          this[JewelerySlots.Right]!.isEquipped = false;
        }
        this[JewelerySlots.Right] = item;
        equipped = true;
      }
    }

    return equipped;
  }

  public unequip(item: Item): boolean {
    // we need to do this twice because we have items that occupy more than one slot
    let slot = this.findSlotByItem(item);
    if (slot) {
      delete this[slot];
    }

    slot = this.findSlotByItem(item);
    if (slot) {
      delete this[slot];
    }

    return true;
  }

  public static hydrate(craeft: ICraeft, equipment: Equipment): Equipment {
    return Object.assign(new Equipment({ craeft }), equipment);
  }

  public tick?(tick: number): void {
    for (const slot in this) {
      const item = this[slot];
      if (item instanceof Item) item?.tick?.(tick);
    }
  }
}
