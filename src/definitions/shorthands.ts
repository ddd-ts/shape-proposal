import { Definition } from "./definition";
import { DictShorthand, DictDefinition, DictConfiguration } from "./dict";
import {
  LiteralShorthand,
  LiteralDefinition,
  LiteralConfiguration,
} from "./literal";

export type Shorthands = LiteralShorthand | DictShorthand;

export type LonghandToShorthand =
  | LiteralDefinition<LiteralConfiguration>
  | LiteralConfiguration
  | DictDefinition<DictConfiguration>
  | DictConfiguration;

export type ShorthandToLonghand<T> = T extends Definition
  ? T
  : T extends typeof String
  ? LiteralDefinition<T>
  : T extends typeof Number
  ? LiteralDefinition<T>
  : T extends typeof Date
  ? LiteralDefinition<T>
  : T extends Record<string, any>
  ? DictDefinition<{ [k in keyof T]: ShorthandToLonghand<T[k]> }>
  : never;
