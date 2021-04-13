import { ValidationError } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Form } from "./Form";
import { OnEvents } from "./types";

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

//#endregion

//#region HTML Event Helpers

export function _attachOnValidateEvents(
  node: HTMLElement,
  field: FieldConfig,
  validate_on_events: OnEvents,
  validationCb: Function
): void {
  Object.entries(validate_on_events).forEach(([eventName, shouldListen]) => {
    // If shouldListen true, then add the event listener
    // If the field has options, we can assume it will use the change event listener
    if (field.options) {
      // so don't add the input event listener
      if (shouldListen && eventName !== "input") {
        node.addEventListener(
          eventName,
          (ev) => {
            validationCb(field);
          },
          false
        );
      }
    }
    // Else, we can assume it will use the input event listener
    // * This may be changed in the future
    else {
      // and don't add the change event listener
      if (shouldListen && eventName !== "change") {
        node.addEventListener(
          eventName,
          (ev) => {
            validationCb(field);
          },
          false
        );
      }
    }
  });
}

export function _attachOnClearErrorEvents(
  node: HTMLElement,
  field: FieldConfig,
  clear_errors_on_events: OnEvents,
  clearValidationCb?: Function
): void {
  Object.entries(clear_errors_on_events).forEach(
    ([eventName, shouldListen]) => {
      // If the OnEvent is true, then add the event listener
      if (shouldListen) {
        node.addEventListener(eventName, (ev) => {
          field.errors.set(null);
        });
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

export function _linkFieldErrors(
  errors: ValidationError[],
  field: FieldConfig
): void {
  const error = errors.filter((e) => e.property === field.name);
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

//#region Form State
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

//#endregion

//#region - Styling

/**
 * Using this.field_order, rearrange the order of the fields.
 */
// export function createOrder(): void {
//   let newLayout = [];
//   let leftovers = [];
//   // Loop over the order...
//   this.field_order.forEach((name) => {
//     const field = _get(name, this.fields);
//     // If the field.name and the order name match...
//     if (
//       field.name === name ||
//       (field.group && field.group.name === name) ||
//       (field.step && `${field.step.index}` === name)
//     ) {
//       // Then push it to the fields array
//       newLayout.push(field);
//     } else if (
//       leftovers.indexOf(field) === -1 &&
//       this.field_order.indexOf(field.name) === -1
//     ) {
//       // Field is not in the order, so push it to bottom of order.
//       leftovers.push(field);
//     }
//   });
//   this.fields = [...newLayout, ...leftovers];
// }

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

//#endregion
