import type { User } from "lucia";
import { getContext, setContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const USER_KEY = "USER_CTX";
const userState = writable<User | null>();

export function getUser() {
  return getContext<Writable<User | null>>(USER_KEY);
}

export function setUser(data: User | null) {
  userState.set(data);
  setContext(USER_KEY, userState);
  return userState;
}
