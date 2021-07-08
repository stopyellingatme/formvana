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
 * I wanted a way to handle field groups in an effective but lightweight
 * manner. I believe this achieves that goal.
 *
 *
 */
declare function _hanldeFieldGroups<T extends Object>(fields: Array<FieldConfig<T>>): Array<FieldConfig<T> | Array<FieldConfig<T>>>;
/**
 * Using this.field_order, rearrange the order of the fields.
 */
declare function _setFieldOrder<T extends Object>(field_order: Array<keyof T>, fields: FieldConfig<T>[]): FieldConfig<T>[];
export { _hanldeFieldGroups, _setFieldOrder };
