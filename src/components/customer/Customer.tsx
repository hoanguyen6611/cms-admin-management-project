import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect } from "react";
import CustomerTable from "./customer-table/CustomerTable";
import CustomerForm from "./customer-form/CustomerForm";
import { actions, useStoreContext } from "@/store";
import { useRouter } from "next/router";

const CustomerShow = () => {
  const {state, dispatch} = useStoreContext();
  const router = useRouter();
  const showModal = () => {
    dispatch(actions.changeVisibleFormCustomer(true));
  };
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
