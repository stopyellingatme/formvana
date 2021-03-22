import { get, writable } from "svelte/store";
// import { Business } from "./Business";
import { Business } from "./TestClass";
import { Form, OnEvents } from "../../package/lib/typescript";
import { refs } from "./ref.data.store";
//@ts-ignore
import SettingsTemplate from "./SettingsTemplate.svelte";

function initStore() {
  // Just gonna set up the form real quick...
  let form = new Form({
    model: new Business(),
    field_order: ["description", "status", "email", "name"],
    template: SettingsTemplate,
    validate_on_events: new OnEvents(true, { focus: false }),
    refs: get(refs),
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