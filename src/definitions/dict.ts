import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definition";
import { Shorthands, ShorthandToLonghand } from "./shorthands";

export type DictConfiguration = { [key: string]: Shorthands | Definition };
export type DictShorthand = Record<string, DictConfiguration>;
export type DictDefinition<I extends DictConfiguration> = Definition<
  { [k in keyof I]: DefinitionRuntime<ShorthandToLonghand<I[k]>> },
  { [k in keyof I]: DefinitionSerialized<ShorthandToLonghand<I[k]>> }
>;
export function Dict<I extends DictConfiguration>(
  configuration: I
): DictDefinition<I> {
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
