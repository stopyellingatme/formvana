import {
  Form,
  FormGroup,
  OnEvents,
  ReferenceData,
  ValidationCallback,
  ValidationError
} from "@formvana";
import { validate, ValidationError as VError } from "class-validator";
import { get, Writable, writable } from "svelte/store";
import { ExampleModel as GroupForm1 } from "../../../models/GroupForm1";
import { ExampleModel as GroupForm2 } from "../../../models/GroupForm2";
import GroupTemplate from "../../../templates/Group.template.svelte";


const ref_data: ReferenceData = {
  statuses: [
    { label: "ACTIVE", value: 0 },
    { label: "PENDING", value: 1 },
    { label: "SUSPENDED", value: 2 },
    { label: "ARCHIVED", value: 3 },
  ],
};

const validator = (model, options) => {
  return validate(model, options).then((errors: VError[]) => {
    return errors.map((error) => {
      return new ValidationError(error.property, error.constraints);
    });
  });
};

function initStore() {
  // Set up the form(vana) class
  let form_1 = new Form(
    new GroupForm1(),
    { validator: validator },
    {
      on_events: new OnEvents({ focus: false }),
      template: GroupTemplate,
      refs: ref_data,
      // hidden_fields: ["description_3"],
      disabled_fields: ["email_2", "email_4"],
    }
  );

  let form_2 = new Form(
    new GroupForm2(),
    { validator: validator },
    {
      on_events: new OnEvents({ focus: false }),
      template: GroupTemplate,
      refs: ref_data,
      hidden_fields: ["email_4"],
      disabled_fields: ["description_3"],
    }
  );

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
