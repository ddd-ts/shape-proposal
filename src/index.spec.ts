import { Shape } from ".";
import { Optional } from "./definitions/optional";
import { check } from "./testUtils";

describe("Shape", () => {
  it("uses keyword-less notation", () => {
    class ShapeChild extends Shape({
      value: Number,
    }) {}

    class SerializableChild {
      constructor(public readonly value: number) {}

      serialize() {
        return { value: this.value };
      }

      static deserialize(serialized: { value: number }) {
        return new SerializableChild(serialized.value);
      }
    }

    class Test extends Shape({
      string: String,
      number: Number,
      boolean: Boolean,
      date: Date,
      optional: Optional(Number),
      multiple: [Number],
      stringEnum: ["a", "b", "c"],
      child: ShapeChild,
      serializableClass: SerializableChild,
    }) {}

    const a = new Test({
      string: "my string",
      number: 2,
      boolean: true,
      date: new Date("1998-10-28T00:00:00.000Z"),
      optional: undefined,
      multiple: [1, 2, 3, 4, 5],
      stringEnum: "b",
      child: new ShapeChild({ value: 4 }),
      serializableClass: new SerializableChild(5),
    });

    expect(a.string).toEqual("my string");
    expect(a.number).toEqual(2);
    expect(a.boolean).toEqual(true);
    expect(a.date).toEqual(new Date("1998-10-28T00:00:00.000Z"));
    expect(a.optional).toEqual(undefined);
    expect(a.multiple).toEqual([1, 2, 3, 4, 5]);
    expect(a.stringEnum.value).toEqual("b");
    expect(a.child).toEqual(new ShapeChild({ value: 4 }));
    expect(a.serializableClass).toEqual(new SerializableChild(5));

    check(Test, a);
  });

  it("uses recursive keyword-less notation", () => {});
});
