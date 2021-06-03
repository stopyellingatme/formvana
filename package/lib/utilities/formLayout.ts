import { FieldConfig } from "../core";
import { _get } from "./formUtilities";

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

export { _setFieldOrder };
