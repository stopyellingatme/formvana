import { ValidationError } from "class-validator";
import { Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Form } from "./Form";
import { OnEvents } from "./types";
export declare function _get(name: string, fields: FieldConfig[]): FieldConfig;
/**
 *
 * Build the field configs from this.model using metadata-reflection.
 * More comments inside...
 */
export declare function _buildFormFields(model: any): FieldConfig[];
export declare function _getRequiredFieldNames(fields: FieldConfig[]): string[];
export declare function _setValueChanges(changes: Writable<Record<string, any>>, field_name: string, change: any): void;
export declare function _attachEventListeners(field: FieldConfig, on_events: OnEvents, callback: Function): void;
export declare function _attachOnClearErrorEvents(node: HTMLElement, clear_errors_on_events: OnEvents, callback?: Function): void;
export declare function _linkValues(fromFieldsToModel: boolean, fields: FieldConfig[], model: any): void;
/**
 * Currently this depends on class-validator.
 * TODO: Disconnect class-validator dependency from all functions
 */
export declare function _linkFieldErrors(errors: ValidationError[], field: FieldConfig, filter_term: keyof ValidationError): void;
export declare function _linkErrors(errors: ValidationError[], fields: FieldConfig[]): void;
/**
 * This is used to add functions and callbacks to the OnEvent
 * handler. Functions can be added in a plugin-style manner now.
 */
export declare function _usePlugins(funcs: any | any[]): void;
/**
 * Hanlde the events that will fire for each field.
 * Corresponds to the form.on_events field.
 *
 * TODO: Add plugin area, hoist-er
 * TODO: Decouple class-validator!
 */
export declare function _handleOnEvent<T extends object>(form: Form<T>, required_fields: string[], stateful_items: string[], initial_state_str: string, field_names: string[], field: FieldConfig): Promise<void>;
/**
 * TODO: Decouple class-validator as to allow plugin based validation
 *
 */
export declare function _validateField<T extends object>(form: Form<T>, field: FieldConfig, required_fields: string[]): Promise<void>;
/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.link_fields_to_model === LinkOnEvent.Valid is true.
 */
export declare function _handleValidation<T extends object>(form: Form<T>, errors: ValidationError[], required_fields: string[], field?: FieldConfig): Promise<void>;
/**
 * TODO: Clean up this arfv implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid
 */
export declare function _requiredFieldsValid(errors: ValidationError[], required_fields: string[]): boolean;
export declare function _getStateSnapshot<T extends object>(form: Form<T>, stateful_items: string[]): string;
/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with > 1000 fields in a single class with very slight input lag.
 */
export declare function _hasChanged<T extends object>(form: Form<T>, stateful_items: string[], initial_state_str: string): void;
export declare function _clearState<T extends object>(form: Form<T>, initial_state: any, required_fields: string[]): void;
/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
export declare function _setInitialState<T extends object>(form: Form<T>, stateful_items: string[], initial_state: any, initial_state_str: string): void;
/**
 * This one's kinda harry.
 * But it resets the form to it's initial state.
 */
export declare function _resetState<T extends object>(form: Form<T>, stateful_items: string[], initial_state: any): void;
/**
 * Using this.field_order, rearrange the order of the fields.
 */
export declare function _createOrder(field_order: string[], fields: FieldConfig[]): FieldConfig[];
export declare function _hideFields(hidden_fields: string[], field_names: string[], fields: FieldConfig[]): void;
export declare function _hideField(name: string, fields: FieldConfig[]): void;
export declare function _disableFields(disabled_fields: string[], field_names: string[], fields: FieldConfig[]): void;
export declare function _disableField(name: string, fields: FieldConfig[]): void;
/**
 * * Use this if you're trying to update the layout after initialization.
 * Similar to this.setOrder()
 *
 * Like this:
 * const layout = ["description", "status", "email", "name"];
 * const newState = sget(formState).buildStoredLayout(formState, layout);
 * formState.updateState({ ...newState });
 */
