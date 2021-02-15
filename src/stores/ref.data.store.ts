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
      key: "ACTIVE",
      value: "ACTIVE",
    },
    {
      key: "DISABLED",
      value: "DISABLED",
    },
  ],
  user_roles: [
    {
      key: "ADMINISTRATOR",
      value: "ADMINISTRATOR",
    },
    {
      key: "OWNER",
      value: "OWNER",
    },
    {
      key: "MANAGER",
      value: "MANAGER",
    },
    {
      key: "CLERK",
      value: "CLERK",
    },
    {
      key: "MEMBER",
      value: "MEMBER",
    },
    {
      key: "VIP",
      value: "VIP",
    },
  ],
  business_statuses: [
    {
      key: "ACTIVE",
      value: "ACTIVE",
    },
    {
      key: "PANDING",
      value: "PANDING",
    },
    {
      key: "SUSPENDED",
      value: "SUSPENDED",
    },
    {
      key: "ARCHIVED",
      value: "ARCHIVED",
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
