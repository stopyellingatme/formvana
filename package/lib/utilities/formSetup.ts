import {
  FieldConfig,
  OnEvents,
  Callback,
  Form,
  ValidationCallback,
} from "../core";
import { _executeValidationEvent } from "./formValidation";

/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Setup ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */

/**
 * Build the field configs from this.model using metadata-reflection.
 * Grab the editableProperties from the @field decorator.
 *
 * @TODO Create method to use plain JSON as model, fields and validation schema
 */
function _buildFormFields<T extends Object>(
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

function _buildFormFieldsWithSchema<T extends Object>(
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

// #region HTML Event Helpers

/**
 * Attach the OnEvents events to each form.field.
 * Parent: form.useField(...)
 */
function _attachEventListeners<T extends Object>(
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

function _addCallbackToField<T extends Object>(
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

export {
  _buildFormFields,
  _buildFormFieldsWithSchema,
  _attachEventListeners,
  _addCallbackToField,
};
