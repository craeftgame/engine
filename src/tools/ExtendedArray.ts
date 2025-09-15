import { CraeftMixin, HydrateableMixin } from "./mixins";
import type { CraeftBase, ICraeft } from "../interfaces";

class ArrayBase<T> extends Array<T> {}

const MixedBase = CraeftMixin(HydrateableMixin(ArrayBase));

export class ExtendedArray<T extends CraeftBase> extends MixedBase<T> {
  public count = 0;

  constructor({ craeft }: { craeft: ICraeft }, ...items: T[]) {
    // @ts-expect-error  i am not sure why this happens
    super(craeft, ...items);
  }

  public findById = (id: string) => {
    return this.find((obj) => obj.id === id);
  };

  public removeItem = (item: T) => {
    return this.splice(this.indexOf(item), 1);
  };

  public wipeItem = (item: T) => {
    delete this[this.indexOf(item)];
  };

  public push = (...items: T[]): number => {
    const length = super.push(...items);
    this.count += items.length;

    return length;
  };

  public static hydrate(
    craeft: ICraeft,
    array: CraeftBase[],
    array2?: CraeftBase[],
  ): CraeftBase[] {
    const newArray = Object.assign(new ExtendedArray({ craeft }), ...array);

    if (array2) {
      newArray.push(...array2);
    }

    return newArray;
  }
}
