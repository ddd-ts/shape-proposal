import { Shape } from "..";
import { check } from "../testUtils";
import { Dict } from "./dict";

describe("Definition: Child", () => {
  it("uses keyword notation", () => {
    class Test extends Shape(Dict({})) {}

    // @ts-expect-error - missing value
    new Test();

    new Test({});
    check(Test, new Test({}));
  });

  it("uses keyword-less notation", () => {
    class Test extends Shape({}) {}

    // @ts-expect-error - missing value
    new Test();

    new Test({});
    check(Test, new Test({}));
  });
});
