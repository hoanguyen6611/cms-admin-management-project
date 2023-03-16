
import ProductShow from "@/components/product/Product";
import Head from "next/head";
import React from "react";

const Product = () => {
  return (
    <div>
      <Head>
        <title>Hàng hoá</title>
      </Head>
      <ProductShow></ProductShow>
    </div>
  );
};

export default Product;
