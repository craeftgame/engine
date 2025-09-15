import { Organism } from "../../organism";
import type { ICraeft } from "../../interfaces";

export class Boss extends Organism {
  type: string;

  constructor({
    craeft,
    hp,
    level,
    name,
    type,
  }: { craeft: ICraeft } & Partial<{
    hp: number;
    level: number;
    name: string;
    type: string;
  }>) {
    super({
      craeft,
      name,
      hp,
    });

    if (level) {
      this.level = level;
    }

    if (type) {
      this.type = type;
    }
  }
}
