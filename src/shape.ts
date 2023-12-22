import {
  DefinitionParameter,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definitions/definition";
import { DictDefinition, DictShorthand } from "./definitions/dict";
import { ShorthandToLonghand } from "./definitions/shorthands";
import { shorthandToLonghand } from "./shorthandToLonghand";
import { AbstractConstructor, Constructor, Expand } from "./types";

export type IsShapeConstructor<D extends DictShorthand | DictDefinition<any>> =
  Constructor<{
    serialize: () => Expand<DefinitionSerialized<ShorthandToLonghand<D>>>;
  }> & {
    deserialize: ShorthandToLonghand<D>["deserialize"];
    isShape: true;
  };

type NonConstructorKeys<T> = {
  [P in keyof T]: T[P] extends new () => any ? never : P;
}[keyof T];
type NonConstructor<T> = Pick<T, NonConstructorKeys<T>>;

class DefaultShapeBaseClass {}

export const Shape = <
  const D extends DictShorthand | DictDefinition<any>,
  B extends Constructor<{}> | AbstractConstructor<{}>
>(
  definition: D,
  base: B = DefaultShapeBaseClass as B
) => {
  const longhand = shorthandToLonghand(definition);

  class Intermediate extends base {
    base = base;
    static isShape = true as const;

    constructor(...args: any[]) {
      const converted = longhand.paramToRuntime(args[0]);
      super();
      Object.assign(this, converted);
    }

    static deserialize<T extends IsShapeConstructor<D>>(
      this: T,
      serialized: Expand<DefinitionSerialized<ShorthandToLonghand<D>>>
    ) {
      return new this(longhand.deserialize(serialized as any));
    }

    serialize(): Expand<DefinitionSerialized<ShorthandToLonghand<D>>> {
      return longhand.serialize(this) as any;
    }
  }

  return Intermediate as any as NonConstructor<typeof Intermediate> & {
    new (data: DefinitionParameter<ShorthandToLonghand<D>>): InstanceType<B> &
      Intermediate &
      DefinitionRuntime<ShorthandToLonghand<D>>;
  };
};
