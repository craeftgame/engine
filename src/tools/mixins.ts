import { getRandomId } from "./rand";
import type { CraeftBase, ICraeft } from "../interfaces";

/*eslint-disable-next-line*/
type Constructor<T = {}> = new (...args: any[]) => T;

export function HydrateableMixin<B extends Constructor = Constructor>(
  Base: B = class {} as B,
) {
  abstract class Hydrateable extends Base {
    // loose signature so subclasses can specialize
    public static hydrate(
      _craeft: ICraeft,
      _obj: Hydrateable,
      _obj2?: Hydrateable,
    ): Hydrateable {
      throw new Error("Not implemented");
    }
  }
  return Hydrateable;
}

// Mixin function that applies CraeftBase to any class
export function CraeftMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements CraeftBase {
    public readonly craeft: ICraeft;
    public readonly id: string;

    /*eslint-disable-next-line*/
    constructor(...args: any[]) {
      const [craeft, ...rest] = args;
      super(...rest);
      this.craeft = craeft;
      this.id = getRandomId();
    }
  };
}
