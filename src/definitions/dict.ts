import { Expand } from "../types";
import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definition";
import { OptionalConfiguration } from "./optional";
import { Shorthands, ShorthandToLonghand } from "./shorthands";

export type DictConfiguration = { [key: string]: Shorthands | Definition };
export type DictShorthand = Record<string, DictConfiguration>;


type OnlyOptionalKeys<C extends DictConfiguration> = {
  [k in keyof C]: C[k] extends OptionalConfiguration ? k : never
}[keyof C];

type OnlyRequiredKeys<C extends DictConfiguration> = {
  [k in keyof C]: C[k] extends OptionalConfiguration ? never : k
}[keyof C];

type DictRuntime<C extends DictConfiguration> = { [k in OnlyRequiredKeys<C>]: DefinitionRuntime<ShorthandToLonghand<C[k]>> } & { [k in OnlyOptionalKeys<C>]?: DefinitionRuntime<ShorthandToLonghand<C[k]>> };

type DictSerialized<C extends DictConfiguration> = { [k in OnlyRequiredKeys<C>]: DefinitionSerialized<ShorthandToLonghand<C[k]>> } & { [k in OnlyOptionalKeys<C>]?: DefinitionSerialized<ShorthandToLonghand<C[k]>> };

export type DictDefinition<C extends DictConfiguration> = Definition<
  DictRuntime<C>,
  DictSerialized<C>
>;
export function Dict<C extends DictConfiguration>(
  configuration: C
): DictDefinition<C> {
  return {
    serialize: (runtime) => {
      const serialized = {} as any;
      for (const key in configuration) {
        serialized[key] = configuration[key]!.serialize(runtime[key]);
      }
      return serialized;
    },
    deserialize: (serialized) => {
      const runtime = {} as any;
      for (const key in configuration) {
        runtime[key] = configuration[key]!.deserialize(serialized[key]);
      }
      return runtime;
    },
  };
}
