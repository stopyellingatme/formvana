import { FieldConfig } from "../core";
/**
 * Using this.field_order, rearrange the order of the fields.
 */
declare function _setFieldOrder<T extends Object>(field_order: Array<keyof T>, fields: FieldConfig<T>[]): FieldConfig<T>[];
export { _setFieldOrder };
