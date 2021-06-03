import { get } from "svelte/store";
import { _get } from "./formUtilities";
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
function _linkFieldErrors<T extends Object>(
  errors: ValidationError[],
  field: FieldConfig<T>
): void {
  const error = errors.filter((e) => e["field_key"] === field.name);
  // Check if there's an error for the field
  if (error && error.length > 0) {
    field.errors.set(error[0]);
  } else {
    /**  Very important! Don't change! */
    field.errors.set(undefined);
  }
}

/**
 * Link all Validation Errors on Form.errors to each field via the
 * field_error_link_name.
 *
 * @Hotpath
 */
function _linkAllErrors<T extends Object>(
  errors: ValidationError[],
  fields: FieldConfig<T>[]
): void {
  errors.forEach((err) => {
    if (Array.isArray(err)) {
      err = err[0];
      if (err["field_key"]) {
        const field = _get(err["field_key" as keyof ValidationError], fields);
        field.errors.set(err);
      }
    } else {
      if (err["field_key"]) {
        const field = _get(err["field_key" as keyof ValidationError], fields);
        field.errors.set(err);
      }
    }
  });
}

/**
 * Link values from FIELDS to MODEL or MODEL to FIELDS
 *
 * @Hotpath
 */
function _linkAllValues<T extends Object>(
  from_fields_to_model: boolean,
  fields: FieldConfig<T>[],
  model: T
): void {
  fields.forEach((field) => {
    /** Get name and value of the field */
    const name = field.name,
      val = field.value;

    if (from_fields_to_model) {
      /**  Link field[values] to model[values] */
      model[name as keyof T] = get(val);
    } else {
      /**  Link form.model[values] to the form.fields[values] */
      val.set(model[name as keyof T]);
    }
  });
}

/**
 * Link the event value to the target field and model.
 *
 * @Hotpath
 */
function _linkValueFromEvent<T extends Object>(
  field: FieldConfig<T>,
  model: T,
  event?: Event
): void {
  const value = _getValueFromEvent(event);

  /**
   * Well, we have to set both.
   * This compensates for native select elements and more.
   */
  model[field.name] = value;
  field.value.set(value);
}

/**
 * Check if the target has some special value properties to help us out.
 * If not, just grab the target.value and move on.
 *
 * @Hotpath
 */
function _getValueFromEvent(event?: Event): any | undefined {
  /** @ts-ignore */
  if (event && event.target) return _parseNumberOrValue(event.target.value);
  else return undefined;
}

const max_int = Number.MAX_SAFE_INTEGER;
/**
 * Check if the value is a (safe) intiger.
 * Because the event value will happily pass the number 1 as
 * "1", a string. So we parse it, check it, and if it's safe, return it.
 * Otherwise just return the initial value.
 *
 * We check if the value is not a number and if the value (as a number)
 * is greater than the max number value.
 * If either is true, return plain value.
 * Else return value as number.
 *
 * @Hotpath
 */
function _parseNumberOrValue(value: any): Number | any {
  if (isNaN(+value) || +value >= max_int) return value;
  else return +value;
}

export {
  _linkAllErrors,
  _linkFieldErrors,
  _linkValueFromEvent,
  _linkAllValues,
};
