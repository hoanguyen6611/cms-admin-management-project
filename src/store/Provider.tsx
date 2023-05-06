import { useState, useReducer } from "react";
import Context from "./Context";
import { reducer } from "./reducers";
import { initialState } from "./initialState";
export const Providers = (props: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};
