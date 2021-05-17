import { Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Form } from "./Form";
import { Callback, OnEvents, ValidationCallback, ValidationError, InitialFormState, LinkOnEvent } from "./types";
/** Get the form field by name */
export declare function _get<T extends Object>(name: keyof T, fields: FieldConfig[]): FieldConfig;
/**
 * Build the field configs from this.model using metadata-reflection.
 * Grab the editableProperties from the @field decorator.
 *
 * @TODO Create method to use plain JSON as model, fields and validation schema
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
export declare function _attachEventListeners(field: FieldConfig, on_events: OnEvents<HTMLElementEventMap>, callback: Callback): void;
export declare function _addCallbackToField<T extends Object>(form: Form<T>, field: FieldConfig, event: keyof HTMLElementEventMap, callback: ValidationCallback | Callback, required_fields: Array<keyof T>, field_names: Array<keyof T>, hidden_fields?: Array<keyof T>, disabled_fields?: Array<keyof T>): void;
/**  Link values from FIELDS to MODEL or MODEL to FIELDS */
export declare function _linkValues<ModelType extends Object>(from_fields_to_model: boolean, fields: FieldConfig[], model: ModelType): void;
/**
 * Link form.errors to it's corresponding field.errors
 * Via error[field_name]
 */
export declare function _linkFieldErrors(errors: ValidationError[], field: FieldConfig, field_name: ValidationError["property"]): void;
export declare function _linkAllErrors(errors: ValidationError[], fields: FieldConfig[], field_error_link_name: ValidationError["property"]): void;
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
export declare function _executeValidationEvent<T extends Object>(form: Form<T>, required_fields: Array<keyof T>, field_names: Array<keyof T>, hidden_fields?: Array<keyof T>, disabled_fields?: Array<keyof T>, field?: FieldConfig, callbacks?: ValidationCallback[]): Promise<ValidationError[]> | undefined;
/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.link_fields_to_model === LinkOnEvent.Valid is true.
 */
export declare function _handleFormValidation<T extends Object>(form: Form<T>, errors: ValidationError[], required_fields: Array<keyof T>, field?: FieldConfig): Promise<ValidationError[]>;
/**
 * TODO: Clean up this requiredFieldsValid implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid
 */
export declare function _requiredFieldsValid<T extends Object>(errors: ValidationError[], required_fields: Array<keyof T>): boolean;
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
export declare function _setFieldOrder<T extends Object>(field_order: Array<keyof T>, fields: FieldConfig[]): FieldConfig[];
/**
 * Set any attributes on the given fields.
 */
export declare function _setFieldAttributes<T extends Object>(target_fields: Array<keyof T>, all_field_names: Array<keyof T>, fields: FieldConfig[], attributes: Partial<FieldConfig>): void;
/**
 * Set any attributes on the given field.
 */
export declare function _setFieldAttribute<T extends Object>(name: keyof T, fields: FieldConfig[], attributes: Partial<FieldConfig>): void;
