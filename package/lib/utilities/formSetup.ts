import {
  Callback,
  ElementEvent,
  FieldConfig,
  Form,
  OnEvents,
  ValidationCallback
} from "../core";
import { _executeValidationEvent } from "./formValidation";

/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Setup ***
 *
 * Will write later. Files deleted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */

/**
 * Build the field configs from this.model using metadata-reflection.
 * Grab the editableProperties from the @field decorator.
 */
function _buildFormFields<T extends Object>(
  model: T,
  for_form?: string,
  props: string[] = Reflect.getMetadata("editableProperties", model)
): FieldConfig<T>[] {
  /** Map the @field fields to the form.fields */
  let fields = props.map((prop: string) => {
    /** Get the @FieldConfig using metadata reflection */
    const field: FieldConfig<T> = new FieldConfig<T>(prop as keyof T, {
      ...Reflect.getMetadata("fieldConfig", model, prop),
      value: model[prop as keyof T],
    });

    /** We made it. Return the field config and let's generate some inputs! */
    return field;
  });

  if (for_form) {
    /** Filter fields used in a specific form */
    fields = fields.filter(
      (f) => f.for_form === undefined || for_form === f.for_form
    );
  }

  return fields;
}

function _buildFormFieldsWithSchema<T extends Object>(
  props: Record<string, Partial<FieldConfig<T>>>,
  for_form?: string
): FieldConfig<T>[] {
  let k: keyof Record<string, Partial<FieldConfig<Object>>>,
    fields = [];
  for (k in props) {
    const field: FieldConfig<T> = new FieldConfig<T>(k as keyof T, {
      ...props[k],
    });
    fields.push(field);
  }

  if (for_form) {
    /** Filter fields used in a specific form */
    fields = fields.filter(
      (f) => f.for_form === undefined || for_form === f.for_form
    );
  }

  return fields;
}

// #region HTML Event Helpers

/**
 * Attach the OnEvents events to each form.field.
 * Each field with a corresponding model.name will have event listeners
 * attached.
 * Children fields of the form, where useForm has been attached, will have
 * event listeners attached.
 */
function _attachEventListeners<T extends Object>(
  field: FieldConfig<T>,
  on_events: OnEvents<HTMLElementEventMap>,
  callback: Callback
): void {
  Object.entries(on_events).forEach(([event_name, should_listen]) => {
    const filterListenerOnSelectElement = () => {
      if (field.node?.nodeName === "SELECT" && event_name !== "input") {
        field.addEventListener(
          event_name as keyof HTMLElementEventMap,
          callback
        );
      } else {
        field.addEventListener(
          event_name as keyof HTMLElementEventMap,
          callback
        );
      }
    };
    /** If should_listen === true, then add the event listener */
    if (should_listen) {
      /**
       * If should_listen === true... and...
       * If field.exclude_events DOES NOT contain the event name
       * THEN add the event listener to the field.
       */
      if (
        !field.exclude_events?.includes(
          event_name as keyof OnEvents<HTMLElementEventMap>
        )
      )
        filterListenerOnSelectElement();
    }

    /**
     * If the field.include_events includes the event_name
     * then add that event listener to the field.
     * Does NOT matter if should_listen is true || false.
     */
    if (
      field.include_events?.includes(
        event_name as keyof OnEvents<HTMLElementEventMap>
      )
    )
      filterListenerOnSelectElement();
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

/**
 * @deprecated
 * 
 * This is going to be a full on Form method I think.
 *
 * 1. use passive (only validate on form submission)
 *  until form is submitted.
 *  - Must detect if form has been submited.
 *
 * 2. If form is invalid, use aggressive until field is valid.
 *  - This is the hardest part.
 *
 * 3. When all valid, go back to passive validation.
 */
// function _handleEagerValidationSetup<T extends Object>(
//   form: Form<T>,
//   form_node: HTMLFormElement,
//   required_fields: (keyof T)[]
// ) {
//   /**
//    * Add "submit" event listener so we detect when the user submits the form.
//    *  - This is for the "passive" stage
//    */
//   form_node.addEventListener("submit", (event: Event) => {
//     console.log("Made it here");

//     event.preventDefault();
//     form.validate();
//     /**
//      * If the form is not valid then prevent the default action
//      * and add aggressive event listeners to the invalid fields.
//      *
//      * When the field is valid, remove the aggressive listener.
//      */
//     if (!form.valid) {
//       const invalid_fields = form.fields.filter((f) => !f.valid),
//         first_invalid_field = invalid_fields[0],
//         aggressive_events: Array<keyof HTMLElementEventMap> = [
//           "input",
//           "change",
//           "blur",
//         ];
//       /** Focus on the first field. */
//       if (first_invalid_field) {
//         first_invalid_field.node?.focus();
//       }
//       /** Add aggressive event listeners to the invalid fields. */
//       invalid_fields.forEach((field) => {
//         const callback: Callback = (e: ElementEvent) =>
//           _executeValidationEvent(form, required_fields, field, undefined, e);
//         /**
//          * Now we have to detect when the field is valid and remove the
//          * aggressive event listeners
//          */
//         const aggressiveListenerCallback = () => {
//           /**
//            * If the field is valid, remove the aggressive event listeners as well as
//            * the aggressiveListenerCallback itself.
//            */
//           console.log("Validity: ", field.valid);

//           if (field.valid) {
//             console.log("Field is valid");

//             field
//               .removeEventListener(aggressive_events, callback)
//               .removeEventListener(
//                 aggressive_events,
//                 aggressiveListenerCallback
//               );
//           }
//         };
//         field
//           .addEventListener(aggressive_events, callback)
//           .addEventListener(aggressive_events, aggressiveListenerCallback);
//       });
//     }
//   });
// }

export {
  _buildFormFields,
  _buildFormFieldsWithSchema,
  _attachEventListeners,
  _addCallbackToField
};

