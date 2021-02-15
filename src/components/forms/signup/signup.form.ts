import createValidation from "svelidation";
import { push } from "svelte-spa-router";
import { addError, removeError, passwordRegex, clearAllValues } from "../../../utils/forms.utils";
import { supa } from "../../../stores/supa.store";
import { create, update } from "../../../stores/users.store";
import { User } from "../../../../types/user/User";
import { auth } from "../../../stores/auth.store";

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
  [passwordConfirmErrors, passwordConfirmValue, passwordConfirmInput],
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
    type: "string",
    required: true,
  },
  {
    type: "boolean",
    required: false,
  },
]);

export const clearValues = () => {
  clearAllValues(emailValue, passwordValue, passwordConfirmValue, checkboxValue);
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

export const checkPasswordMatch = (pw1: string, pw2: string, errors) => {
  const idx = errors.indexOf("password_confirm");
  if (pw2 !== pw1 && idx === -1) {
    addError(passwordConfirmErrors, "password_confirm");
  } else if (pw2 !== pw1) {
    // The password_confirm error is already there. Passwords still don't match
    removeError(passwordConfirmErrors, "password_confirm");
  }
};

export const onSubmit = (ev) => {
  const values: string[] = Array.from(getValues().values());

  // TODO: Add password validation at this level as well for "real" secutiry
  if (values && values[0] && values[1]) {
    const email = values[0],
      password = values[1];

    auth.signUp(email, password);
  }
};
