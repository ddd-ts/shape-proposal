import { IsShapeConstructor, Shape } from "./shape";
import { Definition } from "./definitions/definition";

export function check<D extends Definition>(
  constructor: IsShapeConstructor<D>,
  instance: InstanceType<IsShapeConstructor<D>>
) {
  expect(instance).toEqual(constructor.deserialize(instance.serialize()));
}
