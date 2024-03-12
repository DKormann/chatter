import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";
import { get } from "svelte/store";
import type { message } from "./api";

function create_writable<T>(key: string, value: T): Writable<T> {

  if (!browser) {
    return writable(value);
  }
  if (localStorage.getItem(key)) {    
    value = JSON.parse(localStorage.getItem(key)!);
  }
  const { subscribe, set, update } = writable(value);
  return {
    subscribe,
    set: (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      return set(value);
    },
    update,
  };
}

export const groq_key = create_writable<string>("api_key", "");
export const mistral_key = create_writable<string>("mistral_key", "");

export type account = {
  prompt: string,
  start_message: string,
  name: string, 
  history: message[]
}

export const accounts = create_writable<account[]>("accounts", [{
  name: "Default",
  prompt: "You are Assistant the helpful AI",
  start_message: "I'm Assistant how can I help you?",
  history: [{role: "assistant", content: "I'm Assistant how can I help you?"}]
}])

export const active_account = create_writable<number>("active_account", 0);


export const myaccount = writable<account>(get(accounts)[get(active_account)])

console.log(get(myaccount));



myaccount.subscribe((value) => {
  console.log("myaccount changed");
  
  accounts.set(
    get(accounts).map((account,i) => {
      if (i == get(active_account)) {
        return value
      }
      return account
    })
  )
})

active_account.subscribe((value) => {
  let mynew = get(accounts)[value]
  if (JSON.stringify(mynew) != JSON.stringify(get(myaccount))) {
    myaccount.set(mynew);
  }
})

accounts.subscribe((value) => {
  let mynew = value[get(active_account)]
  if (JSON.stringify(mynew) != JSON.stringify(get(myaccount))) {
    myaccount.set(mynew);
  }
})

export const liked_voices=create_writable<number[]>("liked_voices",[])
