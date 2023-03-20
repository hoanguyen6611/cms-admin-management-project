import { Category } from "@/models/category";
import { createSlice } from "@reduxjs/toolkit";

const initialCategory: Category = {
  name: "",
  note: "",
};
export interface categoryState {
  isVisibleFormCategory: boolean;
  isEdit: boolean;
  categorys: Category[];
  id?: number | undefined;
  category?: Category;
  user?: any;
}

const initialState: categoryState = {
  isVisibleFormCategory: false,
  isEdit: false,
  categorys: [],
  category: initialCategory,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    updateIsVisibleFormCategory: (state, action) => ({
      ...state,
      isVisibleFormCategory: action.payload,
    }),
    isEditCategoryForm: (state, action) => ({
      ...state,
      isEdit: action.payload,
    }),
    setCategoryId: (state, action) => ({
      ...state,
      id: action.payload,
    }),
    setCategorySelectedBy: (state, action) => ({
      ...state,
      category: action.payload,
    }),
    setUserLogin: (state, action) => ({
      ...state,
      user: action.payload,
    }),
  },
});
export default categorySlice.reducer;
export const {
  updateIsVisibleFormCategory,
  isEditCategoryForm,
  setCategoryId,
  setCategorySelectedBy,
  setUserLogin,
} = categorySlice.actions;
