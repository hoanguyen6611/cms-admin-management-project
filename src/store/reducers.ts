import {
  IS_EDIT_CATEGORY_FORM,
  IS_VISIBLE_CATEGORY_FORM,
  IS_VISIBLE_ORDER_FORM,
  SET_ID_CATEGORY_FORM,
  SET_ID_GROUP_PERMISSION_FORM,
  SET_ID_ORDER,
  SET_ID_PRODUCT_FORM,
  SET_VARIANT,
} from "./constants";

export const initialState = {
  isVisibleFormCategory: false,
  isVisibleFormOrder: false,
  isEditFormCategory: false,
  idCategory: 0,
  idProduct: 0,
  idOrder: 0,
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
    case SET_ID_ORDER:
      return {
        ...state,
        idOrder: action.payload,
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
