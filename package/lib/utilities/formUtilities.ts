
// #region Linking Utilities

import { get } from "svelte/store";
import { ValidationError } from "..";
import { FieldConfig } from "../core/FieldConfig";
import { _get } from "../core/formMethods";

/**
 * Link form.errors to it's corresponding field.errors
 * Via error[field_name]
 *
 * @Hotpath
 */
 export function _linkFieldErrors<T extends Object>(
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
export function _linkAllErrors<T extends Object>(
  errors: ValidationError[],
  fields: FieldConfig<T>[]
): void {
  errors.forEach((err) => {
    if (Array.isArray(err)) {
      err = err[0];
      if (err["field_key"]) {
        const f = _get(err["field_key" as keyof ValidationError], fields);
        f.errors.set(err);
      }
    } else {
      if (err["field_key"]) {
        const f = _get(err["field_key" as keyof ValidationError], fields);
        f.errors.set(err);
      }
    }
  });
}

/**
 * Link values from FIELDS to MODEL or MODEL to FIELDS
 *
 * @Hotpath
 */
export function _linkAllValues<T extends Object>(
  from_fields_to_model: boolean,
  fields: FieldConfig<T>[],
  model: T,
  event?: Event
): void {
  fields.forEach((field) => {
    /** Get name and value of the field */
    const name = field.name,
      val = field.value,
      value =
        /** @ts-ignore */
        event?.target?.name === name ? getValueFromEvent(event) : undefined;

    /**  Link field[values] to model[values] */
    if (from_fields_to_model) {
      model[name as keyof T] = value
        ? parseIntOrValue(value)
        : parseIntOrValue(get(val));
      // model[name as keyof T] = parseIntOrValue(get(val));
    } else {
      /**  Link form.model[values] to the form.fields[values] */
      val.set(model[name as keyof T]);
    }
  });
}

export function _linkValueFromEvent<T extends Object>(
  field: FieldConfig<T>,
  model: T,
  event?: Event
): void {
  const value = parseIntOrValue(getValueFromEvent(event));
  field.value.set(value);
  model[field.name] = value;
}

function parseIntOrValue(value: any) {
  const value_as_number = Number.parseInt(value);
  if (
    Number.isInteger(value_as_number) ||
    Number.isSafeInteger(value_as_number)
  ) {
    return value_as_number;
  } else return value;
}

/**
 * Returns the value of the event.
 * Can be date, number or string
 */
function getValueFromEvent(event?: Event): Date | Number | String {
  let result;
  if (event) {
    if (event.target) {
      const target = event.target;

      /** @ts-ignore */
      if (target.valueAsDate) {
        /** @ts-ignore */
        result = target.valueAsDate;
        /** @ts-ignore */
      } else if (
        /** @ts-ignore */
        target.valueAsNumber ||
        /** @ts-ignore */
        target.valueAsNumber === 0
      ) {
        /** @ts-ignore */
        result = target.valueAsNumber;
        /** @ts-ignore */
      } else if (target.value) {
        /** @ts-ignore */
        result = target.value;
      }
    }
  }
  return result;
}

//#endregion
