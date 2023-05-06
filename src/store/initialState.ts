import { StateGlobal } from "./reducers";

export const initialState: StateGlobal = {
    isVisibleFormCategory: false,
    isVisibleFormOrder: false,
    isVisibleFormProduct: false,
    isVisibleFormCustomer: false,
    isVisibleFormAccount: false,
    isVisibleFormPromotion: false,
    isVisibleFormStore: false,
    isEditFormCategory: false,
    isEditFormProduct: false,
    isEditFormPromotion: false,
    isEditFormAccount: false,
    isEditFormCustomer: false,
    isEditFormStore: false,
    idCategory: 0,
    idProduct: 0,
    idOrder: 0,
    idCustomer: 0,
    idAccount: 0,
    idPromotion: 0,
    idStore: 0,
    idGroupPermission: 0,
    variant: {},
    category: {},
  };