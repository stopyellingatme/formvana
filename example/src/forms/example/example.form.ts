import { get } from "svelte/store";
import { Form, OnEvents, RefDataItem } from "@formvana";
import { ExampleModel } from "../../models/ExampleClass";
//@ts-ignore
import ExampleTemplate from "../../templates/ExampleTemplate.svelte";

const ref_data: Record<string, RefDataItem[]> = {
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
  let form = new Form(new ExampleModel(), {
    template: ExampleTemplate,
    on_events: new OnEvents({ focus: false }),
    refs: ref_data,
    hidden_fields: ["description_99", "status_97"],
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
    // get(formState).valid.set(true);
    // get(formState).validate();
  }, 1000);

  // setTimeout(() => {
    // get(formState).updateInitialState();
  // }, 3000);

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
