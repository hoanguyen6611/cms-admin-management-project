import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "./permissionSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import { categoryApi } from "@/components/layout/category/category.service";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    product: productReducer,
    category: categoryReducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  devTools: true,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(categoryApi.middleware);
  },
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
