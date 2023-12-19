import { IsShape, Shape } from ".";
import { Child } from "./definitions/child";
import { Definition } from "./definitions/definition";
import { Dict } from "./definitions/dict";
import { SerializableClass } from "./definitions/serializableClass";
import { Literal } from "./definitions/literal";
import { Multiple } from "./definitions/multiple";
import { Optional } from "./definitions/optional";
import { Either } from "./definitions/either";
import { StringEnum } from "./definitions/stringEnum";

describe("Shape", () => {
  function check<D extends Definition>(
    constructor: typeof IsShape<D>,
    instance: InstanceType<ReturnType<typeof Shape<D>>>
  ) {
    expect(instance).toEqual(constructor.deserialize(instance.serialize()));
  }

  it("Shape with explicit Dict", () => {
    class Test extends Shape(Dict({})) {}

    // @ts-expect-error - missing value
    new Test();

    new Test({});
    check(Test, new Test({}));
  });

  it("Shape with implicit Dict", () => {
    class Test extends Shape({}) {}

    // @ts-expect-error - missing value
    new Test();

    new Test({});
    check(Test, new Test({}));
  });

  it("Shape with Literal value", () => {
    class Test extends Shape(
      Dict({
        string: Literal(String),
        number: Literal(Number),
        date: Literal(Date),
      })
    ) {}

    // @ts-expect-error - missing value
    new Test({ string: "1", number: 1 });
    new Test({
      // @ts-expect-error - wrong type
      string: 1,
      // @ts-expect-error - wrong type
      number: "1",
      // @ts-expect-error - wrong type
      date: "1",
    });

    const test = new Test({ string: "a", number: 1, date: new Date() });

    expect(test.string).toBe("a");
    expect(test.number).toBe(1);
    expect(test.date).toBeInstanceOf(Date);
    check(Test, test);
  });

  it("Shape with shorthand notation", () => {
    class Test extends Shape({
      value: String,
    }) {}

    // @ts-expect-error - missing value
    new Test({});
    // @ts-expect-error - wrong type
    new Test({ value: 1 });

    new Test({ value: "a" });
  });

  it("Shape multiple with keyword notation", () => {
    class Test extends Shape({
      value: Multiple(Literal(String)),
    }) {}
  });

  it("Shape multiple with keyword-less notation", () => {
    class Test extends Shape({
      value: [String],
    }) {}
    const a = new Test({ value: ["a", "b"] });
  });

  it("Shape optional with keyword notation", () => {
    class Other extends Shape({
      value: Optional(String),
    }) {}

    const a = new Other({});
  });

  it("Shape child with keyword notation", () => {
    class Other extends Shape({
      yo: String,
    }) {}

    class Test extends Shape({
      value: Child(Other),
    }) {}

    new Test({ value: new Other({ yo: "," }) }).value;
  });

  it("Shape child with keyword-less notation", () => {
    class Other extends Shape({
      value: String,
    }) {}

    class Test extends Shape({
      value: Other,
    }) {}
  });

  it("Shape serializableClass with keyword notation", () => {
    class Id {
      constructor(public value: string) {}
      serialize() {
        return this.value;
      }
      static deserialize(value: string) {
        return new Id(value);
      }
    }

    class Test extends Shape({
      value: SerializableClass(Id),
    }) {}

    const a: string = new Test({ value: new Id("a") }).serialize().value;
  });

  it("Shape serializableClass with keywordless notation", () => {
    class Id {
      constructor(public value: string) {}
      serialize() {
        return this.value;
      }
      static deserialize(value: string) {
        return new Id(value);
      }
    }

    class Test extends Shape({
      value: Id,
    }) {}

    new Test({ value: new Id("a") }).serialize();
    Test.deserialize({ value: "a" });

    const a: string = new Test({ value: new Id("a") }).serialize().value;
  });

  it("does not allow SerializableClass with not serializable serialize() return type", () => {
    class Test {
      serialize() {
        return {
          ok: 1,
          ko: () => {},
        };
      }
      static deserialize(arg: any) {
        return new Test();
      }
    }

    // @ts-expect-error - cannot detect shorthand
    class TestShape extends Shape({
      // @ts-expect-error - class is not serializable
      ko: Test,
    }) {}
  });

  it("Allows recursive serialization with SerializableClass", () => {
    class Tree {
      public leafName!: string;
      public child?: Tree;

      serialize(): {
        name: string;
        child: ReturnType<Tree["serialize"]> | undefined;
      } {
        return {
          name: this.leafName,
          child: this.child?.serialize(),
        };
      }

      static deserialize() {
        return new Tree();
      }
    }

    class Test extends Shape({
      root: Tree,
    }) {}

    type A = ReturnType<Test["serialize"]>["root"]["child"];
    const test: A = {
      name: "",
      child: {
        child: undefined,
        name: "hey",
      },
    };
  });

  it("Either Shape with keyword notation", () => {
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

  it("String Enum shape with keyword notation", () => {
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

  it("String Enum shape with keyword-less notation", () => {
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
