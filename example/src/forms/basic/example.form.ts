import { get, Writable, writable } from "svelte/store";
import { Form, OnEvents, RefData, ValidationCallback } from "@formvana";
import { ExampleModel } from "../../models/ExampleClass";
import { validate, ValidationError } from "class-validator";
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

async function vali(model: any, options: any): Promise<ValidationError[]> {
  return [];
}

function initStore() {
  // Set up the form(vana) class
  let form = new Form(
    new ExampleModel(),
    { validator: validate, on_events: new OnEvents({ focus: false }) },
    {
      template: ExampleTemplate,
      refs: ref_data,
      hidden_fields: ["description_3"],
      disabled_fields: ["email_2", "email_8"],
    }
  );

  // And add it to the store...
  const { subscribe, update } = writable(form);

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

let initialized = false;
/**
 * Used to initialize the form on first load.
 */
export const init = () => {
  if (!initialized) {
    get(formState).loading.set(true);

    setTimeout(() => {
      get(formState).loading.set(false);
    }, 1000);

    // setTimeout(() => {
    //   const callbacks: ValidationCallback[] = [
    //     {
    //       callback: () => {
    //         // console.log("Weeehoo!");
    //       },
    //       when: "after",
    //     },
    //     {
    //       callback: () => {
    //         // console.log(get(formState));
    //         get(formState).get("name_10").value.set("some value jfkdsalfjdsk");
    //         get(formState).validate();
    //       },
    //       when: "before",
    //     },
    //   ];
    //   get(formState).validate(callbacks);
    // }, 2000);

    // setTimeout(() => {
    //   get(formState).updateInitialState();
    // }, 3000);

    get(formState).value_changes.subscribe((val) => {
      console.log("CHANGE: ", val);
    });

    /**
   * Update form with backend data
   * 
        getDBO(SOME_STATE.ITEM_ID).then((data) => {
        const form = get(formState).loadData(new ExampleModel(data));
      
        OR
      
        const form = get(formState).loadData(data, false);

        formState.updateState({ form: form });
      });
   */

    initialized = true;
  }
};

export const onSubmit = (ev) => {
  console.log("SUBMIT: ", ev);
  console.log(get(formState));

  // formState.setLoading(true);

  // updateDBO(get(formState).model).then((model) => {
  //     get(formState).loadData(model, false);
  //     formState.updateState({model: new ExampleModel(model)})
  //     formState.setLoading(false);
  // });
};
