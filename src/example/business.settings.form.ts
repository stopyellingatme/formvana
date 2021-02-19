import { get as sget, writable } from "svelte/store";
import { Business } from "./Business";
import { Form } from "../lib/Form";
import { refs } from "./ref.data.store";

function initStore() {
  // Just gonna set up the form real quick...
  let form = new Form({
    model: new Business(),
  });
  form.validate_on_events.focus = false;
  form.buildFields();
  form.attachRefData(sget(refs));

  // And add it to the store...
  const { subscribe, set, update } = writable({
    ...form,
  });

  return {
    subscribe,
    set,
    updateState: (updates) => update((s) => updateState(s, updates)),
    setLoading: (loading) => update((s) => setLoading(s, loading)),
  };
}
export const updateState = (state, updates) => {
  Object.assign(state, updates);
  return state;
};

export const setLoading = (state, loading) => {
  state.loading = loading;
  return state;
};

export const formState = initStore();

export const init = () => {
  formState.setLoading(true);

  setTimeout(() => {
    formState.setLoading(false);
  }, 1000);

  // Update form with data fetched from DB
  // getBusiness(SOME_STATE.BUSINESS_ID).then((data) => {
  //  Get current form state
  //     const form = sget(formState);
  //     const biz = new Business(data);
  //     form.model = biz;
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
