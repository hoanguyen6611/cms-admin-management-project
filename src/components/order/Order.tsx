import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect } from "react";
import OrderTable from "./order-table/OrderTable";
import OrderForm from "./order-form/OrderForm";
import { useRouter } from "next/router";

const OrderShow = () => {
  const showModal = () => {};
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }
  }, [router]);
  return (
    <div>
      <OrderTable></OrderTable>
      <OrderForm></OrderForm>
    </div>
  );
};

export default OrderShow;
