import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import OrderTable from "./order-table/OrderTable";
import OrderForm from "./order-form/OrderForm";

const OrderShow = () => {
  const showModal = () => {};
  return (
    <div>
      <OrderTable></OrderTable>
      <OrderForm></OrderForm>
    </div>
  );
};

export default OrderShow;
