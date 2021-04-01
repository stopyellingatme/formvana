import { get } from "svelte/store";
import { Form, OnEvents } from "@formvana";
import { ExampleModel } from "../../models/TestClass";
//@ts-ignore
import ExampleTemplate from "../../templates/ExampleTemplate.svelte";

const ref_data = {
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
  let form = new Form({
    model: new ExampleModel(),
    field_order: ["description", "status", "email", "name"],
    template: ExampleTemplate,
    validate_on_events: new OnEvents(true, { focus: false }),
    refs: ref_data,
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
  //   get(formState).updateInitialState();
  // }, 3000);

  // Update form with data fetched from DB
  // getBusiness(SOME_STATE.BUSINESS_ID).then((data) => {
  //   Get current form state
  //   const form = get(formState).loadData(new Business(data));
  //   formState.updateState({ form: form });
  // });
};

export const onSubmit = (ev) => {
  console.log("SUBMIT: ", ev);
  console.log(get(formState));

  // formState.setLoading(true);
  // const model = sget(formState).model;
  // updateBusniess(model).then((model) => {
  //     formState.updateState({model: model})
  //     formState.setLoading(false);
  // });
};