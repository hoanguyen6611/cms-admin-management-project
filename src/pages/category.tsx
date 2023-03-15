import CategoryShow from "@/components/category/category";
import Head from "next/head";
import React from "react";

const Category = () => {
  return (
    <div>
      <Head>
        <title>Nhóm hàng hoá</title>
      </Head>
      <CategoryShow></CategoryShow>
    </div>
  );
};

export default Category;
