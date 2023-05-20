import React, { createContext, useEffect, useState } from "react";
import CategoryForm from "./category-form/CategoryForm";
import { Button } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import CategoryTable from "./category-table/CategoryTable";
import { actions, useStoreContext } from "@/store";

const CategoryShow = () => {
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
        router.push("/login");
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
      <CategoryTable></CategoryTable>
      <CategoryForm></CategoryForm>
    </div>
  );
};

export default CategoryShow;
