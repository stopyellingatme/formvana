import { writable } from "svelte/store";

function initStore() {
  const { subscribe, set, update } = writable({
    selected_business_id: null,
  });

  return {
    subscribe,
    set,
    updateState: (updates) => update((s) => updateState(s, updates)),
  };
}

export const updateState = (state, updates) => {
  Object.assign(state, updates);
  return state;
};

export const bizState = initStore();
