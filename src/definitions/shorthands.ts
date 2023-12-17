import { IsShape } from "..";
import { Constructor } from "../types";
import { ChildDefinition, ChildShorthand } from "./child";
import { Definition } from "./definition";
import { DictShorthand, DictDefinition } from "./dict";
import { SerializableClassConfiguration, SerializableClassDefinition, SerializableClassShorthand } from "./serializableClass";
import {
  LiteralShorthand,
  LiteralDefinition,
} from "./literal";
import {
  MultipleDefinition,
  MultipleShorthand,
} from "./multiple";

export type Shorthands = LiteralShorthand | DictShorthand | MultipleShorthand | ChildShorthand | SerializableClassShorthand

export type ShorthandToLonghand<T> = T extends Constructor<IsShape<any>>
  ? ChildDefinition<T>
  : T extends SerializableClassConfiguration
  ? SerializableClassDefinition<T>
  : T extends Definition
  ? T
  : T extends typeof String
  ? LiteralDefinition<T>
  : T extends typeof Number
  ? LiteralDefinition<T>
  : T extends typeof Date
  ? LiteralDefinition<T>
  : T extends [infer C]
  ? MultipleDefinition<ShorthandToLonghand<C>>
  : T extends Record<string, any>
  ? DictDefinition<{ [k in keyof T]: ShorthandToLonghand<T[k]> }>
  : never;
