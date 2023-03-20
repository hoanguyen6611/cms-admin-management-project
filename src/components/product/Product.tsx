import React, { useEffect } from "react";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateVisibleFormProduct } from "@/redux/product/productSlice";
import ProductTable from "./product-table/ProductTable";
import ProductForm from "./product-form/ProductForm";
import { useRouter } from "next/router";

const ProductShow = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const showModal = () => {
    dispatch(updateVisibleFormProduct(true));
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
          Tạo mới
        </Button>
        <Button className="ml-2">
          <UploadOutlined />
        </Button>
      </div>
      <ProductTable></ProductTable>
      <ProductForm></ProductForm>
    </div>
  );
};

export default ProductShow;
