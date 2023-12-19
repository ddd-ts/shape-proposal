import { Shape } from "..";
import { Either } from "./either";

describe("Definition: Child", () => {
  it("uses keyword notation", () => {
    class A extends Shape({
      value: String,
    }) {}

    class Test extends Shape({
      value: Either(A, { dictValue: Number }, String),
    }) {}

    const shape = new Test({ value: new A({ value: "hehe" }) });
    const dict = new Test({ value: { dictValue: 1 } });
    const str = new Test({ value: "" });

    // @ts-expect-error - wrong type
    new Test({ value: 1 });
  });
});
