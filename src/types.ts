export type Constructor<T> = new (...args: any[]) => T;

type DontExpand = Date | { serialize: Function };

export type Expand<T> = T extends DontExpand
  ? T
  : T extends Record<string, any>
  ? { [key in keyof T]: Expand<T[key]> }
  : T;
