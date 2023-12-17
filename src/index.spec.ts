import { IsShape, Shape } from ".";
import { Child } from "./definitions/child";
import { Definition } from "./definitions/definition";
import { Dict } from "./definitions/dict";
import { SerializableClass } from "./definitions/serializableClass";
import { Literal } from "./definitions/literal";
import { Multiple } from "./definitions/multiple";
import { Optional } from "./definitions/optional";

describe("Shape", () => {
  function check<D extends Definition>(
    constructor: typeof IsShape<D>,
    instance: InstanceType<ReturnType<typeof Shape<D>>>
  ) {
    expect(instance).toEqual(constructor.deserialize(instance.serialize()));
  }

  it('Shape with explicit Dict', () => {
    class Test extends Shape(
      Dict({})
    ) { }

    // @ts-expect-error - missing value
    new Test()

    new Test({});
    check(Test, new Test({}));
  })

  it('Shape with implicit Dict', () => {
    class Test extends Shape({}) { }

    // @ts-expect-error - missing value
    new Test()

    new Test({});
    check(Test, new Test({}));
  })


  it("Shape with Literal value", () => {
    class Test extends Shape(
      Dict({
        string: Literal(String),
        number: Literal(Number),
        date: Literal(Date),
      })
    ) { }

    // @ts-expect-error - missing value
    new Test({ string: "1", number: 1 });
    new Test({
      // @ts-expect-error - wrong type
      string: 1,
      // @ts-expect-error - wrong type
      number: "1",
      // @ts-expect-error - wrong type
      date: "1",
    })

    const test = new Test({ string: "a", number: 1, date: new Date() });

    expect(test.string).toBe("a");
    expect(test.number).toBe(1);
    expect(test.date).toBeInstanceOf(Date);
    check(Test, test);
  });

  it("Shape with shorthand notation", () => {
    class Test extends Shape({
      value: String,
    }) { }

    // @ts-expect-error - missing value
    new Test({})
    // @ts-expect-error - wrong type
    new Test({ value: 1 })

    new Test({ value: "a" });
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

    const a = new Other({})
  });

  it('Shape child with keyword notation', () => {
    class Other extends Shape({
      yo: String,
    }) { }

    class Test extends Shape({
      value: Child(Other)
    }) { }

    new Test({ value: new Other({ yo: ',' }) }).value
  })

  it('Shape child with keyword-less notation', () => {
    class Other extends Shape({
      value: String,
    }) { }

    class Test extends Shape({
      value: Other
    }) { }

  })

  it('Shape serializableClass with keyword notation', () => {
    class Id {
      constructor(public value: string) { }
      serialize() {
        return this.value
      }
      static deserialize(value: string) {
        return new Id(value)
      }
    }

    class Test extends Shape({
      value: SerializableClass(Id)
    }) { }

    const a: string = new Test({ value: new Id('a') }).serialize().value
  })

  it('Shape serializableClass with keywordless notation', () => {
    class Id {
      constructor(public value: string) { }
      serialize() {
        return this.value
      }
      static deserialize(value: string) {
        return new Id(value)
      }
    }

    class Test extends Shape({
      value: Id
    }) { }

    new Test({ value: new Id('a') }).serialize()
    Test.deserialize({ value: 'a' })

    const a: string = new Test({ value: new Id('a') }).serialize().value
  })
});
