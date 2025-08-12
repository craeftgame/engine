import Organism from "../organism";

export default class Boss extends Organism {
  type: string;

  constructor(
    {
      hp,
      level,
      name,
      type,
    }: {
      hp: number;
      level: number;
      name: string;
      type: string;
    } = {
      hp: 100,
      level: 1,
      name: "Boss",
      type: "spider",
    },
  ) {
    super({
      name,
      hp,
    });

    this.level = level;
    this.type = type;
  }
}
