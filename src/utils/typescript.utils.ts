import "reflect-metadata";
import { FieldConfig } from "../../types/_internal/FieldConfig";

export function editable(target: any, propertyKey: string) {
  let properties: string[] =
    Reflect.getMetadata("editableProperties", target) || [];
  if (properties.indexOf(propertyKey) < 0) {
    properties.push(propertyKey);
  }

  Reflect.defineMetadata("editableProperties", properties, target);
}

export function field(config: FieldConfig) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata("field", config, target, propertyKey);
  };
}
