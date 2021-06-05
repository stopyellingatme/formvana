import { FieldConfig } from "../core";
/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Layout ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Using this.field_order, rearrange the order of the fields.
 */
declare function _setFieldOrder<T extends Object>(field_order: Array<keyof T>, fields: FieldConfig<T>[]): FieldConfig<T>[];
export { _setFieldOrder };
