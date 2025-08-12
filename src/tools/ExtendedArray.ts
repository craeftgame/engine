import item from "../items/item";

export default class ExtendedArray<T> extends Array<any> {
  count = 0;

  public findById = (id) => {
    return this.find((obj) => obj.id === id);
  };

  public removeItem = (item) => {
    return this.splice(this.indexOf(item), 1);
  };

  public wipeItem = (item) => {
    return (this[this.indexOf(item)] = null);
  };

  public push = (...items: T[]): number => {
    const n = super.push(...items);
    this.count += items.length;

    return n;
  };
}
