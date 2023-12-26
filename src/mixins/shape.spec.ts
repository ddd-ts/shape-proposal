import { Optional } from "../definitions/optional";
import { check, checkPrimitive } from "../testUtils";
import { ObjectShape } from "./objectShape";
import { Primitive } from "./primitive";
import { Shape } from "./shape";

describe("Shape", () => {
	it("uses primitive", () => {
		class Id extends Primitive(String) {}

		const a = new Id("my id");
		expect(a.value).toEqual("my id");

		a.serialize();

		checkPrimitive(Id, a);
	});

	it("uses complex primitive", () => {
		class Test extends Shape([String]) {}

		const a = new Test(["a", "b", "c"]);
		expect(a.value).toEqual(["a", "b", "c"]);

		checkPrimitive(Test, a);
	});

	it("uses dict", () => {
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
});
