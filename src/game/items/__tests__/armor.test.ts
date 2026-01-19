import assert from "assert";
import { Armor } from "../";
import Craeft from "../../../craeft";
import { Rarities } from "../../../data";

describe("Armor", () => {
  const craeft = new Craeft();
  describe("constructor", () => {
    it("should set def correct", () => {
      const def = 10;
      const item = new Armor({ craeft, def, rarity: Rarities.Common });

      assert.equal(item.def(), def);
    });
  });
});
