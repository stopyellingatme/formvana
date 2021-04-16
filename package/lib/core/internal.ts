import { ValidationError, validate } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Form } from "./Form";
import { LinkOnEvent, OnEvents } from "./types";

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
export function _buildFormFields(model: any): FieldConfig[] {
  // Grab the editableProperties from the @editable decorator
  let props: string[] = Reflect.getMetadata("editableProperties", model);
  // Map the @editable fields to the form.fields array.
  const fields = props.map((prop: string) => {
    // Get the FieldConfig using metadata reflection
    const field: FieldConfig = new FieldConfig({
      ...Reflect.getMetadata("fieldConfig", model, prop),
      name: prop,
    });

    // If the model has a value, attach it to the field config
    // 0, "", [], etc. are set in the constructor based on type.
    if (model[prop]) {
      field.value.set(model[prop]);
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

export function _setValueChanges(form: Form, field_name: string, change: any) {
  const changes = get(form.changes);

  // The change is on the same field
  if (changes[field_name]) {
    changes[field_name] = change;
    form.changes.set({ ...changes });
  } else {
    // Change is on a different field
    form.changes.set({ ...changes, [field_name]: change });
  }
}

//#endregion

//#region HTML Event Helpers

export function _attachEventListeners(
  field: FieldConfig,
  on_events: OnEvents,
  callback: Function
): void {
  Object.entries(on_events).forEach(([eventName, shouldListen]) => {
    // If shouldListen true, then add the event listener
    if (shouldListen) {
      field.node.addEventListener(eventName, (e: Event) => callback(e), false);
    }
    // If the field has options, we can assume it will use the change event listener
    // if (field.options) {
    //   // so don't add the input event listener
    //   if (shouldListen && eventName !== "input") {
    //     node.addEventListener(
    //       eventName,
    //       (ev) => {
    //         callback(field);
    //       },
    //       false
    //     );
    //   }
    // }
    // // Else, we can assume it will use the input event listener
    // // * This may be changed in the future
    // else {
    //   // and don't add the change event listener
    //   if (shouldListen && eventName !== "change") {
    //     node.addEventListener(
    //       eventName,
    //       (ev) => {
    //         callback(field);
    //       },
    //       false
    //     );
    //   }
    // }
  });
}

export function _attachOnClearErrorEvents(
  node: HTMLElement,
  clear_errors_on_events: OnEvents,
  callback?: Function
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

//#endregion

//#region Linking Utilities

// Link values from FIELDS toMODEL or MODEL to FIELDS
export function _linkValues(
  fromFieldsToModel: boolean,
  fields: FieldConfig[],
  model: any
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
      model[name] = get(val);
    } else {
      // Link model values to the fields
      val.set(model[name]);
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
  filter_term: keyof ValidationError // TODO: Create special validation error Type
): void {
  const error = errors.filter((e) => e[filter_term] === field.name);
  // Check if there's an error for the field
  if (error && error.length > 0) {
    field.errors.set(error[0]);
  } else {
    field.errors.set(null);
  }
}

export function _linkErrors(
  errors: ValidationError[],
  fields: FieldConfig[]
): void {
  errors.forEach((err) => {
    const f = _get(err.property, fields);
    f.errors.set(err);
  });
}

//#endregion

//#region Validation Helpers
export function _handleOnEvent(
  form: Form,
  required_fields: string[],
  stateful_items: string[],
  initial_state_str: string,
  field_names: string[],
  field: FieldConfig
): Promise<void> {
  /**
   * Link the input from the field to the model.
   * We aren't linking (only) the field value.
   * We link all values just in case the field change propigates other field changes.
   */
  form.link_fields_to_model === LinkOnEvent.Always &&
    _linkValues(true, form.fields, form.model);

  _setValueChanges(form, field.name, get(field.value));

  _hideFields(form.hidden_fields, field_names, form.fields),
    _disableFields(form.disabled_fields, field_names, form.fields);

  return _validateField(form, field, required_fields).then(() => {
    _hasChanged(form, stateful_items, initial_state_str);
  });
}

export function _validateField(
  form: Form,
  field: FieldConfig,
  required_fields: string[]
): Promise<void> {
  return validate(form.model, form.validation_options).then(
    (errors: ValidationError[]) => {
      return _handleValidation(form, errors, required_fields, field);
    }
  );
}

export async function _handleValidation(
  form: Form,
  errors: ValidationError[],
  required_fields: string[],
  field?: FieldConfig
): Promise<void> {
  try {
    // There are errors!
    if (errors.length > 0) {
      form.errors = errors;

      // Are we validating the whole form or just the fields?
      if (field) {
        // Link errors to field (to show validation errors)
        _linkFieldErrors(errors, field, "property");
      } else {
        // This is validatino for the whole form!
        _linkErrors(errors, form.fields);
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
      form.link_fields_to_model === LinkOnEvent.Valid &&
        _linkValues(true, form.fields, form.model);

      form.valid.set(true); // Form is valid!
      form.clearErrors(); // Clear form errors
    }
  } catch (e) {
    console.error(e);
    if (e) throw e;
  }
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
    if (errs.includes(required_fields[i])) {
      return false;
    }
  }
  return true;
}

//#endregion

//#region - Form State

// Returns a string of the current state
export function _getStateSnapshot(
  form: Form,
  stateful_items: string[]
): string {
  let i = 0,
    len = stateful_items.length,
    result = {};
  for (; len > i; ++i) {
    const item = stateful_items[i];
    result[item] = form[item];
  }
  return JSON.stringify(result);
}

/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with > 1000 fields in a single class with very slight input lag.
 */
export function _hasChanged(
  form: Form,
  stateful_items: string[],
  initial_state_str: string
): void {
  if (_getStateSnapshot(form, stateful_items) === initial_state_str) {
    form.changed.set(false);
    return;
  }
  form.changed.set(true);
}

// Clears everything before being destoryed.
export function _clearState(
  form: Form,
  initial_state: any,
  required_fields: string[]
): void {
  form.model = null;
  initial_state = {};
  required_fields = [];
  form.refs = null;
  form.template = null;
}

/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
export function _setInitialState(
  form: Form,
  stateful_items: string[],
  initial_state: any,
  initial_state_str: string
): void {
  /**
   * This is the best method for reliable deep-ish cloning that I've found.
   * If you know a BETTER way, be my guest. No extra dependencies please.
   */
  stateful_items.forEach((key) => {
    if (key === "valid" || key === "touched" || key === "changed") {
      get(form[key])
        ? (initial_state[key] = writable(true))
        : (initial_state[key] = writable(false));
    } else if (key === "changes") {
      initial_state[key] = writable(get(form.changes));
    } else {
      initial_state[key] = JSON.parse(JSON.stringify(form[key]));
    }
    initial_state_str = JSON.stringify(initial_state);
  });
}

/**
 * This one's kinda harry.
 * But it resets the form to it's initial state.
 */
export function _resetState(
  form: Form,
  stateful_items: string[],
  initial_state: any
): void {
  stateful_items.forEach((key) => {
    if (key === "valid" || key === "touched" || key === "changed") {
      // Check the inital_state's key
      get(initial_state[key]) ? form[key].set(true) : form[key].set(false);
    } else if (key === "errors") {
      // Clear the errors so we don't have leftovers all over the place
      form.clearErrors();
      // Attach errors located in initial_state (to form.errors)
      form.errors = initial_state.errors.map((e) => {
        // Create new ValidationError to match the class-validator error type
        let err = new ValidationError();
        Object.assign(err, e);
        return err;
      });
      // If this.errors is not empty then attach the errors to the fields
      if (form.errors && form.errors.length > 0) {
        _linkErrors(form.errors, form.fields);
      }
    } else if (key === "model") {
      /**
       * We have to disconnect the initial_state's model so that we don't get
       * burned by reference links.
       * We also don't want to overwrite the actual model, because it contains
       * all the metadata for validation, feilds, etc.
       * So we just copy the inital_state[model] and shove it's values back into
       * this.model.
       * That way when we reset the form, we still get validation errors from the
       * model's decorators.
       */
      const model_state = JSON.parse(JSON.stringify(initial_state[key]));
      Object.keys(form[key]).forEach((mkey) => {
        form[key][mkey] = model_state[mkey];
      });
      _linkValues(false, form.fields, form.model);
    } else if (key === "changes") {
      // Reset form value changes!
      if (get(initial_state[key]) === {}) {
        form.changes.set({});
      } else {
        form.changes.set(get(initial_state[key]));
      }
    } else {
      form[key] = JSON.parse(JSON.stringify(initial_state[key]));
    }
  });
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
    if (
      field.name === name ||
      (field.group && field.group.name === name) ||
      (field.step && `${field.step.index}` === name)
    ) {
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

export function _hideFields(
  hidden_fields: string[],
  field_names: string[],
  fields: FieldConfig[]
) {
  let i = 0,
    len = hidden_fields.length;
  if (len === 0) return;
  for (; len > i; ++i) {
    const field = hidden_fields[i],
      field_index = field_names.indexOf(field);

    if (field_index !== -1) {
      _hideField(field_names[field_index], fields);
    }
  }
}

export function _hideField(name: string, fields: FieldConfig[]) {
  const f = _get(name, fields);
  f.hidden = true;
}

export function _disableFields(
  disabled_fields: string[],
  field_names: string[],
  fields: FieldConfig[]
) {
  let i = 0,
    len = disabled_fields.length;
  if (len === 0) return;
  for (; len > i; ++i) {
    const field = disabled_fields[i],
      field_index = field_names.indexOf(field);
    if (field_index !== -1) {
      _disableField(field_names[field_index], fields);
    }
  }
}

export function _disableField(name: string, fields: FieldConfig[]) {
  const f = _get(name, fields);
  f.disabled = true;
  f.attributes["disabled"] = true;
}

/**
 * * Use this if you're trying to update the layout after initialization.
 * Similar to this.setOrder()
 *
 * Like this:
 * const layout = ["description", "status", "email", "name"];
 * const newState = sget(formState).buildStoredLayout(formState, layout);
 * formState.updateState({ ...newState });
 */
// buildStoredLayout = (
//   formState: Writable<any>,
//   order: string[]
// ): Writable<any> => {
//   let fields = [];
//   let leftovers = [];
//   // Update the order
//   formState.update((state) => (state.field_order = order));
//   // Get the Form state
//   const state = get(formState);
//   state.field_order.forEach((item) => {
//     state.fields.forEach((field) => {
//       if (
//         field.name === item ||
//         (field.group && field.group.name === item) ||
//         (field.step && `${field.step.index}` === item)
//       ) {
//         fields.push(field);
//       } else if (
//         leftovers.indexOf(field) === -1 &&
//         state.field_order.indexOf(field.name) === -1
//       ) {
//         leftovers.push(field);
//       }
//     });
//   });
//   state.fields = [...fields, ...leftovers];
//   return state;
// };

//#endregion
