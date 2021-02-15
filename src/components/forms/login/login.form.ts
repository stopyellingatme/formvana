import createValidation from "svelidation";
import { writable } from "svelte/store";
import { addError, removeError, passwordRegex, clearAllValues } from "../../../utils/forms.utils";
import { supa } from "../../../stores/supa.store";
import { create, update } from "../../../stores/users.store";
import { auth } from "../../../stores/auth.store";

function initStore() {
  const { subscribe, set, update } = writable({
    loading: false,
  });

  return {
    subscribe,
    set,
    setLoading: (loading) => update((s) => setLoading(s, loading)),
  };
}

export const setLoading = (state, loading) => {
  state.loading = loading;
  return state;
};

export const formState = initStore();

export const { createForm, createEntries, getValues, clearErrors } = createValidation({
  validateOnEvents: { change: false, input: true, blur: true },
  clearErrorsOnEvents: { reset: false, focus: true },
  listenInputEvents: 1,
  presence: "required",
  trim: true,
  includeAllEntries: false,
  useCustomErrorsStore: false,
  warningsEnabled: true,
  getValues: true,
});

export const [
  [emailErrors, emailValue, emailInput],
  [passwordErrors, passwordValue, passwordInput],
  [checkboxErrors, checkboxValue, checkboxInput],
] = createEntries([
  {
    type: "email",
    required: true,
  },
  {
    type: "string",
    required: true,
  },
  {
    type: "boolean",
    required: false,
  },
]);

export const clearValues = () => {
  clearAllValues(emailValue, passwordValue, checkboxValue);
};

export const passwordValid = (ev) =>
  ev.detail ? passwordRegex.test(ev.detail) : passwordRegex.test(ev);

export const validatePassword = (ev, errors) => {
  const idx = errors.indexOf("password_pattern");
  if (!passwordValid(ev) && idx === -1) {
    addError(passwordErrors, "password_pattern");
  } else if (passwordValid(ev)) {
    removeError(passwordErrors, "password_pattern");
  }
};

export const onSubmit = (ev) => {
  formState.setLoading(true);
  const values: string[] = Array.from(getValues().values());
  // console.log(values);
  // console.log(getValues());

  if (values && values[0] && values[1]) {
    const email = values[0],
      password = values[1];

    setTimeout(() => {
      auth.login(email, password);
      formState.setLoading(false);
    }, 250);

    // supa.auth
    //   .signIn({
    //     email,
    //     password,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     if (res.user && !res.error) {
    //       update(res.user);
    //     }
    //   });
  }
};
