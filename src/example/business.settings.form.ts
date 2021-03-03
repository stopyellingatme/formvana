import { get, writable } from "svelte/store";
import { Business } from "./Business";
import { Form, OnEvents } from "../../package/typescript";
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
    setLoading: (loading) => update((s) => setLoading(s, loading)),
  };
}
const updateState = (state, updates) => {
  Object.assign(state, updates);
  return state;
};

const setLoading = (state, loading) => {
  state.loading = loading;
  return state;
};

/**
 ** External functionlaity below
 *    || || || ||
 *    \/ \/ \/ \/
 */

export const formState = initStore();

export const init = () => {
  formState.setLoading(true);

  setTimeout(() => {
    formState.setLoading(false);
  }, 1000);

  // Update form with data fetched from DB
  // getBusiness(SOME_STATE.BUSINESS_ID).then((data) => {
  //   Get current form state
  //     const form = sget(formState);
  //     form.model = new Business(data);
  //     form.updateInitialState();
  //     form.buildFields();

  //     formState.updateState({ form: form });
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
