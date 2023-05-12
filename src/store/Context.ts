import { createContext } from "react";
import { StateGlobal, initialState } from "./initialState";

export interface Store {
  state: StateGlobal;
  dispatch?: any;
}
const Context = createContext<Store>({ state: initialState });
export default Context;
