import CategoryTable from "@/components/layout/category/category-table/CategoryTable";
import LayoutPage from "@/components/layout/layout/Layout";
import Head from "next/head";
import React from "react";

const Category = () => {
  return (
    <div>
      <Head>
        <title>Danh mục sản phẩm</title>
      </Head>
      <CategoryTable></CategoryTable>
    </div>
  );
};

export default Category;
