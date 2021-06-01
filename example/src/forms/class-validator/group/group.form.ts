import { get, Writable, writable } from "svelte/store";
import {
  Form,
  FormGroup,
  OnEvents,
  RefData,
  ValidationCallback,
} from "@formvana";
import { ExampleModel } from "../../../models/ExampleClass2";
import { ExampleModel as ExampleModel3 } from "../../../models/ExampleClass3";
import { validate } from "class-validator";
//@ts-ignore
import GroupTemplate from "../../../templates/GroupTemplate.svelte";

const ref_data: RefData = {
  statuses: [
    {
      label: "ACTIVE",
      value: 0,
    },
    {
      label: "PENDING",
      value: 1,
    },
    {
      label: "SUSPENDED",
      value: 2,
    },
    {
      label: "ARCHIVED",
      value: 3,
    },
  ],
};

function initStore() {
  // Set up the form(vana) class
  let form_1 = new Form(
    new ExampleModel(),
    { validator: validate, on_events: new OnEvents({ focus: false }) },
    {
      template: GroupTemplate,
      refs: ref_data,
      hidden_fields: ["description_3", "name_10"],
      disabled_fields: ["email_2", "email_4"],
    }
  );

  let form_2 = new Form(
    new ExampleModel3(),
    { validator: validate, on_events: new OnEvents({ focus: false }) },
    {
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
