import { get } from "svelte/store";
import { _get } from "./formUtilities";
import { FieldConfig } from "../core/FieldConfig";
import {
  ElementEvent,
  FieldNode,
  ValidationError,
  ValidationOptions,
} from "../core/Types";
const max_int = Number.MAX_SAFE_INTEGER;
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
  field: FieldConfig<T>,
  error_display: ValidationOptions["error_display"],
  form_node: HTMLFormElement
): void {
  const error = errors.filter((e) => e["field_key"] === field.name);
  /** Check if there's an error for the field */
  if (error && error.length > 0) {
    field.errors.set(error[0]);
    field.node?.setAttribute("aria-invalid", "true");
    _handleErrorDisplay(field, error[0], error_display, form_node);
  } else {
    /**  Very important! Don't change! */
    field.errors.set(undefined);
    field.node?.removeAttribute("aria-invalid");
    _handleErrorDisplay(field, undefined, error_display, form_node);
  }
}

function _handleErrorDisplay<T extends Object>(
  field: FieldConfig<T>,
  error: ValidationError | undefined,
  error_display: ValidationOptions["error_display"],
  form_node: HTMLFormElement
): void {
  if (error_display === "constraint") {
    /** Constraint implementation goes here */
    if (error && error.errors) {
      console.log(field.name, error.errors);

      const message: Record<string, string> = error.errors;
      Object.keys(message).forEach((key) => {
        field.node?.setCustomValidity(`${key}: ${message[key]}`);
        // field.node?.reportValidity();
      });
      // form_node.reportValidity();
    } else {
      field.node?.setCustomValidity("");
    }
    field.node?.reportValidity();
  } else if (error_display === "custom") {
    return;
  } else if (typeof error_display === "object") {
    /** If there is only one error message */
    _handleDomErrorDisplay(field, error, error_display, form_node);
  }
}

/**
 * This one is pretty harry.
 * There is a lot going on in this function but almost everything is commented.
 * I'm sure there's room for improvement down there somewhere.
 */
function _handleDomErrorDisplay<T extends Object>(
  field: FieldConfig<T>,
  error: ValidationError | undefined,
  error_display: ValidationOptions["error_display"],
  form_node: HTMLFormElement
) {
  if (typeof error_display === "object") {
    if (error_display.dom.type === "single") {
      if (error && error.errors) {
        const _message: Record<string, string> = error.errors,
          message = Object.keys(error.errors)
            .map((key) => _message[key])
            .join("");
        const node = field.node?.parentElement?.querySelector("span");

        if (node && field.node?.parentElement?.contains(node)) {
          node.textContent = message;
        } else {
          /** Create the span element to append text */
          const span = document.createElement("span");
          span.setAttribute("aria-live", "polite");
          /** Add a text node and append the message. */
          const text_node = document.createTextNode(message);
          span.appendChild(text_node);
          /** Add any extra classes for styling */
          error_display.dom.wrapper_class &&
            field.node?.classList.add(...error_display.dom.wrapper_class);
          /** Add the span to the field's node - which the field.name is attached */
          field.node?.parentElement?.appendChild(span);
        }
      } else {
        const node = field.node?.parentElement?.querySelector("span");
        if (node && field.node?.parentElement?.contains(node)) {
          field.node?.parentElement?.removeChild(node);
        }
      }
    } else if (
      error_display.dom.type === "ol" ||
      error_display.dom.type === "ul"
    ) {
      const error_element_id = `___error-list-item-for-${field.name}`;

      if (error && error.errors) {
        const _message: Record<string, string> = error.errors,
          messages = Object.keys(_message).map((key) => _message[key]);

        /** Have we already created an error node element for the given field? */
        const error_node = form_node.querySelector(`#${error_element_id}`);
        /** If so, we only update the list items */
        if (error_node) {
          /**
           * @TODO clean up this implementation to only update the elments
           * that are already created.
           */
          /** Remove all list item elements from list parent */
          const children = error_node.querySelectorAll("li");
          children.forEach((child) => {
            error_node?.removeChild(child);
          });
          /** Loop over error messages */
          for (let i = 0; messages.length > i; ++i) {
            const message = messages[i],
              message_element = document.createElement("li"),
              text_node = document.createTextNode(message);

            message_element.appendChild(text_node);
            error_display.dom.error_class &&
              message_element.classList.add(...error_display.dom?.error_class);

            error_node.appendChild(message_element);
          }
        } else {
          /** Set up blank variable to hold the error node element */
          const node = _getErrorNode(field, form_node);

          /** Add new error element and add errors to list */
          const list_element = document.createElement(error_display.dom.type);
          /** If there are classes for the error list wrapper, apply them */
          error_display.dom.wrapper_class &&
            list_element.classList.add(...error_display.dom.wrapper_class);
          /** Add an id to the element so we can grab it later */
          list_element.id = error_element_id;
          /** Loop over error messages. */
          for (const message of messages) {
            /** Create a list item to add the error message into */
            const message_element = document.createElement("li"),
              /** Create a text node with the error message */
              text_node = document.createTextNode(message);
            /** Append text node to the new list item element */
            message_element.appendChild(text_node);
            /** Apply any classes being passed in through config */
            error_display.dom.error_class &&
              message_element.classList.add(...error_display.dom?.error_class);
            /** Add the new list item to the parent list element */
            list_element.appendChild(message_element);
          }
          /** Append the list element to the error_node element */
          node?.appendChild(list_element);
        }
      } else {
        /** No field errors! */
        /** Get the error node from the field */
        const node = _getErrorNode(field, form_node),
          error_node = form_node.querySelector(`#${error_element_id}`);
        if (node && error_node && node.contains(error_node)) {
          node.removeChild(error_node);
        }
      }
    } else {
      return;
    }
  }
}

function _getErrorNode<T extends Object>(
  field: FieldConfig<T>,
  form_node: HTMLFormElement
) {
  let node: FieldNode<T> | Element | undefined | null;
  /** Check if there are data-error-for datasets attached to any elements */
  form_node.querySelectorAll("[data-error-for]").forEach((el) => {
    /** If so, check if the errorFor value is for the current field */
    /** @ts-ignore */
    if (el.dataset && el.dataset["errorFor"] === field.name) node = el;
  });
  /** If no node is found, just pin to the field's parent element. */
  if (!node) node = field.node?.parentElement;
  return node;
}
/**
 * Link all Validation Errors on Form.errors to each field via the
 * field_error_link_name.
 *
 * @Hotpath
 */
function _linkAllErrors<T extends Object>(
  errors: ValidationError[],
  fields: FieldConfig<T>[],
  error_display: ValidationOptions["error_display"],
  form_node: HTMLFormElement
): void {
  errors.forEach((err) => {
    if (Array.isArray(err)) {
      err = err[0];
      if (err["field_key"]) {
        const field = _get(err["field_key" as keyof ValidationError], fields);
        field.errors.set(err);
        _handleErrorDisplay(field, err, error_display, form_node);
      }
    } else {
      if (err["field_key"]) {
        const field = _get(err["field_key" as keyof ValidationError], fields);
        field.errors.set(err);
        _handleErrorDisplay(field, err, error_display, form_node);
      }
    }
  });
  const fields_with_errors = errors.map((e) => e.field_key);
  fields.forEach((field) => {
    if (!errors || !fields_with_errors.includes(field.name as string)) {
      field.errors.set(undefined);
      field.node?.removeAttribute("aria-invalid");
      _handleErrorDisplay(field, undefined, error_display, form_node);
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
      switch (field.data_type) {
        case "string" || "text":
          return event.target.value;
        case "number":
          return _parseNumberOrValue(event.target.value);
        case "boolean":
          return Boolean(event.target.value);
        case "array":
          return _parseArray(event, field);
        case "file" || "files":
          return _parseFileInput(event, field);
        /**
         * @TODO Add handler for file input type
         */
      }
    } else return undefined;

    /** If none of the above conditions apply, just retrun the value */
    return event.target.value;
  } else return undefined;
}

function _parseFileInput<T extends Object>(
  event: ElementEvent,
  field: FieldConfig<T>
) {
  console.log(event);
  
}

function _parseArray<T extends Object>(
  event: ElementEvent,
  field: FieldConfig<T>
) {
  let vals = get(field.value) ? [...get(field.value)] : [];
  /**
   * If the target is checked and the target value isn't in the field.value
   * then add the target value to the field value.
   */
  if (vals.indexOf(event.target.value) === -1) {
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
function _parseNumberOrValue(value: any): Number | any | undefined {
  if (
    value === "" ||
    value === undefined ||
    value === null ||
    typeof value === "undefined" ||
    /**
     * This is needed when a null or undefined value is attached
     * to a select option value.
     */
    value === "undefined" ||
    value === "null"
  )
    return undefined;
  if (isNaN(+value) || +value >= max_int || +value <= -max_int) return value;
  else return +value;
}

/**
 * Tried to implement this in a nice way, but there are too many gotcha's.
 * Plus, JS likes to return event target values as string.
 * So even if the dev set the input.value to the object, it would come in
 * through the event target value as "[object Object]" anyways.
 */
// function _parseObject<T extends Object>(
//   event: ElementEvent,
//   field: FieldConfig<T>
// ) {
//   console.log("PARSE OBJECT: ", event.target.value);

//   if (
//     typeof event.target.value === "string" &&
//     event.target.value === "[object Object]"
//   )
//     return event.target.value;

//   let vals: Record<string, any> = JSON.parse(get(field.value));
//   const value: Record<string, any> = JSON.parse(event.target.value);

//   let key: keyof typeof value;
//   for (key in value) {
//     if (!vals[key] || vals[key] === 0) {
//       vals[key] = value[key];
//     } else {
//       delete vals[key];
//     }
//   }
//   /** Return the array of values */
//   return JSON.stringify(vals);
// }

export {
  _linkAllErrors,
  _linkFieldErrors,
  _linkValueFromEvent,
  _linkAllValues,
};
