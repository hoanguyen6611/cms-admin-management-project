
import ProductTable from "@/components/product/product-table/ProductTable";
import Head from "next/head";
import React from "react";

const Product = () => {
  return (
    <div>
      <Head>
        <title>Hàng hoá</title>
      </Head>
      <ProductTable></ProductTable>
    </div>
  );
};

export default Product;
