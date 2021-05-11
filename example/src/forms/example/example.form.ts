import { get, Writable } from "svelte/store";
import { Form, OnEvents, RefData, ValidationCallback } from "@formvana";
import { ExampleModel } from "../../models/ExampleClass";
import { validate } from "class-validator";
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

async function vali(model: any, options: any) {
  return [];
}

function initStore() {
  // Set up the form(vana) class
  let form = new Form(
    new ExampleModel(),
    { validator: validate },
    {
      template: ExampleTemplate,
      on_events: new OnEvents({ focus: false }),
      refs: ref_data,
      hidden_fields: ["description_99", "status_97"],
      disabled_fields: ["email_96", "email_94"],
    }
  );

  // And add it to the store...
  const { subscribe, update } = form.storify();

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
          get(formState).get("name_100").value.set("some value jfkdsalfjdsk");
          get(formState).validate();
        },
        when: "before",
      },
    ];
    get(formState).validate(callbacks);
  }, 2000);

  setTimeout(() => {
    get(formState).updateInitialState();

    console.log(get(formState));
  }, 3000);

  // get(formState).value_changes.subscribe((val) => {
  //   console.log("CHANGE: ", val);
  // });

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
