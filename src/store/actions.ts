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
  IS_VISIBLE_GROUP_PERMISSION_FORM,
  IS_VISIBLE_STORE_FORM,
  SET_ID_ACCOUNT,
  SET_ID_CATEGORY,
  SET_ID_CUSTOMER,
  SET_ID_GROUP_PERMISSION,
  SET_ID_ORDER,
  SET_ID_PRODUCT,
  SET_ID_PROMOTION,
  SET_ID_STORE,
  SET_VARIANT,
  SET_CATEGORY,
  SET_FROM_DATE,
  SET_TO_DATE,
  IS_VISIBLE_IMPORT_PRODUCT_FORM,
  SET_ID_IMPORT_PRODUCT,
} from "./constants";

export const changeVisibleFormCategory = (payload: boolean) => ({
  type: IS_VISIBLE_CATEGORY_FORM,
  payload,
});
export const changeVisibleFormOrder = (payload: boolean) => ({
  type: IS_VISIBLE_ORDER_FORM,
  payload,
});
export const changeVisibleFormProduct = (payload: boolean) => ({
  type: IS_VISIBLE_PRODUCT_FORM,
  payload,
});
export const changeVisibleFormCustomer = (payload: boolean) => ({
  type: IS_VISIBLE_CUSTOMER_FORM,
  payload,
});
export const changeVisibleFormPromotion = (payload: boolean) => ({
  type: IS_VISIBLE_PROMOTION_FORM,
  payload,
});
export const changeVisibleFormAccount = (payload: boolean) => ({
  type: IS_VISIBLE_ACCOUNT_FORM,
  payload,
});
export const changeVisibleFormStore = (payload: boolean) => ({
  type: IS_VISIBLE_STORE_FORM,
  payload,
});
export const changeVisibleFormGroupPermission = (payload: boolean) => ({
  type: IS_VISIBLE_GROUP_PERMISSION_FORM,
  payload,
});
export const changeVisibleFormImportProduct = (payload: boolean) => ({
  type: IS_VISIBLE_IMPORT_PRODUCT_FORM,
  payload,
});
export const changeEditFormCategory = (payload: boolean) => ({
  type: IS_EDIT_CATEGORY_FORM,
  payload,
});
export const changeEditFormPromotion = (payload: boolean) => ({
  type: IS_EDIT_PROMOTION_FORM,
  payload,
});
export const changeEditFormProduct = (payload: boolean) => ({
  type: IS_EDIT_PRODDUCT_FORM,
  payload,
});
export const changeEditFormAccount = (payload: boolean) => ({
  type: IS_EDIT_ACCOUNT_FORM,
  payload,
});
export const changeEditFormStore = (payload: boolean) => ({
  type: IS_EDIT_STORE_FORM,
  payload,
});
export const changeEditFormCustomer = (payload: boolean) => ({
  type: IS_EDIT_CUSTOMER_FORM,
  payload,
});
export const setIdGroupPermissionForm = (payload: number) => ({
  type: SET_ID_GROUP_PERMISSION,
  payload,
});
export const setIdProductForm = (payload: number) => ({
  type: SET_ID_PRODUCT,
  payload,
});
export const setIdOrderForm = (payload: number) => ({
  type: SET_ID_ORDER,
  payload,
});
export const setIdCustomerForm = (payload: number) => ({
  type: SET_ID_CUSTOMER,
  payload,
});
export const setIdAccountForm = (payload: number) => ({
  type: SET_ID_ACCOUNT,
  payload,
});
export const setIdPromotionForm = (payload: number) => ({
  type: SET_ID_PROMOTION,
  payload,
});
export const setIdStoreForm = (payload: number) => ({
  type: SET_ID_STORE,
  payload,
});
export const setIdCategoryForm = (payload: number) => ({
  type: SET_ID_CATEGORY,
  payload,
});
export const setIdImportProductForm = (payload: number) => ({
  type: SET_ID_IMPORT_PRODUCT,
  payload,
});
export const setCategoryList = (payload: any) => ({
  type: SET_CATEGORY,
  payload,
});
export const setFromDate = (payload: any) => ({
  type: SET_FROM_DATE,
  payload,
});
export const setToDate = (payload: any) => ({
  type: SET_TO_DATE,
  payload,
});
