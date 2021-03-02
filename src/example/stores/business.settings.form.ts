import { get as sget, writable } from "svelte/store";
import { Business } from "../types/Business";
import { Form, OnEvents } from "../../../package/typescript";
import { refs } from "./ref.data.store";

function initStore() {
  // Just gonna set up the form real quick...
  let form = new Form({
    model: new Business(),
    layout: ["description", "status", "email", "name"],
    classes: [
      "shadow sm:rounded-md",
      "px-4 py-6 bg-white sm:p-6",
      "grid grid-cols-4 gap-6 mt-6",
    ],
    validate_on_events: new OnEvents(true, { focus: false }),
    refs: sget(refs),
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
  console.log(sget(formState));

  // formState.setLoading(true);
  // const model = sget(formState).model;
  // updateBusniess(model).then((model) => {
  //     formState.updateState({model: model})
  //     formState.setLoading(false);
  // });
};
