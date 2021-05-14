import { Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Form } from "./Form";
import { Callback, OnEvents, ValidationCallback, ValidationError, InitialFormState, LinkOnEvent } from "./types";
export declare function _get(name: string, fields: FieldConfig[]): FieldConfig;
/**
 *
 * Build the field configs from this.model using metadata-reflection.
 * More comments inside...
 */
export declare function _buildFormFields<T extends Object>(model: T, props?: string[]): FieldConfig[];
/**
 * Helper function for value_change emitter.
 * Write the form's value changes to form.value_changes.
 *
 * @param changes incoming value changes
 * @param field field emitting the changes
 */
export declare function _setValueChanges(changes: Writable<Record<string, any>>, field: FieldConfig): void;
/**
 * Attach the OnEvents events to each form.field.
 * Parent: form.useField(...)
 */
export declare function _attachEventListeners(field: FieldConfig, on_events: OnEvents, callback: Callback): void;
export declare function _addCallbackToField<T>(form: Form<T>, field: FieldConfig, event: keyof HTMLElementEventMap, callback: ValidationCallback | Callback, required_fields: string[], field_names: string[], hidden_fields?: Array<FieldConfig["name"]>, disabled_fields?: Array<FieldConfig["name"]>): void;
export declare function _linkValues<ModelType extends Object>(from_fields_to_model: boolean, fields: FieldConfig[], model: ModelType): void;
/**
 * Link form.errors to it's corresponding field.errors
 * Via error[field_name]
 */
export declare function _linkFieldErrors(errors: ValidationError[], field: FieldConfig, field_name: keyof ValidationError): void;
export declare function _linkAllErrors(errors: ValidationError[], fields: FieldConfig[]): void;
export declare function _hanldeValueLinking<T extends Object>(model: T, fields: FieldConfig[], link_fields_to_model: LinkOnEvent): void;
/**
 * This is used to add functions and callbacks to the OnEvent
 * handler. Functions can be added in a plugin-style manner now.
 */
export declare function _executeCallbacks(callbacks: Callback | Callback[]): void;
/**
 * Hanlde the events that will fire for each field.
 * Corresponds to the form.on_events field.
 *
 */
export declare function _handleValidationEvent<T extends Object>(form: Form<T>, required_fields: string[], field_names: string[], hidden_fields?: Array<FieldConfig["name"]>, disabled_fields?: Array<FieldConfig["name"]>, field?: FieldConfig, callbacks?: ValidationCallback[]): Promise<ValidationError[]> | undefined;
/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.link_fields_to_model === LinkOnEvent.Valid is true.
 */
export declare function _handleFormValidation<T extends Object>(form: Form<T>, errors: ValidationError[], required_fields: string[], field?: FieldConfig): Promise<ValidationError[]>;
/**
 * TODO: Clean up this requiredFieldsValid implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid
 */
export declare function _requiredFieldsValid(errors: ValidationError[], required_fields: string[]): boolean;
/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with > 1000 fields in a single class with very slight input lag.
 */
export declare function _hasStateChanged(value_changes: Writable<Record<string, any>>, changed: Writable<boolean>): void;
/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
export declare function _setInitialState<T extends Object>(form: Form<T>, initial_state: InitialFormState<T>): InitialFormState<T>;
/**
 * Reset form to inital state.
 */
export declare function _resetState<T extends Object>(form: Form<T>, initial_state: InitialFormState<T>): void;
/**
 * Using this.field_order, rearrange the order of the fields.
 */
export declare function _setFieldOrder(field_order: string[], fields: FieldConfig[]): FieldConfig[];
/**
 * Set any attributes on the given fields.
 */
export declare function _setFieldAttributes(target_fields: Array<FieldConfig["name"]>, all_field_names: Array<FieldConfig["name"]>, fields: FieldConfig[], attributes: Partial<FieldConfig>): void;
/**
 * Set any attributes on the given field.
 */
export declare function _setFieldAttribute(name: string, fields: FieldConfig[], attributes: Partial<FieldConfig>): void;
