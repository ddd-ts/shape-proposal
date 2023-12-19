export type Definition<R = any, S = any, P = R> = {
  serialize(runtime: R): S;
  deserialize(serialized: S): R;

  __used?: P;
};

export type DefinitionRuntime<D extends Definition> = Parameters<
  D["serialize"]
>[0];
export type DefinitionSerialized<D extends Definition> = ReturnType<
  D["serialize"]
>;
export type DefinitionParameter<D extends Definition> = D extends Definition<
  any,
  any,
  infer P
>
  ? P
  : never;
