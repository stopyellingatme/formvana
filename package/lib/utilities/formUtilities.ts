import { get } from "svelte/store";
import { ValidationError } from "../core/Types";
import { FieldConfig } from "../core/FieldConfig";

/**
 * ---------------------------------------------------------------------------
 *
 * *** General Form Utilities ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */

/** Get the form field by name */
function _get<T extends Object>(
  name: keyof T,
  fields: FieldConfig<T>[]
): FieldConfig<T> {
  return fields.filter((f) => f.name === name)[0];
}

/**
 * Set any attributes on the given fields.
 */
function _setFieldAttributes<T extends Object>(
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
function _setFieldAttribute<T extends Object>(
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

export { _get, _setFieldAttributes, _setFieldAttribute };
