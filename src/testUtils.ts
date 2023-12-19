import { IsShapeConstructor, Shape } from ".";
import { Definition } from "./definitions/definition";

export function check<D extends Definition>(
  constructor: IsShapeConstructor<D>,
  instance: InstanceType<ReturnType<typeof Shape<D>>>
) {
  expect(instance).toEqual(constructor.deserialize(instance.serialize()));
}
