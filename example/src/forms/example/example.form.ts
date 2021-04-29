import { get } from "svelte/store";
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

function initStore() {
  // Just gonna set up the form real quick...
  let form = new Form(new ExampleModel(), validate, {
    template: ExampleTemplate,
    on_events: new OnEvents({ focus: false }),
    refs: ref_data,
    hidden_fields: ["description_99", "status_97"],
    // perf_options: {
    //   link_all_values_on_event: "all",
    //   enable_change_detection: true,
    // },
  });

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
 * * External functionlaity below
 *    || || || || || || || ||
 *    \/ \/ \/ \/ \/ \/ \/ \/
 */

export const formState = initStore();

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
