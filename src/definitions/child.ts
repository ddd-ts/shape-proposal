import { IsShape } from "..";
import { Constructor } from "../types";
import { Definition } from "./definition";

export type ChildConfiguration = Constructor<IsShape<any>>;
export type ChildShorthand = ChildConfiguration;
export type ChildDefinition<C extends ChildConfiguration> = Definition<
    InstanceType<C>,
    C extends { serialize(): infer D } ? D : never
>;
export function Child<C extends ChildConfiguration>(
    configuration: C,
): ChildDefinition<C> {
    return {
        serialize: (runtime) => {
            return {} as any;
        },
        deserialize: (serialized) => {
            return {} as any;
        },
    };
}
