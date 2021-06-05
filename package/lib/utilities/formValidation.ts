import { get } from "svelte/store";
import {
  Form,
  FieldConfig,
  ValidationCallback,
  ValidationError,
  Callback,
  ElementEvent,
} from "../core";
import { _setValueChanges, _hasStateChanged } from "./formState";
import {
  _linkFieldErrors,
  _linkAllErrors,
  _linkValueFromEvent,
} from "./linkMethods";
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
function _executeValidationEvent<T extends Object>(
  form: Form<T>,
  required_fields: Array<keyof T>,
  field?: FieldConfig<T>,
  callbacks?: ValidationCallback[],
  event?: ElementEvent
): Promise<ValidationError[]> | undefined {
  /** The form has been altered (no longer pristine) */
  form.pristine.set(false);
  /** If field && it hasn't been marked as touched... touch it. */
  if (field && !get(field.touched)) field.touched.set(true);

  /** Execute pre-validation callbacks */
  _executeCallbacks([
    field &&
      form.validation_options.when_link_fields_to_model === "always" &&
      _linkValueFromEvent(field, form.model, event),
    /** Execution step may need work */
    field && _setValueChanges(form.value_changes, field),
    callbacks && _executeValidationCallbacks("before", callbacks),
  ]);

  /**
   * @TODO This section needs a rework.
   * Too many moving parts.
   * Hard to pass in custom validation parameters.
   *
   * If there's validation options, use them.
   * Else, just fire the callbacks and be done.
   */
  if (form.validation_options) {
    return form.validation_options
      .validator(form.model, form.validation_options.options)
      .then((errors: ValidationError[]) => {
        _executeCallbacks([
          _handleValidationSideEffects(
            form,
            errors,
            required_fields,
            field,
            event
          ),
          _hasStateChanged(form.value_changes, form.changed),
          callbacks && _executeValidationCallbacks("after", callbacks),
        ]);
        return errors;
      });
  } else {
    _executeCallbacks([
      _hasStateChanged(form.value_changes, form.changed),
      callbacks && _executeValidationCallbacks("after", callbacks),
    ]);
    return undefined;
  }
}

/**
 * Execute validation callbacks, depending on when_to_call
 * @Hotpath
 */
function _executeValidationCallbacks(
  when_to_call: "before" | "after",
  callbacks: ValidationCallback[]
): void {
  if (callbacks && callbacks.length > 0)
    callbacks.forEach((cb) => {
      if (cb.when === when_to_call) {
        _callFunction(cb.callback);
      }
    });
}

/**
 * Check if the callback is a function and execute it accordingly
 * @Hotpath
 */
function _callFunction(cb: Callback) {
  if (cb instanceof Function) {
    cb();
  } else {
    () => cb;
  }
}

/**
 * This is used to add functions and callbacks to the OnEvent
 * handler. Functions can be added in a plugin-style manner now.
 *
 * @Hotpath
 */
function _executeCallbacks(callbacks: Callback | Callback[]): void {
  /** Is it an Array of callbacks? */
  if (Array.isArray(callbacks)) {
    callbacks.forEach((cb) => {
      _callFunction(cb);
    });
  } else {
    _callFunction(callbacks);
  }
}

/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.when_link_fields_to_model === LinkOnEvent.Valid is true.
 *
 * @Hotpath
 */
async function _handleValidationSideEffects<T extends Object>(
  form: Form<T>,
  errors: ValidationError[],
  required_fields: Array<keyof T>,
  field?: FieldConfig<T>,
  event?: ElementEvent
): Promise<ValidationError[]> {
  /**  There are errors! */
  if (errors && errors.length > 0) {
    form.errors = errors;

    /**  Are we validating the whole form or just the fields? */
    if (field) {
      /**  Link errors to field (to show validation errors) */
      _linkFieldErrors(errors, field);
    } else {
      /**  This is validation for the whole form! */
      _linkAllErrors(errors, form.fields);
    }

    /**  All required fields are valid? */
    if (_requiredFieldsValid(errors, required_fields)) {
      form.valid.set(true);
    } else {
      form.valid.set(false);
    }
  } else {
    /** We can't get here unless the errors we see are for non-required fields */

    /**
     * If the config tells us to link the values only when the form
     * is valid, then link them here.
     */
    field &&
      form.validation_options.when_link_fields_to_model === "valid" &&
      _linkValueFromEvent(field, form.model, event);
    form.clearErrors(); /** Clear form errors */
    form.valid.set(true); /** Form is valid! */
  }
  return errors;
}

/**
 * @TODO Clean up this requiredFieldsValid implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid.
 *
 * @Hotpath
 */
function _requiredFieldsValid<T extends Object>(
  errors: ValidationError[],
  required_fields: Array<keyof T>
): boolean {
  if (errors.length === 0) return true;
  // Go ahead and return if there are no errors
  let i = 0,
    len = required_fields.length;
  // If there are no required fields, just go ahead and return
  if (len === 0) return true;
  /**
   * Otherwise we have to map the names of the errors so we can
   * check if they're for a required field
   */
  const errs = errors.map((e) => e["field_key"]);
  for (; len > i; ++i) {
    if (errs.indexOf(required_fields[i] as keyof ValidationError) !== -1) {
      return false;
    }
  }
  return true;
}

export {
  _executeValidationEvent,
  _executeCallbacks,
  _handleValidationSideEffects,
};
