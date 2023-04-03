import {
  IS_VISIBLE_CATEGORY_FORM,
  SET_ID_CATEGORY_FORM,
  SET_ID_GROUP_PERMISSION_FORM,
  SET_ID_PRODUCT_FORM,
  SET_VARIANT,
} from "./constants";

export const setIdCategoryForm = (payload: any) => ({
  type: SET_ID_CATEGORY_FORM,
  payload,
});
export const changeVisibleFormCategory = (payload: any) => ({
  type: IS_VISIBLE_CATEGORY_FORM,
  payload,
});
export const setIdGroupPermissionForm = (payload: any) => ({
  type: SET_ID_GROUP_PERMISSION_FORM,
  payload,
});
export const setIdProductForm = (payload: any) => ({
  type: SET_ID_PRODUCT_FORM,
  payload,
});
export const setVariant = (payload: any) => ({
  type: SET_VARIANT,
  payload,
});
