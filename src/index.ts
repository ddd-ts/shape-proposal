import {
  DefinitionParameter,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definitions/definition";
import { DictDefinition, DictShorthand } from "./definitions/dict";
import { ShorthandToLonghand } from "./definitions/shorthands";
import { shorthandToLonghand } from "./shorthandToLonghand";
import { Constructor } from "./types";

export type IsShapeConstructor<D extends DictShorthand | DictDefinition<any>> =
  Constructor<IsShape<D>> & {
    deserialize: (
      serialized: DefinitionSerialized<ShorthandToLonghand<D>>
    ) => DefinitionRuntime<ShorthandToLonghand<D>>;
  };
export abstract class IsShape<D extends DictShorthand | DictDefinition<any>> {
  static __isShape = true;
  __isShape = true;

  constructor(data: DefinitionParameter<ShorthandToLonghand<D>>) {
    Object.assign(this, data);
  }

  serialize(): DefinitionSerialized<ShorthandToLonghand<D>> {
    throw new Error("Not implemented");
  }
}

export const Shape = <const D extends DictShorthand | DictDefinition<any>>(
  definition: D
) => {
  const longhand = shorthandToLonghand(definition);

  class Intermediate extends IsShape<D> {
    static deserialize<T extends Constructor<IsShape<any>>>(
      this: T,
      serialized: DefinitionSerialized<ShorthandToLonghand<D>>
    ) {
      return new this(longhand.deserialize(serialized));
    }

    serialize(): DefinitionSerialized<ShorthandToLonghand<D>> {
      return longhand.serialize(this);
    }
  }
  return Intermediate as any as (new (
    data: DefinitionParameter<ShorthandToLonghand<D>>
  ) => Intermediate & DefinitionRuntime<ShorthandToLonghand<D>>) & {
    deserialize: (typeof Intermediate)["deserialize"];
    definition: D;
  };
};
