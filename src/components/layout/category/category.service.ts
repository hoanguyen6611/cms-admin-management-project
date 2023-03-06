import { Category, CategoryResponse } from "@/models/category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: ["Categorys"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://tech-api.herokuapp.com/v1/",
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
      return headers;
    },
  }),
  endpoints: (build) => ({
    getCategorys: build.query<CategoryResponse, void>({
      query: () => "product-category/list",
      providesTags(result) {
        return [{ type: "Categorys", id: "LIST" }];
      },
    }),
    createCategory: build.mutation<Category, Omit<Category, "id">>({
      query(body) {
        return {
          url: "product-category/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Categorys"],
    }),
  }),
});
export const { useGetCategorysQuery, useCreateCategoryMutation } = categoryApi;
