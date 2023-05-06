import { createContext } from "react";
import { initialState } from "./initialState";
import { StateGlobal } from "./reducers";

export interface Store {
  state: StateGlobal;
  dispatch?: any;
}
const Context = createContext<Store>({ state: initialState });
export default Context;
