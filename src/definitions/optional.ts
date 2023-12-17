import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definition";
import { Shorthands, ShorthandToLonghand } from "./shorthands";

export type OptionalConfiguration = Shorthands | Definition;
export type OptionalDefinition<C extends OptionalConfiguration> = Definition<
  DefinitionRuntime<ShorthandToLonghand<C>> | undefined,
  DefinitionSerialized<ShorthandToLonghand<C>> | undefined
>;
export function Optional<C extends OptionalConfiguration>(
  configuration: C
): OptionalDefinition<C> {
  return {
    serialize: (runtime) => {
      return {} as any;
    },
    deserialize: (serialized) => {
      return {} as any;
    },
  };
}
