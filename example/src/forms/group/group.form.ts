import { get, Writable, writable } from "svelte/store";
import {
  Form,
  FormGroup,
  OnEvents,
  RefData,
  ValidationCallback,
} from "@formvana";
import { ExampleModel } from "../../models/ExampleClass2";
import { ExampleModel as ExampleModel3 } from "../../models/ExampleClass3";
import { validate, ValidationError } from "class-validator";
//@ts-ignore
import ExampleTemplate from "../../templates/ExampleTemplate.svelte";

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
      template: ExampleTemplate,
      refs: ref_data,
      hidden_fields: ["description_3"],
      disabled_fields: ["email_2", "email_8"],
    }
  );

  let form_2 = new Form(
    new ExampleModel3(),
    { validator: validate, on_events: new OnEvents({ focus: false }) },
    {
      template: ExampleTemplate,
      refs: ref_data,
      hidden_fields: ["email_4"],
      disabled_fields: ["description_3"],
    }
  );

  let form_group = new FormGroup([form_1, form_2]);

  // And add it to the store...
  const { subscribe, update } = writable(form_group);

  return {
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
export const formState = initStore();

/**
 * Used to initialize the form on first load.
 */
export const init = () => {
  get(formState).loading.set(true);

  setTimeout(() => {
    get(formState).loading.set(false);
  }, 1000);

  setTimeout(() => {
    const callbacks: ValidationCallback[] = [
      {
        callback: () => {
          console.log("Weeehoo!");
        },
        when: "after",
      },
      {
        callback: () => {
          get(formState)
            .forms[0].get("name_10")
            .value.set("some value jfkdsalfjdsk");
          get(formState).validateAll();
        },
        when: "before",
      },
    ];
    get(formState).validateAll(callbacks);
    // get(formState).forms[0].valid.set(true);
    // get(formState).forms[1].valid.set(true);
  }, 2000);

  // setTimeout(() => {
  // console.log(get(formState));
  // }, 3000);

  // get(formState).all_value_changes.subscribe((val) => {
  //   console.log("CHANGE: ", val);
  // });

  // get(formState).all_valid.subscribe((val) => {
  //   console.log("ALL VALID: ", val);
  // });

  get(formState).all_pristine.subscribe((val) => {
    console.log("ALL PRISTINE: ", val);
  });

  get(formState).all_changed.subscribe((val) => {
    console.log("ALL CHANGED: ", val);
  });
};

export const onSubmit = (ev) => {
  console.log("SUBMIT: ", ev);
  console.log(get(formState));
};
