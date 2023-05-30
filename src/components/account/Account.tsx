import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect } from "react";
import AccountTable from "./account-table/AccountTable";
import AccountForm from "./account-form/AccountForm";
import { actions, useStoreContext } from "@/store";
import { useRouter } from "next/router";

const AccountShow = () => {
  const {state, dispatch} = useStoreContext();
  const router = useRouter();
  const showModal = () => {
    dispatch(actions.changeVisibleFormAccount(true));
  }
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
      <AccountTable />
      <AccountForm />
    </div>
  );
};

export default AccountShow;
