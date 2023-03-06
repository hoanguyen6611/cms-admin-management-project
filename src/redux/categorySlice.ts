import { Category } from "@/models/category";
import { createSlice } from "@reduxjs/toolkit";

export interface categoryState {
  isVisibleFormCategory: boolean;
  isEdit: boolean;
  category: Category[];
  id?: number;
  categorySelected?: Category;
}

const initialState: categoryState = {
  isVisibleFormCategory: false,
  isEdit: false,
  category: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    updateIsVisibleFormCategory: (state, action) => {
      state.isVisibleFormCategory = action.payload;
    },
    isEditCategoryForm: (state, action) => {
      state.isEdit = action.payload;
    },
    setCategoryId: (state, action) => {
      state.id = action.payload;
    },
    setCategorySelected:(state, action) => {
      state.categorySelected = action.payload;
    }
  },
});
export default categorySlice.reducer;
export const { updateIsVisibleFormCategory, isEditCategoryForm, setCategoryId, setCategorySelected } =
  categorySlice.actions;
