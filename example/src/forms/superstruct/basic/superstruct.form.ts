import { get, Writable, writable } from "svelte/store";
import {
  Form,
  OnEvents,
  RefData,
  ValidationError,
  FieldConfig,
  FormFieldSchema,
} from "@formvana";
import {
  validate,
  object,
  number,
  string,
  array,
  StructError,
} from "superstruct";
import DefaultTemplate from "../../../templates/Default.template.svelte";

const refs: RefData = {
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
    value: writable(undefined),
    exclude_events: ["change"],
  },
  tags: {
    selector: "checkboxes",
    data_type: "array",
    label: "Tags:",
    required: false,
    ref_key: "tags",
    hint: "Select one or more tags",
    value: writable(["news"]),
    exclude_events: ["input", "focus", "blur"],
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
    value: writable(2),
    attributes: { id: "profile_image" },
    exclude_events: ["focus", "blur"],
  },
};

const validation_options = object({
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
  // image:
});

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

/**
 * ! TESTING TO SEE IF THIS WORKS! -- IT WORKS! :)
 *
 * This was a test to see if it's possible/easy to coop the ValidationError
 * in order to conform other validator's error types into the proper shape.
 *
 * It seems to have been successful, albeit a little more complex than I'd like.
 */
const doValidation = async (model, struct): Promise<ValidationError[]> => {
  /**
   * This is for parsing really huge number values
   * Otherwise if the value is above Number.MAX_SAFE_INTEGER, we return the
   * value as string. Seems sensible to me.
   */
  model.id = parseInt(model.id);

  /**
   * This pattern enables support for validating "object" objects
   * in superstruct. As formvana (javascript and the dom) does not support
   * using an input.value = { some_object }.
   * Event.target.value will return "[object Object]" unless stringified
   * first.
   * Which means you are using the string field.data_type, right?
   */
  const author_id = JSON.parse(JSON.stringify(model.author));
  if (typeof model.author === "object") {
    model.author["id"] = model.author.id;
  } else {
    model.author = { id: author_id };
  }

  /** Validate the struct */
  /** Flatten the array so it's not [[ValidationError], [ValidationError]] */
  return [].concat(
    [],
    ...validate(model, struct)
      .map((error: StructError) => {
        if (!error) return;

        /** Map the failures into ValidationErrors */
        let errors;
        if (error.failures instanceof Function) {
          errors = error.failures().map((fail) => {
            /** Get/Format the validation contraints */
            const constraints = Object.assign(
              {},
              ...error
                .failures()
                .filter((failure) => failure.key === fail.key)
                .map((err) => ({ [err.type]: err.message }))
            );
            /** Return the validaiton error with the given field key and errors */
            return new ValidationError(fail.key, constraints);
          });
        }
        return errors;
      })
      .filter((e) => e)
  );
};

function initStore() {
  // Set up the form(vana) object
  let form = new Form(
    data_model,
    {
      validator: doValidation,
      options: validation_options,
      error_display: {
        dom: { type: "ul", error_class: ["text-red-600", "text-sm"] },
      },
    },
    /** Partial Form Model Properties */
    {
      template: DefaultTemplate,
      field_schema: field_configs,
      on_events: new OnEvents({ focus: false }),
      refs: refs,
      // disabled_fields: ["title"],
    }
  );

  // And add it to the store...
  const { subscribe, update, set } = writable(form);

  return {
    set,
    update,
    subscribe,
  };
}

/**
 * Export the Form State
 */
export const form_state: Writable<Form<typeof data_model>> = initStore();

let initialized = false;
/**
 * Used to initialize the form on first load.
 */
export const init = () => {
  if (!initialized) {
    setTimeout(() => {
      // const callbacks: ValidationCallback[] = [
      //   {
      //     callback: () => {
      //       console.log(get(form_state));
      //     },
      //     when: "after",
      //   },
      //   {
      //     callback: () => {
      //       get(form_state).get("title").value.set("some value jfkdsalfjdsk");
      //       get(form_state).validate();
      //     },
      //     when: "before",
      //   },
      // ];
      // get(form_state).validate(callbacks);
      // get(form_state).validate();
    }, 2000);

    // setTimeout(() => {
    //   get(form_state).updateInitialState();
    // }, 3000);

    // get(form_state).value_changes.subscribe((val) => {
    // console.log("CHANGE: ", val);
    //   console.log("CHANGE: ", get(form_state).model);
    // });

    /**
   * Update form with backend data
   * 
        getDBO(SOME_STATE.ITEM_ID).then((data) => {
        const form = get(form_state).loadData(new ExampleModel(data));
      
        OR
      
        const form = get(form_state).loadData(data, false);

        form_state.updateState({ form: form });
      });
   */

    initialized = true;
  }
};

export const onSubmit = (ev) => {
  console.log("SUBMIT: ", ev);
  console.log(get(form_state));

  // form_state.setLoading(true);

  // updateDBO(get(form_state).model).then((model) => {
  //     get(form_state).loadData(model, false);
  //     form_state.updateState({model: new ExampleModel(model)})
  //     form_state.setLoading(false);
  // });
};
