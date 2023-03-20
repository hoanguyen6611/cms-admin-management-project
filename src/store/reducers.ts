import { IS_VISIBLE_CATEGORY_FORM, SET_ID_CATEGORY_FORM, SET_ID_GROUP_PERMISSION_FORM } from "./constants";

export const initialState: any = {
  isVisibleFormCategory: false,
  isEditFormCategory: false,
  idCategory: 0,
  idGroupPermission: 0
};
export function reducer(state: any, action: any) {
  switch (action.type) {
    case IS_VISIBLE_CATEGORY_FORM:
      return {
        ...state,
        isVisibleFormCategory: action.payload,
      };
    case SET_ID_CATEGORY_FORM:
      return {
        ...state,
        idCategory: action.payload,
      };
    case SET_ID_GROUP_PERMISSION_FORM:
      return {
        ...state,
        idGroupPermission: action.payload,
      };
  }
}
