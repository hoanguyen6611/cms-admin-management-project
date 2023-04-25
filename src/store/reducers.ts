import { boolean, number } from "yup";
import {
  IS_EDIT_CATEGORY_FORM,
  IS_VISIBLE_ACCOUNT_FORM,
  IS_VISIBLE_CATEGORY_FORM,
  IS_VISIBLE_CUSTOMER_FORM,
  IS_VISIBLE_ORDER_FORM,
  SET_ID_ACCOUNT,
  SET_ID_CATEGORY_FORM,
  SET_ID_CUSTOMER,
  SET_ID_GROUP_PERMISSION_FORM,
  SET_ID_ORDER,
  SET_ID_PRODUCT_FORM,
  SET_VARIANT,
} from "./constants";
export interface StateGlobal {
  isVisibleFormCategory: boolean;
  isVisibleFormOrder: boolean;
  isVisibleFormCustomer: boolean;
  isVisibleFormAccount: boolean;
  isEditFormCategory: boolean;
  idCategory: number;
  idProduct: number;
  idOrder: number;
  idCustomer: number;
  idAccount: number;
  idGroupPermission: number;
  variant: {};
  category: {};
}
export const initialState: StateGlobal = {
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
export function reducer(state:StateGlobal, action: any) {
  switch (action.type) {
    case IS_VISIBLE_CATEGORY_FORM:
      return {
        ...state,
        isVisibleFormCategory: action.payload,
      };
    case IS_EDIT_CATEGORY_FORM:
      return {
        ...state,
        isEditFormCategory: action.payload,
      };
    case SET_ID_CATEGORY_FORM:
      return {
        ...state,
        idCategory: action.payload,
      };
    case IS_VISIBLE_ORDER_FORM:
      return {
        ...state,
        isVisibleFormOrder: action.payload,
      };
    case IS_VISIBLE_CUSTOMER_FORM:
      return {
        ...state,
        isVisibleFormCustomer: action.payload,
      };
    case IS_VISIBLE_ACCOUNT_FORM:
      return {
        ...state,
        isVisibleFormAccount: action.payload,
      };
    case SET_ID_ORDER:
      return {
        ...state,
        idOrder: action.payload,
      };
    case SET_ID_CUSTOMER:
      return {
        ...state,
        idCustomer: action.payload,
      };
    case SET_ID_ACCOUNT:
      return {
        ...state,
        idAccount: action.payload,
      };
    case SET_ID_GROUP_PERMISSION_FORM:
      return {
        ...state,
        idGroupPermission: action.payload,
      };
    case SET_ID_PRODUCT_FORM:
      return {
        ...state,
        idProduct: action.payload,
      };
    case SET_VARIANT:
      return {
        ...state,
        variant: action.payload,
      };
  }
}
