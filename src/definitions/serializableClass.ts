import { Constructor } from "../types";
import { Definition } from "./definition";

export type SerializableClassConfiguration = Constructor<{
	serialize(): any;
}> & {
	deserialize(serialized: any): any;
};
export type SerializableClassShorthand = SerializableClassConfiguration;
export type SerializableClassDefinition<
	C extends SerializableClassConfiguration,
> = Definition<InstanceType<C>, ReturnType<InstanceType<C>["serialize"]>>;
export function SerializableClass<C extends SerializableClassConfiguration>(
	configuration: C,
): SerializableClassDefinition<C> {
	return {
		serialize: (runtime) => {
			return {} as any;
		},
		deserialize: (serialized) => {
			return {} as any;
		},
	};
}
