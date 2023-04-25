import { createContext } from "react";
import { StateGlobal } from "./reducers";

const initialState = {
    isVisibleFormCategory: false,
    isVisibleFormOrder: false,
    isVisibleFormCustomer: false,
    isVisibleFormAccount: false,
    isEditFormCategory: false,
    idCategory: 0,
    idProduct: 0,
    idOrder: 0,
    idCustomer: 0,
    idAccount: 0,
    idGroupPermission: 0,
    variant: {},
    category: {},
  };
const Context = createContext<any>(initialState);
export default Context;
