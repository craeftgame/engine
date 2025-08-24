export class ExtendedArray<T> extends Array {
  count = 0;

  public findById = (id: string) => {
    return this.find((obj) => obj.id === id);
  };

  public removeItem = (item: T) => {
    return this.splice(this.indexOf(item), 1);
  };

  public wipeItem = (item: T) => {
    return (this[this.indexOf(item)] = undefined);
  };

  public push = (...items: T[]): number => {
    const n = super.push(...items);
    this.count += items.length;

    return n;
  };
}
