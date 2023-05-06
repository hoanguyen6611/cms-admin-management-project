import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import CustomerTable from "./customer-table/CustomerTable";
import CustomerForm from "./customer-form/CustomerForm";
import { actions, useStoreContext } from "@/store";

const CustomerShow = () => {
  const {state, dispatch} = useStoreContext();
  const showModal = () => {
    dispatch(actions.changeVisibleFormCustomer(true));
  };
  return (
    <div>
      <div className="flex justify-end ml-4">
        <Button className="mb-2" onClick={showModal}>
          <PlusOutlined />
          Tạo mới
        </Button>
      </div>
      <CustomerTable />
      <CustomerForm />
    </div>
  );
};

export default CustomerShow;
