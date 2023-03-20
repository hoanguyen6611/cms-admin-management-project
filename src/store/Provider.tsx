import { useState, useReducer } from "react";
import Context from "./Context";
import { initialState, reducer } from "./reducers";
export const Providers = (props: any) => {
  const [state, dispatch]= useReducer(reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>
      {props.children}
    </Context.Provider>
  );
};
