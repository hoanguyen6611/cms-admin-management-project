import ImportProductShow from "@/components/import-product/ImportProduct";
import Head from "next/head";
import React from "react";

const ImportProduct = () => {
  return (
    <div>
      <Head>
        <title>Lịch sử nhập xuất hàng </title>
      </Head>
      <ImportProductShow/>
    </div>
  );
};

export default ImportProduct;
