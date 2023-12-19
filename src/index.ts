import {
  DefinitionParameter,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definitions/definition";
import { DictDefinition, DictShorthand } from "./definitions/dict";
import { ShorthandToLonghand } from "./definitions/shorthands";
import { Constructor } from "./types";

export abstract class IsShape<D extends DictShorthand | DictDefinition<any>> {
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
  class Intermediate extends IsShape<D> {
    static deserialize<T extends Constructor<IsShape<any>>>(
      this: T,
      serialized: DefinitionSerialized<ShorthandToLonghand<D>>
    ) {
      return new this(definition.deserialize(serialized));
    }

    serialize(): DefinitionSerialized<ShorthandToLonghand<D>> {
      return definition.serialize(this);
    }
  }
  return Intermediate as any as (new (
    data: DefinitionParameter<ShorthandToLonghand<D>>
  ) => Intermediate & DefinitionRuntime<ShorthandToLonghand<D>>) & {
    deserialize: (typeof Intermediate)["deserialize"];
    definition: D;
  };
};
