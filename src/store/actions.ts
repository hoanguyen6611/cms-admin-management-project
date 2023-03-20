import {
  IS_VISIBLE_CATEGORY_FORM,
  SET_ID_CATEGORY_FORM,
  SET_ID_GROUP_PERMISSION_FORM,
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
