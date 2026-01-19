import assert from "assert";
import { Weapon } from "../";
import Craeft from "../../../craeft";
import { Rarities } from "../../../data";

describe("Weapon", () => {
  const craeft = new Craeft();
  describe("constructor", () => {
    it("should set atk correct", () => {
      const atk = 10;
      const item = new Weapon({ craeft, atk, rarity: Rarities.Common });
      assert.equal(item.atk(), atk);
    });
  });
});
