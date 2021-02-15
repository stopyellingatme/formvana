import { User } from "../../types/user/User";

/**
 * Basic functions
 */
export function set(data, key) {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
}

export function get(key) {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  var item = localStorage.getItem(key);

  if (!item) {
    return;
  }

  return JSON.parse(item);
}

export function remove(key) {
  if (!window.localStorage || !window.JSON || !key) {
    return;
  }
  localStorage.removeItem(key);
}

/**
 * Special Functions
 */
interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  user: any;
}

export function setAuthData(user: User) {
  if (!window.localStorage || !window.JSON) {
    return;
  }
//   localStorage.setItem("auth_data", JSON.stringify(resp));
  localStorage.setItem("auth_user", JSON.stringify(user));
  localStorage.setItem("authenticated", "true");
}

export function checkSupabaseAuthToken() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  const sat = localStorage.getItem("supabase.auth.token") ? true : false;
  return sat;
}

export function getAuthData() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  let result = null;
//   const ad = localStorage.getItem("auth_data");
  const au = localStorage.getItem("auth_user");
  const authed = localStorage.getItem("authenticated") ? true : false;
  const sat = localStorage.getItem("supabase.auth.token");

  if (au && authed && sat) {
    result = {
      auth_user: JSON.parse(au),
      authenticatd: authed,
      sat: JSON.parse(sat),
    };
  }

  return result;
}

export function setAuth(authenticated, auth_user) {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  localStorage.setItem("authenticated", JSON.stringify(authenticated));
  localStorage.setItem("auth_user", JSON.stringify(auth_user));
//   localStorage.setItem(
//     "auth_data",
//     localStorage.getItem("supabase.auth.token")
//   );
}

export function removeAuth() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  localStorage.removeItem("authenticated");
  localStorage.removeItem("auth_user");
  localStorage.removeItem("supabase.auth.token");
//   localStorage.removeItem("auth_data");
}

export function getEmailConfirm() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  let result = localStorage.getItem("email_confirm");
  return result;
}

export function setEmailConfirm() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  localStorage.setItem("email_confirm", "true");
}

export function removeEmailConfirm() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  localStorage.removeItem("email_confirm");
  localStorage.setItem("first_login", "true");
}

export function isFirstLogin() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  const result = localStorage.getItem("first_login");
  return result;
}

export function removeFirstLogin() {
  if (!window.localStorage || !window.JSON) {
    return;
  }
  localStorage.removeItem("first_login");
}
