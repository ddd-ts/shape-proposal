import { Shape } from "..";
import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definition";
import { Shorthands, ShorthandToLonghand } from "./shorthands";

export type EitherConfiguration = (Shorthands | Definition)[];
export type EitherDefinition<C extends EitherConfiguration> = Definition<
  DefinitionRuntime<ShorthandToLonghand<C[number]>>,
  DefinitionSerialized<ShorthandToLonghand<C[number]>>
>;
export function Either<C extends EitherConfiguration>(
  ...configuration: C
): EitherDefinition<C> {
  return {
    serialize: (runtime) => {
      return {} as any;
    },
    deserialize: (serialized) => {
      return {} as any;
    },
  };
}
