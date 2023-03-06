import { Category } from "@/models/category";
import { createAction } from "@reduxjs/toolkit";

export const getCategoryList = createAction("category/get-list");
// export const getCategoryListSuccess = createAction(
//   "/category/get-list-success"
// );
// export const getCategoryListFail = createAction("/category/get-list-fail");

export const createCategory = createAction<Category>("category/create");
export const deleteCategory = createAction<string>("category/delete");
export const updateCategory = createAction<Category>("category/update");
