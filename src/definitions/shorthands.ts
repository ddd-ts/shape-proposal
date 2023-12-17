import { IsShape } from "..";
import { Constructor } from "../types";
import { ChildDefinition, ChildShorthand } from "./child";
import { Definition } from "./definition";
import { DictShorthand, DictDefinition, DictConfiguration } from "./dict";
import {
  LiteralShorthand,
  LiteralDefinition,
  LiteralConfiguration,
} from "./literal";
import {
  MultipleConfiguration,
  MultipleDefinition,
  MultipleShorthand,
} from "./multiple";

export type Shorthands = LiteralShorthand | DictShorthand | MultipleShorthand | ChildShorthand;

export type ShorthandToLonghand<T> = T extends Constructor<IsShape<any>>
  ? ChildDefinition<T>
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
