import { get } from "svelte/store";
import { _get } from "./formUtilities";
import { FieldConfig } from "../core/FieldConfig";
import { ElementEvent, ValidationError } from "../core/Types";
const max_int = Number.MAX_SAFE_INTEGER;
const int_word_list = ["number", "decimal", "range", "int", "integer", "num"];
const array_word_list = ["array", "list", "collection", "group"];
const obj_word_list = ["object", "obj", "record", "rec", "dictionary", "dict"];

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
  /** Check if there's an error for the field */
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
  event?: ElementEvent
): void {
  const value = _getValueFromEvent(event, field);

  /**
   * Well, we have to set both.
   * This compensates for native select elements and probably more.
   */
  model[field.name] = value;
  field.value.set(value);
}

/**
 * Ok, there's a lot going on here.
 * But we're really just checking the data_type for special cases.
 *
 * Objects and arrays need special treatment.
 *
 * Check if the target has some special value properties to help us out.
 * If not, just grab the target.value and move on.
 *
 * @Hotpath
 */
function _getValueFromEvent<T extends Object>(
  event?: ElementEvent,
  field?: FieldConfig<T>
): any | undefined {
  if (event && event.target) {
    if (field) {
      /**
       * Yeah, we do a lot of checking in this bitch.
       * Deep fucking ribbit hole.
       */
      if (int_word_list.indexOf(field.data_type) !== -1) {
        /** Check if data_type is number-like */
        return _parseNumberOrValue(event.target.value);
      } else if (field.data_type === "boolean") {
        /** Check if data_type is Boolean */
        return Boolean(event.target.value);
      } else if (array_word_list.indexOf(field.data_type) !== -1) {
        /** Check if data_type is Array-like */
        return _parseArray(event, field);
      } else if (obj_word_list.indexOf(field.data_type) !== -1) {
        /** @TODO Handle the Object data type! */
        /** @TODO Handle the Object data type! */
        /** @TODO Handle the Object data type! */
      }
    }

    /** If none of the above, just retrun the unaltered value */
    return event.target.value;
  } else return undefined;
}

function _parseArray<T extends Object>(
  event: ElementEvent,
  field: FieldConfig<T>
) {
  let vals = [...get(field.value)];

  /**
   * If the target is checked and the target value isn't in the field.value
   * then add the target value to the field value.
   */
  if (event.target.checked && vals.indexOf(event.target.value) === -1) {
    vals.push(event.target.value);
  } else {
    /** Else remove the target.value from the field.value */
    vals.splice(vals.indexOf(event.target.value), 1);
  }
  /** Return the array of values */
  return vals;
}

/**
 * Check if the value is a (safe) intiger.
 * Because the event value will happily pass the number 1 as
 * "1", a string. So we parse it, check it, and if it's safe, return it.
 * Otherwise just return the initial value.
 *
 * We check if the value is not a number or if the value (as a number)
 * is greater than the max number value.
 *
 * If either is true, return plain value.
 * Else return value as number.
 *
 * @Hotpath
 */
function _parseNumberOrValue(value: any): Number | any {
  if (value === "" || value === undefined || value === null) return value;
  if (isNaN(+value) || +value >= max_int || +value <= -max_int) return value;
  else return +value;
}

export {
  _linkAllErrors,
  _linkFieldErrors,
  _linkValueFromEvent,
  _linkAllValues,
};
