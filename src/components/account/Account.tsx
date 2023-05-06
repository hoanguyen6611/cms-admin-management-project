import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import AccountTable from "./account-table/AccountTable";
import AccountForm from "./account-form/AccountForm";
import { actions, useStoreContext } from "@/store";

const AccountShow = () => {
  const {state, dispatch} = useStoreContext();
  const showModal = () => {
    dispatch(actions.changeVisibleFormAccount(true));
  }
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
