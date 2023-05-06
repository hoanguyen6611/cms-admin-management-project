import React,{ useContext } from "react";
import Context from "./Context";


export const useStoreContext = () => {
  return useContext(Context);
};
