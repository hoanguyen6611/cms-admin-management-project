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
  IS_VISIBLE_GROUP_PERMISSION_FORM,
  IS_VISIBLE_ORDER_FORM,
  IS_VISIBLE_PRODUCT_FORM,
  IS_VISIBLE_PROMOTION_FORM,
  IS_VISIBLE_STORE_FORM,
  SET_CATEGORY,
  SET_ID_ACCOUNT,
  SET_ID_CATEGORY,
  SET_ID_CUSTOMER,
  SET_ID_GROUP_PERMISSION,
  SET_ID_ORDER,
  SET_ID_PRODUCT,
  SET_ID_PROMOTION,
  SET_ID_STORE,
  SET_VARIANT,
} from "./constants";

export function reducer(state: any, action: any) {
  switch (action.type) {
    case IS_VISIBLE_CATEGORY_FORM:
      return {
        ...state,
        isVisibleFormCategory: action.payload,
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
    case IS_VISIBLE_GROUP_PERMISSION_FORM:
      return {
        ...state,
        isVisibleFormGroupPermission: action.payload,
      };
    case SET_ID_CATEGORY:
      return {
        ...state,
        idCategory: action.payload,
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
    case SET_ID_GROUP_PERMISSION:
      return {
        ...state,
        idGroupPermission: action.payload,
      };
    case SET_ID_PRODUCT:
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
    case SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
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
        isEditFormStore: action.payload,
      };
  }
}
