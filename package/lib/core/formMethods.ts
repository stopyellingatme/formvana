import { get, Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Form } from "./Form";
import {
  Callback,
  OnEvents,
  ValidationCallback,
  ValidationError,
  InitialFormState,
  LinkOnEvent,
} from "./Types";

// #region Utility Functions

/**
 * Build the field configs from this.model using metadata-reflection.
 * Grab the editableProperties from the @field decorator.
 *
 * @TODO Create method to use plain JSON as model, fields and validation schema
 */
export function _buildFormFields<T extends Object>(
  model: T,
  meta?: Record<string, string | number | boolean | Object>,
  props: string[] = Reflect.getMetadata("editableProperties", model)
): FieldConfig<T>[] {
  /** Map the @field fields to the form.fields */
  const fields = props.map((prop: string) => {
    /** Get the @FieldConfig using metadata reflection */
    const field: FieldConfig<T> = new FieldConfig<T>(prop as keyof T, {
      ...Reflect.getMetadata("fieldConfig", model, prop),
      value: model[prop as keyof T],
    });

    /** We made it. Return the field config and let's generate some inputs! */
    return field;
  });

  if (meta) {
    /** Filter fields used in a specific form */
    fields.filter((f) => meta["name"] === f.for_form);
  }

  return fields;
}

export function _buildFormFieldsWithSchema<T extends Object>(
  props: Record<string, Partial<FieldConfig<T>>>,
  meta?: Record<string, string | number | boolean | Object>
): FieldConfig<T>[] {
  let k: keyof Record<string, Partial<FieldConfig<Object>>>,
    fields = [];
  for (k in props) {
    const field: FieldConfig<T> = new FieldConfig<T>(k as keyof T, {
      ...props[k],
    });
    fields.push(field);
  }
  // const fields = props.map((prop: string) => {
  //   /** Get the @FieldConfig using metadata reflection */
  //   const field: FieldConfig<T> = new FieldConfig<T>(prop as keyof T, {
  //     ...Reflect.getMetadata("fieldConfig", model, prop),
  //     value: model[prop as keyof T],
  //   });

  /** We made it. Return the field config and let's generate some inputs! */
  // return field;
  // });

  if (meta) {
    /** Filter fields used in a specific form */
    fields.filter((f) => meta["name"] === f.for_form);
  }

  return fields;
}

/** Get the form field by name */
export function _get<T extends Object>(
  name: keyof T,
  fields: FieldConfig<T>[]
): FieldConfig<T> {
  return fields.filter((f) => f.name === name)[0];
}

//#endregion

// #region HTML Event Helpers

/**
 * Attach the OnEvents events to each form.field.
 * Parent: form.useField(...)
 */
export function _attachEventListeners<T extends Object>(
  field: FieldConfig<T>,
  on_events: OnEvents<HTMLElementEventMap>,
  callback: Callback
): void {
  Object.entries(on_events).forEach(([eventName, shouldListen]) => {
    /** If shouldListen true, then add the event listener */
    if (shouldListen) {
      if (field.node?.nodeName === "SELECT" && eventName !== "input") {
        field.addEventListener(
          eventName as keyof HTMLElementEventMap,
          callback
        );
      }

      if (field.node?.nodeName !== "SELECT") {
        field.addEventListener(
          eventName as keyof HTMLElementEventMap,
          callback
        );
      }
    }
  });
}

export function _addCallbackToField<T extends Object>(
  form: Form<T>,
  field: FieldConfig<T>,
  event: keyof HTMLElementEventMap,
  callback: ValidationCallback | Callback,
  required_fields: Array<keyof T>
): void {
  /** Check if callback is of type ValidationCallback */
  if (callback && (<ValidationCallback>callback).when) {
    field.addEventListener(
      event,
      _executeValidationEvent(form, required_fields, undefined, [
        <ValidationCallback>callback,
      ])
    );
  } else {
    field.addEventListener(event, <Callback>callback);
  }
}

//#endregion

// #region Linking Utilities

/**
 * Link form.errors to it's corresponding field.errors
 * Via error[field_name]
 *
 * @Hotpath
 */
export function _linkFieldErrors<T extends Object>(
  errors: ValidationError[],
  field: FieldConfig<T>,
  field_name: ValidationError["property"]
): void {
  const error = errors.filter(
    (e) => e[field_name as keyof ValidationError] === field.name
  );
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
  fields: FieldConfig<T>[],
  field_error_link_name: ValidationError["property"]
): void {
  errors.forEach((err) => {
    if (Array.isArray(err)) {
      err = err[0];
      if (err[field_error_link_name as keyof ValidationError]) {
        const f = _get(
          err[field_error_link_name as keyof ValidationError],
          fields
        );
        f.errors.set(err);
      }
    } else {
      if (err[field_error_link_name as keyof ValidationError]) {
        const f = _get(
          err[field_error_link_name as keyof ValidationError],
          fields
        );
        f.errors.set(err);
      }
    }
  });
}

/** When should we link the fields to the model?
 * "alwyas" || "valid" (when valid)
 *
 * @Hotpath
 */
export function _hanldeValueLinking<T extends Object>(
  model: T,
  fields: FieldConfig<T>[],
  link_fields_to_model: LinkOnEvent | undefined,
  event?: Event
): void {
  /**
   * Link the input from the field to the model.
   * We dont't link (just) the field value.
   * We link all values just in case the field change propigates
   * to other field changes.
   */
  if (link_fields_to_model === "always") {
    _linkValues(true, fields, model, event);
  } else if (link_fields_to_model === "valid") {
    _linkValues(true, fields, model, event);
  }
}

/**
 * Link values from FIELDS to MODEL or MODEL to FIELDS
 *
 * @Hotpath
 */
export function _linkValues<T extends Object>(
  from_fields_to_model: boolean,
  fields: FieldConfig<T>[],
  model: T,
  event?: Event
): void {
  /** Still the fastest way i've seen to loop in JS. */
  let i = 0,
    len = fields.length;
  for (; len > i; ++i) {
    /** Get name and value of the field */
    const name = fields[i].name,
      val = fields[i].value,
      value = getValueFromEvent(event);

    /**  Link field[values] to model[values] */
    if (from_fields_to_model) {
      // model[name as keyof T] = get<typeof model[keyof T]>(val);
      model[name as keyof T] = value;
    } else {
      /**  Link form.model[values] to the form.fields[values] */
      val.set(model[name as keyof T]);
      // val.set(value);
    }
  }
}

function getValueFromEvent(event?: Event): any {
  let result;
  if (event) {
    if (event.target) {
      /** @ts-ignore */
      if (event.target.valueAsDate) {
        /** @ts-ignore */
        result = event.target.valueAsDate;
        /** @ts-ignore */
      } else if (
        /** @ts-ignore */
        event.target.valueAsNumber ||
        /** @ts-ignore */
        event.target.valueAsNumber === 0
      ) {
        /** @ts-ignore */
        result = event.target.valueAsNumber;
        /** @ts-ignore */
      } else if (event.target.value) {
        /** @ts-ignore */
        result = event.target.value;
      }
    }
  }
  return result;
}

//#endregion

// #region Validation Helpers

/**
 * Hanlde the events that will fire for each field.
 * Corresponds to the form.on_events field.
 *
 * @Hotpath
 */
export function _executeValidationEvent<T extends Object>(
  form: Form<T>,
  required_fields: Array<keyof T>,
  field?: FieldConfig<T>,
  callbacks?: ValidationCallback[],
  event?: Event
): Promise<ValidationError[]> | undefined {
  /** The form has been altered (no longer pristine) */
  form.pristine.set(false);

  /** Execute pre-validation callbacks */
  _executeCallbacks([
    /**
     * Link new data from field to the model.
     * We are not linking (only/just) the field value.
     * We link all values just in case the field change propigates other field changes.
     * I've tried an approach that linked ONLY data to single field, negligable perf hit
     */
    _hanldeValueLinking(
      form.model,
      form.fields,
      form.validation_options.link_fields_to_model,
      event
    ),
    /** Execution step may need work */
    field && _setValueChanges(form.value_changes, field),
    callbacks && _executeValidationCallbacks("before", callbacks),
  ]);

  return form.validation_options
    .validator(
      form.model,
      form.validation_options.options
      // form.validation_options.schema && form.validation_options.schema
    )
    .then((errors: ValidationError[]) => {
      _executeCallbacks([
        _handleValidationSideEffects(form, errors, required_fields, field),
        _hasStateChanged(form.value_changes, form.changed),
        callbacks && _executeValidationCallbacks("after", callbacks),
      ]);
      return errors;
    });
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
export function _executeCallbacks(callbacks: Callback | Callback[]): void {
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
 * form.link_fields_to_model === LinkOnEvent.Valid is true.
 *
 * @Hotpath
 */
export async function _handleValidationSideEffects<T extends Object>(
  form: Form<T>,
  errors: ValidationError[],
  required_fields: Array<keyof T>,
  field?: FieldConfig<T>
): Promise<ValidationError[]> {
  /**  There are errors! */
  if (errors && errors.length > 0) {
    form.errors = errors;

    /**  Are we validating the whole form or just the fields? */
    if (field) {
      /**  Link errors to field (to show validation errors) */
      if (form.validation_options.field_error_link_name) {
        _linkFieldErrors(
          errors,
          field,
          form.validation_options.field_error_link_name
        );
      }
    } else {
      /**  This is validation for the whole form! */
      _linkAllErrors(
        errors,
        form.fields,
        form.validation_options.field_error_link_name
      );
    }

    /**  All required fields are valid? */
    if (
      _requiredFieldsValid(
        errors,
        required_fields,
        form.validation_options.field_error_link_name
      )
    ) {
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
    _hanldeValueLinking(
      form.model,
      form.fields,
      form.validation_options.link_fields_to_model
    );
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
export function _requiredFieldsValid<T extends Object>(
  errors: ValidationError[],
  required_fields: Array<keyof T>,
  field_error_link_name: string | undefined
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
  const errs = errors.map(
    (e) => e[field_error_link_name as keyof ValidationError]
  );
  for (; len > i; ++i) {
    if (errs.indexOf(required_fields[i] as keyof ValidationError) !== -1) {
      return false;
    }
  }
  return true;
}

//#endregion

// #region Form State

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
  initial_state.model = Object.assign({}, form.model);

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
  let k: keyof T;
  if (initial_state.model) {
    for (k in initial_state.model) {
      form.model[k] = initial_state.model[k];
    }
  }

  /** Clear the form errors before assigning initial_state.errors */
  form.clearErrors();
  if (initial_state.errors && initial_state.errors.length > 0) {
    form.errors = [...initial_state.errors];
  } else {
    form.errors = [];
  }
  /** Done serializing the initial_state */

  /** Link the values, now */
  _linkValues(false, form.fields, form.model);

  /** If there were errors in the inital_state
   *  link them to each field
   */
  if (form.errors && form.errors.length > 0) {
    _linkAllErrors(
      form.errors,
      form.fields,
      form.validation_options.field_error_link_name
    );
  }
  /** Reset the value changes and the "changed" store */
  form.value_changes.set({});
  form.changed.set(false);
}

//#endregion

// #region Styling

/**
 * Using this.field_order, rearrange the order of the fields.
 */
export function _setFieldOrder<T extends Object>(
  field_order: Array<keyof T>,
  fields: FieldConfig<T>[]
): FieldConfig<T>[] {
  let newLayout: FieldConfig<T>[] = [];
  let leftovers: FieldConfig<T>[] = [];
  /** Loop over the order... */
  field_order.forEach((name) => {
    const field = _get(name, fields);
    /** If the field.name and the order name match... */
    if (field.name === name) {
      /** Then push it to the fields array */
      newLayout.push(field);
    } else if (
      leftovers.indexOf(field) === -1 &&
      field_order.indexOf(field.name as keyof T) === -1
    ) {
      /** Field is not in the order, so push it to bottom of order. */
      leftovers.push(field);
    }
  });
  fields = [...newLayout, ...leftovers];
  return fields;
}

/**
 * Set any attributes on the given fields.
 */
export function _setFieldAttributes<T extends Object>(
  target_fields: Array<keyof T>,
  fields: FieldConfig<T>[],
  attributes: Partial<FieldConfig<T>>
): void {
  let i = 0,
    len = target_fields.length;
  if (len === 0) return;
  const all_field_names = fields.map((f) => f.name);

  for (; len > i; ++i) {
    const field_index = all_field_names.indexOf(target_fields[i]);

    if (field_index !== -1) {
      const field_name = all_field_names[field_index];

      _setFieldAttribute(field_name, fields, attributes);
    }
  }
}

/**
 * Set any attributes on the given field.
 */
export function _setFieldAttribute<T extends Object>(
  name: keyof T,
  fields: FieldConfig<T>[],
  attributes: Partial<FieldConfig<T>>
): void {
  /**  Get field config */
  const f: FieldConfig<T> = _get(name, fields);
  /**  Loop over key of Partial FieldConfig */
  let k: keyof typeof attributes;
  for (k in attributes) {
    /**  If we hit the attributes property then we set the field.attributes */
    if (k === "attributes") {
      Object.assign(f.attributes, attributes[k]);
    } else if (k !== "name") {
      /**  "name" is readonly on FieldConfig */
      setFieldProperty(f, k, attributes[k]);
    }
  }
}

/**
 * Initially created to deal with TS compiler errors.
 * Dynamically assigning a value to f[key] wouldn't play nice.
 */
function setFieldProperty<T extends Object, K extends keyof FieldConfig<T>>(
  f: FieldConfig<T>,
  key: K,
  value: FieldConfig<T>[K]
) {
  f[key] = value;
}

//#endregion

//#region Form Manager

//#endregion
