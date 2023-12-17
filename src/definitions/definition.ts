export type Definition<R = any, S = any> = {
  serialize(runtime: R): S;
  deserialize(serialized: S): R;
};

export type DefinitionRuntime<D extends Definition> = Parameters<
  D["serialize"]
>[0];
export type DefinitionSerialized<D extends Definition> = ReturnType<
  D["serialize"]
>;

// optional
// either
