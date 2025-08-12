/* globals describe, it */
import Armor from "../armor";
import assert from "assert";

describe("Armor", () => {
  describe("constructor", () => {
    it("should set def correct", () => {
      const def = 10;
      // @ts-ignore
      const item = new Armor({ def });
      assert.equal(item.def, def);
    });
  });
});
