import { Writable } from "svelte/store";
import { FieldConfig, Form, InitialFormState } from "../core";
/**
 * ---------------------------------------------------------------------------
 *
 * *** Form State ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Helper function for value_change emitter.
 * Write the form's value changes to form.value_changes.
 *
 * @Hotpath
 *
 * @param changes incoming value changes
 * @param field field emitting the changes
 */
declare function _setValueChanges<T extends Object>(changes: Writable<Record<keyof T | any, T[keyof T]>>, field: FieldConfig<T>): void;
/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with ~ 1000 fields in a single class with very slight input lag.
 *
 * @Hotpath
 */
declare function _hasStateChanged(value_changes: Writable<Record<string, any>>, changed: Writable<boolean>): void;
/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
declare function _setInitialState<T extends Object>(form: Form<T>, initial_state: InitialFormState<T>): InitialFormState<T>;
/**
 * Reset form to inital state.
 */
declare function _resetState<T extends Object>(form: Form<T>, initial_state: InitialFormState<T>): void;
export { _setValueChanges, _hasStateChanged, _setInitialState, _resetState };
