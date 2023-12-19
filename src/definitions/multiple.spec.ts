import { Shape } from "..";
import { Literal } from "./literal";
import { Multiple } from "./multiple";

describe("Definition: Child", () => {
  it("uses keyword notation", () => {
    class Test extends Shape({
      value: Multiple(Literal(String)),
    }) {}
  });

  it("uses keyword-less notation", () => {
    class Test extends Shape({
      value: [String],
    }) {}
    const a = new Test({ value: ["a", "b"] });
  });
});
