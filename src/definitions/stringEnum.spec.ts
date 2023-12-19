import { Shape } from "..";
import { StringEnum } from "./stringEnum";

describe("Definition: Child", () => {
  it("uses keyword notation", () => {
    class Test extends Shape({
      enum: StringEnum("A", "B"),
    }) {}

    const valid = new Test({
      enum: "A",
    });

    const result: string | number = valid.enum.match({
      A: () => "string",
      _: () => 1,
    });

    const fallbackResult: string | number = valid.enum.match({
      A: () => "string",
      B: () => 1,
    });

    const invalid = new Test({
      // @ts-expect-error - wrong type
      enum: "C",
    });
  });

  it("uses keyword-less notation", () => {
    class Test extends Shape({
      enum: ["A", "B"],
    }) {}

    const valid = new Test({
      enum: "A",
    });

    const result: string | number = valid.enum.match({
      A: () => "string",
      _: () => 1,
    });

    const fallbackResult: string | number = valid.enum.match({
      A: () => "string",
      B: () => 1,
    });

    const invalid = new Test({
      // @ts-expect-error - wrong type
      enum: "C",
    });
  });
});
