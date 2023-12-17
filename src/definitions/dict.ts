import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definition";
import { Shorthands, ShorthandToLonghand } from "./shorthands";

type OnlyRequired<C extends Record<string, any>> = {
  [k in keyof C]: undefined extends C[k] ? never : C[k];
};

type A = {
  a: string;
  b: number | undefined;
};
type B = OnlyRequired<A>;

export type DictConfiguration = { [key: string]: Shorthands | Definition };
export type DictShorthand = Record<string, DictConfiguration>;
export type DictDefinition<C extends DictConfiguration> = Definition<
  {
    [k in keyof C]?: DefinitionRuntime<ShorthandToLonghand<C[k]>> | undefined;
  } & {
    [k in keyof OnlyRequired<C>]: DefinitionRuntime<ShorthandToLonghand<C[k]>>;
  },
  { [k in keyof C]: DefinitionSerialized<ShorthandToLonghand<C[k]>> }
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
