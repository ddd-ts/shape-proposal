import { shorthandToLonghand } from "../shorthandToLonghand";
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
> & { optional: true };

export function Optional<C extends OptionalConfiguration>(
  configuration: Exclude<C, { optional: true }>
): OptionalDefinition<C> {
  const longhand = shorthandToLonghand(configuration);

  return {
    optional: true,
    serialize: (runtime) => {
      return runtime ? longhand.serialize(runtime) : undefined;
    },
    deserialize: (serialized) => {
      return serialized ? longhand.deserialize(serialized) : undefined;
    },
  };
}
