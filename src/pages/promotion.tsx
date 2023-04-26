import PromotionShow from "@/components/promotion/Promotion";
import Head from "next/head";
import React from "react";

const Voucher = () => {
  return (
    <div>
      <Head>
        <title>Mã giảm giá</title>
      </Head>
      <PromotionShow />
    </div>
  );
};

export default Voucher;
