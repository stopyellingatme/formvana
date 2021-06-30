import { Form, FormStepper, OnEvents, ValidationProperties } from "@formvana";
import { get, Writable, writable } from "svelte/store";
import { UserExampleModel } from "../../../models/UserExampleModel";
import StepperTemplate from "../../../templates/Stepper.template.svelte";
import { validator } from "../validator";

const validator_options: Partial<ValidationProperties<UserExampleModel>> = {
  validator: validator,
  error_display: {
    dom: { type: "ol", error_classes: ["text-sm", "text-red-600", "mt-2"] },
  },
};

function initStore() {
  // Set up the form(vana) class
  let login_form = new Form(new UserExampleModel(), validator_options, {
    on_events: new OnEvents({ focus: false }),
    template: StepperTemplate,
    for_form: "login",
  });

  let register_form = new Form(new UserExampleModel(), validator_options, {
    on_events: new OnEvents({ focus: false }),
    template: StepperTemplate,
    for_form: "register",
  });

  let form_group = new FormStepper([login_form, register_form]);

  // And add it to the store...
  const { subscribe, update, set } = writable(form_group);

  return {
    set,
    update,
    subscribe,
    updateState: (updates) => update((s) => updateState(s, updates)),
  };
}

const updateState = (state, updates) => {
  Object.assign(state, updates);
  return state;
};

/**
 * Export the Form State
 */
export const form_state: Writable<FormStepper> = initStore();

let initialized = false;
/**
 * Used to initialize the form on first load.
 */
export const init = () => {
  if (!initialized) {
    get(form_state).loading.set(true);

    setTimeout(() => {
      get(form_state).loading.set(false);
    }, 1000);

    // setTimeout(() => {
    // const callbacks: ValidationCallback[] = [
    //   {
    //     callback: () => {
    //       console.log("Weeehoo!");
    //     },
    //     when: "after",
    //   },
    //   {
    //     callback: () => {
    //       get(form_state)
    //         .forms[0].get("name_10")
    //         .value.set("some value jfkdsalfjdsk");
    //       get(form_state).validateAll();
    //     },
    //     when: "before",
    //   },
    // ];
    // get(form_state).validateAll(callbacks);
    // get(form_state).forms[0].valid.set(true);
    // get(form_state).forms[1].valid.set(true);
    // }, 2000);

    // setTimeout(() => {
    // console.log(get(form_state));
    // }, 3000);

    /** Don't over subscribe to this bad boy */
    // get(form_state).all_value_changes.subscribe((val) => {
    //   console.log("CHANGE: ", val);
    // });

    // get(form_state).all_valid.subscribe((val) => {
    //   console.log("ALL VALID: ", val);
    // });

    // get(form_state).all_pristine.subscribe((val) => {
    //   console.log("ALL PRISTINE: ", val);
    // });

    // get(form_state).all_changed.subscribe((val) => {
    //   console.log("ALL CHANGED: ", val);
    // });

    initialized = true;
  }
};

export const onSubmit = (ev) => {
  console.log("SUBMIT: ", ev);
  console.log(get(form_state));
};
