import LayoutPage from "@/components/layout/layout/Layout";
import ProductTable from "@/components/layout/product/product-table/ProductTable";
import Head from "next/head";
import React from "react";

const Product = () => {
  return (
    <div>
      <Head>
        <title>Quản lý sản phẩm</title>
      </Head>
      <ProductTable></ProductTable>
    </div>
  );
};

export default Product;
