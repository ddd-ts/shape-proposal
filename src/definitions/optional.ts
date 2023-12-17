import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definition";
import { Shorthands, ShorthandToLonghand } from "./shorthands";

export type OptionalConfiguration = Shorthands | Definition
export type OptionalDefinition<C extends OptionalConfiguration> = Definition<
  DefinitionRuntime<ShorthandToLonghand<C>> | undefined,
  DefinitionSerialized<ShorthandToLonghand<C>> | undefined
> & { optional: true };

export function Optional<C extends OptionalConfiguration>(
  configuration: Exclude<C, { optional: true }>
): OptionalDefinition<C> {
  return {
    optional: true,
    serialize: (runtime) => {
      return {} as any;
    },
    deserialize: (serialized) => {
      return {} as any;
    },
  };
}
