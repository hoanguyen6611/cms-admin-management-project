import { Product } from "@/models/product";
import { createSlice } from "@reduxjs/toolkit";

export interface productState {
  isVisibleFormProduct: boolean;
  isEdit: boolean;
  product: Product[];
}

const initialState: productState = {
  isVisibleFormProduct: false,
  isEdit: false,
  product: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateVisibleFormProduct: (state, action) => {
      state.isVisibleFormProduct = action.payload;
    },
    isEditProductForm: (state, action) => {
      state.isEdit = action.payload;
    },
  },
});
export default productSlice.reducer;
export const { updateVisibleFormProduct, isEditProductForm } = productSlice.actions;
