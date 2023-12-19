import { Shape } from "..";
import { SerializableClass } from "./serializableClass";

describe("Definition: Child", () => {
  it("uses keyword notation", () => {
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

    expect(new Test({ value: new Id("a") }).serialize().value).toBeInstanceOf(
      String
    );
    expect(new Test({ value: new Id("a") }).serialize().value).toEqual("a");
  });

  it("uses keyword-less notation", () => {
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
});
