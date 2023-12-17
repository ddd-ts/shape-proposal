import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definition";
import { Shorthands, ShorthandToLonghand } from "./shorthands";

export type MultipleConfiguration = Shorthands | Definition;
export type MultipleShorthand = Array<MultipleConfiguration> & { length: 1 };
export type MultipleDefinition<C extends MultipleConfiguration> = Definition<
  DefinitionRuntime<ShorthandToLonghand<C>>[],
  DefinitionSerialized<ShorthandToLonghand<C>>[]
>;
export function Multiple<C extends MultipleConfiguration>(
  configuration: C
): MultipleDefinition<C> {
  return {
    serialize: (runtime) => {
      return {} as any;
    },
    deserialize: (serialized) => {
      return {} as any;
    },
  };
}
