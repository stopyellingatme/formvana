import {
    FieldConfig, Form, FormFieldSchema, OnEvents,
    ReferenceData,
    ValidationError
} from "@formvana";
import {
    array, number, object, string, StructError, validate
} from "superstruct";
import { get, Writable, writable } from "svelte/store";

const refs: ReferenceData = {
  tags: [
    { label: "News", value: "news" },
    { label: "Features", value: "features" },
  ],
  parts: [
    { label: "RTX 3090", value: 0 },
    { label: "Ryzen Threadripper", value: 1 },
    { label: "A House", value: 2 },
    { label: "Wood!", value: 3 },
  ],
  food: [
    { label: "Burger", value: 0 },
    { label: "Hotdog", value: 1 },
    { label: "Beef Pho", value: 2 },
    { label: "Steamed Buns", value: 3 },
    { label: "Spring Rolls", value: 4 },
    { label: "Parm Eggs & Bacon", value: 5 },
  ],
  author_ids: [
    { label: "First", value: 1 },
    { label: "Second", value: 2 },
    { label: "Third", value: 3 },
  ],
};

/**
 * All of the following is what's needed to configure a formvana instance
 * without using classes while using a different validator.
 */
const field_configs: FormFieldSchema = {
  id: {
    selector: "input",
    data_type: "number",
    label: "ID",
    required: false,
    group: "personal",
    value: writable(0),
    attributes: { type: "number" },
  },
  title: {
    selector: "input",
    data_type: "string",
    label: "Title",
    required: false,
    value: writable(undefined),
  },
  description: {
    selector: "input",
    data_type: "string",
    label: "Description",
    required: false,
    group: "personal",
    value: writable(undefined),
    exclude_events: ["change"],
  },
  tags: {
    selector: "checkboxes",
    data_type: "array",
    label: "Tags:",
    required: false,
    ref_key: "tags",
    group: "personal",
    hint: "Select one or more tags",
    value: writable(["news"]),
    exclude_events: ["input", "focus", "blur"],
    attributes: { legend: "Field Group" },
  },
  taggers: {
    selector: "checkboxes",
    data_type: "array",
    label: "Stuff I want:",
    required: false,
    ref_key: "parts",
    hint: "These are hard to aquire in 2021!",
    value: writable([]),
    exclude_events: ["input", "focus", "blur"],
  },
  foods: {
    selector: "checkbox",
    data_type: "array",
    label: "Fooooood:",
    required: false,
    ref_key: "food",
    hint: "Whatcha gonna eat?",
    value: writable(null),
    exclude_events: ["input", "focus", "blur"],
  },
  author: {
    selector: "radio",
    data_type: "number",
    label: "Author Ids:",
    hint: "It was part of the superstruct example.",
    required: true,
    ref_key: "author_ids",
    value: writable(1),
    exclude_events: ["input", "focus", "blur"],
  },
  order: {
    selector: "radio",
    data_type: "number",
    label: "Ordering",
    hint: "Pick some orders.",
    required: false,
    ref_key: "author_ids",
    value: writable(2),
    exclude_events: ["input", "focus", "blur"],
  },
  profile_image: {
    selector: "file",
    data_type: "file",
    label: "Profile Image",
    required: false,
    value: writable(undefined),
    attributes: { id: "profile_image" },
    exclude_events: ["focus", "blur"],
  },
};

/**
 * Use the field_configs to build the data model object.
 * Object will look like this:
 *  {
 *    [field_property]: field_value,
 *    [field_property]: field_value,
 *    etc.
 *   }
 */
const data_model = Object.assign(
  {},
  ...Object.keys(field_configs).map((k) => ({
    [k]: get(field_configs[k].value),
  }))
);

const superstruct_validation_options = object({
  id: number(),
  title: string(),
  description: string(),
  tags: array(string()),
  taggers: array(string()),
  foods: array(number()),
  author: object({
    id: number(),
  }),
  order: number(),
  profile_image: object(),
});

export { superstruct_validation_options, data_model, field_configs, refs };
