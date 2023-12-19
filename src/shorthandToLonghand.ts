import { IsShape } from ".";
import { Child, ChildConfiguration } from "./definitions/child";
import {
  Definition,
  DefinitionRuntime,
  DefinitionSerialized,
} from "./definitions/definition";
import { Dict, DictConfiguration } from "./definitions/dict";
import { Literal } from "./definitions/literal";
import { Multiple } from "./definitions/multiple";
import {
  SerializableClass,
  SerializableClassConfiguration,
} from "./definitions/serializableClass";
import { Shorthands, ShorthandToLonghand } from "./definitions/shorthands";
import { StringEnum } from "./definitions/stringEnum";

export function shorthandToLonghand<D extends Definition | Shorthands>(
  definition: D
): Definition<
  DefinitionRuntime<ShorthandToLonghand<D>>,
  DefinitionSerialized<ShorthandToLonghand<D>>,
  DefinitionRuntime<ShorthandToLonghand<D>>
> {
  if (
    "serialize" in definition &&
    "deserialize" in definition &&
    typeof definition.serialize === "function" &&
    typeof definition.deserialize === "function"
  ) {
    // TODO FIX
    // Dict({
    //   a: Number
    // })
    return definition as Definition;
  }
  if ("prototype" in definition) {
    if ((definition as any as typeof IsShape).__isShape) {
      return Child(definition as ChildConfiguration);
    }
    return SerializableClass(
      definition as SerializableClassConfiguration
    ) as any;
  }
  if (definition === String) {
    return Literal(String) as any;
  }
  if (definition === Number) {
    return Literal(Number) as any;
  }
  if (definition === Boolean) {
    return Literal(Boolean) as any;
  }
  if (definition === Date) {
    return Literal(Date) as any;
  }
  if (Array.isArray(definition)) {
    const [arrayType] = definition;
    if (!arrayType) {
      throw new Error("cannot know multiple or string enum");
    }
    if (typeof arrayType === "string") {
      if (!definition.every((e) => typeof e === "string")) {
        throw new Error("wrong string enum");
      }
      return StringEnum(...definition);
    }
    if (definition.length !== 1) {
      throw new Error("wrong multiple");
    }
    return Multiple(shorthandToLonghand(arrayType)) as any;
  }
  if (typeof definition === "object") {
    return Dict(definition as DictConfiguration) as any;
  }
  throw new Error("cannot identify shorthand" + JSON.stringify(definition));
}
