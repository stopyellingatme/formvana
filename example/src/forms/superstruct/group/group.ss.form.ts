import {
    Form,
    FormGroup,
    OnEvents,
    ReferenceData,
    ValidationCallback,
    ValidationError,
    ValidationProperties
} from "@formvana";
import { get, Writable, writable } from "svelte/store";
import GroupTemplate from "../../../templates/Group.template.svelte";
import { doValidation } from "../validationFormatter";
import {
    data_model, field_configs, refs, superstruct_validation_options
} from "./group.ss.model";


const options: Partial<ValidationProperties<Object>> = {
  validator: doValidation,
  options: superstruct_validation_options,
  error_display: {
    dom: { type: "ul", error_classes: ["text-red-600", "text-sm"] },
  },
};

function initStore() {
  // Set up the form(vana) class
  let form_1 = new Form(data_model, options, {
    field_schema: field_configs,
    template: GroupTemplate,
    refs: refs,
  });

  let form_2 = new Form(data_model, options, {
    field_schema: field_configs,
    template: GroupTemplate,
    refs: refs,
  });

  let form_group = new FormGroup([form_1, form_2]);

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
export const form_state: Writable<FormGroup> = initStore();

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

    initialized = true;
  }
};

export const onSubmit = (ev) => {
  console.log("SUBMIT: ", ev);
  console.log(get(form_state));
};
