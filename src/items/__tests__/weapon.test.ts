import assert from "assert";
import { Weapon } from "../";

describe("Weapon", () => {
  describe("constructor", () => {
    it("should set atk correct", () => {
      const atk = 10;
      const item = new Weapon({ atk });
      assert.equal(item.atk(), atk);
    });
  });
});
