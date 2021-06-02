// #region Form State

import { Writable, get } from "svelte/store";
import { FieldConfig, Form, InitialFormState } from "..";
import { _linkAllValues, _linkAllErrors } from "./formUtilities";

/**
 * Helper function for value_change emitter.
 * Write the form's value changes to form.value_changes.
 *
 * @Hotpath
 *
 * @param changes incoming value changes
 * @param field field emitting the changes
 */
export function _setValueChanges<T extends Object>(
  changes: Writable<Record<keyof T | any, T[keyof T]>>,
  field: FieldConfig<T>
): void {
  const _changes = get(changes);

  /** Is the change is on the same field? */
  if (_changes[field.name]) {
    _changes[field.name] = get(field.value);
    changes.set({ ..._changes });
  } else {
    /** Or is the change on a different field? */
    changes.set({ ..._changes, [field.name]: get(field.value) });
  }
}

/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with ~ 1000 fields in a single class with very slight input lag.
 *
 * @Hotpath
 */
export function _hasStateChanged(
  value_changes: Writable<Record<string, any>>,
  changed: Writable<boolean>
): void {
  // const changes = get(value_changes) !== {} ? get(value_changes) : null;
  const changes = get(value_changes);

  if (changes && changes !== {} && Object.keys(changes).length > 0) {
    changed.set(true);
    return;
  }
  changed.set(false);
}

/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
export function _setInitialState<T extends Object>(
  form: Form<T>,
  initial_state: InitialFormState<T>
): InitialFormState<T> {
  Object.assign(initial_state.model, form.model);

  if (form.errors && form.errors.length > 0) {
    initial_state.errors = [...form.errors];
  } else {
    initial_state.errors = [];
  }
  return initial_state;
}

/**
 * Reset form to inital state.
 */
export function _resetState<T extends Object>(
  form: Form<T>,
  initial_state: InitialFormState<T>
): void {
  /** !CANNOT OVERWRITE MODEL. VALIDATION GETS FUCKED UP! */
  Object.assign(form.model, initial_state.model);

  /** Clear the form errors before assigning initial_state.errors */
  form.clearErrors();
  if (initial_state.errors && initial_state.errors.length > 0) {
    form.errors = [...initial_state.errors];
  } else {
    form.errors = [];
  }
  /** Done serializing the initial_state, now link everything. */

  /** Link the values, now */
  _linkAllValues(false, form.fields, form.model);

  /** If there were errors in the inital_state
   *  link them to each field
   */
  if (form.errors && form.errors.length > 0) {
    _linkAllErrors(form.errors, form.fields);
  }
  /** Reset the value changes and the "changed" store */
  form.value_changes.set({});
  form.changed.set(false);
}

//#endregion
