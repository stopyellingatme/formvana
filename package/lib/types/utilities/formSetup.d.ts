import { FieldConfig, OnEvents, Callback, Form, ValidationCallback } from "../core";
/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Setup ***
 *
 * Will write later. Files deleted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Build the field configs from this.model using metadata-reflection.
 * Grab the editableProperties from the @field decorator.
 */
declare function _buildFormFields<T extends Object>(model: T, for_form?: string, props?: string[]): FieldConfig<T>[];
declare function _buildFormFieldsWithSchema<T extends Object>(props: Record<string, Partial<FieldConfig<T>>>, for_form?: string): FieldConfig<T>[];
/**
 * I wanted a way to handle field groups in an effective but lightweight
 * manner. I believe this achieves that goal.
 *
 *
 */
declare function _hanldeFieldGroups<T extends Object>(fields: Array<FieldConfig<T>>): Array<FieldConfig<T> | Array<FieldConfig<T>>>;
/**
 * Attach the OnEvents events to each form.field.
 * Parent: form.useField(...)
 */
declare function _attachEventListeners<T extends Object>(field: FieldConfig<T>, on_events: OnEvents<HTMLElementEventMap>, callback: Callback): void;
declare function _addCallbackToField<T extends Object>(form: Form<T>, field: FieldConfig<T>, event: keyof HTMLElementEventMap, callback: ValidationCallback | Callback, required_fields: Array<keyof T>): void;
export { _buildFormFields, _buildFormFieldsWithSchema, _attachEventListeners, _addCallbackToField, _hanldeFieldGroups, };
