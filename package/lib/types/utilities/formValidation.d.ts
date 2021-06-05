import { Form, FieldConfig, ValidationCallback, ValidationError, Callback, ElementEvent } from "../core";
/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Validation ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Hanlde the events that will fire for each field.
 * Corresponds to the form.on_events field.
 *
 * @Hotpath
 */
declare function _executeValidationEvent<T extends Object>(form: Form<T>, required_fields: Array<keyof T>, field?: FieldConfig<T>, callbacks?: ValidationCallback[], event?: ElementEvent): Promise<ValidationError[]> | undefined;
/**
 * This is used to add functions and callbacks to the OnEvent
 * handler. Functions can be added in a plugin-style manner now.
 *
 * @Hotpath
 */
declare function _executeCallbacks(callbacks: Callback | Callback[]): void;
/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.when_link_fields_to_model === LinkOnEvent.Valid is true.
 *
 * @Hotpath
 */
declare function _handleValidationSideEffects<T extends Object>(form: Form<T>, errors: ValidationError[], required_fields: Array<keyof T>, field?: FieldConfig<T>, event?: ElementEvent): Promise<ValidationError[]>;
export { _executeValidationEvent, _executeCallbacks, _handleValidationSideEffects, };
