import { FieldConfig } from "../core/FieldConfig";
import { ValidationError } from "../core/Types";
/**
 * ---------------------------------------------------------------------------
 *
 * *** Linking Methods ***
 *
 * This section handles linking values and errors.
 * Nearly all of these functions are part of hot paths.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Link form.errors to it's corresponding field.errors
 * Via error[field_name]
 *
 * @Hotpath
 */
declare function _linkFieldErrors<T extends Object>(errors: ValidationError[], field: FieldConfig<T>): void;
/**
 * Link all Validation Errors on Form.errors to each field via the
 * field_error_link_name.
 *
 * @Hotpath
 */
declare function _linkAllErrors<T extends Object>(errors: ValidationError[], fields: FieldConfig<T>[]): void;
/**
 * Link values from FIELDS to MODEL or MODEL to FIELDS
 *
 * @Hotpath
 */
declare function _linkAllValues<T extends Object>(from_fields_to_model: boolean, fields: FieldConfig<T>[], model: T): void;
/**
 * Link the event value to the target field and model.
 *
 * @Hotpath
 */
declare function _linkValueFromEvent<T extends Object>(field: FieldConfig<T>, model: T, event?: Event): void;
export { _linkAllErrors, _linkFieldErrors, _linkValueFromEvent, _linkAllValues, };
