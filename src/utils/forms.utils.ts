import { writable } from "svelte/store";
import { get as sget } from 'svelte/store';

export const passwordRegex = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;


export const setStore = (store, item) => {
  store.update((s) => {
    s = item;
    return s;
  });
};

export const addError = (errors, error) => {
  errors.update((s) => {
    s.push(error);
    return s;
  });
};

export const removeError = (errors, error) => {
  errors.update((s) => {
    s.splice(error, 1);
    return s;
  });
};

export const clearValues = (value) => {
  value.update((s) => {
    s = null;
    return s;
  });
};

export const clearAllValues = (...values) => {
  values.forEach(value => {
    value.update((s) => {
      s = null;
      return s;
    });
  });
};









const _fields = (configs, createEntry) => {
  const config = {};
  let len = configs.length, i = 0;
  for (; len > i; ++i) {
    const item = configs[i];
    const [errors, value, input] = createEntry(item);
    config[item.name] = {
      errors,
      value,
      input
    };
  }
  return config;
};

// const clearValues = () => {
//   const store = sget(form).fields;
//   let vals = [];
//   Object.entries(store).forEach(([key, val]) => {
//     vals.push(store[key].value);
//   });
//   clearAll(...vals);
// };

const formValid = () => {
  const fields = sget(form).fields;
  let errors = 0;
  let valid = false;
  let vals = [];
  Object.entries(fields).forEach(([key, val]) => {
    //@ts-ignore
    errors = errors + sget(fields[key].errors).length;

    if (sget(fields[key].value)) {
      vals.push(sget(fields[key].value));
    }
  });

  if (errors === 0 && vals.length === 4) {
    valid = true;
  } else {
    valid = false;
  }
  return valid;
};

/**
 * * STATE STUFF!
 */
function init() {
  let state = {
    "fields": null
  };
  const { subscribe, set, update } = writable(state);

  return {
    subscribe,
    set,
    setFields: (fields) => update((s) => setFields(s, fields)),
  };
}

const setFields = (state, fields) => {
  state.fields = fields;
  return state;
};

const form = init();