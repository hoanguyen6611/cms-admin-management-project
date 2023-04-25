import CustomerShow from "@/components/customer/Customer";
import Head from "next/head";
import React from "react";

const Customer = () => {
  return (
    <div>
      <Head>
        <title>Khách hàng</title>
      </Head>
      <CustomerShow />
    </div>
  );
};

export default Customer;
