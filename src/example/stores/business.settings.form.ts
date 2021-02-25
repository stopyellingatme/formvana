import { get as sget, writable } from "svelte/store";
import { Business } from "../types/Business";
import { Form } from "../../../package/Form";
import { refs } from "./ref.data.store";

function initStore() {
  // Just gonna set up the form real quick...
  let form = new Form({
    model: new Business(),
  });
  form.validate_on_events.focus = false;
  form.attachRefData(sget(refs));

  const layout = ["description", "status", "email", "name"];
  form.setLayout(layout);

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
  // const layout = ["description", "status", "email", "name"];
  // formState.updateState({ layout: layout });

  setTimeout(() => {
    // const newState = sget(formState).buildStoredLayout(sget(formState));
    // console.log(newState);
    // formState.updateState({ ...newState });

    formState.setLoading(false);
  }, 1000);

  // Update form with data fetched from DB
  // getBusiness(SOME_STATE.BUSINESS_ID).then((data) => {
  //   Get current form state
  //     const form = sget(formState);
  //     form.model = new Business(data);
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
