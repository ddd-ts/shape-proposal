import { Shape } from "../mixins/shape";
import { check } from "../testUtils";
import { Literal } from "./literal";
import { Multiple } from "./multiple";

describe("Definition: Multiple", () => {
  it("uses keyword notation", () => {
    class Test extends Shape({
      value: Multiple(Literal(String)),
    }) { }

    const a = new Test({
      value: ["a", "b", "c"],
    });

    expect(a.value).toEqual(["a", "b", "c"]);
    check(Test, a);
  });

  it("uses keyword-less notation", () => {
    class Test extends Shape({
      value: [String],
    }) { }

    const a = new Test({ value: ["a", "b", "c"] });

    expect(a.value).toEqual(["a", "b", "c"]);
    check(Test, a);
  });
});
