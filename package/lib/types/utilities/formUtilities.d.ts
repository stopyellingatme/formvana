import { FieldConfig } from "../core/FieldConfig";
/**
 * ---------------------------------------------------------------------------
 *
 * *** General Form Utilities ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/** Get the form field by name */
declare function _get<T extends Object>(name: keyof T, fields: FieldConfig<T>[]): FieldConfig<T>;
/**
 * Set any attributes on the given fields.
 */
declare function _setFieldAttributes<T extends Object>(target_fields: Array<keyof T>, fields: FieldConfig<T>[], attributes: Partial<FieldConfig<T>>): void;
/**
 * Set any attributes on the given field.
 */
declare function _setFieldAttribute<T extends Object>(name: keyof T, fields: FieldConfig<T>[], attributes: Partial<FieldConfig<T>>): void;
export { _get, _setFieldAttributes, _setFieldAttribute };
