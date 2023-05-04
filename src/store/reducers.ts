import { boolean, number } from "yup";
import {
  IS_EDIT_ACCOUNT_FORM,
  IS_EDIT_CATEGORY_FORM,
  IS_EDIT_CUSTOMER_FORM,
  IS_EDIT_PRODDUCT_FORM,
  IS_EDIT_PROMOTION_FORM,
  IS_EDIT_STORE_FORM,
  IS_VISIBLE_ACCOUNT_FORM,
  IS_VISIBLE_CATEGORY_FORM,
  IS_VISIBLE_CUSTOMER_FORM,
  IS_VISIBLE_ORDER_FORM,
  IS_VISIBLE_PRODUCT_FORM,
  IS_VISIBLE_PROMOTION_FORM,
  IS_VISIBLE_STORE_FORM,
  SET_ID_ACCOUNT,
  SET_ID_CATEGORY_FORM,
  SET_ID_CUSTOMER,
  SET_ID_GROUP_PERMISSION_FORM,
  SET_ID_ORDER,
  SET_ID_PRODUCT_FORM,
  SET_ID_PROMOTION,
  SET_ID_STORE,
  SET_VARIANT,
} from "./constants";
export interface StateGlobal {
  isVisibleFormCategory: boolean;
  isVisibleFormOrder: boolean;
  isVisibleFormProduct: boolean;
  isVisibleFormCustomer: boolean;
  isVisibleFormAccount: boolean;
  isVisibleFormPromotion: boolean;
  isVisibleFormStore: boolean;
  isEditFormCategory: boolean;
  isEditFormProduct: boolean;
  isEditFormPromotion: boolean;
  isEditFormAccount: boolean;
  isEditFormCustomer: boolean;
  isEditFormStore: boolean;
  idCategory: number;
  idProduct: number;
  idOrder: number;
  idCustomer: number;
  idAccount: number;
  idPromotion: number;
  idStore: number;
  idGroupPermission: number;
  variant: {};
  category: {};
}
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
export function reducer(state: any, action: any) {
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
    case IS_EDIT_PRODDUCT_FORM:
      return {
        ...state,
        isEditFormProduct: action.payload,
      };
    case IS_EDIT_ACCOUNT_FORM:
      return {
        ...state,
        isEditFormAccount: action.payload,
      };
    case IS_EDIT_CUSTOMER_FORM:
      return {
        ...state,
        isEditFormCustomer: action.payload,
      };
    case IS_EDIT_PROMOTION_FORM:
      return {
        ...state,
        isEditFormPromotion: action.payload,
      };
    case IS_EDIT_STORE_FORM:
      return {
        ...state,
        isEditStorePromotion: action.payload,
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
    case IS_VISIBLE_STORE_FORM:
      return {
        ...state,
        isVisibleFormStore: action.payload,
      };
    case IS_VISIBLE_PRODUCT_FORM:
      return {
        ...state,
        isVisibleFormProduct: action.payload,
      };
    case IS_VISIBLE_PROMOTION_FORM:
      return {
        ...state,
        isVisibleFormPromotion: action.payload,
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
    case SET_ID_PROMOTION:
      return {
        ...state,
        idPromotion: action.payload,
      };
    case SET_ID_STORE:
      return {
        ...state,
        idStore: action.payload,
      };
    case SET_VARIANT:
      return {
        ...state,
        variant: action.payload,
      };
  }
}
