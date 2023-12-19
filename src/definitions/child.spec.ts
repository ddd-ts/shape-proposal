import { Shape } from "..";
import { Child } from "./child";

describe("Definition: Child", () => {
  it("uses keyword notation", () => {
    class Other extends Shape({
      yo: String,
    }) {}

    class Test extends Shape({
      value: Child(Other),
    }) {}

    new Test({ value: new Other({ yo: "," }) }).value;
  });

  it("uses keyword-less notation", () => {
    class Other extends Shape({
      value: String,
    }) {}

    class Test extends Shape({
      value: Other,
    }) {}
  });
});
