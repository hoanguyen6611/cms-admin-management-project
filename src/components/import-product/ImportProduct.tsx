import React, { createContext, useEffect, useState } from "react";
import { Button } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { actions, useStoreContext } from "@/store";
import ImportProductTable from "./import-product-table/ImportProductTable";
import ImportProductForm from "./import-product-form/ImportProductForm";

const ImportProductShow = () => {
  const router = useRouter();
  const { state, dispatch } = useStoreContext();
  const showModal = () => {
    dispatch(actions.changeVisibleFormCategory(true));
    dispatch(actions.changeEditFormCategory(false));
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
      <ImportProductTable/>
      <ImportProductForm/>
    </div>
  );
};

export default ImportProductShow;
