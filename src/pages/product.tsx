import LayoutPage from "@/components/layout/layout/Layout";
import ProductTable from "@/components/layout/product/ProductTable";
import Head from "next/head";
import React from "react";

const Product = () => {
  return (
    <div>
      <Head>
        <title>Quản lý sản phẩm</title>
      </Head>
      <LayoutPage>
        <ProductTable></ProductTable>
      </LayoutPage>
    </div>
  );
};

export default Product;
