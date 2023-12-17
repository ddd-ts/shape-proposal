import { Shape } from ".";
import { Definition } from "./definitions/definition";
import { Dict } from "./definitions/dict";
import { Literal } from "./definitions/literal";
import { Multiple } from "./definitions/multiple";
import { Optional } from "./definitions/optional";

describe("Shape", () => {
  function check<D extends Definition>(
    constructor: ReturnType<typeof Shape<D>>,
    instance: InstanceType<ReturnType<typeof Shape<D>>>
  ) {
    expect(instance).toEqual(constructor.deserialize(instance.serialize()));
  }

  it("Shape with String value", () => {
    class Test extends Shape(
      Dict({
        value: Literal(String),
      })
    ) { }

    const test = new Test({
      value: "my first shape",
    });

    expect(test.value).toBe("my first shape");
    check(Test, test);
  });

  it("Shape with shorthand notation", () => {
    class Test extends Shape({
      value: String,
    }) { }
  });

  it("Shape multiple with keyword notation", () => {
    class Test extends Shape({
      value: Multiple(Literal(String)),
    }) { }
  });

  it("Shape multiple with keyword-less notation", () => {
    class Test extends Shape({
      value: [String],
    }) { }
    const a = new Test({ value: ["a", "b"] });
  });

  it("Shape optional with keyword notation", () => {

    class Other extends Shape({
      value: Optional(String),
    }) { }

    const a = new Other({});
  });

  // it("shape of string", () => {
  //   class Test extends Shape({
  //     value: Literal(String),
  //   }) {}

  //   const a = new Test("a");
  //   check(a);
  // });

  // it("Primitive", () => {
  //   class Id extends Primitive(String) {}
  // });

  // it("allows keyword-less notation", () => {
  //   class Test extends Shape(
  //     Dict({
  //       value: Literal(String),
  //     })
  //   ) {}

  //   class TestKeywordLess extends Shape({
  //     value: String,
  //   }) {}

  //   const a = new Test("a");
  //   const b = new TestKeywordLess({ value: "b" });

  //   expect(a.serialize()).toEqual(b.serialize());
  //   check(a);
  //   check(b);
  // });

  // it("shape is recognizable", () => {
  //   class Test extends Shape({}) {}

  //   const a = new Test({});
  //   expect(a instanceof Shape).toBe(true);
  //   check(a);
  // });
});
