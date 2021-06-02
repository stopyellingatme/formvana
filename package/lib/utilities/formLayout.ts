// #region Styling

import { FieldConfig } from "..";
import { _get } from "./formSetup";

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
