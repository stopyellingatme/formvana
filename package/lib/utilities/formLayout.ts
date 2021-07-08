import { FieldConfig } from "../core";
import { _get } from "./formUtilities";

/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Layout ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */

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

/**
 * Using this.field_order, rearrange the order of the fields.
 */
function _setFieldOrder<T extends Object>(
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

export { _hanldeFieldGroups, _setFieldOrder };

