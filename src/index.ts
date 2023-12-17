import {
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definitions/definition";
import { DictConfiguration, DictDefinition } from "./definitions/dict";
import { ShorthandToLonghand } from "./definitions/shorthands";
import { Expand } from "./types";

export class IsShape {
  constructor(data: any) {
    Object.assign(this, data);
  }
}

export const Shape = <D extends DictConfiguration | DictDefinition<any>>(
  definition: D
) => {
  class Intermediate extends IsShape {
    constructor(data: DefinitionRuntime<ShorthandToLonghand<D>>) {
      super(data);
    }

    static deserialize<T extends typeof IsShape>(
      this: T,
      serialized: Expand<DefinitionSerialized<ShorthandToLonghand<D>>>
    ) {
      return new this(definition.deserialize(serialized));
    }

    serialize(): Expand<DefinitionSerialized<ShorthandToLonghand<D>>> {
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
