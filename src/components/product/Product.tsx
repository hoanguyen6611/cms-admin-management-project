import React, { useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ProductTable from "./product-table/ProductTable";
import ProductForm from "./product-form/ProductForm";
import { useRouter } from "next/router";
import { actions, useStoreContext } from "@/store";

const ProductShow = () => {
  const {state, dispatch} = useStoreContext();
  const router = useRouter();
  const showModal = () => {
    dispatch(actions.changeVisibleFormProduct(true));
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
      <ProductTable></ProductTable>
      <ProductForm></ProductForm>
    </div>
  );
};

export default ProductShow;
