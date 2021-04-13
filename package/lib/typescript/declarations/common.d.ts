import { ValidationError } from "class-validator";
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
export declare function _attachOnValidateEvents(node: HTMLElement, field: FieldConfig, validate_on_events: OnEvents, validationCb: Function): void;
export declare function _attachOnClearErrorEvents(node: HTMLElement, field: FieldConfig, clear_errors_on_events: OnEvents, clearValidationCb?: Function): void;
export declare function _linkValues(fromFieldsToModel: boolean, fields: FieldConfig[], model: any): void;
export declare function _linkFieldErrors(errors: ValidationError[], field: FieldConfig): void;
export declare function _linkErrors(errors: ValidationError[], fields: FieldConfig[]): void;
/**
 * TODO: Clean up this arfv implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid
 */
export declare function _requiredFieldsValid(errors: ValidationError[], required_fields: string[]): boolean;
export declare function _getStateSnapshot(form: Form, stateful_items: string[]): string;
/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with > 1000 fields in a single class with very slight input lag.
 */
export declare function _hasChanged(form: Form, stateful_items: string[], initial_state_str: string): void;
/**
 * Using this.field_order, rearrange the order of the fields.
 */
export declare function _hideFields(hidden_fields: string[], field_names: string[], fields: FieldConfig[]): void;
export declare function _hideField(name: string, fields: FieldConfig[]): void;
export declare function _disableFields(disabled_fields: string[], field_names: string[], fields: FieldConfig[]): void;
export declare function _disableField(name: string, fields: FieldConfig[]): void;
