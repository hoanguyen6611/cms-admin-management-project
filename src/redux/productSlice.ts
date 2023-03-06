import { Product } from "@/models/product";
import { createSlice } from "@reduxjs/toolkit";

export interface productState {
  isVisibleFormProduct: boolean;
  product: Product[];
}

const initialState: productState = {
  isVisibleFormProduct: false,
  product: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    updateVisibleFormProduct: (state, action) => {
      state.isVisibleFormProduct = action.payload;
    },
  },
});
export default productSlice.reducer;
export const { updateVisibleFormProduct } = productSlice.actions;
