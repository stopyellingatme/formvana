import {
  Callback, FieldConfig, Form, OnEvents, ValidationCallback
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

/**
 * I wanted a way to handle field groups in an effective but lightweight
 * manner. I believe this achieves that goal.
 *
 *
 */
function _hanldeFieldGroups<T extends Object>(
  fields: Array<FieldConfig<T>>
): Array<FieldConfig<T> | Array<FieldConfig<T>>> {
  if (fields && fields.length > 0) {
    /**
     * Use a blank object to store/map field groups.
     */
    let field_groups: Record<string, any> = {};
    /** This sets up the return type to be easily itterable. */
    const getSortedFields = () => {
      /** Array for storing the field config or array of field configs */
      const new_fields: Array<FieldConfig<T> | Array<FieldConfig<T>>> = [];
      Object.keys(field_groups).forEach((key) => {
        new_fields.push(field_groups[key]);
      });
      /** Return our crazy array structure. */
      return new_fields;
    };

    /** is the field.group in the field_groups map already? */
    const isGroupInFieldGroups = (group_name: string): boolean => {
      if (Array.isArray(field_groups[group_name])) return true;
      /** If we made it here, there was no match */
      return false;
    };

    for (let i = 0; fields.length > i; ++i) {
      const field = fields[i];
      /** Is the field part of a group? */
      if (field.group) {
        if (Array.isArray(field.group)) {
          field.group.forEach((name) => {
            /**
             * Have we already created a group (in our object above)
             * for the field.group?
             */
            const isInGroupResult = isGroupInFieldGroups(name);
            if (isInGroupResult) {
              field_groups[name].push(field);
            } else {
              /**
               * If not, we add key for the field.gorup and initialize
               * it with an array of the field.
               * We use the array so we can add more fields later when we
               * find more fields with the same group name.
               */
              field_groups[name] = [field];
            }
          });
        } else if (typeof field.group === "string") {
          /**
           * Have we already created a group (in our object above)
           * for the field.group?
           */
          const isInGroupResult = isGroupInFieldGroups(field.group);
          if (isInGroupResult) {
            field_groups[field.group].push(field);
          } else {
            /**
             * If not, we add key for the field.gorup and initialize
             * it with an array of the field.
             * We use the array so we can add more fields later when we
             * find more fields with the same group name.
             */
            field_groups[field.group] = [field];
          }
        }
      } else {
        /**
         * If the field does not have a group then we use this identifier
         * to ensure all fields stay in order after this manipulation.
         */
        field_groups[`field_${i}`] = field;
      }
    }

    const _fields = getSortedFields();
    return _fields;
  } else {
    return fields;
  }
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

export {
  _buildFormFields,
  _buildFormFieldsWithSchema,
  _attachEventListeners,
  _addCallbackToField,
  _hanldeFieldGroups,
};

