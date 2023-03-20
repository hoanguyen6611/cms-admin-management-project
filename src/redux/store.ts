import { configureStore } from "@reduxjs/toolkit";
import permissionReducer from "./permission/permissionSlice";
import permissionGroupReducer from "./group-permission/groupPermissionSlice";
import productReducer from "./product/productSlice";
import categoryReducer from "./category/categorySlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    permissionGroup: permissionGroupReducer,
    product: productReducer,
    category: categoryReducer,
  },
  devTools: true,
  // middleware(getDefaultMiddleware) {
  //   return getDefaultMiddleware().concat(categoryApi.middleware);
  // },
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
