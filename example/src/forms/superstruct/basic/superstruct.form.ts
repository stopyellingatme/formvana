import { get, Writable, writable } from "svelte/store";
import {
  Form,
  OnEvents,
  RefData,
  ValidationCallback,
  ValidationError,
  FieldConfig,
} from "@formvana";
import { ExampleModel } from "../../../models/ExampleClass";
import {
  validate,
  object,
  number,
  string,
  array,
  StructError,
} from "superstruct";
import ExampleTemplate from "../../../templates/ExampleTemplate.svelte";

/**
 * All of the following is what's needed to configure a formvana instance
 * without using classes while using a different validator.
 */
const field_configs: Record<string, Partial<FieldConfig<Object>>> = {
  id: {
    selector: "input",
    type: "number",
    label: "ID",
    required: true,
    value: writable(null),
    classes: "col-span-4 sm:col-span-2",
  },
  title: {
    selector: "input",
    type: "text",
    label: "Title",
    required: true,
    value: writable(null),
    classes: "col-span-4 sm:col-span-2",
  },
  tags: {
    selector: "checkboxes",
    type: "checkbox",
    label: "Tags",
    required: true,
    value: writable(["news", "features"]),
    classes: "col-span-4 sm:col-span-2",
  },
  author: {
    selector: "list",
    type: "object",
    label: "author",
    required: true,
    value: writable({ id: 1 }),
    classes: "col-span-4 sm:col-span-2",
  },
};

const Article = object({
  id: number(),
  title: string(),
  tags: array(string()),
  author: object({
    id: number(),
  }),
});

const data = Object.assign(
  {},
  ...Object.keys(field_configs).map((k) => ({
    [k]: get(field_configs[k].value),
  }))
);

/**
 * ! TESTING TO SEE IF THIS WORKS!
 *
 * This was a test to see if it's possible/easy to coop the ValidationError
 * in order to conform other validator's error types into the proper shape.
 *
 * It seems to have been successful, albeit a little more complex than I'd like.
 */
const doValidation = async (model, struct): Promise<ValidationError[]> => {
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
            /** Add the validaiton error with the given field key and errors */
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
    data,
    {
      validator: doValidation,
      on_events: new OnEvents({ focus: false }),
      options: Article,
      field_schema: field_configs,
    },
    /** Partial Form Model Properties */
    {
      template: ExampleTemplate,
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
export const form_state: Writable<Form<typeof data>> = initStore();

let initialized = false;
/**
 * Used to initialize the form on first load.
 */
export const init = () => {
  if (!initialized) {
    // get(form_state).loading.set(true);

    // setTimeout(() => {
    //   get(form_state).loading.set(false);
    // }, 1000);

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
      get(form_state).validate();
    }, 2000);

    // setTimeout(() => {
    //   get(form_state).updateInitialState();
    // }, 3000);

    // get(form_state).value_changes.subscribe((val) => {
    //   console.log("CHANGE: ", val);
    //   console.log(get(form_state));
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
