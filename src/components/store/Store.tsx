import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect } from "react";
import StoreTable from "./store-table/StoreTable";
import StoreForm from "./store-form/StoreForm";
import { actions, useStoreContext } from "@/store";
import { useRouter } from "next/router";

const StoreShow = () => {
  const {state, dispatch} = useStoreContext();
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }
  }, [router]);
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
