import { Category } from "@/models/category";
import { createReducer, createSlice } from "@reduxjs/toolkit";
import { createCategory } from "./category.actions";

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
  export const categoryReducer = createReducer(initialState, (builder) => {
    builder.addCase(createCategory, (state, action) => {

    })
  })