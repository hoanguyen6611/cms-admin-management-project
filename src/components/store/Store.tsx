import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import StoreTable from "./store-table/StoreTable";
import StoreForm from "./store-form/StoreForm";
import { actions, useStoreContext } from "@/store";

const StoreShow = () => {
  const {state, dispatch} = useStoreContext();
  const showModal = () => {
    dispatch(actions.changeVisibleFormStore(true));
  };
  return (
    <div>
      <div className="flex justify-end ml-4">
        <Button className="mb-2" onClick={showModal}>
          <PlusOutlined />
          Tạo mới
        </Button>
      </div>
      <StoreTable />
      <StoreForm />
    </div>
  );
};

export default StoreShow;
