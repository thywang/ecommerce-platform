import { LoginUser } from "../pages/Login";

/* User session */
export function getUser() {
  const user = sessionStorage.getItem("user");
  if (user === "undefined" || !user) {
    return null;
  } else {
    return JSON.parse(user);
  }
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function setUserSession(user: LoginUser, token: string) {
  sessionStorage.setItem("user", JSON.stringify(user));
  sessionStorage.setItem("token", token);
}

export function resetUserSession() {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
}

/* Checkout session ID */
export function getCheckoutSessionID() {
  return sessionStorage.getItem("session_id");
}

export function setCheckoutSessionID(session_id: string) {
  sessionStorage.setItem("session_id", session_id);
}

export function resetCheckoutSessionID() {
  sessionStorage.removeItem("session_id");
}
