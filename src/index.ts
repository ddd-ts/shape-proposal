import {
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definitions/definition";
import { DictConfiguration, DictDefinition } from "./definitions/dict";
import { ShorthandToLonghand } from "./definitions/shorthands";

export abstract class IsShape<D extends DictConfiguration | DictDefinition<any>> {
  constructor(data: DefinitionRuntime<ShorthandToLonghand<D>>) {
    Object.assign(this, data);
  }

  serialize(): DefinitionSerialized<ShorthandToLonghand<D>> {
    throw new Error("Not implemented");
  }

}

export const Shape = <D extends DictConfiguration | DictDefinition<any>>(
  definition: D
) => {
  class Intermediate extends IsShape<D> {

    static deserialize<T extends typeof IsShape>(
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
    data: DefinitionRuntime<ShorthandToLonghand<D>>
  ) => Intermediate & DefinitionRuntime<ShorthandToLonghand<D>>) & {
    deserialize: (typeof Intermediate)["deserialize"];
    definition: D;
  };
};