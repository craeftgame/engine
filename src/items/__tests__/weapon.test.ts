/* globals describe, it */
import Weapon from "../weapon";
import assert from "assert";

describe("Weapon", () => {
  describe("constructor", () => {
    it("should set atk correct", () => {
      const atk = 10;
      // @ts-ignore
      const item = new Weapon({ atk });
      assert.equal(item.atk, atk);
    });
  });
});
