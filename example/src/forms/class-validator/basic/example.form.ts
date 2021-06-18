import { get, Writable, writable } from "svelte/store";
import {
  Form,
  OnEvents,
  RefData,
  ValidationCallback,
  ValidationError,
  ValidationOptions,
} from "@formvana";
import { ExampleModel } from "../../../models/BigForm";
import { ValidatorOptions } from "class-validator";
import DefaultTemplate from "../../../templates/Default.template.svelte";
import { validator } from "../validator";

const ref_data: RefData = {
  statuses: [
    { label: "ACTIVE", value: 0 },
    { label: "PENDING", value: 1 },
    { label: "SUSPENDED", value: 2 },
    { label: "ARCHIVED", value: 3 },
  ],
};

const class_validator_options: ValidatorOptions = {
  skipMissingProperties: false,
  dismissDefaultMessages: false,
  validationError: {
    target: false,
    value: false,
  },
  forbidUnknownValues: true,
  stopAtFirstError: true,
};

function initStore() {
  // Initialize the form(vana) object
  let form = new Form(
    new ExampleModel(),
    {
      validator: validator,
      /** (Optional) Tweak for better perf, if needed. */
      options: class_validator_options,
      error_display: {
        dom: { type: "ul", error_classes: ["text-red-600", "text-sm"] },
      },
      // error_display: "constraint"
    },
    /** Partial Form Model Properties */
    {
      on_events: new OnEvents({ focus: false }),
      template: DefaultTemplate,
      refs: ref_data,
      hidden_fields: ["description_3"],
      disabled_fields: ["email_72", "email_8"],
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
export const form_state: Writable<Form<ExampleModel>> = initStore();

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
      //   // {
      //   //   callback: () => {
      //   //     console.log(get(form_state));
      //   //   },
      //   //   when: "after",
      //   // },
      //   {
      //     callback: () => {
      //       get(form_state).setValue("name_100", "some value jfkdsalfjdsk");
      //       get(form_state).setValue("status_97", 1);
      //     },
      //     when: "before",
      //   },
      // ];
      get(form_state).validate();
    }, 500);

    // setTimeout(() => {
    //   get(form_state).updateInitialState();
    // }, 1100);

    // get(form_state).value_changes.subscribe((val) => {
    //   console.log("CHANGE: ", val);
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
