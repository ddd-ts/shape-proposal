import { LiteralPrimitive } from "./definitions/literal";

export type Expand<T> = T extends infer O
  ? { [K in keyof O]: O[K] extends LiteralPrimitive ? O[K] : Expand<O[K]> }
  : never;
