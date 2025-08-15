/* globals describe, it */
import assert from "assert";
import Armor from "../armor";

describe("Armor", () => {
  describe("constructor", () => {
    it("should set def correct", () => {
      const def = 10;
      const item = new Armor({ def });
      assert.equal(item.def, def);
    });
  });
});
