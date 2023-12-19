import { Shape } from "..";
import { Optional } from "./optional";

describe("Definition: Child", () => {
  it("uses keyword notation", () => {
    class Other extends Shape({
      value: Optional(String),
    }) {}

    const a = new Other({});
  });
});
