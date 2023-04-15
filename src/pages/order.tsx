import OrderShow from "@/components/order/Order";
import Head from "next/head";
import React from "react";

const Order = () => {
  return (
    <div>
      <Head>
        <title>Đơn hàng </title>
      </Head>
      <OrderShow></OrderShow>
    </div>
  );
};

export default Order;
