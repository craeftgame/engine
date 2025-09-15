import assert from "assert";
import { Armor } from "../";
import Craeft from "../../../craeft";

describe("Armor", () => {
  const craeft = new Craeft();
  describe("constructor", () => {
    it("should set def correct", () => {
      const def = 10;
      const item = new Armor({ craeft, def });
      assert.equal(item.def(), def);
    });
  });
});
