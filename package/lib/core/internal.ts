import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Form } from "./Form";
import {
  Callback,
  OnEvents,
  ValidationCallback,
  ValidationError,
  ObjectKeys,
  InitialFormState,
} from "./types";

//#region Utility Functions

// Get the form field by name
export function _get(name: string, fields: FieldConfig[]): FieldConfig {
  return fields.filter((f) => f.name === name)[0];
}

/**
 *
 * Build the field configs from this.model using metadata-reflection.
 * More comments inside...
 */
export function _buildFormFields<T extends Object>(
  model: T,
  // Grab the editableProperties from the @field decorator
  props: string[] = Reflect.getMetadata("editableProperties", model)
): FieldConfig[] {
  // Map the @field fields to the form.fields 
  const fields = props.map((prop: string) => {
    // Get the @FieldConfig using metadata reflection
    const field: FieldConfig = new FieldConfig(prop, {
      ...Reflect.getMetadata("fieldConfig", model, prop),
    });

    // If the model has a value, attach it to the field config
    // 0, "", [], etc. are set in the constructor based on type.
    if (model[prop as keyof T]) {
      field.setInitialValue(model[prop]);
    }

    // We made it. Return the field config and let's generate some inputs!
    return field;
  });
  return fields;
}

export function _getRequiredFieldNames(fields: FieldConfig[]): string[] {
  let required_field_names: string[] = [];
  fields.forEach((f) => {
    if (f.required) {
      required_field_names.push(f.name);
    }
  });
  return required_field_names;
}

/**
 * Helper function for value_change emitter.
 * Write the form's value changes to form.value_changes.
 *
 * @param changes incoming value changes
 * @param field field emitting the changes
 */
export function _setValueChanges(
  changes: Writable<Record<string, any>>,
  field: FieldConfig
): void {
  const _changes = get(changes);

  // The change is on the same field
  if (_changes[field.name]) {
    _changes[field.name] = get(field.value);
    changes.set({ ..._changes });
  } else {
    // Change is on a different field
    changes.set({ ..._changes, [field.name]: get(field.value) });
  }
}

//#endregion

//#region HTML Event Helpers

/**
 * Attach the OnEvents events to each form.field.
 * Parent: form.useField(...)
 */
export function _attachEventListeners(
  field: FieldConfig,
  on_events: OnEvents,
  callback: Callback
): void {
  Object.entries(on_events).forEach(([eventName, shouldListen]) => {
    // If shouldListen true, then add the event listener
    if (shouldListen) {
      field.node &&
        field.node.addEventListener(
          eventName,
          (e: Event) => callback(e),
          false
        );
    }
  });
}

export function _attachOnClearErrorEvents(
  node: HTMLElement,
  clear_errors_on_events: OnEvents,
  callback: Callback
): void {
  Object.entries(clear_errors_on_events).forEach(
    ([eventName, shouldListen]) => {
      // If the OnEvent is true, then add the event listener
      if (shouldListen) {
        node.addEventListener(eventName, (e: Event) => callback(e), false);
      }
    }
  );
}

export function _addCallbackToField<T>(
  form: Form<T>,
  field: FieldConfig,
  event: keyof HTMLElementEventMap,
  callbacks: ValidationCallback[] | Callback,
  with_validation_event: boolean = true,
  required_fields: string[],
  field_names: string[]
) {
  if (with_validation_event && Array.isArray(callbacks)) {
    field.node &&
      field.node.addEventListener(
        event,
        (e) =>
          _handleValidationEvent(
            form,
            required_fields,
            field_names,
            undefined,
            callbacks
          ),
        false
      );
  } else if (!Array.isArray(callbacks)) {
    field.node &&
      field.node.addEventListener(event, (e) => callbacks(e), false);
  }
}

//#endregion

//#region Linking Utilities

/**
 * Better performance in place of model/field data sync integrity
 */
function _linkFieldValues<ModelType extends Object>(
  field: FieldConfig,
  model: ModelType
): void {
  // let k: keyof ModelType;
  // for (k in model) {
  //   if (k === field.name) model[k] = get(field.value);
  // }

  model[field.name as keyof ModelType] = get(field.value);
}

// Link values from FIELDS toMODEL or MODEL to FIELDS
export function _linkValues<ModelType extends Object>(
  fromFieldsToModel: boolean,
  fields: FieldConfig[],
  model: ModelType
): void {
  // Still the fastest way i've seen to loop in JS.
  let i = 0,
    len = fields.length;
  for (; len > i; ++i) {
    // Get name and value of the field
    const name = fields[i].name,
      val = fields[i].value;
    if (fromFieldsToModel) {
      // Link field values to the model
      model[name as keyof ModelType] = get(val);
    } else {
      // Link model values to the fields
      val.set(model[name as keyof ModelType]);
    }
  }
}

/**
 * Currently this depends on class-validator.
 * TODO: Disconnect class-validator dependency from all functions
 */
export function _linkFieldErrors(
  errors: ValidationError[],
  field: FieldConfig,
  filter_term: keyof ValidationError
): void {
  const error = errors.filter((e) => e[filter_term] === field.name);
  // Check if there's an error for the field
  if (error && error.length > 0) {
    field.errors.set(error[0]);
  } else {
    field.errors.set(null);
  }
}

export function _linkAllErrors(
  errors: ValidationError[],
  fields: FieldConfig[]
): void {
  errors.forEach((err) => {
    if (err && err.property) {
      const f = _get(err.property, fields);
      f.errors.set(err);
    }
  });
}

export function _hanldeValueLinking<T extends Object>(
  form: Form<T>,
  field?: FieldConfig
): void {
  const checkAllFieldLink = () => {
    if (form.perf_options.link_all_values_on_event === "all" || !field) {
      _linkValues(true, form.fields, form.model);
    } else if (form.perf_options.link_all_values_on_event === "field") {
      _linkFieldValues(field, form.model);
    }
  };
  /**
   * Link the input from the field to the model.
   * We aren't linking (only) the field value.
   * We link all values just in case the field change propigates other field changes.
   */
  if (form.link_fields_to_model === "always") {
    checkAllFieldLink();
  } else if (form.link_fields_to_model === "valid") {
    checkAllFieldLink();
  }
}

//#endregion

//#region Validation Helpers

function _handleValidationCallbacks(
  when_to_call: "before" | "after",
  callbacks: ValidationCallback[]
): void {
  if (callbacks && callbacks.length > 0)
    callbacks.forEach((cb) => {
      if (cb.when === when_to_call) {
        cb.callback();
      }
    });
}

/**
 * This is used to add functions and callbacks to the OnEvent
 * handler. Functions can be added in a plugin-style manner now.
 */
export function _executeCallbacks(callbacks: Callback | Callback[]): void {
  if (Array.isArray(callbacks)) {
    callbacks.forEach((cb) => {
      cb();
    });
  } else {
    callbacks();
  }
}

function _executeIfTrue(is_true: boolean, cb: Callback): void {
  if (is_true) cb();
}

/**
 * Hanlde the events that will fire for each field.
 * Corresponds to the form.on_events field.
 *
 */
export function _handleValidationEvent<T extends Object>(
  form: Form<T>,
  required_fields: string[],
  // stateful_items: string[],
  // initial_state_str: string,
  field_names: string[],
  field?: FieldConfig,
  callbacks?: ValidationCallback[]
): Promise<ValidationError[]> | undefined {
  if (form.validation_options.validator) {
    _executeCallbacks([
      /**
       * Link the input from the field to the model.
       * We aren't linking (only) the field value.
       * We link all values just in case the field change propigates other field changes.
       */
      () => _hanldeValueLinking(form, field),

      () =>
        _executeIfTrue(
          field !== undefined && form.perf_options.enable_change_detection,
          () => _setValueChanges(form.value_changes, field)
        ),

      () => _handleValidationCallbacks("before", callbacks),
    ]);

    return form.validation_options
      .validator(form.model, form.validation_options.options)
      .then((errors: ValidationError[]) => {
        _executeCallbacks([
          () => _handleFormValidation(form, errors, required_fields, field),
          () =>
            _executeIfTrue(
              form.perf_options.enable_hidden_fields_detection,
              () =>
                // _hideFields(form.hidden_fields, field_names, form.fields)
                _negateField(form.hidden_fields, field_names, form.fields, {
                  type: "hide",
                  value: true,
                })
            ),

          () =>
            _executeIfTrue(
              form.perf_options.enable_disabled_fields_detection,
              () =>
                // _disableFields(form.disabled_fields, field_names, form.fields)
                _negateField(form.disabled_fields, field_names, form.fields, {
                  type: "disable",
                  value: true,
                })
            ),

          () =>
            _executeIfTrue(form.perf_options.enable_change_detection, () =>
              _hasStateChanged(form.value_changes, form.changed)
            ),

          () => _handleValidationCallbacks("after", callbacks),
        ]);
        return errors;
      });
  }
}

/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.link_fields_to_model === LinkOnEvent.Valid is true.
 */
export async function _handleFormValidation<T extends Object>(
  form: Form<T>,
  errors: ValidationError[],
  required_fields: string[],
  field?: FieldConfig
): Promise<ValidationError[]> {
  // There are errors!
  if (errors && errors.length > 0) {
    form.errors = errors;

    // Are we validating the whole form or just the fields?
    if (field) {
      // Link errors to field (to show validation errors)
      if (form.validation_options.field_error_link_name) {
        _linkFieldErrors(
          errors,
          field,
          form.validation_options.field_error_link_name
        );
      }
    } else {
      // This is validatino for the whole form!
      _linkAllErrors(errors, form.fields);
    }

    // All required fields are valid?
    if (_requiredFieldsValid(errors, required_fields)) {
      form.valid.set(true);
    } else {
      form.valid.set(false);
    }
  } else {
    // We can't get here unless the errors we see are for non-required fields

    // If the config tells us to link the values only when the form
    // is valid, then link them here.
    _hanldeValueLinking(form, field);
    form.clearErrors(); // Clear form errors
    form.valid.set(true); // Form is valid!
  }
  return errors;
}

/**
 * TODO: Clean up this arfv implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid
 */
export function _requiredFieldsValid(
  errors: ValidationError[],
  required_fields: string[]
): boolean {
  if (errors.length === 0) return true;
  // Go ahead and return if there are no errors
  let i = 0,
    len = required_fields.length;
  // If there are no required fields, just go ahead and return
  if (len === 0) return true;
  // Otherwise we have to map the names of the errors so we can
  // check if they're for a required field
  const errs = errors.map((e) => e.property);
  for (; len > i; ++i) {
    if (errs.indexOf(required_fields[i]) !== -1) {
      return false;
    }
  }
  return true;
}

//#endregion

//#region - Form State

/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with > 1000 fields in a single class with very slight input lag.
 */
// export function _hasStateChanged<T extends Object>(
export function _hasStateChanged(
  value_changes: Writable<Record<string, any>>,
  changed: Writable<boolean>
): void {
  const changes = get(value_changes) !== {} ? get(value_changes) : null;

  if (changes && Object.keys(changes).length > 0) {
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
    initial_state.errors = form.errors.map((e) => e);
  } else {
    initial_state.errors = [];
  }
  return initial_state;
}

/**
 * This one's kinda harry.
 * But it resets the form to it's initial state.
 */
export function _resetState<T extends Object>(
  form: Form<T>,
  initial_state: InitialFormState<T>
): void {
  form.model = Object.assign({}, initial_state.model);

  if (initial_state.errors && initial_state.errors.length > 0) {
    form.errors = initial_state.errors.map((e) => e);
  } else {
    form.errors = [];
  }

  if (form.errors && form.errors.length > 0) {
    _linkAllErrors(form.errors, form.fields);
  }

  _linkValues(false, form.fields, form.model);

  form.value_changes = writable({});
  form.changed.set(false);
}

//#endregion

//#region - Styling

/**
 * Using this.field_order, rearrange the order of the fields.
 */
export function _createOrder(
  field_order: string[],
  fields: FieldConfig[]
): FieldConfig[] {
  let newLayout: FieldConfig[] = [];
  let leftovers: FieldConfig[] = [];
  // Loop over the order...
  field_order.forEach((name) => {
    const field = _get(name, fields);
    // If the field.name and the order name match...
    if (field.name === name) {
      // Then push it to the fields array
      newLayout.push(field);
    } else if (
      leftovers.indexOf(field) === -1 &&
      field_order.indexOf(field.name) === -1
    ) {
      // Field is not in the order, so push it to bottom of order.
      leftovers.push(field);
    }
  });
  fields = [...newLayout, ...leftovers];
  return fields;
}

export function _setFieldAttribute(
  name: string,
  fields: FieldConfig[],
  attributes: Partial<FieldConfig>
): void {
  const f = _get(name, fields);
  Object.entries(attributes).forEach(([key, value]) => {
    if (typeof value === "object") {
      Object.entries(value).forEach(([_key, _val]) => {
        f.attributes[_key] = _val;
      });
    } else {
      f[key] = value;
    }
  });
}

export function _negateField(
  affected_fields: Array<FieldConfig["name"]>,
  field_names: Array<FieldConfig["name"]>,
  fields: FieldConfig[],
  negation: { type: "disable" | "hide"; value: boolean }
) {
  if (
    affected_fields &&
    affected_fields.length > 0 &&
    fields &&
    fields.length > 0
  ) {
    let i = 0,
      len = affected_fields.length;
    if (len === 0) return;
    for (; len > i; ++i) {
      const field = affected_fields[i],
        field_index = field_names.indexOf(field);

      if (field_index !== -1) {
        if (negation.type === "disable") {
          _setFieldAttribute(field_names[field_index], fields, {
            disabled: negation.value,
            attributes: { disabled: negation.value },
          });
        } else if (negation.type === "hide") {
          _setFieldAttribute(field_names[field_index], fields, {
            hidden: negation.value,
          });
        }
      }
    }
  }
}

//#endregion
