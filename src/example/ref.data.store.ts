import { writable } from "svelte/store";

/**
 * Reference data can be accessed by (example):
 * ref_data["user_status"]
 * Returns array of {key, value}
 *
 * ref_data is an object (map-ish-thing) of
 * <string, array<key, value>>
 */
export const data = {
  user_statuses: [
    {
      label: "ACTIVE",
      value: "ACTIVE",
    },
    {
      label: "DISABLED",
      value: "DISABLED",
    },
  ],
  business_statuses: [
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

function init() {
  const { subscribe, set, update } = writable(data);

  return {
    subscribe,
    set,
    setItems: (items) => update((s) => setItems(s, items)),
  };
}

export const setItems = (state, items) => {
  state = items;
  return state;
};

export const insert = (state, name: string, items: any[]) => {
  state[name] = items;
  return state;
};

export const refs = init();
